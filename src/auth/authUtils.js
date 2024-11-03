"use strict";
const { BadRequestError } = require("../core/error.response");
const JWT = require("jsonwebtoken");
const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });
    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.log("err verify: ", err);
      } else {
        console.log("data verify: ", decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (e) {
    console.error("Error in createTokenPair: ", e);
    throw new BadRequestError("Token generation failed", 500); // Or throw the original error `throw e;`
  }
};
module.exports = { createTokenPair };
