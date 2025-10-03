import { API_URL_EQUIPO } from '../config.js';

// Obtener los datos de la tabla
function obtenerDatosTabla() {
    const tabla = document.getElementById("tablaEquipo");
    const roles = [];
    const disponibilidades = [];

    for (let i = 1; i < tabla.rows.length; i++) {
        const fila = tabla.rows[i];
        roles.push(fila.cells[2].textContent);
        disponibilidades.push(fila.cells[5].textContent);
    }

    return { roles, disponibilidades };
}

// Crear gráfico de barras para roles
function crearGraficoRoles(roles) {
    const ctx = document.getElementById("rolesChart").getContext("2d");

    // Si ya hay un gráfico, destruirlo antes de crear uno nuevo
    if (window.rolesChartInstance) {
        window.rolesChartInstance.destroy();
    }

    const rolesContados = {};

    // Contar los roles
    roles.forEach(rol => {
        rolesContados[rol] = (rolesContados[rol] || 0) + 1;
    });

    const labels = Object.keys(rolesContados);
    const data = Object.values(rolesContados);

    window.rolesChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Cantidad de Miembros por Rol',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}

// Crear gráfico de pastel para disponibilidad
function crearGraficoDisponibilidad(disponibilidades) {
    const ctx = document.getElementById("disponibilidadChart").getContext("2d");

    // Si ya hay un gráfico, destruirlo antes de crear uno nuevo
    if (window.disponibilidadChartInstance) {
        window.disponibilidadChartInstance.destroy();
    }

    const disponibilidadContada = {};

    // Contar las disponibilidades
    disponibilidades.forEach(disponibilidad => {
        disponibilidadContada[disponibilidad] = (disponibilidadContada[disponibilidad] || 0) + 1;
    });

    const labels = Object.keys(disponibilidadContada);
    const data = Object.values(disponibilidadContada);

    window.disponibilidadChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Disponibilidad del Equipo',
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)'
                ],
                borderWidth: 1
            }]
        }
    });
}

// Ejecutar las funciones para extraer los datos y crear los gráficos
function cargarYMostrarGraficos() {
    const datos = obtenerDatosTabla();
    crearGraficoRoles(datos.roles);
    crearGraficoDisponibilidad(datos.disponibilidades);
}

document.getElementById("formMiembro").addEventListener("submit", async function(event) {
    event.preventDefault();

    const equipoData = {
        nombre: document.getElementById("nombre").value,
        correo: document.getElementById("correo").value,
        rol: document.getElementById("rol").value,
        especialidad: document.getElementById("especialidad").value,
        proyectos: document.getElementById("proyectos").value,
        disponibilidad: document.getElementById("disponibilidad").value,
        fechaIngreso: document.getElementById("fechaIngreso").value
    };

    const equipoId = this.dataset.equipoId; // Verificar si hay un ID

    try {
        if (equipoId) {
            // Modo de edición
            const response = await fetch(`${API_URL_EQUIPO}/equipos/${equipoId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(equipoData)
            });

            if (response.status === 200) {
                alert("Miembro del equipo actualizado exitosamente");
                this.dataset.equipoId = ""; // Limpiar el ID
                obtenerEquipos();
            } else {
                const result = await response.json();
                alert("Error al actualizar miembro: " + result.message);
            }
        } else {
            // Modo de agregar
            const response = await fetch(`${API_URL_EQUIPO}/equipos`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(equipoData)
            });

            if (response.status === 201) {
                alert("Miembro del equipo agregado exitosamente");
                obtenerEquipos();
            } else {
                const result = await response.json();
                alert("Error al agregar miembro: " + result.message);
            }
        }
    } catch (error) {
        console.error("Error al enviar la solicitud:", error);
        alert("Hubo un problema al procesar la solicitud.");
    }
});

// Función para obtener y mostrar los equipos
async function obtenerEquipos() {
    try {
        const response = await fetch(`${API_URL_EQUIPO}/equipos`);
        const equipos = await response.json();

        const tablaEquipo = document.getElementById("tablaEquipo").getElementsByTagName('tbody')[0];
        tablaEquipo.innerHTML = '';

        equipos.forEach(equipo => {
            const fila = tablaEquipo.insertRow();
            fila.insertCell(0).textContent = equipo.nombre;
            fila.insertCell(1).textContent = equipo.correo;
            fila.insertCell(2).textContent = equipo.rol;
            fila.insertCell(3).textContent = equipo.especialidad;
            fila.insertCell(4).textContent = equipo.proyectos;
            fila.insertCell(5).textContent = equipo.disponibilidad;

            // Conversión de fecha para mostrar en formato local
            const fechaFormateada = convertirFechaISOAFormatoLocal(equipo.fechaIngreso);
            fila.insertCell(6).textContent = fechaFormateada;

            // Botón Editar
            const celdaEditar = fila.insertCell(7);
            const botonEditar = document.createElement("button");
            botonEditar.textContent = "Editar";
            botonEditar.classList.add("btn", "btn-warning");
            botonEditar.addEventListener("click", () => llenarFormularioParaEditar(equipo));
            celdaEditar.appendChild(botonEditar);

            // Botón Borrar
            const celdaBorrar = fila.insertCell(8);
            const botonBorrar = document.createElement("button");
            botonBorrar.textContent = "Borrar";
            botonBorrar.classList.add("btn", "btn-danger");
            botonBorrar.addEventListener("click", () => borrarEquipo(equipo._id));
            celdaBorrar.appendChild(botonBorrar);
        });
        cargarYMostrarGraficos();
    } catch (error) {
        console.error("Error al cargar los equipos:", error);
        alert("Hubo un problema al cargar los equipos.");
    }
}

// Función para borrar un equipo
async function borrarEquipo(equipoId) {
    try {
        const response = await fetch(`${API_URL_EQUIPO}/equipos/${equipoId}`, { method: "DELETE" });
        if (response.status === 200) {
            alert("Miembro del equipo eliminado exitosamente");
            obtenerEquipos();
        } else {
            alert("Error al eliminar miembro");
        }
    } catch (error) {
        console.error("Error al borrar el miembro:", error);
        alert("Hubo un problema al eliminar el miembro del equipo.");
    }
}

function llenarFormularioParaEditar(equipo) {
    document.getElementById("nombre").value = equipo.nombre;
    document.getElementById("correo").value = equipo.correo;
    document.getElementById("rol").value = equipo.rol;
    document.getElementById("especialidad").value = equipo.especialidad;
    document.getElementById("proyectos").value = equipo.proyectos;
    document.getElementById("disponibilidad").value = equipo.disponibilidad;
    document.getElementById("fechaIngreso").value = convertirFechaISOAFormatoLocal(equipo.fechaIngreso);

    // Guardar el ID del miembro en un atributo data del formulario
    document.getElementById("formMiembro").dataset.equipoId = equipo._id;
}

function convertirFechaISOAFormatoLocal(fechaISO) {
    const fecha = new Date(fechaISO);
    return fecha.toISOString().split("T")[0]; // Extrae solo la parte de la fecha
}

document.addEventListener("DOMContentLoaded", obtenerEquipos);
