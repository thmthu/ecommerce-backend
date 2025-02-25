"use strict";
const discountModel = require("../models/discount.model");
const {
  ConflictRequestError,
  BadRequestError,
  ForbidenError,
  NotFoundError,
} = require("../core/error.response");
const { convertStringToObjectId } = require("../utils");
const { findAllProduct } = require("../models/repositories/product.repo");
const {
  findAllDiscountCodeUnselect,
  checkDiscountExists,
} = require("../models/repositories/discount.repo");
class DiscountService {
  static async createDiscountCode(payload) {
    const {
      discount_code,
      discount_name,
      discount_description,
      discount_type,
      discount_value,
      discount_start_date,
      discount_end_date,
      discount_max_uses,
      discount_uses_count,
      discount_users_used,
      discount_max_uses_per_user,
      discount_min_order_value,
      discount_shopId,
      discount_is_active,
      discount_applies_to,
      discount_product_ids,
    } = payload;
    if (
      new Date() > new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    ) {
      throw new BadRequestError("Discount is expired");
    }

    // if (new Date(discount_start_date) < new Date(discount_end_date)) {
    //   throw new BadRequestError(
    //     "Discount start date should be before end date"
    //   );
    // }

    const foundCode = await discountModel.findOne({
      discount_code,
      discount_shopId: convertStringToObjectId(discount_shopId),
    });
    if (foundCode && foundCode.product_is_active) {
      throw new BadRequestError("Discount is already exist");
    }
    const newDiscount = await discountModel.create({
      discount_code,
      discount_name,
      discount_description,
      discount_type,
      discount_value,
      discount_start_date: new Date(discount_start_date),
      discount_end_date: new Date(discount_end_date),
      discount_max_uses,
      discount_uses_count,
      discount_users_used,
      discount_max_uses_per_user,
      discount_min_order_value: discount_min_order_value || 0,
      discount_shopId,
      discount_is_active,
      discount_applies_to,
      discount_product_ids:
        discount_applies_to == "all" ? [] : discount_product_ids,
    });
    return newDiscount;
  }
  static async getAllDiscountCodeWithProduct({ code, shopId, limit, page }) {
    const foundShop = await discountModel.findOne({
      discount_code: code,
      discount_shopId: convertStringToObjectId(shopId),
    });
    if (!foundShop || !foundShop.discount_is_active) {
      throw new ConflictRequestError("Discount not found or not active");
    }
    console.log(foundShop);
    const { discount_applies_to, discount_product_ids } = foundShop;
    let products;

    if (discount_applies_to == "all") {
      products = await findAllProduct({
        filter: {
          product_shop: convertStringToObjectId(shopId),
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
        select: ["product_name"],
      });
    } else {
      products = discount_product_ids;
    }
    return products;
  }
  static async getAllDiscountCodeByShop({ limit, page, shopId }) {
    const discount = await findAllDiscountCodeUnselect({
      filter: {
        discount_shopId: convertStringToObjectId(shopId),
        discount_is_active: true,
      },
      limit: +limit,
      page: +page,
      unselect: ["-v", "discount_shopId"],
      model: discountModel,
    });
    return discount;
  }
  static async getDiscountAmount({ codeId, shopId, products }) {
    const foundDiscount = await checkDiscountExists({
      model: discountModel,

      filter: {
        discount_code: codeId,
        discount_shopId: convertStringToObjectId(shopId),
      },
    });
    if (!foundDiscount) {
      throw new NotFoundError("Discount code not found or not active");
    }
    const { discount_is_active, discount_max_uses } = foundDiscount;
    if (!discount_is_active) {
      throw new NotFoundError("Discount is not active");
    }
    if (!discount_max_uses) {
      throw new NotFoundError("Max uses of discount code reached");
    }
    let total = 0;
    console.log("total", total);

    if (foundDiscount.discount_min_order_value > 0) {
      total = products.reduce((acc, product) => {
        return acc + product.product_quantity * product.product_price;
      }, 0);
      if (total < foundDiscount.discount_min_order_value)
        throw new ForbidenError("Order value is below minimum order value");
    }
    const amount =
      foundDiscount.discount_type == "fixed_amount"
        ? foundDiscount.discount_value
        : (foundDiscount.discount_value / 100) * total;
    console.log("total", total, "amount discount", amount);
    return {
      discount: amount,
      totalOrder: total,
      totalPrice: total - amount,
    };
  }
}
module.exports = DiscountService;
