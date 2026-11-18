// VISTA: representa datos en el DOM sin almacenar ni modificar el inventario.

const contenedorVehiculos = document.getElementById("contenedor-vehiculos");
const contadorResultados = document.getElementById("contador-resultados");
const mensajeSinResultados = document.getElementById("mensaje-sin-resultados");
const filtrosCategorias = document.getElementById("filtros-categorias");

const resumenTotal = document.getElementById("resumen-total");
const resumenAgotados = document.getElementById("resumen-agotados");
const resumenUnidades = document.getElementById("resumen-unidades");
const resumenValor = document.getElementById("resumen-valor");

const cuerpoTabla = document.getElementById("cuerpo-tabla");
const mensajeFormulario = document.getElementById("mensaje-formulario");
const mensajeContacto = document.getElementById("mensaje-contacto");


// Formatea números como valores monetarios colombianos.
export function formatearMoneda(valor) {

    return "$" + valor.toLocaleString("es-CO");
}


// Construye las tarjetas del catálogo y sus botones CRUD.
export function pintarVehiculos(lista) {

    contenedorVehiculos.textContent = "";

    contadorResultados.textContent = lista.length + " vehiculo(s) encontrado(s)";

    mensajeSinResultados.hidden = lista.length !== 0;

    lista.forEach(function (vehiculo) {

        const tarjeta = document.createElement("article");
        tarjeta.classList.add("tarjeta");

        if (vehiculo.cantidad === 0) {

            tarjeta.classList.add("agotado");
        }


        const imagen = document.createElement("img");
        imagen.src = vehiculo.imagen;
        // Muestra un recurso alternativo si la imagen original no está disponible.
        imagen.onerror = function () {

            imagen.onerror = null;
            imagen.src = "img/vehiculo-respaldo.svg";
        };
        imagen.alt = vehiculo.nombre;
        imagen.classList.add("tarjeta__imagen");

        const titulo = document.createElement("h3");
        titulo.textContent = vehiculo.nombre;
        titulo.classList.add("tarjeta__titulo");

        const codigo = document.createElement("p");
        codigo.textContent = "Código: " + vehiculo.codigo;
        codigo.classList.add("tarjeta__codigo");

        const precio = document.createElement("p");
        precio.textContent = formatearMoneda(vehiculo.precio);
        precio.classList.add("tarjeta__precio");

        const categoria = document.createElement("p");
        categoria.textContent = "Categoría: " + vehiculo.categoria;
        categoria.classList.add("tarjeta__categoria");

        const cantidad = document.createElement("p");
        cantidad.classList.add("tarjeta__cantidad");

        if (vehiculo.cantidad === 0) {

            cantidad.textContent = "Agotado";
        } else {

            cantidad.textContent = "Disponibles: " + vehiculo.cantidad;
        }


        const botonEditar = document.createElement("button");
        botonEditar.type = "button";
        botonEditar.textContent = "Editar";
        botonEditar.classList.add("tarjeta__editar");
        botonEditar.dataset.id = vehiculo.id;

        const botonEliminar = document.createElement("button");
        botonEliminar.type = "button";
        botonEliminar.textContent = "Eliminar";
        botonEliminar.classList.add("tarjeta__eliminar");
        botonEliminar.dataset.id = vehiculo.id;

        
        tarjeta.appendChild(imagen);
        tarjeta.appendChild(titulo);
        tarjeta.appendChild(codigo);
        tarjeta.appendChild(precio);
        tarjeta.appendChild(categoria);
        tarjeta.appendChild(cantidad);
        tarjeta.appendChild(botonEditar);
        tarjeta.appendChild(botonEliminar);
        
        contenedorVehiculos.appendChild(tarjeta);
    });
}


// Crea los botones de categorías y destaca la opción seleccionada.
export function pintarFiltrosCategorias(lista, categoriaSeleccionada) {

    filtrosCategorias.textContent = "";

    const categorias = Array.from(new Set(lista.map(function (vehiculo) {
        
        return vehiculo.categoria;
    })));


    categorias.unshift("Todos");

    categorias.forEach(function (categoria) {

        const boton = document.createElement("button");

        boton.type = "button";
        boton.textContent = categoria;
        boton.classList.add("filtro-categoria");
        boton.dataset.categoria = categoria;

        if (categoria === categoriaSeleccionada) {

            boton.classList.add("seleccionado");
        }

        filtrosCategorias.appendChild(boton);
    });
}


// Muestra los indicadores calculados por el modelo.
export function pintarResumen(resumen) {

    resumenTotal.textContent = resumen.totalVehiculos;

    resumenAgotados.textContent = resumen.agotados;
    
    resumenUnidades.textContent = resumen.totalUnidades;

    resumenValor.textContent = formatearMoneda(resumen.valorInventario);
}


// Dibuja únicamente las filas de la página actual de la tabla.
export function pintarTabla(lista) {

    cuerpoTabla.textContent = "";

    lista.forEach(function (vehiculo) {

        const fila = document.createElement("tr");

        const celdaCodigo = document.createElement("td");
        const celdaNombre = document.createElement("td");
        const celdaCategoria = document.createElement("td");
        const celdaPrecio = document.createElement("td");
        const celdaCantidad = document.createElement("td");
        const celdaEstado = document.createElement("td");

        celdaCodigo.textContent = vehiculo.codigo;
        celdaNombre.textContent = vehiculo.nombre;
        celdaCategoria.textContent = vehiculo.categoria;
        celdaPrecio.textContent = formatearMoneda(vehiculo.precio);
        celdaCantidad.textContent = vehiculo.cantidad;

        if (vehiculo.cantidad === 0) {

            celdaEstado.textContent = "Agotado";
            fila.classList.add ("agotado");
        } else {

            celdaEstado.textContent = "Disponible";
        }

        fila.appendChild(celdaCodigo);
        fila.appendChild(celdaNombre);
        fila.appendChild(celdaCategoria);
        fila.appendChild(celdaPrecio);
        fila.appendChild(celdaCantidad);
        fila.appendChild(celdaEstado);

        cuerpoTabla.appendChild(fila);
    });
}


// Informa el resultado de una operación con estilos de éxito o error.
export function mostrarMensajeFormulario(mensaje, tipo) {

    mensajeFormulario.textContent = mensaje;
    mensajeFormulario.classList.remove("error", "exito");

    if (tipo === "error") {

        mensajeFormulario.classList.add("error");
    }

    if (tipo === "exito") {

        mensajeFormulario.classList.add("exito");
    }
}


// Confirma visualmente la recepción del formulario de contacto (sin envío real).
export function mostrarMensajeContacto(nombre) {

    mensajeContacto.textContent = "Gracias, " + nombre + ". Hemos recibido tu mensaje";

    mensajeContacto.classList.add("exito");
}


// Rellena el formulario con los datos del vehículo que se desea editar.
export function cargarFormularioEdicion(vehiculo) {

    document.getElementById("codigo-vehiculo").value = vehiculo.codigo;

    document.getElementById("nombre-vehiculo").value = vehiculo.nombre;

    document.getElementById("precio-vehiculo").value = vehiculo.precio;

    document.getElementById("categoria-vehiculo").value = vehiculo.categoria;

    document.getElementById("cantidad-vehiculo").value = vehiculo.cantidad;

    document.getElementById("imagen-vehiculo").value = vehiculo.imagen;

    const botonGuardar = document.querySelector("#formulario-vehiculo button[type='submit']");

    botonGuardar.textContent = "Guardar cambios";
}


// Limpia los campos y devuelve el botón a modo de registro.
export function restaurarFormulario() {

    const formulario = document.getElementById("formulario-vehiculo");

    formulario.reset();

    const botonGuardar = formulario.querySelector("button[type='submit']");

    botonGuardar.textContent = "Agregar vehiculo";
}




// Actualiza el estado visual de la tabla y su paginación.
export function pintarEstadoTabla(total, pagina, totalPaginas) {

    document.getElementById("tabla-resultados").textContent = total + " vehículo(s) en la tabla";
    document.getElementById("tabla-pagina").textContent = "Página " + pagina + " de " + totalPaginas;
    document.getElementById("tabla-anterior").disabled = pagina <= 1;
    document.getElementById("tabla-siguiente").disabled = pagina >= totalPaginas;
}


// Informa el estado de carga o error de la API, sin mostrar datos sin validar.
export function mostrarEstadoApi(mensaje, tipo = "normal") {

    const estado = document.getElementById("api-estado");
    estado.textContent = mensaje;
    estado.className = "api-estado " + tipo;
}


// Presenta las marcas de la API en una lista segura mediante textContent.
export function pintarMarcasApi(marcas) {

    const contenedor = document.getElementById("api-marcas");
    contenedor.textContent = "";

    marcas.forEach(function (marca) {

        const elemento = document.createElement("li");
        elemento.textContent = marca.nombre;
        contenedor.appendChild(elemento);
    });
}
