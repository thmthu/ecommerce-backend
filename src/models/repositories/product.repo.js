"use strict";
const { getSelectData } = require("../../utils");
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
module.exports = { findAllDradtForShop, findAllProduct };
