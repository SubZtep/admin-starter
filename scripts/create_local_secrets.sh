#!/usr/bin/env bash
set -euo pipefail

echo "BETTER_AUTH_SECRET=$(openssl rand -base64 32)" >> apps/api/.env
echo "JWT_SECRET=$(bun -e "console.log(Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('hex'))")" >> apps/api/.env
