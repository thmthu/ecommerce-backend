"use strict";
const { apiKey, permission } = require("../auth/checkAuth");

const express = require("express");
const router = express.Router();
// router.use(apiKey);
// router.use(permission("0000")); // Truyền đúng tham số permission

router.use("/v1/api/shop", require("./access"));
router.use("/v1/api/product", require("./product"));
router.use("/v1/api/cart", require("./cart"));
router.use("/v1/api/discount", require("./discount"));

module.exports = router;
