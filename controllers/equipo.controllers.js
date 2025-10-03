import Equipo from "../models/equipo.model.js";

// Crear un nuevo miembro del equipo
export const agregarEquipo = async (req, res) => {
    const {nombre, correo, rol, especialidad, proyectos, disponibilidad, fechaIngreso } = req.body;

    try {
        const nuevoMiembro = new Equipo({nombre, correo, rol, especialidad, proyectos, disponibilidad, fechaIngreso });

        const miembroGuardado = await nuevoMiembro.save();
        res.status(201).json({
            message: "Miembro del equipo agregado exitosamente",
            miembro: miembroGuardado
        });
    } catch (error) {
        console.error("Error al guardar el miembro del equipo:", error);
        res.status(500).json({ message: "Error al agregar miembro del equipo" });
    }
};

// Obtener todos los miembros del equipo
export const obtenerEquipos = async (req, res) => {
    try {
        const equipos = await Equipo.find();
        res.status(200).json(equipos);
    } catch (error) {
        console.error("Error al obtener los miembros del equipo:", error);
        res.status(500).json({ message: "Error al obtener miembros del equipo" });
    }
};

// Actualizar un miembro por ID
export const actualizarEquipo = async (req, res) => {
    const { id } = req.params;
    const datosActualizados = req.body;

    try {
        const miembroActualizado = await Equipo.findByIdAndUpdate(id, datosActualizados, { new: true });
        if (!miembroActualizado) {
            return res.status(404).json({ message: "Miembro del equipo no encontrado" });
        }
        res.status(200).json({
            message: "Miembro actualizado exitosamente",
            miembro: miembroActualizado
        });
    } catch (error) {
        console.error("Error al actualizar el miembro del equipo:", error);
        res.status(500).json({ message: "Error al actualizar miembro del equipo" });
    }
};

// Eliminar un miembro por ID
export const eliminarEquipo = async (req, res) => {
    const { id } = req.params;

    try {
        const miembroEliminado = await Equipo.findByIdAndDelete(id);
        if (!miembroEliminado) {
            return res.status(404).json({ message: "Miembro del equipo no encontrado" });
        }
        res.status(200).json({ message: "Miembro del equipo eliminado exitosamente" });
    } catch (error) {
        console.error("Error al eliminar el miembro del equipo:", error);
        res.status(500).json({ message: "Error al eliminar miembro del equipo" });
    }
};
