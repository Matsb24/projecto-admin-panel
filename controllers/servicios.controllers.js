import Servicio from "../models/servicios.model.js";

// Crear un nuevo servicio
export const agregarServicio = async (req, res) => {
    const { nombreServicio, descripcion, precio, tiempoEstimado, disponibilidad } = req.body;

    try {
        const nuevoServicio = new Servicio({ nombreServicio, descripcion, precio, tiempoEstimado, disponibilidad });
        const servicioGuardado = await nuevoServicio.save();
        res.status(201).json({
            message: "Servicio agregado exitosamente",
            servicio: servicioGuardado
        });
    } catch (error) {
        console.error("Error al guardar el servicio:", error);
        res.status(500).json({ message: "Error al agregar servicio" });
    }
};

// Obtener todos los servicios
export const obtenerServicios = async (req, res) => {
    try {
        const servicios = await Servicio.find();
        res.status(200).json(servicios);
    } catch (error) {
        console.error("Error al obtener los servicios:", error);
        res.status(500).json({ message: "Error al obtener servicios" });
    }
};

// Actualizar un servicio por ID
export const actualizarServicio = async (req, res) => {
    const { id } = req.params;
    const datosActualizados = req.body;

    try {
        const servicioActualizado = await Servicio.findByIdAndUpdate(id, datosActualizados, { new: true });
        if (!servicioActualizado) {
            return res.status(404).json({ message: "Servicio no encontrado" });
        }
        res.status(200).json({
            message: "Servicio actualizado exitosamente",
            servicio: servicioActualizado
        });
    } catch (error) {
        console.error("Error al actualizar el servicio:", error);
        res.status(500).json({ message: "Error al actualizar servicio" });
    }
};

// Eliminar un servicio por ID
export const eliminarServicio = async (req, res) => {
    const { id } = req.params;

    try {
        const servicioEliminado = await Servicio.findByIdAndDelete(id);
        if (!servicioEliminado) {
            return res.status(404).json({ message: "Servicio no encontrado" });
        }
        res.status(200).json({ message: "Servicio eliminado exitosamente" });
    } catch (error) {
        console.error("Error al eliminar el servicio:", error);
        res.status(500).json({ message: "Error al eliminar servicio" });
    }
};
