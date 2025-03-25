"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
router.post("/register", [(0, express_validator_1.body)("email").isEmail().withMessage("Ingrese un email válido")], authController_1.register);
router.post("/login", [(0, express_validator_1.body)("email").isEmail().withMessage("Ingrese un email válido")], authController_1.login);
router.post("/exists", [(0, express_validator_1.body)("email").isEmail().withMessage("Ingrese un email válido")], authController_1.userExists);
exports.default = router;
