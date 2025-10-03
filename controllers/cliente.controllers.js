import Client from "../models/cliente.model.js";

// Crear un nuevo cliente
export const agregarCliente = async (req, res) => {
    const {nombre, correo, telefono, empresa, pais, servicios, estado } = req.body;

    try {
        const nuevoCliente = new Client({nombre,correo,telefono,empresa,pais,servicios,estado});

        const clienteGuardado = await nuevoCliente.save();
        res.status(201).json({
            message: "Cliente agregado exitosamente",
            cliente: clienteGuardado
        });
    } catch (error) {
        console.error("Error al guardar el cliente:", error);
        res.status(500).json({ message: "Error al agregar cliente" });
    }
};

// Obtener todos los clientes
export const obtenerClientes = async (req, res) => {
    try {
        const clientes = await Client.find();
        res.status(200).json(clientes);
    } catch (error) {
        console.error("Error al obtener los clientes:", error);
        res.status(500).json({ message: "Error al obtener clientes" });
    }
};

// Actualizar un cliente por ID
export const actualizarCliente = async (req, res) => {
    const { id } = req.params;
    const datosActualizados = req.body;

    try {
        const clienteActualizado = await Client.findByIdAndUpdate(id, datosActualizados, { new: true });
        if (!clienteActualizado) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }
        res.status(200).json({
            message: "Cliente actualizado exitosamente",
            cliente: clienteActualizado
        });
    } catch (error) {
        console.error("Error al actualizar el cliente:", error);
        res.status(500).json({ message: "Error al actualizar cliente" });
    }
};

// Eliminar un cliente por ID
export const eliminarCliente = async (req, res) => {
    const { id } = req.params;

    try {
        const clienteEliminado = await Client.findByIdAndDelete(id);
        if (!clienteEliminado) {
            return res.status(404).json({ message: "Cliente no encontrado" });
        }
        res.status(200).json({ message: "Cliente eliminado exitosamente" });
    } catch (error) {
        console.error("Error al eliminar el cliente:", error);
        res.status(500).json({ message: "Error al eliminar cliente" });
    }
};
