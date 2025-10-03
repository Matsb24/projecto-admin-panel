import express from "express";
import { 
    agregarCliente, 
    obtenerClientes, 
    actualizarCliente, 
    eliminarCliente,
} from "../controllers/cliente.controllers.js";

const router = express.Router();

// Rutas para CRUD de clientes
router.post("/clientes", agregarCliente); // Crear cliente
router.get("/clientes", obtenerClientes); // Leer todos los clientes
router.put("/clientes/:id", actualizarCliente); // Actualizar cliente
router.delete("/clientes/:id", eliminarCliente); // Eliminar cliente

export default router;
