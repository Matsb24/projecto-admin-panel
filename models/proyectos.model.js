import mongoose from "mongoose";

const proyectoSchema = mongoose.Schema({
    cliente: {
        type: String,
        required: true,
        trim: true
    },
    nombreProyecto: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        required: true,
        trim: true
    },
    fechaInicio: {
        type: Date,
        required: true
    },
    fechaFin: {
        type: Date,
        required: true
    },
    servicios: {
        type: String,
        required: true,
        trim: true
    },
    estado: {
        type: String,
        required: true,
        default: "pendiente"
    },
    responsable: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

export default mongoose.model("Proyecto", proyectoSchema);
