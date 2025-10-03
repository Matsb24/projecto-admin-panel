import express from "express";
import { 
    agregarProyecto, 
    obtenerProyectos, 
    actualizarProyecto, 
    eliminarProyecto 
} from "../controllers/proyectos.controllers.js";

const router = express.Router();

// Rutas para CRUD de proyectos
router.post("/proyectos", agregarProyecto);
router.get("/proyectos", obtenerProyectos);
router.put("/proyectos/:id", actualizarProyecto);
router.delete("/proyectos/:id", eliminarProyecto);

export default router;
