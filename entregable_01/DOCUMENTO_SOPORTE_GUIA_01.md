# Documento de soporte — Guía 01: MongoDB y Docker

## Propósito y alcance

Este documento registra la configuración y los resultados comunicados para el Entregable 01. Los criterios técnicos 1 a 4 se consideran verificados técnicamente a partir de las pruebas reales ejecutadas por el estudiante. Esta revisión documental no volvió a ejecutar Docker ni a consultar la base de datos. El criterio 5 permanece pendiente de auditoría del documento individual y sus evidencias.

## Entorno y arquitectura

- Docker Desktop: 4.97.0.
- MongoDB: 8.0.32.
- Contenedor: `nosql-entregable-01-mongodb-1`.
- Publicación: `127.0.0.1:27017`.
- Red: `nosql-entregable-01_red_nosql`, controlador `bridge`.
- Volumen: `nosql-entregable-01_mongo_data`, asociado a `/data/db`.
- Usuario administrativo confirmado: `admin_universidad`, rol `root` en la base `admin`.

Las credenciales se mantienen fuera de la documentación. El archivo `.env` no debe versionarse ni aparecer en capturas compartidas.

## Criterio 1 — Docker Compose y MongoDB

Se reportó el contenedor funcionando con MongoDB 8.0.32, puerto ligado a loopback, red bridge propia y volumen persistente. La autenticación con `mongosh` fue correcta; `connectionStatus` y `ping` devolvieron `ok: 1`.

**Resultado:** Verificado técnicamente. La carpeta de evidencias disponible en esta revisión no contiene capturas para auditoría documental.

## Criterio 2 — Persistencia

Se creó `E01-PERSISTENCIA-001` en `universidad_nosql.pruebas_persistencia`, con fecha original `2026-11-02T15:54:34.439Z`. Después de operaciones de reinicio y recreación del contenedor sin eliminar el volumen, se confirmó la presencia del mismo documento con su identificador, fecha y contenido conservados.

**Resultado:** Verificado técnicamente según las pruebas reportadas.

## Criterio 3 — Administración con mongosh

Los resultados reportados fueron:

- `db.version()` → `8.0.32`.
- `show dbs` → incluye `universidad_nosql`.
- `db.stats()` → `ok: 1`.
- `show collections` → mostró las colecciones de la base.
- Se ejecutaron consultas `find()`, `findOne()` y `countDocuments()`.
- Se creó `E01-ADMIN-001` en `coleccion_laboratorio`.

**Resultado:** Verificado técnicamente según las pruebas reportadas.

## Criterio 4 — MongoDB Compass

MongoDB Compass está instalado en Windows. Se reportó conexión exitosa a `127.0.0.1:27017`, exploración de `universidad_nosql` y visualización de `coleccion_laboratorio` y `pruebas_persistencia`, incluidos los dos documentos de prueba.

**Resultado:** Verificado técnicamente según las pruebas reportadas.

## Incidencia inicial de autenticación y resolución

Durante la configuración inicial, la autenticación no funcionó con las credenciales que se intentaban utilizar. En la imagen oficial de MongoDB, las variables `MONGO_INITDB_ROOT_USERNAME` y `MONGO_INITDB_ROOT_PASSWORD` inicializan el usuario administrador cuando se inicializa un directorio de datos vacío; no cambian automáticamente usuarios o contraseñas en un `/data/db` que ya contiene datos. Por eso, cambiar las variables de entorno sin reinicializar los datos de prueba no habría actualizado la cuenta existente.

La resolución reportada fue una reinicialización controlada del volumen de pruebas y una nueva inicialización con las credenciales previstas. Después se validó el acceso como `admin_universidad`, su rol `root` en `admin`, `connectionStatus` y `ping` con `ok: 1`. Esta explicación describe el incidente reportado; no se ejecutó ninguna operación de volumen durante esta revisión. La reinicialización de un volumen elimina los datos guardados en él, por lo que solo debe realizarse deliberadamente en un entorno de pruebas y cuando esos datos puedan descartarse.

## Criterio 5 — Documento y evidencias

La carpeta `entregable_01/evidencias/` existe, pero estaba vacía al revisarla. No se encontró un Word dentro de `entregable_01`. El estudiante indicó que lo está preparando; por tanto, no se afirma que esté completo ni se marca el criterio como verificado.

Para la auditoría final faltan el documento individual inspeccionable y las evidencias requeridas por la guía: capturas reales y legibles de configuración/ejecución, persistencia, administración en `mongosh` y Compass, fotografías reales del laboratorio y conclusiones. Añadir referencias relativas a las capturas cuando los archivos existan, por ejemplo `![Descripción](evidencias/archivo-real.png)`; no usar nombres de ejemplo como si fueran archivos disponibles.

## Resumen de estado

| Criterio | Estado |
|---|---|
| 1. Docker Compose y MongoDB | Verificado técnicamente |
| 2. Persistencia | Verificado técnicamente |
| 3. Administración con mongosh | Verificado técnicamente |
| 4. Cliente gráfico | Verificado técnicamente |
| 5. Documento y evidencias | En progreso; pendiente de inspección |

## Fuentes y limitaciones de esta revisión

Los resultados técnicos anteriores corresponden a las pruebas confirmadas por el estudiante. En esta revisión se inspeccionaron los archivos del proyecto y la carpeta de evidencias; no se ejecutaron comandos Docker, no se modificó `.env` y no se accedió ni alteró la base de datos. La presencia del Word y la validez de sus capturas, fotografías y conclusiones requieren una revisión posterior cuando se entregue el archivo.
