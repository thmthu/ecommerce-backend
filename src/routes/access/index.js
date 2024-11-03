"use strict";
const AccessController = require("../../controllers/access.controller");
const express = require("express");
const { asyncHandler } = require("../../auth/checkAuth");
const router = express.Router();
router.post("/signup", asyncHandler(AccessController.signUp));
router.post("/signin", asyncHandler(AccessController.signIn));

module.exports = router;
