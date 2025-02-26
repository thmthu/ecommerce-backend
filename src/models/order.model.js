"use strict";
const { model, Schema } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";

const orderSchema = new Schema(
  {
    order_userId: { type: String, required: true },
    order_checkout: { type: Object, required: true },
    order_shipping: { type: Object, required: true },
    order_payment: { type: Object, required: true },
    order_products: { type: Array, required: true },
    order_trackingNumber: { type: String, default: "#000110052022" },
    order_status: {
      type: String,
      default: "pending",
      enum: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
module.exports = model(DOCUMENT_NAME, orderSchema);
