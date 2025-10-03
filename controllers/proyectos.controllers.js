import Proyecto from "../models/proyectos.model.js";

// Crear un nuevo proyecto
export const agregarProyecto = async (req, res) => {
    const {cliente, nombreProyecto, descripcion, fechaInicio, fechaFin, servicios, estado, responsable } = req.body;

    try {
        const nuevoProyecto = new Proyecto({cliente, nombreProyecto, descripcion, fechaInicio, fechaFin, servicios, estado, responsable });
        const proyectoGuardado = await nuevoProyecto.save();
        res.status(201).json({
            message: "Proyecto agregado exitosamente",
            proyecto: proyectoGuardado
        });
    } catch (error) {
        console.error("Error al guardar el proyecto:", error);
        res.status(500).json({ message: "Error al agregar proyecto" });
    }
};

// Obtener todos los proyectos
export const obtenerProyectos = async (req, res) => {
    try {
        const proyectos = await Proyecto.find();
        res.status(200).json(proyectos);
    } catch (error) {
        console.error("Error al obtener los proyectos:", error);
        res.status(500).json({ message: "Error al obtener proyectos" });
    }
};

// Actualizar un proyecto por ID
export const actualizarProyecto = async (req, res) => {
    const { id } = req.params;
    const datosActualizados = req.body;

    try {
        const proyectoActualizado = await Proyecto.findByIdAndUpdate(id, datosActualizados, { new: true });
        if (!proyectoActualizado) {
            return res.status(404).json({ message: "Proyecto no encontrado" });
        }
        res.status(200).json({
            message: "Proyecto actualizado exitosamente",
            proyecto: proyectoActualizado
        });
    } catch (error) {
        console.error("Error al actualizar el proyecto:", error);
        res.status(500).json({ message: "Error al actualizar proyecto" });
    }
};

// Eliminar un proyecto por ID
export const eliminarProyecto = async (req, res) => {
    const { id } = req.params;

    try {
        const proyectoEliminado = await Proyecto.findByIdAndDelete(id);
        if (!proyectoEliminado) {
            return res.status(404).json({ message: "Proyecto no encontrado" });
        }
        res.status(200).json({ message: "Proyecto eliminado exitosamente" });
    } catch (error) {
        console.error("Error al eliminar el proyecto:", error);
        res.status(500).json({ message: "Error al eliminar proyecto" });
    }
};
