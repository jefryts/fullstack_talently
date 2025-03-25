import { Request, Response } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import admin from "firebase-admin";
import { User } from "../models/User";
import { db } from "../config/firebase";
import { JWT_SECRET } from "../config/constants";

const TASKS_COLLECTION = "users";

export const register = async (req: Request, res: Response) => {
  // Validar datos de entrada
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {
    const userSnapshot = await db
      .collection(TASKS_COLLECTION)
      .where("email", "==", email)
      .get();
    if (!userSnapshot.empty) {
      return res.status(400).json({ msg: "El usuario ya existe" });
    }

    const newUser: User = {
      email,
      createdAt: admin.firestore.Timestamp.now(),
    };

    const userRef = await db.collection("users").add(newUser);

    // Generar token JWT
    const token = generateToken(userRef.id);

    return res.json({ token, userId: userRef.id });
  } catch (error) {
    return res.status(500).json({ msg: "Error en el servidor" });
  }
};

export const login = async (req: Request, res: Response) => {
  // Validar datos de entrada
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {
    // Buscar usuario en Firestore
    const userSnapshot = await db
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
  } catch (error) {
    return res.status(500).json({ msg: "Error en el servidor" });
  }
};

// Validar si un usuario existe por su email
export const userExists = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {
    const userSnapshot = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    return res.json({ exists: !userSnapshot.empty });
  } catch (error) {
    return res.status(500).json({ error: "Error al verificar el usuario" });
  }
};

function generateToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}
