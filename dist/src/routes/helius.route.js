"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const helius_controller_1 = require("../controllers/helius.controller");
const router = (0, express_1.Router)();
router.post('/', helius_controller_1.heliusController);
exports.default = router;
