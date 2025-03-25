import express from "express";
import { body } from "express-validator";
import { register, login, userExists } from "../controllers/authController";

const router = express.Router();

router.post(
  "/register",
  [body("email").isEmail().withMessage("Ingrese un email válido")],
  register
);

router.post(
  "/login",
  [body("email").isEmail().withMessage("Ingrese un email válido")],
  login
);

router.post(
  "/exists",
  [body("email").isEmail().withMessage("Ingrese un email válido")],
  userExists
);

export default router;
