// Cerrar.js
import { API_URL_AUTH } from '../../config.js';

// Cierre de sesión
document.getElementById("logoutButton").addEventListener("click", async () => {
    try {
        const response = await fetch(`${API_URL_AUTH}/logout`, {
            method: "POST",
            credentials: "include" // Para enviar cookies al backend
        });
        
        if (response.ok) {
            window.location.href = '../Login.html'; // Cambia la ruta según sea necesario
        } else {
            console.error("Error al cerrar sesión");
        }
    } catch (error) {
        console.error("Error:", error);
    }
});