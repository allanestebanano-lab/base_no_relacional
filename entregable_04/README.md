# Entregable 04 — Redis y bases de datos en memoria

## Objetivo y estado

Preparar una práctica reproducible para Redis con autenticación, estructuras de datos, TTL, administración, persistencia y una comparación didáctica de caché. Los scripts y procedimientos están preparados, pero no se han ejecutado en esta intervención. No se declara aprobado ningún criterio hasta que el estudiante ejecute las prácticas y reúna las evidencias.

## Arquitectura

- Imagen oficial fijada a `redis:8.4.8-alpine3.22`, etiqueta disponible en Docker Hub.
- Compose independiente `nosql-entregable-04`.
- Puerto solo local: `127.0.0.1:6379` hacia `6379` del contenedor.
- Red bridge independiente `nosql-entregable-04_red`.
- Volumen nombrado `nosql-entregable-04_redis_data` montado en `/data`.
- RDB habilitado con una política de snapshots y AOF habilitado con `appendfsync everysec`.
- La contraseña se genera en `secrets/redis_password.txt`, excluido por `.gitignore`; Compose la monta como secreto. El script de inicio compone una configuración efímera en `/tmp` dentro del contenedor, por lo que la contraseña no aparece en los argumentos del contenedor ni se versiona.

La etiqueta exacta `8.4.8-alpine3.22` se encuentra publicada en la página oficial de tags de Redis en Docker Hub: [imagen y tags oficiales](https://hub.docker.com/_/redis/tags?name=alpi&page=1).

## Preparación local del archivo `.env` y contraseña

Desde Git Bash, en la raíz del repositorio:

```bash
cd entregable_04
if [ ! -f .env ]; then cp .env.example .env; fi
```

`.env.example` solo contiene `REDIS_PORT=6379`. El Compose usa la ruta local predeterminada `./secrets/redis_password.txt`; no guardes la contraseña en `.env`.

Genera el secreto local sin mostrarlo:

```bash
bash scripts/create-secret.sh
```

El script crea un valor aleatorio hexadecimal de 64 caracteres, aplica permisos locales restrictivos cuando el sistema los admite y no sobrescribe un secreto preexistente. La carpeta `secrets/` está ignorada por Git. Si el secreto ya existe, se conserva.

## Inicio y autenticación

```bash
docker compose config --quiet
docker compose up -d
docker compose ps
```

Espera a que el servicio aparezca activo. Prueba la autenticación y el ping:

```bash
bash scripts/auth-check.sh
```

El script usa `REDISCLI_AUTH` dentro del contenedor; `redis-cli` envía la autenticación AUTH automáticamente, sin incluir la contraseña en argumentos ni mostrarla ([documentación oficial de redis-cli](https://redis.io/docs/latest/develop/tools/cli/)). Verifica `PING` → `PONG` y `ACL WHOAMI` → `default`. No escribas `AUTH <contraseña>` en la terminal: eso puede quedar en el historial.

La conexión manual segura equivalente, desde Git Bash, es:

```bash
docker compose exec -T redis sh -c 'REDISCLI_AUTH="$(cat /run/secrets/redis_password)" exec redis-cli --no-auth-warning --raw PING'
```

El secreto solo se lee dentro del contenedor y no forma parte del comando escrito.

## Orden de ejecución de la práctica

Ejecuta después de iniciar Redis y confirmar autenticación:

```bash
bash scripts/auth-check.sh
bash scripts/data-structures.sh
bash scripts/ttl.sh
bash scripts/admin.sh
node scripts/cache-benchmark.js
bash scripts/persistence-save.sh
docker compose restart redis
bash scripts/persistence-check.sh
```

Para observar `MONITOR`, abre una segunda terminal Git Bash en `entregable_04` y ejecuta `bash scripts/monitor.sh`; en la primera corre `bash scripts/data-structures.sh`. Detén MONITOR con Ctrl+C. Úsalo solo durante la práctica: muestra comandos y valores de Redis. No se vacía la base ni se borran volúmenes. El único `DEL` de los scripts apunta a la clave temporal exacta `e04:list:eventos` o `e04:cache:resultado`.

## Pruebas por criterio

### 1. Despliegue y autenticación

`docker compose ps` debe mostrar Redis activo y el puerto ligado a loopback. `bash scripts/auth-check.sh` valida autenticación y `PING/PONG`; `ACL WHOAMI` indica el usuario activo.

### 2. Estructuras de datos

`bash scripts/data-structures.sh` ejecuta y muestra:

- Strings: `SET`, `GET`, `INCR`, `INCRBY`.
- Hash: `HSET`, `HGETALL`.
- List: `LPUSH`, `LRANGE`.
- Set: `SADD`, `SMEMBERS`.
- Sorted Set: `ZADD`, `ZRANGE ... WITHSCORES`.

Todas las claves llevan el prefijo `e04:`. La lista de ejemplo se reinicia eliminando únicamente su propia clave para conservar una salida repetible.

### 3. TTL, EXPIRE y PERSIST

`bash scripts/ttl.sh` fija una clave con `EXPIRE`, comprueba el TTL, espera su expiración y verifica `EXISTS=0` y `TTL=-2`. Luego demuestra `TTL=-1` para una clave sin vencimiento, le aplica `EXPIRE`, ejecuta `PERSIST` y confirma que regresa a `TTL=-1`.

### 4. Diagnóstico, persistencia y caché

- `bash scripts/admin.sh`: `INFO server`, `INFO persistence`, `DBSIZE` y `SCAN 0 MATCH e04:* COUNT 100`.
- `bash scripts/monitor.sh`: `MONITOR` en vivo; comparar desde otra terminal.
- `redis.conf`: snapshots RDB con umbrales configurados y AOF habilitado (`appendonly yes`, `appendfsync everysec`). RDB guarda instantáneas según la política o por `BGSAVE`; AOF registra escrituras y Redis lo usa al reiniciar cuando está habilitado. RDB/AOF no sustituyen copias externas de seguridad. La [documentación oficial de persistencia](https://redis.io/docs/latest/operate/oss_and_stack/management/persistence/) describe ambos mecanismos y su interacción.
- `bash scripts/persistence-save.sh`: fija `e04:persistencia:reinicio`, espera la confirmación de fsync local mediante `WAITAOF`, solicita `BGSAVE` y muestra configuración/estado.
- `docker compose restart redis`: reinicia solo el servicio; mantiene el volumen.
- `bash scripts/persistence-check.sh`: verifica el mismo valor después del reinicio y muestra estado AOF/RDB. No uses `down -v` ni elimines el volumen.
- `node scripts/cache-benchmark.js`: mide cinco lecturas simuladas sin caché (lectura de origen Redis con espera fija de 40 ms) frente a cinco lecturas de la clave cacheada. Mide el miss y el promedio de hits con `performance.now()`, imprime los tiempos reales de esa ejecución y no presupone que haya mejora. Es una demostración controlada, no un benchmark de base de datos externa.

## Scripts

- `scripts/create-secret.sh`: genera el secreto local sin imprimirlo ni reemplazar uno existente.
- `scripts/start-redis.sh`: carga el secreto montado y crea la configuración de ejecución protegida dentro del contenedor.
- `scripts/common.sh`: helper de comandos autenticados y aserciones.
- `scripts/auth-check.sh`, `data-structures.sh`, `ttl.sh`, `admin.sh`, `monitor.sh`: pruebas de autenticación, estructuras, expiración y administración.
- `scripts/persistence-save.sh`, `persistence-check.sh`: guardado y comprobación tras reinicio.
- `scripts/cache-benchmark.js`: medición controlada de cache miss/hit.

## Resultados esperados y criterios de aceptación

Los resultados esperados son PONG; valores presentes para estructuras; TTL con resultados positivos antes de expirar, `-2` al expirar y `-1` sin expiración; configuración AOF habilitada y RDB operativo; la clave de persistencia conservada tras reiniciar; y tiempos de caché medidos en ejecución. Estos son criterios, no resultados observados.

El estudiante debe registrar resultados reales y capturas. Ningún criterio se considera aprobado por tener los scripts preparados.

## Capturas para el documento Word

1. Compose activo, puerto `127.0.0.1:6379` e imagen fija; no mostrar el secreto.
2. Autenticación satisfactoria con `PING/PONG` y `ACL WHOAMI`.
3. Comandos y resultados de los cinco tipos de datos.
4. TTL antes y después, expiración real, `-1`, `-2` y `PERSIST`.
5. `INFO`, `MONITOR` (sin credenciales), `DBSIZE` y `SCAN`.
6. Configuración/estado RDB y AOF, valor antes y después de `docker compose restart redis`.
7. Salida real del comparador de caché con las mediciones que produjo.
8. Fotografía real del laboratorio y conclusiones propias.

No capturar `.env`, `secrets/redis_password.txt`, salida sensible ni valores de autenticación. Las capturas se incorporan al Word individual y no hace falta duplicarlas en Markdown.
