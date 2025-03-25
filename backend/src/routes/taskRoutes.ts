import express from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateStateTask,
} from "../controllers/taskController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, getTasks);
router.post("/", authMiddleware, createTask);
router.put("/:id", authMiddleware, updateTask);
router.put("/:id/changeState", authMiddleware, updateStateTask);
router.delete("/:id", authMiddleware, deleteTask);

export default router;
