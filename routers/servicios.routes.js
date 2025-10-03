import express from "express";
import { 
    agregarServicio, 
    obtenerServicios, 
    actualizarServicio, 
    eliminarServicio 
} from "../controllers/servicios.controllers.js";

const router = express.Router();

// Rutas para CRUD de servicios
router.post("/servicios", agregarServicio);
router.get("/servicios", obtenerServicios);
router.put("/servicios/:id", actualizarServicio);
router.delete("/servicios/:id", eliminarServicio);

export default router;
