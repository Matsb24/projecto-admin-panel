const API_URL = "http://localhost:3000/api/auth"; // Cambia a la URL de tu backend si es diferente

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      try {
          const response = await fetch(`${API_URL}/login`, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({ email, password })
          });
          const data = await response.json();
          
          if (response.ok) {
              document.getElementById("loginMessage").textContent = "Inicio de sesión exitoso!";
              window.location.href = './Menu/Menu.html';
          } else {
              document.getElementById("loginMessage").textContent = data.message || "Error en el inicio de sesión";
          }
      } catch (error) {
          console.error("Error:", error);
      }
  });
});


