"use strict";
const { convertStringToObjectId } = require("../../utils");
const inventoryModel = require("../inventory.model");

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unknown",
}) => {
  return await inventoryModel.create({
    inven_productId: productId,
    inven_shopId: shopId,
    inven_stock: stock,
    inven_location: location,
  });
};
const reservationIntoInventory = async ({ productId, quantity, cartId }) => {
  const query = { inven_productId: convertStringToObjectId(productId) },
    updateSet = {
      $inc: { iven_stock: -quantity },
      $push: {
        inven_reservations: {
          quantity,
          cartId,
          createOn: new Date(),
        },
      },
    };
  return await inventoryModel.findOneAndUpdate(query, updateSet, {
    upsert: true,
    new: true,
  });
};
module.exports = { insertInventory, reservationIntoInventory };
