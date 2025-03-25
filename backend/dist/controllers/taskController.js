"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateStateTask = exports.updateTask = exports.createTask = exports.getTasks = void 0;
const firebase_1 = require("../config/firebase");
const TASKS_COLLECTION = "tasks";
const getTasks = async (req, res) => {
    try {
        const { userId } = req.body;
        const snapshot = await firebase_1.db
            .collection(TASKS_COLLECTION)
            .where("userId", "==", userId)
            .get();
        const tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        res.json(tasks);
    }
    catch (error) {
        res.status(500).json({ msg: "Error al obtener tareas" });
    }
};
exports.getTasks = getTasks;
const createTask = async (req, res) => {
    try {
        const { title, description, userId } = req.body;
        const newTask = {
            title,
            description,
            completed: false,
            createdAt: new Date().toISOString(),
            userId,
        };
        const taskRef = await firebase_1.db.collection(TASKS_COLLECTION).add(newTask);
        // Recupera la tarea creada
        const createdTask = await taskRef.get();
        res.status(201).json({ id: createdTask.id, ...createdTask.data() });
    }
    catch (error) {
        res.status(500).json({ msg: "Error al crear la tarea" });
    }
};
exports.createTask = createTask;
const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, completed } = req.body;
        const taskRef = firebase_1.db.collection("tasks").doc(id);
        // Actualiza la tarea en Firestore
        await taskRef.update({ title, description, completed });
        // Recupera la tarea actualizada
        const updatedTask = await taskRef.get();
        res.status(201).json({ id: updatedTask.id, ...updatedTask.data() });
    }
    catch (error) {
        res.status(500).json({ msg: "Error al actualizar la tarea" });
    }
};
exports.updateTask = updateTask;
const updateStateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const taskRef = firebase_1.db.collection("tasks").doc(id);
        const currentState = (await taskRef.get()).data()?.completed || false;
        // Actualiza la tarea en Firestore
        await taskRef.update({ completed: !currentState });
        // Recupera la tarea actualizada
        const updatedTask = await taskRef.get();
        res.status(201).json({ id: updatedTask.id, ...updatedTask.data() });
    }
    catch (error) {
        res.status(500).json({ msg: "Error al cambiar el estado de la tarea" });
    }
};
exports.updateStateTask = updateStateTask;
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        await firebase_1.db.collection(TASKS_COLLECTION).doc(id).delete();
        res.json({ message: "Tarea eliminada" });
    }
    catch (error) {
        res.status(500).json({ msg: "Error al eliminar la tarea" });
    }
};
exports.deleteTask = deleteTask;
