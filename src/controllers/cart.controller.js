"use strice";
const { CREATED, SuccessResponse } = require("../core/success.response");
const CartService = require("../services/cart.service");
class CartController {
  addToCart = async (req, res, next) => {
    new CREATED({
      message: "Create new discount success",
      metadata: await CartService.addToCartV2({
        ...req.body,
        userId: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new CartController();
