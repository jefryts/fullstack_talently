const token = require("crypto").randomBytes(64).toString("hex");
export const JWT_SECRET = process.env["JWT_SECRET"] ?? token;
