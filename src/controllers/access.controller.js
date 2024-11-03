"use strict";

const AccessService = require("../services/access.service");
const { OK, CREATED } = require("../core/success.response");
class AccessController {
  signIn = async (req, res, next) => {
    new CREATED({
      metadata: await AccessService.signIn(req.body),
    }).send(res);
  };
  signUp = async (req, res, next) => {
    new CREATED({
      message: "register OK!",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };
}
module.exports = new AccessController();
