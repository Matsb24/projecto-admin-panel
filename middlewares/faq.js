import { API_URL_FAQ } from '../config.js';

// Obtener los datos de la tabla
function obtenerDatosTabla() {
    const tabla = document.getElementById("tablaFAQ");
    const fechas = [];
    
    for (let i = 1; i < tabla.rows.length; i++) {
        const fila = tabla.rows[i];
        fechas.push(fila.cells[2].textContent); // Última Actualización
    }

    const contadorFechas = {};
    fechas.forEach(fecha => {
        contadorFechas[fecha] = (contadorFechas[fecha] || 0) + 1;
    });

    return contadorFechas;
}

// Crear gráfico de líneas para preguntas frecuentes por fecha
function crearGraficoFAQ(contadorFechas) {
    const ctx = document.getElementById("faqChart").getContext("2d");

    if (window.faqChartInstance) {
        window.faqChartInstance.destroy();
    }

    const fechas = Object.keys(contadorFechas);
    const cantidades = Object.values(contadorFechas);

    window.faqChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: fechas,
            datasets: [{
                label: 'Cantidad de Preguntas por Fecha',
                data: cantidades,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Cantidad de Preguntas' }
                },
                x: {
                    title: { display: true, text: 'Fecha' }
                }
            }
        }
    });
}

// Ejecutar las funciones para extraer los datos y crear el gráfico
function cargarYMostrarGraficos() {
    const contadorFechas = obtenerDatosTabla();
    crearGraficoFAQ(contadorFechas);
}

document.getElementById("faqForm").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevenir el comportamiento de recarga de página

    const pregunta = document.getElementById("pregunta").value;
    const respuesta = document.getElementById("respuesta").value;
    const fecha = document.getElementById("fecha").value;

    if (!pregunta || !respuesta || !fecha) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    const faqData = { pregunta, respuesta, fecha };

    try {
        const response = await fetch(`${API_URL_FAQ}/faq`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(faqData)
        });

        const result = await response.json();
        if (response.status === 201) {
            alert("FAQ agregado exitosamente");
            obtenerFAQs(); // Actualizar la lista de FAQs
        } else {
            alert("Error al agregar FAQ: " + result.message);
        }
    } catch (error) {
        console.error("Error al enviar la solicitud:", error);
        alert("Hubo un problema al agregar el FAQ");
    }
});

// Función para obtener y mostrar los FAQs en la tabla
async function obtenerFAQs() {
    try {
        const response = await fetch(`${API_URL_FAQ}/faq`);
        const faqs = await response.json();

        const tablaFAQs = document.getElementById("tablaFAQ").getElementsByTagName('tbody')[0];
        tablaFAQs.innerHTML = ''; // Limpiar la tabla antes de agregar los nuevos datos

        faqs.forEach(faq => {
            const fila = tablaFAQs.insertRow();
            const celdaPregunta = fila.insertCell(0);
            celdaPregunta.textContent = faq.pregunta;

            const celdaRespuesta = fila.insertCell(1);
            celdaRespuesta.textContent = faq.respuesta;

            const celdaFecha = fila.insertCell(2);
            celdaFecha.textContent = new Date(faq.fecha).toLocaleDateString();

            const celdaBorrar = fila.insertCell(3);
            const botonBorrar = document.createElement("button");
            botonBorrar.textContent = "Borrar";
            botonBorrar.classList.add("btn", "btn-danger");
            botonBorrar.addEventListener("click", () => borrarFAQ(faq._id));
            celdaBorrar.appendChild(botonBorrar);

            const celdaEditar = fila.insertCell(4);
            const botonEditar = document.createElement("button");
            botonEditar.textContent = "Editar";
            botonEditar.classList.add("btn", "btn-warning");
            botonEditar.addEventListener("click", () => editarFAQ(faq));
            celdaEditar.appendChild(botonEditar);
        });
        cargarYMostrarGraficos();
    } catch (error) {
        console.error("Error al cargar los FAQs:", error);
        alert("Hubo un problema al cargar los FAQs.");
    }
}

// Función para borrar un FAQ
async function borrarFAQ(faqId) {
    try {
        const response = await fetch(`${API_URL_FAQ}/faq/${faqId}`, {
            method: "DELETE"
        });

        if (response.status === 200) {
            alert("FAQ eliminado exitosamente");
            obtenerFAQs(); // Actualizar la lista de FAQs después de borrar
        } else {
            alert("Error al eliminar FAQ");
        }
    } catch (error) {
        console.error("Error al borrar el FAQ:", error);
        alert("Hubo un problema al eliminar el FAQ.");
    }
}

// Función para editar un FAQ
function editarFAQ(faq) {
    document.getElementById("pregunta").value = faq.pregunta;
    document.getElementById("respuesta").value = faq.respuesta;
    document.getElementById("fecha").value = convertirFechaISOAFormatoLocal(faq.fecha);

    // Establecer el ID del FAQ a editar
    const formFAQ = document.getElementById("faqForm");
    formFAQ.setAttribute("data-editar", faq._id);
}

// Función para manejar la edición de un FAQ
document.getElementById("faqForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const pregunta = document.getElementById("pregunta").value;
    const respuesta = document.getElementById("respuesta").value;
    const fecha = document.getElementById("fecha").value;
    const faqId = event.target.getAttribute("data-editar");

    if (!pregunta || !respuesta || !fecha) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    const faqData = { pregunta, respuesta, fecha };

    try {
        const response = await fetch(`${API_URL_FAQ}/faq/${faqId}`, {
            method: "PUT", // Método PUT para actualizar
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(faqData)
        });

        const result = await response.json();
        if (response.status === 200) {
            alert("FAQ actualizado exitosamente");
            obtenerFAQs(); // Actualizar la lista de FAQs
        } else {
            alert("Error al actualizar FAQ: " + result.message);
        }
    } catch (error) {
        console.error("Error al enviar la solicitud:", error);
        alert("Hubo un problema al actualizar el FAQ");
    }
});

function convertirFechaISOAFormatoLocal(fechaISO) {
    const fecha = new Date(fechaISO);
    return fecha.toISOString().split("T")[0]; // Extrae solo la parte de la fecha
}

// Llamar a la función para cargar los FAQs cuando se carga la página
document.addEventListener("DOMContentLoaded", obtenerFAQs);