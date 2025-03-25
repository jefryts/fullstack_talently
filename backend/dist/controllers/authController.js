"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userExists = exports.login = exports.register = void 0;
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const firebase_1 = require("../config/firebase");
const constants_1 = require("../config/constants");
const TASKS_COLLECTION = "users";
const register = async (req, res) => {
    // Validar datos de entrada
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email } = req.body;
    try {
        const userSnapshot = await firebase_1.db
            .collection(TASKS_COLLECTION)
            .where("email", "==", email)
            .get();
        if (!userSnapshot.empty) {
            return res.status(400).json({ msg: "El usuario ya existe" });
        }
        const newUser = {
            email,
            createdAt: firebase_admin_1.default.firestore.Timestamp.now(),
        };
        const userRef = await firebase_1.db.collection("users").add(newUser);
        // Generar token JWT
        const token = generateToken(userRef.id);
        return res.json({ token, userId: userRef.id });
    }
    catch (error) {
        return res.status(500).json({ msg: "Error en el servidor" });
    }
};
exports.register = register;
const login = async (req, res) => {
    // Validar datos de entrada
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email } = req.body;
    try {
        // Buscar usuario en Firestore
        const userSnapshot = await firebase_1.db
            .collection("users")
            .where("email", "==", email)
            .get();
        if (userSnapshot.empty) {
            return res.status(400).json({ message: "Credenciales inválidas" });
        }
        // Obtener el usuario
        const userDoc = userSnapshot.docs[0];
        const user = userDoc.data();
        // Generar token JWT
        const token = generateToken(userDoc.id);
        return res.json({ token, userId: user.id });
    }
    catch (error) {
        return res.status(500).json({ msg: "Error en el servidor" });
    }
};
exports.login = login;
// Validar si un usuario existe por su email
const userExists = async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email } = req.body;
    try {
        const userSnapshot = await firebase_1.db
            .collection("users")
            .where("email", "==", email)
            .get();
        return res.json({ exists: !userSnapshot.empty });
    }
    catch (error) {
        return res.status(500).json({ error: "Error al verificar el usuario" });
    }
};
exports.userExists = userExists;
function generateToken(userId) {
    return jsonwebtoken_1.default.sign({ userId }, constants_1.JWT_SECRET, { expiresIn: "7d" });
}
