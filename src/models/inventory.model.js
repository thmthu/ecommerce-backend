"use strict";
const { model, Schema } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventorys";

const inventorySchema = new Schema(
  {
    inven_productId: { type: Schema.Types.ObjectId, ref: "Product" },
    inven_location: {type:String, default: "unknow"},
    inven_stock:{type: Number, require: true},
    inven_shopId: { type: Schema.Types.ObjectId, ref: "Customer" },
    inven_reservations: {type: Array, default: []},
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
module.exports = model(DOCUMENT_NAME, inventorySchema);
