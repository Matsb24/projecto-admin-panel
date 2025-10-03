//Llamada hacia el servidor Web (EXPRESS)
import app from "./app.js";
import {connectDB} from "./db.js";

//Llamada hacia la base de datos (MONGODB)
connectDB();


const PORT = 3000;
app.listen(PORT);

console.log('Web server running on port: ', PORT);