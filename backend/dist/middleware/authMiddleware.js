"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../config/constants");
const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ msg: "Acceso no autorizado" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, constants_1.JWT_SECRET);
        req.body.userId = decoded.userId; // Agregar el UID al request
        return next();
    }
    catch (error) {
        return res.status(401).json({ msg: "Token inválido" });
    }
};
exports.authMiddleware = authMiddleware;
