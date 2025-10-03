import express from "express";
import {
    agregarEquipo,
    obtenerEquipos,
    eliminarEquipo,
    actualizarEquipo
} from "../controllers/equipo.controllers.js";

const router = express.Router();

// Rutas para CRUD de miembros del equipo
router.post("/equipos", agregarEquipo); // Crear miembro
router.get("/equipos", obtenerEquipos); // Leer todos los miembros
router.delete("/equipos/:id", eliminarEquipo); // Eliminar miembro
router.put("/equipos/:id", actualizarEquipo); //Actualizar miembros

export default router;
