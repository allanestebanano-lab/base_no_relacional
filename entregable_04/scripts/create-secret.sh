#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
secret_file="$PROJECT_DIR/secrets/redis_password.txt"
if [[ -e "$secret_file" ]]; then
  printf 'Ya existe %s; no se sobrescribió.\n' "$secret_file"
  exit 1
fi
if ! command -v openssl >/dev/null 2>&1; then
  printf 'Se requiere openssl para generar el secreto sin imprimirlo.\n' >&2
  exit 1
fi
mkdir -p "$(dirname "$secret_file")"
umask 077
openssl rand -hex 32 > "$secret_file"
chmod 600 "$secret_file"
printf 'Secreto local generado en secrets/redis_password.txt; su contenido no se mostró.\n'
