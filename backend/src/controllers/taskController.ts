import { Request, Response } from "express";
import { db } from "../config/firebase";
import { Task } from "../models/Task";

const TASKS_COLLECTION = "tasks";

export const getTasks = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const snapshot = await db
      .collection(TASKS_COLLECTION)
      .where("userId", "==", userId)
      .get();
    const tasks = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener tareas" });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, userId } = req.body;
    const newTask: Task = {
      title,
      description,
      completed: false,
      createdAt: new Date().toISOString(),
      userId,
    };
    const taskRef = await db.collection(TASKS_COLLECTION).add(newTask);

    // Recupera la tarea creada
    const createdTask = await taskRef.get();

    res.status(201).json({ id: createdTask.id, ...createdTask.data() });
  } catch (error) {
    res.status(500).json({ msg: "Error al crear la tarea" });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const taskRef = db.collection("tasks").doc(id);

    // Actualiza la tarea en Firestore
    await taskRef.update({ title, description, completed });

    // Recupera la tarea actualizada
    const updatedTask = await taskRef.get();

    res.status(201).json({ id: updatedTask.id, ...updatedTask.data() });
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar la tarea" });
  }
};

export const updateStateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const taskRef = db.collection("tasks").doc(id);

    const currentState = (await taskRef.get()).data()?.completed || false;

    // Actualiza la tarea en Firestore
    await taskRef.update({ completed: !currentState });

    // Recupera la tarea actualizada
    const updatedTask = await taskRef.get();

    res.status(201).json({ id: updatedTask.id, ...updatedTask.data() });
  } catch (error) {
    res.status(500).json({ msg: "Error al cambiar el estado de la tarea" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.collection(TASKS_COLLECTION).doc(id).delete();
    res.json({ message: "Tarea eliminada" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar la tarea" });
  }
};
