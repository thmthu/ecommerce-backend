"use strict";
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { getInforData } = require("../utils/index");
const shopModel = require("../models/shop.model");
const KeyTokenService = require("./key.service");
const { findByEmail } = require("../services/shop.service");
const {
  ConflictRequestError,
  BadRequestError,
} = require("../core/error.response");
const { createTokenPair } = require("../auth/authUtils");
const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};
class AccessService {
  static signIn = async ({ email, password, refreshToken = null }) => {
    const foundShop = await findByEmail({ email });
    console.log(foundShop.password);

    if (!foundShop) throw new BadRequestError("Shop is not registered");
    const match = await bcrypt.compare(password, foundShop.password);
    if (!match) throw new BadRequestError("Wrong password");
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");
    const tokens = await createTokenPair(
      { userId: foundShop._id },
      publicKey,
      privateKey
    );
    await KeyTokenService.createKeyToken({
      userId,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });
    return {
      metadata: {
        shop: getInforData({
          fields: ["id", "name", "email"],
          object: foundShop,
        }),
        tokens,
      },
    };
  };
  static signUp = async ({ name, email, password }) => {
    const hoderShop = await shopModel.findOne({ email }).lean();

    if (hoderShop) {
      throw new ConflictRequestError("shop already register", 500);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });
    if (!newShop) {
      throw new Error("Failed to create new shop");
    }
    if (newShop) {
      const publicKey = crypto.randomBytes(64).toString("hex");
      const privateKey = crypto.randomBytes(64).toString("hex");
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });
      if (!keyStore) {
        throw new ConflictRequestError("keyStore error", 500);
      }
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );
      return {
        code: 201,
        metadata: {
          shop: getInforData({
            fields: ["id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }
  };
}
module.exports = AccessService;
