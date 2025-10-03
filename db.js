//Conexión a base de datos - MONGODB

import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect("") //aca va la cadena de conexión
        console.log('Conexión exitosa');
    } catch (error) {
        console.log(error);
    }
}