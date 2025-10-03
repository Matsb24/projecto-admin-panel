import mongoose from "mongoose";

const clientSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    correo: {
        type: String,
        required: true,
        trim: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Valida formato de email
    },
    telefono: {
        type: String,
        required: true,
        trim: true
    },
    empresa: {
        type: String,
        required: true,
        trim: true
    },
    pais: {
        type: String,
        required: true,
        trim: true
    },
    servicios: {
        type: String,
        required: true,
        trim: true
    },
    estado: {
        type: String,
        required: true,
        default: "activo"
    }
}, {
    timestamps: true
});

export default mongoose.model("Client", clientSchema);
