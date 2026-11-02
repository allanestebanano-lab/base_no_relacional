#!/usr/bin/env bash
source "$(dirname "${BASH_SOURCE[0]}")/common.sh"

printf '%s\n' '-- INFO server --'
rcli INFO server | grep -E '^(redis_version|uptime_in_seconds|process_id):'
printf '\n%s\n' '-- INFO persistence --'
rcli INFO persistence | grep -E '^(aof_enabled|aof_last_write_status|rdb_last_bgsave_status|rdb_bgsave_in_progress):' || true
printf '\nDBSIZE: '; rcli DBSIZE
printf '\nSCAN MATCH e04:* COUNT 100:\n'
rcli SCAN 0 MATCH 'e04:*' COUNT 100
