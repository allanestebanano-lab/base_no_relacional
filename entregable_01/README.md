# Entregable 01 — MongoDB y Docker

## Estado

Los criterios técnicos 1 a 4 fueron verificados por el estudiante con pruebas reales en Windows. El criterio 5 sigue pendiente de auditoría documental: no hay capturas ni documento Word en `evidencias/` al momento de esta revisión.

| Criterio | Estado actual |
|---|---|
| 1. Docker Compose y MongoDB | Verificado técnicamente |
| 2. Persistencia | Verificado técnicamente |
| 3. Administración con mongosh | Verificado técnicamente |
| 4. Cliente gráfico MongoDB Compass | Verificado técnicamente |
| 5. Documento y evidencias | En progreso; faltan evidencias comprobables |

## Configuración y resultados reportados

- Docker Desktop 4.97.0 y MongoDB 8.0.32.
- Contenedor `nosql-entregable-01-mongodb-1` funcionando.
- Puerto publicado en `127.0.0.1:27017`.
- Red bridge `nosql-entregable-01_red_nosql`.
- Volumen `nosql-entregable-01_mongo_data`, montado en `/data/db`.
- Autenticación correcta con `mongosh` como `admin_universidad`, con rol `root` en `admin`.
- `connectionStatus` y `ping` respondieron `ok: 1`.
- Se comprobó MongoDB Compass conectado a `127.0.0.1:27017`, la base `universidad_nosql` y las colecciones `coleccion_laboratorio` y `pruebas_persistencia`.

Los valores de credenciales no se documentan. El archivo local `.env` está excluido por `.gitignore`.

## Persistencia comprobada

El documento `E01-PERSISTENCIA-001` se insertó en `universidad_nosql.pruebas_persistencia` con fecha `2026-11-02T15:54:34.439Z`. Tras reiniciar y recrear el contenedor sin eliminar el volumen, se encontró el mismo documento y se conservaron su identificador, fecha y contenido.

## Administración comprobada

En `mongosh`, `db.version()` devolvió `8.0.32`, `show dbs` mostró `universidad_nosql`, y `db.stats()` devolvió `ok: 1`. Se usaron `show collections`, `find()`, `findOne()` y `countDocuments()`. También se creó `E01-ADMIN-001` en `coleccion_laboratorio`.

## Evidencias

La carpeta `evidencias/` está vacía en esta revisión. Por ello, no se incluyen referencias a capturas inexistentes ni se da por inspeccionado el Word que el estudiante está preparando. Para auditar el criterio 5 se deberán incorporar, según corresponda, capturas legibles y reales de Compose/Docker, persistencia, comandos de `mongosh` y MongoDB Compass, además de fotografías reales del laboratorio y conclusiones en el documento individual requerido.

## Siguiente paso

Completar la auditoría del documento individual y sus evidencias para cerrar el criterio 5. Con ese pendiente identificado, la documentación técnica de los criterios 1 a 4 queda consolidada para continuar con el Entregable 02 — Mongo Express.
