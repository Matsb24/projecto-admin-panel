import FAQ from "../models/faq.model.js";

// Crear un nuevo FAQ
export const agregarFAQ = async (req, res) => {
    const { pregunta, respuesta, fecha } = req.body;

    try {
        const nuevoFAQ = new FAQ({ pregunta, respuesta, fecha });

        const faqGuardado = await nuevoFAQ.save();
        res.status(201).json({
            message: "FAQ agregado exitosamente",
            faq: faqGuardado
        });
    } catch (error) {
        console.error("Error al guardar el FAQ:", error);
        res.status(500).json({ message: "Error al agregar FAQ" });
    }
};

// Obtener todos los FAQs
export const obtenerFAQs = async (req, res) => {
    try {
        const faqs = await FAQ.find();
        res.status(200).json(faqs);
    } catch (error) {
        console.error("Error al obtener los FAQs:", error);
        res.status(500).json({ message: "Error al obtener FAQs" });
    }
};

// Actualizar un FAQ por ID
export const actualizarFAQ = async (req, res) => {
    const { id } = req.params;
    const datosActualizados = req.body;

    try {
        const faqActualizado = await FAQ.findByIdAndUpdate(id, datosActualizados, { new: true });
        if (!faqActualizado) {
            return res.status(404).json({ message: "FAQ no encontrado" });
        }
        res.status(200).json({
            message: "FAQ actualizado exitosamente",
            faq: faqActualizado
        });
    } catch (error) {
        console.error("Error al actualizar el FAQ:", error);
        res.status(500).json({ message: "Error al actualizar FAQ" });
    }
};

// Eliminar un FAQ por ID
export const eliminarFAQ = async (req, res) => {
    const { id } = req.params;

    try {
        const faqEliminado = await FAQ.findByIdAndDelete(id);
        if (!faqEliminado) {
            return res.status(404).json({ message: "FAQ no encontrado" });
        }
        res.status(200).json({ message: "FAQ eliminado exitosamente" });
    } catch (error) {
        console.error("Error al eliminar el FAQ:", error);
        res.status(500).json({ message: "Error al eliminar FAQ" });
    }
};
