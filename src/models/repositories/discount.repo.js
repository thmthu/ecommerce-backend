"use strict";

const { unGetSelectData, getSelectData } = require("../../utils");

const findAllDiscountCodeUnselect = async ({
  filter,
  unselect,
  limit,
  page,
  sort = "ctime",
  model,
}) => {
  const skip = limit * (page - 1);
  const sortBy = sort == "ctime" ? { _id: -1 } : { _id: 1 };
  const document = await model
    .find(filter)
    .limit(limit)
    .skip(skip)
    .sort(sortBy)
    .select(unGetSelectData(unselect))
    .lean();

  return document;
};

const findAllDiscountCodeSelect = async ({
  filter,
  select,
  limit,
  page,
  sort = "ctime",
  model,
}) => {
  const skip = limit * (page - 1);
  const sortBy = sort == "ctime" ? { _id: -1 } : { _id: 1 };
  const document = await model
    .find(filter)
    .limit(limit)
    .skip(skip)
    .sort(sortBy)
    .select(getSelectData(select))
    .lean();

  return document;
};

const checkDiscountExists = async ({ filter, model }) => {
  return await model.findOne(filter).lean();
};
module.exports = {
  findAllDiscountCodeUnselect,
  checkDiscountExists,
  findAllDiscountCodeSelect,
};
