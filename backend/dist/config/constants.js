"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET = void 0;
const token = require("crypto").randomBytes(64).toString("hex");
exports.JWT_SECRET = process.env["JWT_SECRET"] ?? token;
