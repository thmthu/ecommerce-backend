"use strict";
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { getInforData } = require("../utils/index");
const customerModel = require("../models/customer.model");
const KeyTokenService = require("./key.service");
const { findByEmail } = require("../services/customer.service");
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
    const foundCustomer = await findByEmail({ email });
    console.log(foundCustomer.password);

    if (!foundCustomer) throw new BadRequestError("Customer is not registered");
    const match = await bcrypt.compare(password, foundCustomer.password);
    if (!match) throw new BadRequestError("Wrong password");
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");
    const tokens = await createTokenPair(
      { userId: foundCustomer._id },
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
        customer: getInforData({
          fields: ["id", "name", "email"],
          object: foundCustomer,
        }),
        tokens,
      },
    };
  };
  static signUp = async ({ name, email, password }) => {
    const hoderCustomer = await customerModel.findOne({ email }).lean();

    if (hoderCustomer) {
      throw new ConflictRequestError("customer already register", 500);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newCustomer = await customerModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });
    if (!newCustomer) {
      throw new Error("Failed to create new shop");
    }
    if (newCustomer) {
      const publicKey = crypto.randomBytes(64).toString("hex");
      const privateKey = crypto.randomBytes(64).toString("hex");
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newCustomer._id,
        publicKey,
        privateKey,
      });
      if (!keyStore) {
        throw new ConflictRequestError("keyStore error", 500);
      }
      const tokens = await createTokenPair(
        { userId: newCustomer._id, email },
        publicKey,
        privateKey
      );
      return {
        code: 201,
        metadata: {
          shop: getInforData({
            fields: ["id", "name", "email"],
            object: newCustomer,
          }),
          tokens,
        },
      };
    }
  };
}
module.exports = AccessService;
