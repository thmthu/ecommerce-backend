"use strict";
const express = require("express");
const { asyncHandler } = require("../../auth/checkAuth");
const { authentication } = require("../../auth/authUtils");
const discountController = require("../../controllers/discount.controller");
const router = express.Router();

router.use(authentication);

router.post("/amount", asyncHandler(discountController.getDiscountAmount));
router.get("/list-product-code", asyncHandler(discountController.getAllDiscountCodeWithProduct));

router.post("/", asyncHandler(discountController.createDiscount));
router.get("/", asyncHandler(discountController.getAllDiscountCodeByShop));



module.exports = router;
