# Matriz de criterios de evaluaciÃ³n

**Proyecto:** Bases de Datos No Relacionales  
**Entregables:** 4  
**Puntaje mÃ¡ximo:** 100 puntos por entregable  
**PonderaciÃ³n:** 5.00 puntos por entregable

## Objetivo

Registrar los criterios de evaluaciÃ³n de las cuatro guÃ­as prÃ¡cticas, sus condiciones de aceptaciÃ³n, las evidencias requeridas y su estado de cumplimiento.

**Estados permitidos:**

- Pendiente: todavÃ­a no se ha implementado.
- En progreso: implementaciÃ³n o pruebas en curso.
- Verificado: funcionamiento comprobado con resultados reales.
- Documentado: verificado y respaldado con evidencias y explicaciÃ³n tÃ©cnica.

---

## Entregable 01 â€” MongoDB y Docker

**Total: 100 puntos**

### Criterio 1. ConfiguraciÃ³n de contenedor y Docker Compose â€” 20 puntos

**AceptaciÃ³n:** MongoDB ejecutÃ¡ndose mediante Docker Compose, puerto `27017:27017`, autenticaciÃ³n administrativa y red Docker interna.

**Evidencias:** Archivo Compose, `docker compose ps`, `docker ps` y registros de inicio.

**Estado:** Verificado técnicamente.

### Criterio 2. Persistencia de datos y volÃºmenes â€” 20 puntos

**AceptaciÃ³n:** Volumen persistente montado en `/data/db`. Los documentos deben conservarse despuÃ©s de detener, iniciar y recrear el contenedor sin eliminar el volumen.

**Evidencias:** InserciÃ³n inicial, inspecciÃ³n del volumen y consulta de los mismos documentos despuÃ©s de recrear el contenedor.

**Estado:** Verificado técnicamente.

### Criterio 3. Comandos de administraciÃ³n en mongosh â€” 20 puntos

**AceptaciÃ³n:** Acceso autenticado a mongosh y ejecuciÃ³n de `db.version()`, `show dbs`, `db.stats()` y operaciones sobre una colecciÃ³n de prueba.

**Evidencias:** Capturas de la terminal y resultados de los comandos.

**Estado:** Verificado técnicamente.

### Criterio 4. Conectividad con cliente grÃ¡fico externo â€” 20 puntos

**AceptaciÃ³n:** ConexiÃ³n al MongoDB del contenedor desde Windows utilizando un cliente grÃ¡fico y una URI autenticada.

**Evidencias:** Capturas de conexiÃ³n y exploraciÃ³n de bases de datos.

**Estado:** Verificado técnicamente.

### Criterio 5. Documento de soporte tÃ©cnico y evidencias â€” 20 puntos

**AceptaciÃ³n:** Documento individual con explicaciÃ³n tÃ©cnica, capturas nÃ­tidas de Docker, logs, mongosh, interfaz grÃ¡fica, fotografÃ­as reales de laboratorio y conclusiones.

**Evidencias:** `DOCUMENTO_SOPORTE_GUIA_01.md`, carpeta `evidencias/` y documento final de entrega.

**Estado:** En progreso — falta auditar el documento Word, capturas y fotografías.

---

## Entregable 02 â€” Mongo Express y operaciones CRUD

**Total: 100 puntos**

### Criterio 1. Despliegue e interconexiÃ³n de Mongo Express â€” 20 puntos

**AceptaciÃ³n:** Mongo Express conectado a MongoDB mediante una red Docker, con credenciales y variables de entorno correctas. Interfaz accesible por el puerto `8081`.

**Evidencias:** ConfiguraciÃ³n Compose y captura de la interfaz web.

**Estado:** En progreso — Compose revisado; ejecución e interfaz aún no confirmadas.

### Criterio 2. CreaciÃ³n de bases de datos y colecciones â€” 20 puntos

**AceptaciÃ³n:** CreaciÃ³n y organizaciÃ³n de bases de datos y colecciones con nombres coherentes y estructura documental NoSQL.

**Evidencias:** Capturas de bases de datos y colecciones creadas.

**Estado:** Pendiente.

### Criterio 3. InserciÃ³n y estructuraciÃ³n de documentos BSON/JSON â€” 20 puntos

**AceptaciÃ³n:** Documentos que utilicen ObjectId, fechas, cadenas, nÃºmeros, subdocumentos y arreglos anidados.

**Evidencias:** Capturas de documentos insertados y explicaciÃ³n de sus tipos de datos.

**Estado:** Pendiente.

### Criterio 4. Consultas avanzadas y actualizaciones CRUD â€” 20 puntos

**AceptaciÃ³n:** DemostraciÃ³n de filtros con `$gt`, `$in`, `$regex` y operadores lÃ³gicos. ActualizaciÃ³n selectiva y eliminaciÃ³n segura de documentos de prueba.

**Evidencias:** Consultas, resultados antes y despuÃ©s de modificar o eliminar documentos.

**Estado:** Pendiente.

### Criterio 5. Documento de soporte y evidencias visuales â€” 20 puntos

**AceptaciÃ³n:** Documento individual con capturas de Mongo Express, documentos creados, filtros utilizados, fotografÃ­as reales de la prÃ¡ctica y conclusiones.

**Estado:** Pendiente.

---

## Entregable 03 — Node.js y transacciones ACID

**Total: 100 puntos**

### Criterio 1. Configuracion de MongoDB con Replica Set — 20 puntos

**Aceptacion:** MongoDB configurado en modo Replica Set e inicializado con `rs.initiate()`. Debe permitir transacciones multidocumento.

**Evidencias:** Configuracion, estado del Replica Set y prueba de inicializacion.

**Estado:** Verificado tecnicamente — rs0 inicializado y miembro PRIMARY confirmado.

### Criterio 2. Estructura de Node.js y conexion asincrona — 15 puntos

**Aceptacion:** Proyecto Node.js con `package.json`, driver oficial de MongoDB, variables de entorno seguras y conexion asincrona.

**Evidencias:** Codigo fuente, dependencias instaladas y salida de `npm run check`.

**Estado:** Verificado tecnicamente — `npm install` y conexion Node.js confirmados.

### Criterio 3. Transacciones multidocumento con commit — 30 puntos

**Aceptacion:** Sesion, transaccion, operaciones dependientes en varias colecciones y `commitTransaction()`.

**Evidencias:** Codigo y resultados posteriores al commit.

**Estado:** Verificado tecnicamente — stock 10 a 8, una venta e invariante PASS.

### Criterio 4. Excepciones y abort/rollback — 20 puntos

**Aceptacion:** `try-catch-finally`, `abortTransaction()` ante el error controlado y `session.endSession()`.

**Evidencias:** Error capturado y consultas posteriores que demuestren rollback.

**Estado:** Verificado tecnicamente — stock 10, cero ventas e invariante PASS.

### Criterio 5. Documento y evidencias — 15 puntos

**Aceptacion:** Documento individual con resultados, capturas, fotografias reales del laboratorio y conclusiones tecnicas.

**Estado:** En progreso — falta inspeccionar el Word y sus evidencias; no se encontro en `entregable_03/documentos/`.

---
## Entregable 04 â€” Redis en Docker

**Total: 100 puntos**

### Criterio 1. Despliegue y configuraciÃ³n de Redis en Docker â€” 15 puntos

**AceptaciÃ³n:** Redis ejecutÃ¡ndose en Docker con puerto `6379:6379`, contraseÃ±a mediante `requirepass` y conexiÃ³n autenticada utilizando redis-cli.

**Evidencias:** ConfiguraciÃ³n Compose, estado del contenedor y acceso a redis-cli.

**Estado:** Pendiente.

### Criterio 2. ManipulaciÃ³n de estructuras de datos en memoria â€” 30 puntos

**AceptaciÃ³n:** EjecuciÃ³n de operaciones sobre:

- Strings: `SET`, `GET`, `INCR`.
- Hashes: `HSET`, `HGETALL`.
- Lists: `LPUSH`, `LRANGE`.
- Sets: `SADD`, `SMEMBERS`.
- Sorted Sets: `ZADD`, `ZRANGE`.

**Evidencias:** Capturas de comandos y resultados de cada tipo de estructura.

**Estado:** Pendiente.

### Criterio 3. GestiÃ³n de tiempos de vida y expiraciÃ³n â€” 20 puntos

**AceptaciÃ³n:** AplicaciÃ³n de `EXPIRE`, consulta con `TTL`, eliminaciÃ³n de expiraciÃ³n mediante `PERSIST` y demostraciÃ³n del comportamiento de claves volÃ¡tiles.

**Evidencias:** Capturas del tiempo de expiraciÃ³n y de la desapariciÃ³n o conservaciÃ³n de claves.

**Estado:** Pendiente.

### Criterio 4. DiagnÃ³stico, monitoreo y persistencia â€” 15 puntos

**AceptaciÃ³n:** EjecuciÃ³n y explicaciÃ³n de `INFO`, `MONITOR`, `DBSIZE` y `SCAN`; identificaciÃ³n de persistencia RDB/AOF y demostraciÃ³n de un caso prÃ¡ctico de aceleraciÃ³n mediante cachÃ©.

**Evidencias:** Capturas de resultados, configuraciÃ³n de persistencia y prueba del caso prÃ¡ctico.

**Estado:** Pendiente.

### Criterio 5. Documento de soporte y evidencias visuales â€” 20 puntos

**AceptaciÃ³n:** Documento individual con capturas de redis-cli, fotografÃ­as reales de laboratorio y conclusiones tÃ©cnicas.

**Estado:** Pendiente.

---

## Reglas generales de verificaciÃ³n

1. NingÃºn criterio puede marcarse como Verificado sin ejecutar pruebas reales.
2. Las evidencias deben proceder del entorno de trabajo del estudiante.
3. Las credenciales reales deben permanecer fuera de Git y de capturas pÃºblicas.
4. Cada entregable debe conservar su documentaciÃ³n independiente.
5. Los resultados inesperados deben registrarse y corregirse.
6. Antes de cerrar una guÃ­a, comprobar que sus cinco criterios estÃ¡n documentados.

## Estado general

| Entregable | Estado | Puntos verificados |
|---|---|---|
| 01 — MongoDB y Docker | En progreso documental | 80/100 técnicamente verificados |
| 02 — Mongo Express | En progreso | 0/100 acreditados en esta auditoría |
| 03 — Node.js y ACID | En progreso documental | 85/100 técnicamente verificados |
| 04 â€” Redis | Pendiente | 0/100 |

Los puntos verificados representan criterios tecnicos demostrados, no calificaciones oficiales. En el Entregable 03, los criterios 1 a 4 estan verificados tecnicamente; el criterio 5 sigue en progreso hasta auditar el Word y sus evidencias.




