"use strict";
const { getSelectData, convertStringToObjectId } = require("../../utils");
const { product, femaleClothe, maleClothe } = require("../product.model");

const findAllDradtForShop = async ({ query, limit, skip }) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};
const findAllProduct = async ({
  filter,
  limit,
  page,
  sort = "ctime",
  select = "",
}) => {
  return await product
    .find(filter)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort(sort)
    .select(getSelectData(select))
    .exec();
};
const getProductById = async (productId) => {
  return await product.findOne({ _id: convertStringToObjectId(productId) });
};
const checkProductByServer = async (products) => {
  return await Promise.all(
    products.map(async (product) => {
      const foundProduct = await getProductById(product.productId);
      if (foundProduct)
        return {
          price: product.product_price,
          quantity: product.product_quantity,
          productId: product.productId,
        };
    })
  );
};
module.exports = {
  findAllDradtForShop,
  findAllProduct,
  getProductById,
  checkProductByServer,
};
