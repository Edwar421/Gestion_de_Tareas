import express from "express";
import {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
} from "../modules/tasks/task.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, getTasks);
router.post("/", authMiddleware, createTask);
router.put("/:id", authMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);

export default router;
