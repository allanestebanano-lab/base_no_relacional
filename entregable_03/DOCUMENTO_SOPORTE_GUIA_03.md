# Documento de soporte — Guía 03: Transacciones ACID con Node.js y MongoDB

## Objetivo

Demostrar transacciones multidocumento con commit y abort/rollback en MongoDB mediante Node.js y el driver oficial. La práctica utiliza un Replica Set local de un nodo, datos aislados en `universidad_transacciones` y productos/ventas identificados exclusivamente para este entregable.

## Arquitectura

MongoDB 8.0.32 se ejecuta en el proyecto Docker Compose `nosql-entregable-03`, con Replica Set `rs0`, autenticación administrativa e interna mediante keyfile. El puerto anfitrión es `127.0.0.1:27018`; los volúmenes de datos y keyfile son propios de esta práctica. El miembro configurado como `mongodb:27017` alcanzó `PRIMARY`.

La aplicación Node.js corre desde Windows y usa `mongodb`, `dotenv`, `MONGODB_URI` con `replicaSet=rs0&directConnection=true` y la base `universidad_transacciones`. Credenciales y keyfile permanecen fuera del código y del documento.

## Metodología

El estudiante instaló dependencias, inicializó `rs0`, preparó los fixtures y ejecutó la comprobación, demostración y suite de integración. Los comandos reproducibles son `npm ci`, `npm run check`, `npm run seed`, `npm run demo` y `npm test`. Para aislar cada escenario se puede ejecutar `npm run seed` antes de `npm run commit` o `npm run rollback`.

La preparación de datos modifica únicamente los registros reservados para `entregable-03`. No borra colecciones ni documentos ajenos a la práctica. Durante esta auditoría no se volvió a ejecutar seed, demo ni pruebas.

## Revisión técnica del código

El flujo crea una sesión mediante `client.startSession()`, usa `startTransaction()`, comprueba que el stock inicial sea 10 y actualiza el producto solo si hay al menos dos unidades. La inserción de la venta y la actualización del inventario reciben la misma sesión. El commit se confirma con `commitTransaction()`.

En el escenario de rollback se produce una excepción controlada después de ambas escrituras. El bloque `catch` ejecuta `abortTransaction()` y diferencia esa excepción prevista de los errores inesperados. El bloque `finally` ejecuta `session.endSession()`. Las consultas que verifican el estado final se realizan después de terminar la transacción. Los comandos cierran `MongoClient` también en `finally`. No hay operaciones paralelas dentro de la transacción.

## Resultados observados

Los resultados siguientes fueron confirmados por el estudiante tras ejecutar la práctica desde Git Bash:

### Replica Set y conexión

- Imagen MongoDB 8.0.32 y contenedor independiente.
- Publicación local `127.0.0.1:27018`.
- `rs.initiate()` devolvió `{ ok: 1 }`.
- Miembro `mongodb:27017` en estado `PRIMARY`.
- `npm run check` devolvió `{"connection":"OK","setName":"rs0","member":"mongodb:27017","state":"PRIMARY"}`.
- `npm install` completado y `npm run seed` devolvió `SEED_OK`.

### Escenario A — Commit

| Comprobación | Resultado |
|---|---:|
| Stock inicial | 10 |
| Stock final | 8 |
| Ventas esperadas | 1 |
| Ventas observadas | 1 |
| Transacción | `committed` |
| Invariante | `PASS` |

La reducción de dos unidades y la inserción de una venta quedaron confirmadas juntas.

### Escenario B — Abort/Rollback

| Comprobación | Resultado |
|---|---:|
| Stock inicial | 10 |
| Excepción controlada | Capturada |
| `abortTransaction()` | Ejecutado |
| Stock final | 10 |
| Ventas esperadas/observadas | 0 / 0 |
| Transacción | `aborted` |
| Invariante | `PASS` |

Las dos escrituras no quedaron visibles tras el aborto; inventario y ventas conservaron el estado inicial.

### Automatización

`npm run demo` terminó con `DEMO_OK`. `npm test` ejecutó 2 pruebas: 2 aprobadas y 0 fallidas. Estos son resultados comunicados por el estudiante; no se repitieron en esta auditoría para evitar mutar datos o reejecutar escenarios.

## Interpretación ACID

- **Atomicidad:** el stock y la venta forman una unidad; commit los confirma y abort los revierte.
- **Consistencia:** la actualización condicionada evita que el stock baje de cero y las aserciones comparan los valores finales esperados.
- **Aislamiento:** operaciones dependientes dentro de cada transacción comparten sesión; no se ejecutan concurrentemente mediante `Promise.all`.
- **Durabilidad:** las lecturas posteriores al commit observaron stock 8 y una venta. Es una confirmación en el entorno ejecutado, no una prueba de tolerancia a fallos del host.

## Incidencias y limitaciones

En una intervención previa, el Engine Docker estaba inaccesible y el registro npm no respondió desde el entorno de asistencia. Por eso la ejecución se dejó para Git Bash del estudiante; posteriormente el estudiante confirmó instalación, inicio y pruebas satisfactorias.

El Replica Set tiene un solo miembro: permite practicar transacciones, pero no ofrece redundancia ni failover. No demuestra alta disponibilidad. La instancia de laboratorio debe considerarse separada de servicios y datos de otros entregables.

## Conclusión técnica

La ejecución reportada y la inspección del código respaldan los cuatro criterios técnicos: Replica Set PRIMARY, conexión asíncrona, commit multidocumento y rollback ante excepción controlada. Las invariantes verificadas muestran stock 8/una venta después del commit y stock 10/cero ventas después del abort. La evidencia automatizada reportada fue de dos pruebas aprobadas.

## Criterio documental y evidencias

No se encontró un archivo Word en `entregable_03/documentos/`. El criterio 5 permanece pendiente de auditoría aunque este documento Markdown ya registre método y resultados. El cierre académico requiere inspeccionar el Word individual y comprobar capturas reales de Compose/puerto, PRIMARY, conexión Node, commit, rollback y `npm test`, más fotografías reales del laboratorio y conclusiones. No incluir `.env`, contraseñas ni keyfile; no se requiere duplicar las imágenes del Word en Markdown.
