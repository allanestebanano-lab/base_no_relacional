# Entregable 03 — Transacciones ACID con Node.js y MongoDB

## Estado

El estudiante confirmó la ejecución del Replica Set, la conexión Node.js, los escenarios de commit y rollback y las pruebas automatizadas. La revisión del código también confirma el uso de sesión compartida para las operaciones dependientes y el cierre de recursos. Los criterios técnicos 1 a 4 están verificados. El criterio documental 5 sigue en progreso porque no se encontró el Word dentro de `entregable_03/documentos/` para auditar sus capturas y conclusiones.

| Criterio | Estado |
|---|---|
| 1. MongoDB Replica Set `rs0` | Verificado técnicamente |
| 2. Node.js y conexión asíncrona | Verificado técnicamente |
| 3. Transacción multidocumento con commit | Verificado técnicamente |
| 4. Manejo de excepción y rollback | Verificado técnicamente |
| 5. Documento individual y evidencias | En progreso; Word pendiente de inspección |

## Arquitectura

- Compose independiente `nosql-entregable-03` con MongoDB `mongo:8.0.32-noble`.
- Replica Set de un miembro: `rs0`; el miembro `mongodb:27017` alcanzó `PRIMARY`.
- Puerto del host `127.0.0.1:27018` hacia el puerto 27017 del contenedor.
- Volúmenes propios para datos y keyfile; autenticación administrativa y autenticación interna mediante keyfile.
- Aplicación Node.js ejecutada desde Windows, con driver oficial `mongodb`, `dotenv` y conexión a la base `universidad_transacciones`.
- El URI contempla `replicaSet=rs0` y `directConnection=true`.

## Requisitos y ejecución reproducible

Se requiere Docker Desktop con motor Linux, Node.js compatible con el `package.json` y Git Bash. El archivo `.env` es local e ignorado por Git; no se debe imprimir, versionar ni capturar. El keyfile se mantiene en su volumen Docker, fuera del árbol del proyecto.

Desde Git Bash, en `entregable_03`:

```bash
docker compose config --quiet
docker compose up -d
docker compose ps
```

Espera a que MongoDB esté listo. La primera inicialización del Replica Set se realiza una sola vez, desde una shell autenticada; `mongosh` solicita la contraseña sin que se escriba en el comando:

```bash
docker compose exec mongodb mongosh --host localhost --port 27017 --username admin_universidad --authenticationDatabase admin --password
```

En `mongosh`:

```javascript
rs.initiate({ _id: "rs0", members: [{ _id: 0, host: "mongodb:27017" }] })
rs.status().members.map(({ name, stateStr }) => ({ name, stateStr }))
```

No vuelvas a ejecutar `rs.initiate()` si el set ya está inicializado. Espera el estado `PRIMARY`; un ping por sí solo no confirma la preparación.

Instala las dependencias bloqueadas y ejecuta la comprobación, la preparación de datos, la demostración y la suite:

```bash
npm ci
npm run check
npm run seed
npm run demo
npm test
```

Para ejecutar cada escenario por separado, después de preparar los fixtures:

```bash
npm run seed
npm run commit
npm run seed
npm run rollback
```

`npm run demo` prepara los registros y ejecuta ambos escenarios de forma secuencial. La preparación solo afecta los dos productos y las dos ventas identificados para `entregable-03`; no realiza limpieza general.

## Organización del código

- `compose.yaml`: MongoDB, Replica Set, autenticación, inicialización de keyfile y volúmenes aislados.
- `.env.example` y `.gitignore`: plantilla no secreta y exclusión de archivos privados.
- `src/config.js`, `src/connection.js`: validación de configuración y conexión asíncrona.
- `src/fixtures.js`: preparación delimitada a los registros de laboratorio.
- `src/transactions.js`: lógica de transacción, excepción controlada, abort y verificaciones.
- `src/check.js`, `src/seed.js`, `src/run-scenario.js`, `src/demo.js`: comandos npm.
- `tests/transactions.test.js`: pruebas de integración de las invariantes.
- `package.json` y `package-lock.json`: scripts y dependencias instaladas/bloqueadas.

## Resultados reales confirmados por el estudiante

- `rs.initiate()` respondió `{ ok: 1 }`; el miembro `mongodb:27017` llegó a `PRIMARY`.
- `npm install` terminó correctamente.
- `npm run check` devolvió `{"connection":"OK","setName":"rs0","member":"mongodb:27017","state":"PRIMARY"}`.
- `npm run seed` devolvió `SEED_OK`; ambos productos de laboratorio comenzaron con stock 10.
- Commit: stock 10→8, ventas esperadas 1, observadas 1, estado `committed`, invariante `PASS`.
- Rollback: el error controlado se capturó, se ejecutó `abortTransaction()`, stock final 10, ventas esperadas 0 y observadas 0, estado `aborted`, invariante `PASS`.
- `npm run demo`: `DEMO_OK`.
- `npm test`: 2 pruebas, 2 aprobadas, 0 fallidas.

Estos resultados corresponden a las ejecuciones confirmadas por el estudiante; no se volvieron a correr en esta revisión para evitar preparar fixtures o repetir operaciones.

## Lectura de las propiedades ACID

- **Atomicidad:** en commit se aplicaron juntas la reducción de stock y la venta. En rollback, ambas escrituras se descartaron juntas.
- **Consistencia:** el filtro de actualización exige inventario suficiente; las comprobaciones posteriores verificaron stock y cantidad de ventas.
- **Aislamiento:** las lecturas y escrituras dependientes dentro de cada transacción usan la misma sesión. El código no paraleliza operaciones dentro de una transacción.
- **Durabilidad:** después del commit, las consultas observaron stock 8 y una venta. Esta práctica confirma persistencia del commit en el entorno probado, sin representar una prueba de alta disponibilidad.

## Auditoría del flujo transaccional

`runScenario()` crea una sesión con `client.startSession()`. Lee el stock inicial con esa sesión y luego llama a `startTransaction()`. La actualización condicionada y la inserción de venta reciben ambas `{ session }`. En el caso commit se ejecuta `commitTransaction()`; en rollback, una excepción controlada cae en `catch`, que llama `abortTransaction()`. `finally` siempre llama `session.endSession()`. Las consultas posteriores de verificación se hacen una vez cerrada la transacción. Los comandos cierran `MongoClient` en su bloque `finally`.

## Incidencias, limitaciones y conclusiones

En la preparación anterior, el acceso al Docker Engine y al registro npm desde el entorno de asistencia no estaba disponible, así que dependencias, contenedores y pruebas quedaron inicialmente pendientes. El estudiante ejecutó después la instalación y la práctica en Git Bash, y confirmó los resultados detallados arriba; esta revisión los incorpora sin repetir operaciones.

El Replica Set de un solo miembro permite demostrar transacciones, pero no aporta redundancia ni failover. Si el único nodo cae, no hay otro miembro que asuma el rol PRIMARY. Los resultados no demuestran alta disponibilidad ni tolerancia a fallos de infraestructura.

La práctica demuestra que el descuento de inventario y el registro de la venta se confirman de forma conjunta o se revierten de forma conjunta. Las invariantes observadas y las pruebas automatizadas respaldan la implementación técnica de los criterios 1 a 4.

## Evidencias y estado académico

No se encontró un documento Word dentro de `entregable_03/documentos/`; por ello el criterio 5 permanece pendiente de inspección. Para cerrarlo, el Word debe contener capturas reales de Compose/puerto, `rs.status()` en `PRIMARY`, salida de `npm run check`, resultados completos de commit y rollback, `npm test`, fotografías reales del laboratorio y conclusiones del estudiante. No incluir `.env`, contraseñas ni keyfile. Las imágenes pueden permanecer dentro del Word, sin duplicarlas en Markdown.
