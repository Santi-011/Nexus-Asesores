// CONTROLADOR: conecta los eventos de la página con el modelo y la vista.

import {

    cargarVehiculos,
    obtenerVehiculos,
    obtenerVehiculoPorId,
    agregarVehiculo,
    actualizarVehiculo,
    eliminarVehiculo,
    obtenerResumen

} from "./modelo.js";

import {

    pintarVehiculos,
    pintarFiltrosCategorias,
    pintarResumen,
    pintarTabla,
    pintarEstadoTabla,
    mostrarMensajeFormulario,
    mostrarMensajeContacto,
    cargarFormularioEdicion,
    restaurarFormulario,
    mostrarEstadoApi,
    pintarMarcasApi

} from "./vista.js";

import { consultarMarcasAutomoviles } from "./servicios/api.js";


const buscarVehiculo = document.getElementById("buscar-vehiculo");
const filtrosCategorias = document.getElementById("filtros-categorias");
const contenedorVehiculos = document.getElementById("contenedor-vehiculos");
const formularioVehiculo = document.getElementById("formulario-vehiculo");
const codigoVehiculo = document.getElementById("codigo-vehiculo");
const nombreVehiculo = document.getElementById("nombre-vehiculo");
const precioVehiculo = document.getElementById("precio-vehiculo");
const categoriaVehiculo = document.getElementById("categoria-vehiculo");
const cantidadVehiculo = document.getElementById("cantidad-vehiculo");
const imagenVehiculo = document.getElementById("imagen-vehiculo");
const formularioContacto = document.getElementById("formulario-contacto");
const contactoNombre = document.getElementById("contacto-nombre");

const tablaBusqueda = document.getElementById("tabla-busqueda");
const tablaCategoria = document.getElementById("tabla-categoria");
const tablaEstado = document.getElementById("tabla-estado");
const tablaOrden = document.getElementById("tabla-orden");
const tablaTamano = document.getElementById("tabla-tamano");

let categoriaSeleccionada = "Todos";
let idVehiculoEnEdicion = null;
let paginaActual = 1;


// Actualiza catálogo, filtros, resumen y tabla después de cualquier cambio CRUD.
function actualizarInterfaz() {

    const listaVehiculos = obtenerVehiculos();

    const categoriasDisponibles = listaVehiculos.map(function (vehiculo) {

        return vehiculo.categoria;
    });

    if (categoriaSeleccionada !== "Todos" && !categoriasDisponibles.includes(categoriaSeleccionada)) {

        categoriaSeleccionada = "Todos";
    }

    pintarFiltrosCategorias(listaVehiculos, categoriaSeleccionada);
    actualizarCategoriasTabla(listaVehiculos);
    aplicarFiltros();
    pintarResumen(obtenerResumen());
    actualizarTabla();
}


// Filtra el catálogo mediante texto y categoría seleccionada.
function aplicarFiltros() {

    const textoBusqueda = buscarVehiculo.value.trim().toLowerCase();
    const listaVehiculos = obtenerVehiculos();

    const vehiculosFiltrados = listaVehiculos.filter(function (vehiculo) {

        const coincideBusqueda = vehiculo.nombre.toLowerCase().includes(textoBusqueda) ||
            vehiculo.codigo.toLowerCase().includes(textoBusqueda);

        const coincideCategoria = categoriaSeleccionada === "Todos" ||
            vehiculo.categoria === categoriaSeleccionada;

        return coincideBusqueda && coincideCategoria;
    });

    pintarVehiculos(vehiculosFiltrados);
}


// Reconstruye las opciones de categoría conservando el filtro seleccionado.
function actualizarCategoriasTabla(listaVehiculos) {

    const seleccion = tablaCategoria.value;
    const categorias = Array.from(new Set(listaVehiculos.map(function (vehiculo) {

        return vehiculo.categoria;
    }))).sort(function (a, b) {

        return a.localeCompare(b, "es");
    });

    tablaCategoria.textContent = "";

    const opcionTodas = document.createElement("option");
    opcionTodas.value = "Todos";
    opcionTodas.textContent = "Todas las categorías";
    tablaCategoria.appendChild(opcionTodas);

    categorias.forEach(function (categoria) {

        const opcion = document.createElement("option");
        opcion.value = categoria;
        opcion.textContent = categoria;
        tablaCategoria.appendChild(opcion);
    });

    tablaCategoria.value = categorias.includes(seleccion) ? seleccion : "Todos";
}


// Combina búsqueda, categoría y estado; ordena y pagina los registros de la tabla.
function obtenerFilasTabla() {

    const texto = tablaBusqueda.value.trim().toLowerCase();
    const categoria = tablaCategoria.value;
    const estado = tablaEstado.value;

    const filtrados = obtenerVehiculos().filter(function (vehiculo) {

        const coincideTexto = vehiculo.nombre.toLowerCase().includes(texto) ||
            vehiculo.codigo.toLowerCase().includes(texto);
        const coincideCategoria = categoria === "Todos" || vehiculo.categoria === categoria;
        const coincideEstado = estado === "Todos" ||
            (estado === "Disponible" && vehiculo.cantidad > 0) ||
            (estado === "Agotado" && vehiculo.cantidad === 0);

        return coincideTexto && coincideCategoria && coincideEstado;
    });

    const orden = tablaOrden.value;

    filtrados.sort(function (a, b) {

        if (orden === "precio-asc") return a.precio - b.precio;
        if (orden === "precio-desc") return b.precio - a.precio;
        if (orden === "cantidad-asc") return a.cantidad - b.cantidad;
        if (orden === "cantidad-desc") return b.cantidad - a.cantidad;
        if (orden === "codigo") return a.codigo.localeCompare(b.codigo, "es");
        return a.nombre.localeCompare(b.nombre, "es");
    });

    return filtrados;
}


// Pinta solo los elementos de la página elegida y actualiza sus controles.
function actualizarTabla() {

    const filas = obtenerFilasTabla();
    const tamano = Number(tablaTamano.value);
    const totalPaginas = Math.max(1, Math.ceil(filas.length / tamano));

    paginaActual = Math.min(Math.max(1, paginaActual), totalPaginas);

    const inicio = (paginaActual - 1) * tamano;
    const pagina = filas.slice(inicio, inicio + tamano);

    pintarTabla(pagina);
    pintarEstadoTabla(filas.length, paginaActual, totalPaginas);
}


// Descarga en CSV todos los registros filtrados, no solamente la página visible.
function exportarTablaCsv() {

    const filas = obtenerFilasTabla();
    const columnas = ["Código", "Vehículo", "Categoría", "Precio", "Cantidad", "Estado"];

    function escaparCsv(valor) {

        return '"' + String(valor).replaceAll('"', '""') + '"';
    }

    const contenido = [columnas, ...filas.map(function (vehiculo) {

        return [vehiculo.codigo, vehiculo.nombre, vehiculo.categoria,
            vehiculo.precio, vehiculo.cantidad,
            vehiculo.cantidad === 0 ? "Agotado" : "Disponible"];
    })].map(function (fila) {

        return fila.map(escaparCsv).join(";");
    }).join("\r\n");

    const archivo = new Blob(["\uFEFF" + contenido], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(archivo);
    const enlace = document.createElement("a");

    enlace.href = url;
    enlace.download = "nexus_inventario.csv";
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    URL.revokeObjectURL(url);
}


// Recoge los valores del formulario y evita convertir un campo vacío en cero.
function obtenerDatosFormulario() {

    return {

        codigo: codigoVehiculo.value.trim(),
        nombre: nombreVehiculo.value.trim(),
        precio: precioVehiculo.value.trim() === "" ? NaN : Number(precioVehiculo.value),
        categoria: categoriaVehiculo.value.trim(),
        cantidad: cantidadVehiculo.value.trim() === "" ? NaN : Number(cantidadVehiculo.value),
        imagen: imagenVehiculo.value.trim()
    };
}


// Atiende CREATE y UPDATE utilizando el mismo formulario.
formularioVehiculo.addEventListener("submit", function (evento) {

    evento.preventDefault();

    const datosVehiculo = obtenerDatosFormulario();
    const resultado = idVehiculoEnEdicion === null
        ? agregarVehiculo(datosVehiculo)
        : actualizarVehiculo(idVehiculoEnEdicion, datosVehiculo);

    if (!resultado.exito) {

        mostrarMensajeFormulario(resultado.mensaje, "error");
        return;
    }

    restaurarFormulario();
    idVehiculoEnEdicion = null;
    mostrarMensajeFormulario(resultado.mensaje, "exito");
    paginaActual = 1;
    actualizarInterfaz();
});


// Delegación de eventos: un solo listener atiende los botones de todas las tarjetas.
contenedorVehiculos.addEventListener("click", function (evento) {

    const botonEditar = evento.target.closest(".tarjeta__editar");
    const botonEliminar = evento.target.closest(".tarjeta__eliminar");

    if (botonEditar) {

        const id = Number(botonEditar.dataset.id);
        const vehiculo = obtenerVehiculoPorId(id);

        if (vehiculo === null) {

            mostrarMensajeFormulario("No se encontró el vehículo seleccionado", "error");
            return;
        }

        idVehiculoEnEdicion = id;
        cargarFormularioEdicion(vehiculo);
        mostrarMensajeFormulario("Editando vehículo " + vehiculo.codigo, "exito");
        formularioVehiculo.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
    }

    if (botonEliminar) {

        const id = Number(botonEliminar.dataset.id);

        if (!confirm("¿Quiere eliminar este vehículo del inventario?")) {

            return;
        }

        const resultado = eliminarVehiculo(id);

        if (!resultado.exito) {

            mostrarMensajeFormulario(resultado.mensaje, "error");
            return;
        }

        if (idVehiculoEnEdicion === id) {

            idVehiculoEnEdicion = null;
            restaurarFormulario();
        }

        mostrarMensajeFormulario(resultado.mensaje, "exito");
        actualizarInterfaz();
    }
});


// Reacciona a las búsquedas y a los botones de categorías del catálogo.
buscarVehiculo.addEventListener("input", aplicarFiltros);

filtrosCategorias.addEventListener("click", function (evento) {

    if (!evento.target.classList.contains("filtro-categoria")) return;

    categoriaSeleccionada = evento.target.dataset.categoria;
    actualizarInterfaz();
});


// Reacciona a los filtros y al ordenamiento de la tabla.
[tablaBusqueda, tablaCategoria, tablaEstado, tablaOrden, tablaTamano].forEach(function (control) {

    control.addEventListener(control === tablaBusqueda ? "input" : "change", function () {

        paginaActual = 1;
        actualizarTabla();
    });
});


document.getElementById("tabla-anterior").addEventListener("click", function () {

    paginaActual--;
    actualizarTabla();
});


document.getElementById("tabla-siguiente").addEventListener("click", function () {

    paginaActual++;
    actualizarTabla();
});


document.getElementById("tabla-exportar").addEventListener("click", exportarTablaCsv);


// Demostración local del formulario de contacto; no transmite datos a un servidor.
formularioContacto.addEventListener("submit", function (evento) {

    evento.preventDefault();
    mostrarMensajeContacto(contactoNombre.value.trim());
    formularioContacto.reset();
});


// Solicita marcas reales a la API y presenta carga, resultados o error amigable.
async function cargarMarcasApi() {

    mostrarEstadoApi("Consultando marcas de automóviles...", "cargando");

    try {

        const marcas = await consultarMarcasAutomoviles();
        pintarMarcasApi(marcas);
        mostrarEstadoApi("Se encontraron " + marcas.length + " marcas. Fuente: NHTSA vPIC.", "exito");

    } catch (error) {

        pintarMarcasApi([]);
        mostrarEstadoApi("No fue posible consultar las marcas. Comprueba tu conexión e inténtalo de nuevo.", "error");
    }
}


document.getElementById("api-recargar").addEventListener("click", cargarMarcasApi);


// Inicializa el inventario persistido y después carga la información externa.
function iniciarAplicacion() {

    try {

        cargarVehiculos();
        actualizarInterfaz();

    } catch (error) {

        console.error("No se pudo iniciar el inventario:", error);
        mostrarMensajeFormulario("No se pudo cargar el inventario guardado.", "error");
        formularioVehiculo.querySelector("button[type='submit']").disabled = true;
    }

    cargarMarcasApi();
}


iniciarAplicacion();
