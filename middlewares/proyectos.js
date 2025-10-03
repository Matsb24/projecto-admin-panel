import { API_URL_PROYECTO } from '../config.js';

// Obtener los datos de la tabla
function obtenerDatosTablaProyectos() {
    const tabla = document.getElementById("tablaProyectos");
    const estados = [];
    const fechasInicio = [];
    
    // Recorremos cada fila del cuerpo de la tabla (<tbody>)
    for (let i = 1; i < tabla.rows.length; i++) {
        const fila = tabla.rows[i];
        estados.push(fila.cells[6].textContent); // Estado
        fechasInicio.push(fila.cells[3].textContent); // Fecha de Inicio
    }

    // Contar proyectos por estado
    const contadorEstados = {};
    estados.forEach(estado => {
        contadorEstados[estado] = (contadorEstados[estado] || 0) + 1;
    });

    // Contar proyectos por fecha de inicio
    const contadorFechas = {};
    fechasInicio.forEach(fecha => {
        contadorFechas[fecha] = (contadorFechas[fecha] || 0) + 1;
    });

    return { contadorEstados, contadorFechas };
}

// Crear gráfico de barras para proyectos por estado
function crearGraficoEstadoProyectos(contadorEstados) {
    const ctx = document.getElementById("estadoProyectosChart").getContext("2d");

    // Si ya hay un gráfico, destruirlo antes de crear uno nuevo
    if (window.estadoProyectosChartInstance) {
        window.estadoProyectosChartInstance.destroy();
    }

    const estados = Object.keys(contadorEstados);
    const cantidades = Object.values(contadorEstados);

    window.estadoProyectosChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: estados,
            datasets: [{
                label: 'Cantidad de Proyectos por Estado',
                data: cantidades,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Cantidad de Proyectos'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Estado'
                    }
                }
            }
        }
    });
}

// Crear gráfico de líneas para proyectos por fecha de inicio
function crearGraficoFechaInicioProyectos(contadorFechas) {
    const ctx = document.getElementById("fechaInicioProyectosChart").getContext("2d");

    // Si ya hay un gráfico, destruirlo antes de crear uno nuevo
    if (window.fechaInicioProyectosChartInstance) {
        window.fechaInicioProyectosChartInstance.destroy();
    }

    const fechas = Object.keys(contadorFechas);
    const cantidades = Object.values(contadorFechas);

    window.fechaInicioProyectosChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: fechas,
            datasets: [{
                label: 'Cantidad de Proyectos por Fecha de Inicio',
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
                    title: {
                        display: true,
                        text: 'Cantidad de Proyectos'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Fecha de Inicio'
                    }
                }
            }
        }
    });
}


// Ejecutar las funciones para extraer los datos y crear los gráficos

function cargarYMostrarGraficos() {
    const { contadorEstados, contadorFechas } = obtenerDatosTablaProyectos();
crearGraficoEstadoProyectos(contadorEstados);
crearGraficoFechaInicioProyectos(contadorFechas);
}


// Selecciona el formulario y escucha el evento de envío
document.getElementById("formProyecto").addEventListener("submit", async function(event) {
    event.preventDefault();

    const proyectoData = {
        cliente: document.getElementById("cliente").value,
        nombre: document.getElementById("nombreProyecto").value,
        descripcion: document.getElementById("descripcion").value,
        fechaInicio: document.getElementById("fechaInicio").value,
        fechaFin: document.getElementById("fechaFin").value,
        servicios: document.getElementById("servicios").value,
        estado: document.getElementById("estado").value,
        responsable: document.getElementById("responsable").value
    };

    const proyectoId = this.dataset.proyectoId; // Verificar si hay un ID

    try {
        if (proyectoId) {
            const response = await fetch(`${API_URL_PROYECTO}/proyectos/${proyectoId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(proyectoData)
            });

            if (response.status === 200) {
                alert("Proyecto actualizado exitosamente");
                this.dataset.proyectoId = ""; // Limpiar el ID
                obtenerProyectos();
            } else {
                const result = await response.json();
                alert("Error al actualizar proyecto: " + result.message);
            }
        } else {
            const response = await fetch(`${API_URL_PROYECTO}/proyectos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(proyectoData)
            });

            if (response.status === 201) {
                alert("Proyecto agregado exitosamente");
                obtenerProyectos();
            } else {
                const result = await response.json();
                alert("Error al agregar proyecto: " + result.message);
            }
        }
    } catch (error) {
        console.error("Error al enviar la solicitud:", error);
        alert("Hubo un problema al procesar la solicitud.");
    }
});


// Función para obtener y mostrar los proyectos en la tabla
async function obtenerProyectos() {
    try {
        const response = await fetch(`${API_URL_PROYECTO}/proyectos`);
        const proyectos = await response.json();

        const tablaProyectos = document.getElementById("tablaProyectos").getElementsByTagName('tbody')[0];
        tablaProyectos.innerHTML = '';

        proyectos.forEach(proyecto => {
            const fila = tablaProyectos.insertRow();
            fila.insertCell(0).textContent = proyecto.cliente;
            fila.insertCell(1).textContent = proyecto.nombreProyecto;
            fila.insertCell(2).textContent = proyecto.descripcion;
            fila.insertCell(3).textContent = convertirFechaISOAFormatoLocal(proyecto.fechaInicio);
            fila.insertCell(4).textContent = convertirFechaISOAFormatoLocal(proyecto.fechaFin);
            fila.insertCell(5).textContent = proyecto.servicios;
            fila.insertCell(6).textContent = proyecto.estado;
            fila.insertCell(7).textContent = proyecto.responsable;

            // Botón Editar
            const celdaEditar = fila.insertCell(8);
            const botonEditar = document.createElement("button");
            botonEditar.textContent = "Editar";
            botonEditar.classList.add("btn", "btn-warning");
            botonEditar.addEventListener("click", () => llenarFormularioParaEditarProyecto(proyecto));
            celdaEditar.appendChild(botonEditar);

            // Botón Borrar
            const celdaBorrar = fila.insertCell(9);
            const botonBorrar = document.createElement("button");
            botonBorrar.textContent = "Borrar";
            botonBorrar.classList.add("btn", "btn-danger");
            botonBorrar.addEventListener("click", () => borrarProyecto(proyecto._id));
            celdaBorrar.appendChild(botonBorrar);
        });

        cargarYMostrarGraficos(); // Usar la función correcta
    } catch (error) {
        console.error("Error al cargar los proyectos:", error);
        alert("Hubo un problema al cargar los proyectos.");
    }
}

// Función para borrar un proyecto
async function borrarProyecto(proyectoId) {
    try {
        const response = await fetch(`${API_URL_PROYECTO}/proyectos/${proyectoId}`, {
            method: "DELETE"
        });

        if (response.status === 200) {
            alert("Proyecto eliminado exitosamente");
            obtenerProyectos();
        } else {
            alert("Error al eliminar proyecto.");
        }
    } catch (error) {
        console.error("Error al borrar el proyecto:", error);
        alert("Hubo un problema al eliminar el proyecto.");
    }
}

function llenarFormularioParaEditarProyecto(proyecto) {
    // Llena los campos del formulario con los datos del proyecto seleccionado
    document.getElementById("cliente").value = proyecto.cliente;
    document.getElementById("nombreProyecto").value = proyecto.nombreProyecto; // Ajustado a "nombreProyecto"
    document.getElementById("descripcion").value = proyecto.descripcion;
    document.getElementById("responsable").value = proyecto.responsable;
    document.getElementById("fechaInicio").value = proyecto.fechaInicio.split('T')[0]; // Formato para inputs tipo "date"
    document.getElementById("fechaFin").value = proyecto.fechaFin.split('T')[0]; // Formato para inputs tipo "date"
    document.getElementById("servicios").value = proyecto.servicios;
    document.getElementById("estado").value = proyecto.estado;

    // Guardar el ID del proyecto en el formulario para futuras actualizaciones
    const form = document.getElementById("formProyecto");
    form.dataset.proyectoId = proyecto._id; // Asegúrate de que `_id` sea el nombre correcto del ID en tu backend
}


function convertirFechaISOAFormatoLocal(fechaISO) {
    const fecha = new Date(fechaISO);
    return fecha.toISOString().split("T")[0]; // Extrae solo la parte de la fecha
}

// Cargar proyectos al cargar la página
document.addEventListener("DOMContentLoaded", obtenerProyectos);
