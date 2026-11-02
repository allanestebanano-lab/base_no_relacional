# Documento de soporte — Guía 04: Redis y bases de datos en memoria

## Objetivo y estado

Preparar el despliegue autenticado de Redis y las pruebas de estructuras, TTL, diagnóstico, persistencia y caché. Esta intervención creó configuración y scripts, pero no arrancó el contenedor ni ejecutó operaciones Redis. Por tanto, los cinco criterios continúan pendientes de pruebas reales.

| Criterio | Valor | Estado actual |
|---|---:|---|
| 1. Despliegue Docker y autenticación | 15 | Preparado; falta iniciar y verificar |
| 2. Strings, Hashes, Lists, Sets y Sorted Sets | 30 | Scripts preparados; falta ejecutar |
| 3. EXPIRE, TTL y PERSIST | 20 | Script preparado; falta observar expiración y resultados |
| 4. Diagnóstico, RDB/AOF y caché | 15 | Configuración y scripts preparados; falta ejecución y medir |
| 5. Documento, capturas y fotografía | 20 | Documento técnico preparado; Word y evidencias pendientes |

## Arquitectura y seguridad

El servicio Compose independiente usa la imagen oficial `redis:8.4.8-alpine3.22`, con publicación en loopback `127.0.0.1:6379`, red bridge `nosql-entregable-04_red` y volumen `nosql-entregable-04_redis_data` montado en `/data`.

La política RDB está declarada en `redis.conf`; AOF está habilitado con fsync cada segundo. La contraseña vive en `secrets/redis_password.txt`, fuera de Git, y Compose la monta como secreto. El script de inicio la añade a una configuración efímera de `/tmp` dentro del contenedor, sin escribirla en el Compose ni en los argumentos de proceso. Los clientes leen el secreto dentro del contenedor y usan `REDISCLI_AUTH`; `redis-cli` envía AUTH automáticamente, evitando poner la clave en el historial o argumentos visibles ([documentación oficial](https://redis.io/docs/latest/develop/tools/cli/)).

La imagen y etiqueta exacta se verificaron en el registro oficial de Docker: https://hub.docker.com/_/redis/tags?name=alpi&page=1. La explicación de RDB/AOF sigue la documentación oficial de Redis: https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/.

## Procedimiento

Desde Git Bash: copiar `.env.example` a `.env` solo si no existe, ejecutar `bash scripts/create-secret.sh`, validar con `docker compose config --quiet` y arrancar con `docker compose up -d`. Después comprobar `docker compose ps` y ejecutar `bash scripts/auth-check.sh`.

El secreto se genera en un archivo local ignorado por Git y el script no lo muestra. El ejemplo `.env` configura solo el puerto; no guarda contraseñas. No introducir el valor en una orden `AUTH` escrita a mano.

Las pruebas se ejecutan en este orden: autenticación, estructuras de datos, TTL, comandos administrativos, MONITOR con otra terminal, benchmark de caché, guardado RDB/AOF, reinicio del servicio y verificación de persistencia. Los comandos completos, resultados esperados y límites están en `README.md`.

## Resultados esperados — aún no observados

- Autenticación: `PING` devuelve `PONG`; `ACL WHOAMI` devuelve `default`.
- Estructuras: comandos y consultas muestran valores para Strings, Hashes, Lists, Sets y Sorted Sets.
- TTL: `EXPIRE` asigna vencimiento; la expiración real hace desaparecer la clave y `TTL` devuelve `-2`; una clave persistente da `-1`; `PERSIST` elimina el TTL.
- Administración: `INFO`, `MONITOR`, `DBSIZE` y `SCAN` presentan datos de esta práctica.
- Persistencia: AOF habilitado, BGSAVE confirmado, y `e04:persistencia:reinicio` mantiene su contenido tras reiniciar el contenedor conservando el volumen.
- Caché: el script informa tiempos medidos para acceso de origen simulado, cache miss y cache hits. No se afirma una mejora por adelantado.

No se observaron estos resultados en esta intervención y no deben presentarse como aprobados hasta ejecutar los scripts.

## Interpretación de RDB, AOF y caché

RDB produce snapshots puntuales según los umbrales configurados o bajo petición con `BGSAVE`. AOF registra escrituras y reconstruye el estado al iniciar; `appendfsync everysec` puede perder aproximadamente el último segundo de escrituras ante ciertos fallos, según el sistema. Redis puede usar ambos; cuando ambos están activos, AOF suele ser la fuente más completa al recuperar. El volumen conserva los archivos de persistencia entre reinicios del contenedor.

El benchmark simula un almacén de origen mediante una clave Redis y una espera fija de 40 ms; mide el tiempo con el reloj monotónico de Node.js. El resultado ilustra el patrón cache-aside, pero no compara Redis con una base de datos externa y no permite afirmar una mejora universal.

## Riesgos y limitaciones

Redis 6379 se publica solo en loopback. No compartir secretos ni usar `MONITOR` fuera de la práctica: expone comandos y valores. El volumen es persistente; no se elimina ni se ejecuta `FLUSHALL`/`FLUSHDB`. El test de persistencia reinicia únicamente el servicio conservando ese volumen. El ejemplo usa una contraseña para el usuario `default`, adecuado para el laboratorio local; un entorno multiusuario real debería usar ACL por usuario y controles adicionales.

## Documento académico y evidencias

El Word individual será preparado por el estudiante. Debe incluir capturas reales de cada criterio y una fotografía real del laboratorio, además de conclusiones. No se encontraron ni generaron capturas/fotografías en esta intervención; no se duplica evidencia en Markdown.

## Conclusión provisional

La estructura para practicar Redis está preparada, con una separación clara entre secreto, configuración, datos persistentes y pruebas. La evaluación técnica sigue pendiente hasta que el estudiante ejecute los procedimientos, registre los resultados reales y prepare el documento Word. No se declara completo ningún criterio.
