import mongoose from "mongoose";

const Servicios = mongoose.Schema({
        nombreServicio: {
            type: String,
            required: true,
        },
        descripcion: {
            type: String,
            required: true,
        },
        precio: {
            type: Number,
            required: true,
            min: 0
        },
        tiempoEstimado: {
            type: String,
            required: true,
        },
        disponibilidad: {
            type: String,
            required: true,
            enum: ["Disponible", "No disponible"], // Solo permite estos valores
            default: "Disponible"
        }
    },
    {
        timestamps: true // Agrega automáticamente campos de creado y actualizado
    }
);


export default mongoose.model("Servicios", Servicios);
