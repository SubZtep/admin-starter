#!/usr/bin/env bash
set -euo pipefail

# # Start infrastructure
# docker-compose up -d db mail

# # Run the API
# bun run dev:api

# # Run a worker (in another terminal)
# cd apps/worker && bun run cli.ts

# Create jobs via API or SDK
curl -X POST http://localhost:3001/kaja/create-job \
  -H "Content-Type: application/json" \
  -d '{"type":"ollama.generate","payload":{"model":"gemma3:1b-it-qat","prompt":"Hello"}}'
