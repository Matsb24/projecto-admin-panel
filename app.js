import express from "express";
import morgan from "morgan";
import cors from "cors";
import taskRouters from "./routers/task.routers.js";
import authRoutes from "./routers/auth.routes.js";
import clienteRoutes from "./routers/cliente.routes.js";
import equipoRoutes from "./routers/equipo.routes.js";
import equipofaq from "./routers/faq.routes.js";
import equipoProyectos from "./routers/proyectos.routes.js";
import equipoServicios from "./routers/servicios.routes.js";

const app = express();

// Configuración de CORS
const corsOptions = {
  origin: "http://127.0.0.1:5500", // Origen permitido
  methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
  credentials: true, // Permitir el envío de cookies
};

// Aplicar middleware de CORS
app.use(cors(corsOptions));

app.use(morgan("dev"));
app.use(express.json());

app.use("/api/task", taskRouters);
app.use('/api/auth', authRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/equipos", equipoRoutes);
app.use("/api/faq", equipofaq);
app.use("/api/proyectos", equipoProyectos);
app.use("/api/servicios", equipoServicios);

app.get("/", (req, resp) => {
    resp.send("<h1>Hola Mundo</h1>");
});

export default app;