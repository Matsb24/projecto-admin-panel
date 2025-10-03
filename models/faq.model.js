import mongoose from "mongoose";

const faqSchema = mongoose.Schema({
    pregunta: {
        type: String,
        required: true
    },
    respuesta: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

export default mongoose.model("FAQ", faqSchema);
