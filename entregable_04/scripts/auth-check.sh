#!/usr/bin/env bash
source "$(dirname "${BASH_SOURCE[0]}")/common.sh"
ping=$(rcli PING)
assert_eq PONG "$ping" 'PING autenticado'
user=$(rcli ACL WHOAMI)
assert_eq default "$user" 'usuario autenticado'
