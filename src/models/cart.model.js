"use strict";
const { model, Schema } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";

const cartSchema = new Schema(
  {
    cart_state: {
      type: String,
      required: true,
      enum: ["active", "complete", "pending", "failed"],
      default: "active",
    },
    cart_products: {
      type: Array,
      required: true,
      default: [],
    },
    cart_count_product: { type: Number, default: 0 },
    cart_userId: { type: Schema.Types.ObjectId, required: true },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
module.exports = model(DOCUMENT_NAME, cartSchema);
