#!/usr/bin/env bash
source "$(dirname "${BASH_SOURCE[0]}")/common.sh"

key=e04:persistencia:reinicio
value=redis-e04-persistencia-confirmar
printf 'Escribiendo clave identificada: %s\n' "$key"
printf 'Espera fsync AOF en la misma conexion Redis que hizo SET (WAITAOF):\n'
batch_output=$(printf 'SET %s %s\nWAITAOF 1 0 5000\n' "$key" "$value" | rcli_batch)
printf '%s\n' "$batch_output"
local_fsynced=$(printf '%s\n' "$batch_output" | sed -n '2p')
assert_eq 1 "$local_fsynced" 'fsync AOF local'

printf '\nSolicitando snapshot RDB (BGSAVE):\n'
rcli BGSAVE

deadline=$((SECONDS + 30))
while (( SECONDS < deadline )); do
  info=$(rcli INFO persistence)
  if grep -q '^rdb_last_bgsave_status:ok' <<<"$info" && ! grep -q '^rdb_bgsave_in_progress:1' <<<"$info"; then
    printf '%s\n' 'RDB snapshot confirmado.'
    break
  fi
  sleep 1
done
if (( SECONDS >= deadline )); then
  printf '%s\n' 'No se confirmó el snapshot RDB dentro del tiempo esperado.' >&2
  exit 1
fi
printf '\nEstado de persistencia:\n'
rcli INFO persistence | grep -E '^(aof_enabled|aof_last_write_status|rdb_last_bgsave_status|rdb_bgsave_in_progress):'
