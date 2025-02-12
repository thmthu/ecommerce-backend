"use strice";
const { CREATED, SuccessResponse } = require("../core/success.response");
const DiscountService = require("../services/discount.service");
class DiscountController {
  createDiscount = async (req, res, next) => {
    new CREATED({
      message: "Create new discount success",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        discount_shopId: req.user.userId,
      }),
    }).send(res);
  };
  getAllDiscountCodeWithProduct = async (req, res, next) => {
    new CREATED({
      message: "Create new discount success",
      metadata: await DiscountService.getAllDiscountCodeWithProduct({
        ...req.query,
      }),
    }).send(res);
  };
  getAllDiscountCodeByShop = async (req, res, next) => {
    new CREATED({
      message: "Create new discount success",
      metadata: await DiscountService.getAllDiscountCodeByShop({
        ...req.query,
        discount_shopId: req.user.userId,
      }),
    }).send(res);
  };
  getDiscountAmount = async (req, res, next) => {
    new CREATED({
      message: "Create new discount success",
      metadata: await DiscountService.getDiscountAmount({
        ...req.body,
        discount_shopId: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();
