const notiModel = require("../models/notification.model");

const pushNotiToSys = async ({
  type = "SHOP-001",
  senderId = 1,
  recieverId = 1,
  option = {},
}) => {
  let notiContent;
  if (type === "SHOP-001") notiContent = "shop @@@ have updated a new product";
  const newNoti = await notiModel.create({
    noti_senderId: senderId,
    noti_recieverId: recieverId,
    noti_option: option,
    noti_type: type,
  });

  return newNoti;
};

module.exports = { pushNotiToSys };
