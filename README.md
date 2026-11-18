# Nexus Asesores — Proyecto final HP III

**Institución:** Institución Universitaria Pascual Bravo  
**Curso:** Herramientas de Programación III (ET0056), grupo 053, 2026-2  
**Docente:** Luis Fernando Londoño López  
**Equipo:** Santiago Baena Rodriguez 
**Aplicación publicada:** https://santi-011.github.io/Nexus-Asesores/

## Descripción
Aplicación web de catálogo y administración de vehículos. Permite registrar, consultar, editar y eliminar vehículos, filtrar catálogo, calcular indicadores, usar tabla con búsqueda y filtros combinados, ordenar, paginar y exportar CSV. Consulta marcas reales de automóviles mediante una API REST pública.

## Ejecución
1. Abrir la carpeta del proyecto en VS Code.
2. Instalar la extensión **Live Server** si no está instalada.
3. Abrir `index.html` con **Open with Live Server**. No abrir directamente con `file://` porque los módulos ES requieren un servidor HTTP.
4. Para la consulta API se necesita conexión a internet. Si falla, el sistema presenta un mensaje y el inventario local sigue disponible.

## Estructura
```
index.html
README.md
css/estilos.css
js/modelo.js
js/vista.js
js/controlador.js
js/servicios/api.js
img/cx50.jpeg    
img/mazda2.jpeg                  
img/bmwx3.png                  
img/cx5.jpeg                  
img/patrol.jpeg                  
img/tracker.jpeg                  
img/bmw218.jpeg  
img/banner.png                 
img/bannervertical.png  
img/logo.png                  
Manual Tecnico.pdf
Manual de Usuario.pdf
```

## Normas de codificación del equipo
- Variables y funciones JavaScript en `camelCase` y nombres descriptivos en español.
- Clases CSS con convención BEM cuando representan bloques, elementos y modificadores, por ejemplo `.tarjeta__precio`.
- Sangría de cuatro espacios en JavaScript y HTML; comentarios breves en español sobre la responsabilidad de cada función.
- El modelo no modifica el DOM; la vista no persiste datos; el controlador coordina los eventos.
- Se utiliza `textContent` para representar datos en lugar de insertar HTML procedente de entradas.
- Sin bibliotecas ni frameworks de interfaz.

## Arquitectura y persistencia
- `modelo.js`: datos, validación de código único, CRUD y almacenamiento local con clave `nexus_asesores_v1`.
- `vista.js`: tarjetas, tabla, filtros, indicadores, formularios y estados de la API.
- `controlador.js`: eventos, filtros, paginación, exportación CSV y coordinación entre capas.
- `servicios/api.js`: solicitud HTTP y transformación de datos de la API.
- `localStorage`: guarda el arreglo de vehículos mediante `JSON.stringify` y lo recupera con `JSON.parse`; persiste por navegador y origen, no es una base de datos compartida.

## API REST utilizada
- **Proveedor:** National Highway Traffic Safety Administration (NHTSA), Vehicle Product Information Catalog (vPIC).
- **URL base:** `https://vpic.nhtsa.dot.gov/api/vehicles/`
- **Endpoint:** `GetMakesForVehicleType/car`
- **Método:** `GET`
- **Parámetros:** `format=json` en la URL; `car` representa el tipo de vehículo.
- **URL completa:** `https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?format=json`

## Documentación oficial consultada
1. [MDN: Fetch API](https://developer.mozilla.org/es/docs/Web/API/Fetch_API/Using_Fetch): solicitud HTTP y comprobación de respuesta.
2. [MDN: Window.localStorage](https://developer.mozilla.org/es/docs/Web/API/Window/localStorage): persistencia en navegador.
3. [MDN: Array.prototype.reduce](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce): cálculo de indicadores.
4. [MDN: Array.prototype.sort](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/sort): ordenamiento de la tabla.
5. [NHTSA vPIC API](https://vpic.nhtsa.dot.gov/api/): documentación del servicio de fabricantes.

## Pruebas manuales recomendadas
- Registrar un vehículo con código nuevo; intentar registrar el mismo código y comprobar error.
- Registrar cantidad `0` y comprobar estado agotado.
- Editar precio/categoría; recargar la página y verificar persistencia.
- Eliminar un vehículo, cancelar y aceptar la confirmación en dos pruebas distintas.
- Buscar por nombre o código, combinar categoría y estado, ordenar por precio y cambiar de página.
- Exportar CSV y verificar que incluya los registros filtrados y encabezados.
- Desconectar internet y reintentar la API; comprobar mensaje de error.
- Probar en un teléfono o en modo responsivo del navegador.

## Uso de inteligencia artificial
Se utilizó asistencia de IA para revisión de errores, organización del código, implementación de tabla avanzada, integración de API y borradores de documentación. 

## Limitaciones
No existe backend ni autenticación real. El formulario de contacto solo muestra confirmación local; no envía correos. El inventario se almacena exclusivamente en el navegador. Las imágenes originales deben incorporarse antes de la entrega. La aplicación no está publicada automáticamente por este paquete.
