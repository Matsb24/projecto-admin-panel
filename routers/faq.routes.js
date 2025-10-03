import express from "express";
import { 
    agregarFAQ, 
    obtenerFAQs, 
    actualizarFAQ, 
    eliminarFAQ 
} from "../controllers/faq.controllers.js";

const router = express.Router();

// Rutas para CRUD de FAQs
router.post("/faq", agregarFAQ); // Crear FAQ
router.get("/faq", obtenerFAQs); // Leer todos los FAQs
router.put("/faq/:id", actualizarFAQ); // Actualizar FAQ
router.delete("/faq/:id", eliminarFAQ); // Eliminar FAQ

export default router;
