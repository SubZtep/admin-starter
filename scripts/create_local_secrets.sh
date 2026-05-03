#!/usr/bin/env bash
set -euo pipefail

echo "BETTER_AUTH_SECRET=$(openssl rand -base64 32)" >> apps/api/.env
