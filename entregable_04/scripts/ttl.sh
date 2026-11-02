#!/usr/bin/env bash
source "$(dirname "${BASH_SOURCE[0]}")/common.sh"

printf '%s\n' '-- Expiracion real --'
rcli SET e04:ttl:expira en-5-segundos
rcli EXPIRE e04:ttl:expira 5
printf 'TTL inicial: '; rcli TTL e04:ttl:expira
sleep 6
printf 'EXISTS despues de esperar: '; exists=$(rcli EXISTS e04:ttl:expira); printf '%s\n' "$exists"
assert_eq 0 "$exists" 'la clave expiró'
printf 'TTL para clave inexistente (-2): '; ttl_missing=$(rcli TTL e04:ttl:expira); printf '%s\n' "$ttl_missing"
assert_eq -2 "$ttl_missing" 'TTL clave inexistente'

printf '\n%s\n' '-- Persistencia de expiracion --'
rcli SET e04:ttl:persistente conservar
printf 'TTL sin expiracion (-1): '; ttl_before=$(rcli TTL e04:ttl:persistente); printf '%s\n' "$ttl_before"
assert_eq -1 "$ttl_before" 'TTL sin expiracion'
rcli EXPIRE e04:ttl:persistente 60
printf 'PERSIST: '; rcli PERSIST e04:ttl:persistente
printf 'TTL despues de PERSIST (-1): '; ttl_after=$(rcli TTL e04:ttl:persistente); printf '%s\n' "$ttl_after"
assert_eq -1 "$ttl_after" 'PERSIST elimina la expiracion'
