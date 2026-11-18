//MODELO

// Inventario inicial utilizado cuando el navegador no tiene registros guardados.
const vehiculosIniciales = [

    {
        id: 1,
        codigo: "NX-001",
        nombre: "BMW 218i Gran Coupe",
        precio: 100000000,
        categoria: "Sedan",
        cantidad: 1,
        imagen: "img/bmw218.jpeg"
    },

    {
        id: 2,
        codigo: "NX-002",
        nombre: "Nissan Patrol",
        precio: 100000000,
        categoria: "4x4",
        cantidad: 1,
        imagen: "img/patrol.jpeg"
    },

    {
        id: 3,
        codigo: "NX-003",
        nombre: "Chevrolet Tracker LT",
        precio: 49000000,
        categoria: "SUV",
        cantidad: 1,
        imagen: "img/tracker.jpeg"
    },

    {
        id: 4,
        codigo: "NX-004",
        nombre: "Mazda CX-5 Grand Touring",
        precio: 127000000,
        categoria: "SUV",
        cantidad: 1,
        imagen: "img/cx5.jpeg"
    },

    {
        id: 5,
        codigo: "NX-005",
        nombre: "Mazda 2 Grand Touring",
        precio: 84900000,
        categoria: "Hatchback",
        cantidad: 1,
        imagen: "img/mazda2.jpeg"
    },

    {
        id: 6,
        codigo: "NX-006",
        nombre: "Mazda CX-50 Grand Touring",
        precio: 154000000,
        categoria: "SUV",
        cantidad: 0,
        imagen: "img/cx50.jpeg"
    },

]

// Comprueba código único, nombre, precio, cantidad, categoría e imagen.
export function validar(vehiculo, listaVehiculos, idActual = null) {

    if (vehiculo.codigo.trim() === "") {
        return "El codigo de inventario es obligatorio.";
    }

    const codigoDuplicado = listaVehiculos.some(function (item) {
        
        return(item.codigo.trim().toUpperCase() === 
        vehiculo.codigo.trim().toUpperCase() && item.id !== idActual);

    });

    if (codigoDuplicado) {

        return "Ya existe un vehiculo con ese codigo de inventario ";
    }

    if (vehiculo.nombre.trim() === "") {

        return "El nombre del vehiculo es obligatorio ";
    }

    if (!Number.isFinite(vehiculo.precio) || vehiculo.precio <= 0) {

        return "El precio debe ser un numero mayor que cero ";
    }

    if (!Number.isInteger(vehiculo.cantidad) || vehiculo.cantidad < 0) {

        return "La cantidad debe ser un numero entero no negativo ";
    }

    if (vehiculo.categoria.trim() === "") {

        return "La categoria es obligatoria ";
    }

    if (vehiculo.imagen.trim() === "") {

        return "La ruta de la imagen es obligatoria ";
    }

    return null;
}


const CLAVE_STORAGE = "nexus_asesores_v1";

let vehiculos = [...vehiculosIniciales];

// Devuelve copias para evitar que otras capas modifiquen el inventario directamente.
export function obtenerVehiculos() {

    return vehiculos.map(function (vehiculo) {
        return { ...vehiculo};
    });
}


// Convierte el inventario a JSON y lo conserva en localStorage.
function guardarVehiculos() {

    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(vehiculos));
}

// Recupera el inventario persistido; si no existe, inicializa los registros base.
export function cargarVehiculos() {

    const datosGuardados = localStorage.getItem(CLAVE_STORAGE);

    if (datosGuardados === null) {

        vehiculos = vehiculosIniciales.map(function (vehiculo) {
              return {...vehiculo};
        });

        guardarVehiculos();
        return;
    }

    try {
        const datos = JSON.parse(datosGuardados);

        if (!Array.isArray(datos)) {

            throw new Error("El inventario guardado no es valido ");
        }

        vehiculos = datos;

    } catch (error) {

        console.error("Error al cargar el inventario:", error);
        throw new Error("No se pudo recuperar el inventario guardado");
    }
}


// CREATE: valida, asigna ID y guarda un nuevo vehículo.
export function agregarVehiculo(datosVehiculo) {

    const nuevoVehiculo = { 

        id: Date.now(),
        codigo: datosVehiculo.codigo.trim().toUpperCase(),
        nombre: datosVehiculo.nombre.trim(),
        precio: Number(datosVehiculo.precio),
        categoria: datosVehiculo.categoria.trim(),
        cantidad: Number(datosVehiculo.cantidad),
        imagen: datosVehiculo.imagen.trim()
    };


    const error = validar(nuevoVehiculo, vehiculos);

    if (error !== null) {
        
        return {
            exito: false,
            mensaje: error
        };
    }


    while(vehiculos.some(item => item.id === nuevoVehiculo.id)) {
        nuevoVehiculo.id++;
    }

    vehiculos.push(nuevoVehiculo);
    guardarVehiculos();

    return {
        exito: true,
        mensaje: "Vehiculo registrado correctamente"
    };
}


// READ: busca un vehículo por su identificador interno.
export function obtenerVehiculoPorId(id) {

    const vehiculo = vehiculos.find(function (item) {

        return item.id === id;
    });

    return vehiculo ? {...vehiculo} : null;
}


// UPDATE: modifica un registro existente sin duplicar su código.
export function actualizarVehiculo(id, datosVehiculo) {

    const posicion = vehiculos.findIndex(function (item) {

        return item.id === id;
    });

    if (posicion === -1) {

        return {
            exito: false,
            mensaje: "El vehiculo no existe"
        };
    }


    const vehiculoActualizado = {

        id: id,
        codigo: datosVehiculo.codigo.trim().toUpperCase(),
        nombre: datosVehiculo.nombre.trim(),
        precio: Number(datosVehiculo.precio),
        categoria: datosVehiculo.categoria.trim(),
        cantidad: Number(datosVehiculo.cantidad),
        imagen: datosVehiculo.imagen.trim()
    };

    const error = validar(vehiculoActualizado, vehiculos, id);

    if (error !== null) {

        return {
            exito: false,
            mensaje: error
        };
    }

    vehiculos[posicion] = vehiculoActualizado;
    guardarVehiculos();

    return {
        exito: true,
        mensaje: "Vehiculo actualizado correctamente"
    };
}


// DELETE: elimina un registro y actualiza el almacenamiento local.
export function eliminarVehiculo(id) {

    const posicion = vehiculos.findIndex(function (item) {

        return item.id === id;
    });

    if (posicion === -1) {

        return {
            exito: false,
            mensaje: "El vehiculo no existe"
        };
    }

    vehiculos.splice(posicion, 1);
    guardarVehiculos();

    return {
        exito: true,
        mensaje: "Vehiculo eliminado correctamente"
    };
}


// Calcula indicadores con filter y reduce; incluye precio por cantidad.
export function obtenerResumen() {

    const totalVehiculos = vehiculos.length;

    const agotados = vehiculos.filter(function (vehiculo) {

        return vehiculo.cantidad === 0;
    }).length;

    const totalUnidades = vehiculos.reduce(function (total, vehiculo) {
        
        return total + vehiculo.cantidad;
    }, 0);

    const valorInventario = vehiculos.reduce(function (total, vehiculo) {
        
        return total + vehiculo.precio * vehiculo.cantidad;
    }, 0);

    return {

        totalVehiculos,
        agotados,
        totalUnidades,
        valorInventario
    };
}