import { API_URL_CLIENTE } from '../config.js';

function obtenerDatosDesdeTabla() {
    const nombres = [];
    const servicios = [];
    const estados = [];

    const filas = document.querySelectorAll('#tablaClientes tbody tr');
    filas.forEach(fila => {
        const celdas = fila.querySelectorAll('td');
        if (celdas.length >= 7) {
            nombres.push(celdas[0].textContent);
            servicios.push(celdas[5].textContent);
            estados.push(celdas[6].textContent);
        }
    });
    return { nombres, servicios, estados };
}

// Función para generar gráficos de barras
function crearGraficoBarras(nombres, estados) {
    const ctx = document.getElementById("barChart").getContext("2d");

    // Si ya hay un gráfico, destruirlo antes de crear uno nuevo
    if (window.barChartInstance) {
        window.barChartInstance.destroy();
    }

    const estadosContados = {};

    estados.forEach(estado => {
        estadosContados[estado] = (estadosContados[estado] || 0) + 1;
    });

    const labels = Object.keys(estadosContados);
    const data = Object.values(estadosContados);

    window.barChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Cantidad de Clientes por Estado del Proyecto',
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: { y: { beginAtZero: true } }
        }
    });
}

// Función para crear gráfico de pastel
function crearGraficoPastel(servicios) {
    const ctx = document.getElementById("pieChart").getContext("2d");

    // Si ya hay un gráfico, destruirlo antes de crear uno nuevo
    if (window.pieChartInstance) {
        window.pieChartInstance.destroy();
    }

    const serviciosContados = {};

    servicios.forEach(servicio => {
        const listaServicios = servicio.split(', ');
        listaServicios.forEach(s => {
            serviciosContados[s] = (serviciosContados[s] || 0) + 1;
        });
    });

    const labels = Object.keys(serviciosContados);
    const data = Object.values(serviciosContados);

    window.pieChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Servicios Contratados',
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1
            }]
        }
    });
}

function cargarYMostrarGraficos() {
    const datos = obtenerDatosDesdeTabla();
    crearGraficoBarras(datos.nombres, datos.estados);
    crearGraficoPastel(datos.servicios);
}

// Selecciona el formulario y escucha el evento de envío
const formCliente = document.getElementById("formCliente");

document.getElementById("formCliente").addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevenir el comportamiento predeterminado de recarga de página

    // Recoger los datos del formulario
    const clienteData = {
        nombre: document.getElementById("nombre").value,
        correo: document.getElementById("correo").value,
        telefono: document.getElementById("telefono").value,
        empresa: document.getElementById("empresa").value,
        pais: document.getElementById("pais").value,
        servicios: document.getElementById("servicios").value,
        estado: document.getElementById("estado").value
    };

    const formCliente = document.getElementById("formCliente");
    const clienteId = formCliente.getAttribute("data-editar"); // Obtener el ID del cliente si estamos editando

    // Si el formulario tiene el atributo data-editar, significa que estamos editando un cliente
    if (clienteId) {
        // Actualizar los datos del cliente
        try {
            const response = await fetch(`${API_URL_CLIENTE}/clientes/${clienteId}`, {
                method: "PUT", // Usamos PUT para actualizar
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(clienteData) // Convertir el objeto a JSON
            });

            const result = await response.json();
            if (response.status === 200) {
                alert("Cliente actualizado exitosamente");
                obtenerClientes(); // Actualizar la lista de clientes después de la edición
                formCliente.removeAttribute("data-editar"); // Limpiar el atributo de edición
            } else {
                alert("Error al actualizar cliente: " + result.message);
            }
        } catch (error) {
            console.error("Error al enviar la solicitud:", error);
            alert("Hubo un problema al actualizar el cliente");
        }
    } else {
        // Crear un nuevo cliente
        try {
            const response = await fetch(`${API_URL_CLIENTE}/clientes`, {
                method: "POST", // Usamos POST para crear un cliente
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(clienteData) // Convertir el objeto a JSON
            });

            const result = await response.json();
            if (response.status === 201) {
                alert("Cliente agregado exitosamente");
                obtenerClientes(); // Actualizar la lista de clientes después de agregar
            } else {
                alert("Error al agregar cliente: " + result.message);
            }
        } catch (error) {
            console.error("Error al enviar la solicitud:", error);
            alert("Hubo un problema al agregar el cliente");
        }
    }
});

// Función para obtener y mostrar los clientes en la tabla
async function obtenerClientes() {
    try {
        const response = await fetch(`${API_URL_CLIENTE}/clientes`);
        const clientes = await response.json();

        // Accedemos a la tabla y su cuerpo
        const tablaClientes = document.getElementById("tablaClientes").getElementsByTagName('tbody')[0];

        // Limpiar la tabla antes de agregar los nuevos datos
        tablaClientes.innerHTML = '';

        // Recorrer los clientes y crear una fila por cada uno
        clientes.forEach(cliente => {
            const fila = tablaClientes.insertRow();
            const celdaNombre = fila.insertCell(0);
            celdaNombre.textContent = cliente.nombre;
            const celdaCorreo = fila.insertCell(1);
            celdaCorreo.textContent = cliente.correo;
            const celdaTelefono = fila.insertCell(2);
            celdaTelefono.textContent = cliente.telefono;
            const celdaEmpresa = fila.insertCell(3);
            celdaEmpresa.textContent = cliente.empresa;
            const celdaPais = fila.insertCell(4);
            celdaPais.textContent = cliente.pais;
            const celdaServicios = fila.insertCell(5);
            celdaServicios.textContent = cliente.servicios;
            const celdaEstado = fila.insertCell(6);
            celdaEstado.textContent = cliente.estado;

            // Crear la celda del botón de editar
            const celdaEditar = fila.insertCell(7);
            const botonEditar = document.createElement("button");
            botonEditar.textContent = "Editar";
            botonEditar.classList.add("btn", "btn-warning"); // Estilo de Bootstrap (si lo estás usando)
            botonEditar.addEventListener("click", () => editarCliente(cliente));
            celdaEditar.appendChild(botonEditar);

            // Crear la celda del botón de borrar
            const celdaBorrar = fila.insertCell(8);
            const botonBorrar = document.createElement("button");
            botonBorrar.textContent = "Borrar";
            botonBorrar.classList.add("btn", "btn-danger"); // Estilo de Bootstrap (si lo estás usando)
            botonBorrar.addEventListener("click", () => borrarCliente(cliente._id));
            celdaBorrar.appendChild(botonBorrar);
        });

        cargarYMostrarGraficos();

    } catch (error) {
        console.error("Error al cargar los clientes:", error);
        alert("Hubo un problema al cargar los clientes.");
    }
}

//Editar cliente
function editarCliente(cliente) {
    // Rellenar el formulario de edición con los datos del cliente
    document.getElementById("nombre").value = cliente.nombre;
    document.getElementById("correo").value = cliente.correo;
    document.getElementById("telefono").value = cliente.telefono;
    document.getElementById("empresa").value = cliente.empresa;
    document.getElementById("pais").value = cliente.pais;
    document.getElementById("servicios").value = cliente.servicios;
    document.getElementById("estado").value = cliente.estado;

    // Cambiar el comportamiento del formulario para editar
    const formCliente = document.getElementById("formCliente");
    formCliente.setAttribute("data-editar", cliente._id); // Guardar el ID del cliente en un atributo
}


// Función para borrar un cliente
async function borrarCliente(clienteId) {
    try {
        const response = await fetch(`${API_URL_CLIENTE}/clientes/${clienteId}`, {
            method: "DELETE"
        });

        if (response.status === 200) {
            alert("Cliente eliminado exitosamente");
            obtenerClientes(); // Actualizar la lista de clientes después de borrar
        } else {
            alert("Error al eliminar cliente");
        }
    } catch (error) {
        console.error("Error al borrar el cliente:", error);
        alert("Hubo un problema al eliminar el cliente.");
    }
}

// Llamar a la función para cargar los clientes cuando se carga la página
document.addEventListener("DOMContentLoaded", obtenerClientes);