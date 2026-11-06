# Network X Goat Music MD backend

Express + TypeScript REST backend for the Network X Goat Music MD WhatsApp bot. It stores server metadata and pairing request metadata in SQLite, exposes structured API routes, and keeps the WhatsApp integration behind a modular service adapter.

## Development

```bash
cp .env.example .env
pnpm install
pnpm dev
```

The API listens on `http://localhost:8787` by default. Set server-side `BACKEND_API_URL=http://localhost:8787/api` in the Next.js app to use it through the existing proxy routes. Keep provider credentials and session paths in `backend/.env`; never expose them with a `NEXT_PUBLIC_` variable.

## Production deployment

Build the image with `docker build -t network-x-goat-music-backend ./backend` and run it with a persistent volume: `docker run -d --name music-backend -p 8787:8787 -v music-data:/data --env-file backend/.env network-x-goat-music-backend`. The `/data` volume must survive restarts because it contains SQLite metadata and WhatsApp session state. Configure `NODE_ENV=production`, a random `API_KEY` of at least 16 characters, `CORS_ORIGIN`, and only credentials for an authorized WhatsApp or licensed music provider. The container health check calls `/api/health`; restart with `docker restart music-backend` and inspect logs with `docker logs music-backend`.

## WhatsApp Cloud API setup

This backend uses Meta's official WhatsApp Cloud API adapter. It does not implement QR/personal-account pairing because Cloud API does not support that flow. In Meta Business Manager, create/verify a WhatsApp Business phone number, create a System User access token with WhatsApp permissions, register the phone number with its six-digit PIN, subscribe the app to the WABA, and configure `https://<backend-host>/api/webhooks/whatsapp` for the `messages` webhook. Set `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_WEBHOOK_VERIFY_TOKEN`, and `WHATSAPP_APP_SECRET`. The adapter reports connected only after the Graph API confirms the phone-number resource. Pairing requests intentionally fail with a clear setup message until the business number is registered.

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
