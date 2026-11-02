# Documento de soporte — Guía 02: Mongo Express

## Alcance de esta auditoría

Se inspeccionó estáticamente `compose.yaml` y el contenido del repositorio. No se ejecutaron comandos Docker, no se consultó ni modificó MongoDB y no se abrió ningún archivo de credenciales. El Word individual señalado como lugar de las capturas no está disponible en el repositorio. Por ello, solo se documentan como hechos la configuración que aparece en Compose y las ausencias observadas; no se atribuyen resultados a operaciones cuya ejecución no está confirmada.

## Criterio 1 — Despliegue e interconexión de Mongo Express (20 puntos)

**Configuración revisada:** Compose declara `mongo-express:1.0.2-20`, publica `127.0.0.1:8081:8081`, activa autenticación web y conecta el servicio a la red externa `nosql-entregable-01_red_nosql`. La URL configurada usa `mongodb:27017` y `authSource=admin`, con variables de entorno para las credenciales. No se imprimieron ni inspeccionaron sus valores.

**Estado: En progreso.** La definición estática es coherente con la arquitectura prevista, pero no hay evidencia inspeccionable de que el servicio se haya iniciado, que la red esté disponible o que la interfaz responda.

## Criterio 2 — Base de datos y colecciones (20 puntos)

La estructura que se debe acreditar es `tienda_electronica_db` con `productos`, `clientes` y `pedidos`. No se encontró evidencia verificable de que se hayan creado ni de su contenido.

**Estado: Pendiente de resultados verificables.**

## Criterio 3 — Documentos BSON/JSON (20 puntos)

La guía solicita demostrar documentos con ObjectId, fecha ISO/BSON Date, strings, números, booleanos, arreglos y subdocumentos. No se encontraron documentos ni capturas disponibles para comprobar esos tipos. La descripción de este requisito no constituye evidencia de inserción.

**Estado: Pendiente de resultados verificables.**

## Criterio 4 — Consultas y operaciones CRUD (20 puntos)

Las operaciones que deben respaldarse son filtros `$gt`, `$in`, `$regex`, `$and` y `$or`, la actualización selectiva del producto `MOU-002` y la eliminación segura del documento de prueba `TEMP-999`. No se dispone de salidas confirmadas por el estudiante ni del Word que contendría las capturas. No se afirma que estas acciones hayan sido realizadas y no se ejecutaron ni repitieron.

**Estado: Pendiente de resultados verificables.** Para la actualización y eliminación, documentar el filtro usado, la cantidad de documentos afectados y las consultas antes/después. La eliminación solo se registra como completada si existe confirmación real; no volver a eliminar el documento para generar evidencia.

## Criterio 5 — Documento y evidencias visuales (20 puntos)

No se encontró un archivo Word individual (`.doc` o `.docx`) en el repositorio. Las carpetas `entregable_02/documentos/` y `entregable_02/scripts/` no contenían archivos. No se requiere duplicar capturas en `evidencias/`: pueden estar organizadas dentro del Word, pero ese documento debe estar disponible para su auditoría.

La revisión deberá comprobar capturas legibles de Mongo Express, la base y colecciones, documentos y tipos, filtros y resultados CRUD, además de fotografías reales del laboratorio y conclusiones técnicas conforme a la rúbrica.

**Estado: Pendiente de inspección del documento individual.**

## Resumen

| Criterio | Estado | Puntos acreditados en esta auditoría |
|---|---|---:|
| 1. Despliegue e interconexión | En progreso; Compose revisado, ejecución no confirmada | 0/20 |
| 2. Base y colecciones | Pendiente de resultados | 0/20 |
| 3. Documentos y tipos BSON/JSON | Pendiente de resultados | 0/20 |
| 4. Consultas y CRUD | Pendiente de resultados | 0/20 |
| 5. Documento y evidencias | Pendiente de inspección del Word | 0/20 |
| **Total acreditable con evidencia revisada aquí** | **Auditoría incompleta** | **0/100** |

El puntaje indica únicamente qué se pudo acreditar con los archivos revisados en esta auditoría; no niega que el estudiante pueda tener resultados reales organizados en el Word aún no incorporado al repositorio.

## Recomendación de cierre

Incorporar el Word individual al repositorio o facilitarlo para inspección. Confirmar con evidencia la disponibilidad de Mongo Express y la conexión; después registrar capturas y resultados de la base, colecciones, tipos BSON, filtros y operaciones `MOU-002`/`TEMP-999`. Actualizar la matriz únicamente con esos resultados. Mantener la Guía 03 sin iniciar hasta completar y auditar los cinco criterios de la Guía 02.
