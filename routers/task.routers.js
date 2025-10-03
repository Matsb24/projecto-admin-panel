import { Router } from "express";
import {createTask,readTask,readTasks,updateTask,deleteTask} from "../controllers/task.controllers.js";

const router = Router();

router.post("/tasks",createTask);
router.get("/tasks",readTasks);
router.get("/tasks/:id",readTask);
router.put("/tasks/:id",updateTask);
router.delete("/tasks:id",deleteTask);

export default router;