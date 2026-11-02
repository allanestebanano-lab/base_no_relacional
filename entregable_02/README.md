# Entregable 02 — Mongo Express

## Estado de auditoría

La configuración de Compose fue inspeccionada estáticamente. No se confirmó aquí el estado del servicio, su conexión viva con MongoDB ni la ejecución de operaciones en la interfaz. Los documentos y resultados de la práctica no están disponibles en el repositorio para contrastar la base de datos y el CRUD.

| Criterio | Estado de auditoría |
|---|---|
| 1. Despliegue e interconexión | En progreso: Compose revisado; falta confirmar servicio accesible y conexión efectiva |
| 2. Bases de datos y colecciones | Pendiente de resultados verificables |
| 3. Documentos BSON/JSON | Pendiente de resultados verificables |
| 4. Consultas y CRUD | Pendiente de resultados verificables |
| 5. Documento y evidencias | Pendiente: no se encontró el Word para inspección |

## Arquitectura declarada

`compose.yaml` define el servicio `mongo-express` con la imagen `mongo-express:1.0.2-20`, política `unless-stopped` y publicación del puerto del contenedor 8081 solo en `127.0.0.1:8081` del equipo. El servicio se conecta a MongoDB usando el nombre de host `mongodb` dentro de la red externa `nosql-entregable-01_red_nosql`, declarada en Compose como `red_mongodb_compartida`.

La URL de conexión y la autenticación web se interpolan desde variables de entorno. Los valores secretos no se incluyen aquí. Compose requiere las variables de usuario/contraseña para MongoDB y para la autenticación web de Mongo Express. El servicio depende de que el contenedor MongoDB y la red externa ya existan.

## Dependencias y uso

Requisitos declarados: Docker Desktop/Docker Compose, el servicio MongoDB del Entregable 01 activo y la red compartida `nosql-entregable-01_red_nosql`. El archivo local de variables debe estar presente y configurado por el estudiante; no se inspeccionó ni modificó en esta auditoría.

Desde PowerShell, en `entregable_02`, el inicio se realiza con:

```powershell
docker compose up -d
```

Para comprobar el estado del servicio y sus registros:

```powershell
docker compose ps
docker compose logs --tail 50 mongo-express
```

La interfaz, si el servicio inicia correctamente, se abre en `http://127.0.0.1:8081`. Para detener únicamente el servicio de esta guía, sin eliminar volúmenes ni recrear MongoDB:

```powershell
docker compose stop mongo-express
```

Estos son pasos de uso; no se ejecutaron durante la auditoría. No se declara que la interfaz esté accesible.

## Práctica prevista y estado de resultados

La guía contempla crear la base `tienda_electronica_db` con las colecciones `productos`, `clientes` y `pedidos`, e insertar documentos con tipos BSON/JSON como ObjectId, fechas ISO, strings, números, booleanos, arreglos y subdocumentos. También contempla filtros `$gt`, `$in`, `$regex`, `$and` y `$or`, la actualización de `MOU-002` y la eliminación controlada de `TEMP-999`.

No se encontró un reporte, capturas inspeccionables ni una confirmación explícita de los resultados de esas acciones. Por tanto, este documento no afirma que la base o colecciones se hayan creado, que los tipos se hayan insertado, que las consultas hayan devuelto resultados, que `MOU-002` se haya actualizado ni que `TEMP-999` se haya eliminado. No se realizaron operaciones sobre MongoDB en esta auditoría.

Para cerrar estos apartados, registrar en el documento de soporte los resultados reales de cada operación: captura de la base y colecciones; documentos BSON/JSON con tipos visibles; consulta y resultado de cada filtro; y comparación antes/después de la actualización y eliminación segura. No repetir la eliminación si ya se hubiera ejecutado: primero confirmar su resultado mediante evidencia existente.

## Organización de la práctica

Se recomienda presentar las evidencias en este orden dentro del documento Word individual: (1) despliegue e interconexión de Mongo Express; (2) base y colecciones; (3) documentos y tipos; (4) consultas y cambios CRUD con resultados; (5) conclusiones técnicas, fotografías reales del laboratorio y referencias a las capturas. Las capturas pueden permanecer incorporadas en el Word; no es necesario duplicarlas en `evidencias/`.

## Hallazgo documental

`entregable_02/DOCUMENTO_SOPORTE_GUIA_02.md` no contenía texto al inicio de esta revisión. No se encontró archivo Word (`.doc`/`.docx`) en el repositorio, incluidos los directorios `documentos/` y `scripts/`. El criterio 5 queda pendiente hasta inspeccionar el documento individual y verificar su correspondencia con los cinco criterios, las capturas, fotografías y conclusiones requeridas.
