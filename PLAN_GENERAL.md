# Plan general de trabajo

## Fase 0 - Preparación
- [x] Instalar Docker Desktop.
- [x] Actualizar WSL.
- [x] Comprobar Docker Engine.
- [x] Ejecutar hello-world.
- [ ] Organizar el repositorio.
- [ ] Revisar la matriz de evaluación.

## Fase 1 - Entregable 01: MongoDB y Docker
- [x] Configuración de MongoDB y Docker Compose — verificada técnicamente.
- [x] Persistencia de datos — verificada técnicamente, documento conservado después de recrear el contenedor.
- [x] Administración con mongosh — verificada técnicamente.
- [x] Conexión gráfica externa con MongoDB Compass — verificada técnicamente.
- [ ] Documento individual y evidencias — pendiente de auditoría; no se encontró el Word.

**Estado:** Criterios técnicos 1 a 4 verificados (80/100); criterio 5 pendiente de auditoría documental.

## Fase 2 - Entregable 02: Mongo Express
- [x] Revisión estática de `compose.yaml` — imagen 1.0.2-20, puerto local 8081, autenticación web declarada y red externa compartida revisados.
- [ ] Confirmar despliegue, disponibilidad de la interfaz y conexión efectiva con MongoDB.
- [ ] Confirmar creación de `tienda_electronica_db` y colecciones `productos`, `clientes` y `pedidos`.
- [ ] Confirmar inserción de documentos con ObjectId, fechas, strings, números, booleanos, arreglos y subdocumentos.
- [ ] Confirmar consultas `$gt`, `$in`, `$regex`, `$and` y `$or` con sus resultados.
- [ ] Confirmar actualización de `MOU-002` y eliminación segura de `TEMP-999` mediante resultados reales.
- [ ] Inspeccionar el Word individual, capturas, fotografías de laboratorio y conclusiones.

**Estado:** En auditoría; Compose revisado, pero no se encontraron resultados de ejecución ni el Word en el repositorio. Criterio 1 en progreso y criterios 2 a 5 pendientes de evidencia verificable. La Guía 02 permanece en auditoría documental según sus evidencias disponibles.

## Fase 3 - Entregable 03: Node.js y transacciones ACID
- [x] Replica Set rs0 inicializado; miembro PRIMARY confirmado.
- [x] Conexion asincrona Node.js verificada con `npm run check`.
- [x] Transaccion multidocumento con commit: stock 10 a 8 y una venta, PASS.
- [x] Excepcion controlada y abort/rollback: stock 10 y cero ventas, PASS.
- [x] Pruebas automatizadas reportadas: 2 aprobadas, 0 fallidas.
- [ ] Auditar documento Word, capturas, fotografias reales y conclusiones.

**Estado:** Criterios tecnicos 1 a 4 verificados (85/100 puntos); criterio 5 pendiente de auditar el Word, que no esta en `entregable_03/documentos/`. No iniciar la Guía 04 hasta completar esta auditoría.
## Fase 4 - Entregable 04
- [ ] Despliegue de Redis.
- [ ] Estructuras de datos.
- [ ] TTL y expiración.
- [ ] Diagnóstico y persistencia.
- [ ] Documentación y evidencias.

## Regla de avance

Cerrar y auditar los cinco criterios del entregable vigente antes de iniciar servicios del siguiente entregable. La Guía 03 espera la auditoría del documento académico; Redis (Guía 04) aún no se inicia.
