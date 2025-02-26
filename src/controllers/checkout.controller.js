"use strict";
"use strice";
const { CREATED, SuccessResponse } = require("../core/success.response");
const CheckoutService = require("../services/checkout.service");
class CheckoutController {
  checkoutReview = async (req, res, next) => {
    new CREATED({
      message: "Create new discount success",
      metadata: await CheckoutService.orderReview({
        ...req.body,
        userId: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new CheckoutController();
