"use strict";
const cartModel = require("../models/cart.model");
const {
  ConflictRequestError,
  BadRequestError,
  ForbidenError,
  NotFoundError,
} = require("../core/error.response");
const DiscountService = require("../services/discount.service");
const { checkProductByServer } = require("../models/repositories/product.repo");
const { convertStringToObjectId } = require("../utils");
const { accquireLock, releaseLock } = require("./redis.service");
const orderShema = require("../models/order.model");

class CheckoutService {
  static async orderReview({ userId, shop_order_id, cartId }) {
    const foundCart = await cartModel.findOne({
      _id: convertStringToObjectId(cartId),
    });
    if (!foundCart) throw new NotFoundError("Cart not found or not active");
    const checkoutOrder = {
        totalPrice: 0,
        totalDiscount: 0,
        totalCheckout: 0,
        itemProducts: [],
      },
      shop_order_id_news = [];
    for (let i = 0; i < shop_order_id.length; i++) {
      const {
        shopId = "",
        shop_discounts = [],
        item_products = [],
      } = shop_order_id[i];
      const productServer = await checkProductByServer(item_products);

      if (productServer.length < item_products.length) {
        throw new ConflictRequestError("Some product not found in server");
      }

      checkoutOrder.itemProducts = productServer;
      const rawPrice = productServer.reduce((acc, product) => {
        return acc + product.price * product.quantity;
      }, 0);

      checkoutOrder.totalPrice += rawPrice;
      if (shop_discounts.length > 0) {
        const discount = await DiscountService.getDiscountAmount({
          codeId: shop_discounts[0],
          shopId: shopId,
          products: item_products,
        });
        checkoutOrder.totalDiscount += discount.discount;
        if (discount.discount > 0) {
          checkoutOrder.totalCheckout =
            checkoutOrder.totalPrice - checkoutOrder.totalDiscount;
        }
      }
      shop_order_id_news.push(checkoutOrder);
    }
    return {
      shop_order_id,
      shop_order_id_news,
      totalPrice: checkoutOrder.totalPrice,
      totalDiscount: checkoutOrder.totalDiscount,
      totalCheckout: checkoutOrder.totalCheckout,
    };
  }
  static async orderByUser({ userId, shop_order_id, cartId }) {
    const foundCart = await cartModel.findOne({
      _id: convertStringToObjectId(cartId),
    });
    if (!foundCart) throw new NotFoundError("Cart not found or not active");
    const checkoutOrderReview = await this.orderReview({
      userId,
      shop_order_id,
      cartId,
    });
    const products = checkoutOrderReview.shop_order_id_news.flatMap(
      (order) => order.itemProducts
    );
    const accquireProduct = [];
    for (let i = 0; i < products.length; i++) {
      const keyLock = await accquireLock({
        productId: products[i].productId,
        cartId,
        quantity: products[i].product_quantity,
      });
      accquireProduct.push(key ? true : false);
      if (keyLock) {
        await releaseLock(key);
      }
    }
    if (accquireProduct.include(false)) {
      throw new ForbidenError("Some product not available");
    }
    const newOrder = await orderShema.create({
      order_userId: userId,
      order_checkout: checkoutOrderReview,

      order_products: products,
    });
    if (!newOrder) throw new BadRequestError("Failed to create order");
  }
}

module.exports = CheckoutService;
