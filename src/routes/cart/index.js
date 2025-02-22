"use strict";
const express = require("express");
const { asyncHandler } = require("../../auth/checkAuth");
const { authentication } = require("../../auth/authUtils");
const cartController = require("../../controllers/cart.controller");
const router = express.Router();

router.use(authentication);

router.post("/add", asyncHandler(cartController.addToCart));

module.exports = router;
