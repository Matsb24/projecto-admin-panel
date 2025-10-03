import mongoose from "mongoose";

const equipoSchema = mongoose.Schema({
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
    rol: {
        type: String,
        required: true,
        trim: true
    },
    especialidad: {
        type: String,
        required: true,
        trim: true
    },
    proyectos: {
        type: Number,
        required: true,
        default: 0
    },
    disponibilidad: {
        type: String,
        required: true,
        enum: ["Disponible", "No disponible"] // Valores aceptados
    },
    fechaIngreso: {
        type: Date,
        required: true
    },
    estado: {
        type: String,
        required: true,
        default: "activo" // Valor por defecto
    }
}, {
    timestamps: true // Agrega createdAt y updatedAt automáticamente
});

export default mongoose.model("Equipo", equipoSchema);
