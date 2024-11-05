"use strict";
const ProductService = require("../services/product.service");
const { SuccessResponse } = require("../core/success.response");
class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Create new product success",
      metadat: "a",
    }).send(res);
  };
}
module.exports = new ProductController();
