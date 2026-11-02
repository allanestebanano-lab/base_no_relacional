#!/usr/bin/env bash
source "$(dirname "${BASH_SOURCE[0]}")/common.sh"
expected=redis-e04-persistencia-confirmar
actual=$(rcli GET e04:persistencia:reinicio)
assert_eq "$expected" "$actual" 'clave conservada tras reinicio del contenedor'
rcli INFO persistence | grep -E '^(aof_enabled|aof_last_write_status|rdb_last_bgsave_status):'
