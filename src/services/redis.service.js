"use strict";
const redis = require("redis");
const { promisify } = require("../utils/index");
const {
  reservationIntoInventory,
} = require("../models/repositories/invetory.repo");
const client = redis.createClient();
const pexpire = promisify(client.pExpire).bind(client);
const setnxAsync = promisify(client.SETNX).bind(client);
const accquireLock = async ({ productId, quantity, cartId }) => {
  const key = `lock_v2023_${productId}`;
  const expireTime = 3000;
  const retryTime = 10;
  for (let i = 0; i < retryTime; i++) {
    const isAcquire = await setnxAsync(key, expireTime);
    if (isAcquire) {
      const insertInventory = await reservationIntoInventory({
        productId,
        cartId,
        quantity,
      });
      if (insertInventory.isModified) {
        await pexpire(key, expireTime);
        return key;
      }
    } else return null;
  }
};
const releaseLock = async (key) => {
  const delKey = promisify(client.del).bind(client);
  return await delKey(key);
};
module.exports = { accquireLock, releaseLock };
