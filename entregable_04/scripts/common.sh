#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_DIR"

rcli() {
  docker compose exec -T redis sh -c \
    'REDISCLI_AUTH="$(cat /run/secrets/redis_password)" exec redis-cli --no-auth-warning --raw "$@"' \
    redis-cli "$@"
}

assert_eq() {
  local expected="$1" actual="$2" label="$3"
  if [[ "$expected" != "$actual" ]]; then
    printf 'FAIL %s: esperado [%s], recibido [%s]\n' "$label" "$expected" "$actual" >&2
    return 1
  fi
  printf 'PASS %s: %s\n' "$label" "$actual"
}

rcli_batch() {
  docker compose exec -T redis sh -c \
    'REDISCLI_AUTH="$(cat /run/secrets/redis_password)" exec redis-cli --no-auth-warning --raw'
}