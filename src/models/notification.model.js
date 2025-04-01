"use strict";
const { model, Schema } = require("mongoose");
const DOCUMENT_NAME = "Notification";
const COLLECTION_NAME = "Notifications";

const NotificationSchema = new Schema(
  {
    noti_type: {
      type: String,
      enum: ["ORDER-01", "ORDER-02", "PROMOTION-01", "SHOP-001"],
    },
    noti_senderId: {
      type: Schema.Types.ObjectId,
    },
    noti_recieverId: {
      type: String,
    },
    noti_content: {
      type: String,
    },
    noti_option: {
      type: Object,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
module.exports = model(DOCUMENT_NAME, NotificationSchema);
