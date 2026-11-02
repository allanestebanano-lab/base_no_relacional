#!/bin/sh
set -eu

secret_file=/run/secrets/redis_password
password=$(cat "$secret_file")
case "$password" in
  ''|*[!a-fA-F0-9_-]*)
    echo 'El secreto debe ser hexadecimal (openssl rand -hex 32) o usar solo A-F, a-f, 0-9, guion y guion bajo.' >&2
    exit 1
    ;;
esac
if [ "${#password}" -lt 32 ]; then
  echo 'El secreto debe tener al menos 32 caracteres.' >&2
  exit 1
fi

runtime_config=/tmp/redis-runtime.conf
cp /usr/local/etc/redis/redis.conf "$runtime_config"
printf '\nrequirepass %s\n' "$password" >> "$runtime_config"
chmod 600 "$runtime_config"
unset password
exec redis-server "$runtime_config"
