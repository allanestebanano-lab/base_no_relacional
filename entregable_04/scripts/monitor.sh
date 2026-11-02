#!/usr/bin/env bash
source "$(dirname "${BASH_SOURCE[0]}")/common.sh"
printf 'MONITOR activo: observa comandos de prueba y finaliza con Ctrl+C.\n'
rcli MONITOR
