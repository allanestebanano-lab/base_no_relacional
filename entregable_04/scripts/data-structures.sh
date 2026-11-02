#!/usr/bin/env bash
source "$(dirname "${BASH_SOURCE[0]}")/common.sh"

printf '\n-- Strings --\n'
rcli SET e04:string:counter 0
printf 'GET: '; rcli GET e04:string:counter
printf 'INCR: '; rcli INCR e04:string:counter
printf 'INCRBY 4: '; rcli INCRBY e04:string:counter 4

printf '\n-- Hash --\n'
rcli HSET e04:hash:producto sku RED-001 nombre Redis precio 15.5 activo true
rcli HGETALL e04:hash:producto

printf '\n-- List (reinicia solo esta clave de practica) --\n'
rcli DEL e04:list:eventos
rcli LPUSH e04:list:eventos inicio consulta escritura
rcli LRANGE e04:list:eventos 0 -1

printf '\n-- Set --\n'
rcli SADD e04:set:modulos redis mongo node redis
rcli SMEMBERS e04:set:modulos

printf '\n-- Sorted Set --\n'
rcli ZADD e04:zset:ranking 98 Ana 87 Luis 92 Marta
rcli ZRANGE e04:zset:ranking 0 -1 WITHSCORES
