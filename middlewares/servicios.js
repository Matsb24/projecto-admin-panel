import { API_URL_SERVICIO } from '../config.js';

// Obtener los datos de la tabla
function obtenerDatosTablaServicios() {
    const tabla = document.getElementById("tablaServicios");
    const disponibilidad = [];
    const precios = [];
    const nombresServicios = [];

    for (let i = 1; i < tabla.rows.length; i++) {
        const fila = tabla.rows[i];
        disponibilidad.push(fila.cells[4].textContent); // Disponibilidad
        precios.push(parseFloat(fila.cells[2].textContent.replace('$', ''))); // Precio
        nombresServicios.push(fila.cells[0].textContent); // Nombre del Servicio
    }

    return { disponibilidad, precios, nombresServicios };
}

// Crear gráfico de pastel para distribución de servicios por disponibilidad
function crearGraficoDisponibilidadServicios(disponibilidad) {
    const ctx = document.getElementById("disponibilidadServiciosChart").getContext("2d");

    if (window.disponibilidadServiciosChartInstance) {
        window.disponibilidadServiciosChartInstance.destroy();
    }

    const contadorDisponibilidad = {};
    disponibilidad.forEach(estado => {
        contadorDisponibilidad[estado] = (contadorDisponibilidad[estado] || 0) + 1;
    });

    const labels = Object.keys(contadorDisponibilidad);
    const data = Object.values(contadorDisponibilidad);

    window.disponibilidadServiciosChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Servicios por Disponibilidad',
                data: data,
                backgroundColor: ['rgba(54, 162, 235, 0.5)', 'rgba(255, 99, 132, 0.5)'],
                borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Distribución de Servicios por Disponibilidad' }
            }
        }
    });
}

// Crear gráfico de barras para precios de los servicios
function crearGraficoPreciosServicios(precios, nombresServicios) {
    const ctx = document.getElementById("preciosServiciosChart").getContext("2d");

    if (window.preciosServiciosChartInstance) {
        window.preciosServiciosChartInstance.destroy();
    }

    window.preciosServiciosChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: nombresServicios,
            datasets: [{
                label: 'Precio de Servicios',
                data: precios,
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Precio ($)' }
                },
                x: {
                    title: { display: true, text: 'Servicios' }
                }
            }
        }
    });
}

// Ejecutar las funciones para extraer los datos y crear los gráficos
function cargarYMostrarGraficos() {
    const { disponibilidad, precios, nombresServicios } = obtenerDatosTablaServicios();
    crearGraficoDisponibilidadServicios(disponibilidad);
    crearGraficoPreciosServicios(precios, nombresServicios);
}

// Selecciona el formulario y escucha el evento de envío
document.getElementById("formServicio").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevenir recarga de la página

    const servicioData = {
        nombreServicio: document.getElementById("nombreServicio").value,
        descripcion: document.getElementById("descripcion").value,
        precio: document.getElementById("precio").value,
        tiempoEstimado: document.getElementById("tiempoEstimado").value,
        disponibilidad: document.getElementById("disponibilidad").value
    };

    const servicioId = this.dataset.servicioId; // Verificar si hay un ID

    try {
        if (servicioId) {
            // Modo de edición
            const response = await fetch(`${API_URL_SERVICIO}/servicios/${servicioId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(servicioData)
            });

            if (response.status === 200) {
                alert("Servicio actualizado exitosamente");
                this.dataset.servicioId = ""; // Limpiar el ID
                obtenerServicios();
            } else {
                const result = await response.json();
                alert("Error al actualizar servicio: " + result.message);
            }
        } else {
            // Modo de agregar
            const response = await fetch(`${API_URL_SERVICIO}/servicios`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(servicioData)
            });

            if (response.status === 201) {
                alert("Servicio agregado exitosamente");
                obtenerServicios();
            } else {
                const result = await response.json();
                alert("Error al agregar servicio: " + result.message);
            }
        }
    } catch (error) {
        console.error("Error al enviar la solicitud:", error);
        alert("Hubo un problema al procesar la solicitud.");
    }
});

// Función para obtener y mostrar los servicios en la tabla
async function obtenerServicios() {
    try {
        const response = await fetch(`${API_URL_SERVICIO}/servicios`);
        const servicios = await response.json();

        const tablaServicios = document.getElementById("tablaServicios").getElementsByTagName('tbody')[0];
        tablaServicios.innerHTML = ''; // Limpiar la tabla

        servicios.forEach(servicio => {
            const fila = tablaServicios.insertRow();

            fila.insertCell(0).textContent = servicio.nombreServicio;
            fila.insertCell(1).textContent = servicio.descripcion;
            fila.insertCell(2).textContent = servicio.precio;
            fila.insertCell(3).textContent = servicio.tiempoEstimado;
            fila.insertCell(4).textContent = servicio.disponibilidad;

            const celdaEditar = fila.insertCell(5);
            const botonEditar = document.createElement("button");
            botonEditar.textContent = "Editar";
            botonEditar.classList.add("btn", "btn-primary");
            botonEditar.addEventListener("click", () => editarServicio(servicio));
            celdaEditar.appendChild(botonEditar);

            const celdaBorrar = fila.insertCell(6);
            const botonBorrar = document.createElement("button");
            botonBorrar.textContent = "Borrar";
            botonBorrar.classList.add("btn", "btn-danger");
            botonBorrar.addEventListener("click", () => borrarServicio(servicio._id));
            celdaBorrar.appendChild(botonBorrar);
        });

        cargarYMostrarGraficos();
    } catch (error) {
        console.error("Error al cargar los servicios:", error);
        alert("Hubo un problema al cargar los servicios.");
    }
}

// Función para editar un servicio
function editarServicio(servicio) {
    document.getElementById("nombreServicio").value = servicio.nombreServicio;
    document.getElementById("descripcion").value = servicio.descripcion;
    document.getElementById("precio").value = servicio.precio;
    document.getElementById("tiempoEstimado").value = servicio.tiempoEstimado;
    document.getElementById("disponibilidad").value = servicio.disponibilidad;

    // Establecer el ID del servicio en el formulario
    document.getElementById("formServicio").dataset.servicioId = servicio._id;
}

// Función para borrar un servicio
async function borrarServicio(servicioId) {
    try {
        const response = await fetch(`${API_URL_SERVICIO}/servicios/${servicioId}`, {
            method: "DELETE"
        });

        if (response.status === 200) {
            alert("Servicio eliminado exitosamente");
            obtenerServicios();
        } else {
            alert("Error al eliminar servicio.");
        }
    } catch (error) {
        console.error("Error al eliminar el servicio:", error);
        alert("Hubo un problema al eliminar el servicio.");
    }
}

// Cargar los servicios al iniciar
document.addEventListener("DOMContentLoaded", obtenerServicios);