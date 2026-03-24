#!/usr/bin/env bash
set -euo pipefail

mkdir -p /home/agent/work
cd /home/agent/work

printf 'AI Agent Sandbox example container is ready.\n'
printf 'Workspace: %s\n' "$(pwd)"

exec bash
