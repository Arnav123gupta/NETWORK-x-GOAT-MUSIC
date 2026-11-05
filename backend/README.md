# Network X Goat Music MD backend

Express + TypeScript REST backend for the Network X Goat Music MD WhatsApp bot. It stores server metadata and pairing request metadata in SQLite, exposes structured API routes, and keeps the WhatsApp integration behind a modular service adapter.

## Development

```bash
cp .env.example .env
pnpm install
pnpm dev
```

The API listens on `http://localhost:8787` by default. Set `MUSIC_BACKEND_API_URL=http://localhost:8787` in the Next.js app to use it through the existing server-only proxy routes.

## Production integration

`WhatsAppService` intentionally reports `unconfigured` until an authorized WhatsApp adapter is installed and configured. It never returns credentials or invents pairing codes. Implement the provider-specific connection manager behind the `WhatsAppService` interface, preserving filesystem session persistence, reconnection, graceful shutdown, and safe error handling.

Available routes:

- `GET /api/health`
- `GET /api/servers`
- `GET /api/commands`
- `GET /api/dashboard/stats`
- `POST /api/pairing/request`
- `GET /api/pairing/status/:requestId`
- `POST /api/music/search`
- `GET /api/bot/status`
