# projecto-admin-panel
Este proyecto es un panel de administración web desarrollado como parte de un curso universitario. Está diseñado para la gestión de una empresa ficticia que ofrece venta de talleres y contratación de proyectos. Incluye un sistema de visualización de datos con gráficos dinámicos, administración de registros y conexión a MongoDB para el manejo de la base de datos.

# Características

  Generación de gráficos interactivos con los datos almacenados.
  
  CRUD completo (crear, leer, actualizar, eliminar) para talleres, clientes y proyectos.
  
  Autenticación de usuarios con roles administrativos.

# Requisitos previos

  Node.js (versión recomendada: 18+)
  
  MongoDB Atlas o servidor local de MongoDB
  
  Navegador actualizado

# Instalación y uso
  Clonar el repositorio
  git clone https://github.com/Matsb24/proyecto-admin-panel.git
  cd workshop-admin-dashboard
  
  Instalar dependencias
  npm install
  
  Iniciar el proyecto
  npm start
  
# Configuración de la base de datos
El proyecto utiliza MongoDB para la gestión de datos.
El cluster original ya no está disponible, por lo que deberás conectar tu propio cluster de MongoDB Atlas o una instancia local.

Abre el archivo db.js.

Localiza la función connectDB

import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect("") // ← coloca aquí tu cadena de conexión
        console.log("Conexión exitosa");
    } catch (error) {
        console.log(error);
    }
};
