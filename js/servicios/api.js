// SERVICIO API: consulta datos externos sin acceder directamente al DOM.

const URL_MARCAS = "https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json";


// Consume el catálogo público de fabricantes de automóviles de NHTSA vPIC.
export async function consultarMarcasAutomoviles() {

    const respuesta = await fetch(URL_MARCAS, { method: "GET" });

    if (!respuesta.ok) {

        throw new Error("La API respondió con estado " + respuesta.status);
    }

    const datos = await respuesta.json();

    if (!Array.isArray(datos.Results)) {

        throw new Error("La API devolvió una estructura inesperada");
    }

    // map transforma los resultados; filter descarta nombres vacíos;
    // sort presenta las marcas en orden alfabético.
    const marcas = datos.Results.map(function (item) {

        return { nombre: String(item.MakeName || "").trim() };
    }).filter(function (item) {

        return item.nombre !== "";
    }).sort(function (a, b) {

        return a.nombre.localeCompare(b.nombre, "es");
    });

    // La sección muestra un subconjunto para no saturar la página.
    return marcas.slice(0, 24);
}
