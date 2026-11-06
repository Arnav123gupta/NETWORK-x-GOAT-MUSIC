# Backend deployment (preview only)

This repository includes a Render Blueprint for a zero-cost preview deployment.

## Important free-tier limitations

The Render Free web service is for testing, not reliable WhatsApp production use:
- It spins down after 15 minutes without inbound traffic and can take about a minute to wake.
- Its filesystem is ephemeral. The configured SQLite database is lost on restarts, spin-downs, and redeploys.
- A sleeping service may not acknowledge Meta webhook deliveries quickly enough for dependable event handling.
- Free instances may be restarted and do not provide an always-on uptime guarantee.

Do not advertise this free deployment as 24/7 or production-ready. Use it to verify container startup, HTTPS health checks, and initial API connectivity only. Move to an always-on service with persistent storage (or a properly configured external database) before relying on WhatsApp webhooks.

## Deploy the preview

1. Import this GitHub repository into Render and choose the Blueprint file `render.yaml`.
2. Render will ask for the secret values marked `sync: false`. Set a unique random `API_KEY` (at least 16 characters). Keep it private.
3. For initial backend-only smoke testing, WhatsApp credentials can remain unset; WhatsApp will correctly report `unconfigured`.
4. Deploy and wait for the service to become healthy.
5. Copy the HTTPS service URL into the Vercel project's server-side `BACKEND_API_URL` environment variable. Set Vercel's server-side `BACKEND_API_KEY` to the exact same value as backend `API_KEY`. Never use a `NEXT_PUBLIC_` variable for either secret.
6. Redeploy the Vercel frontend after changing its environment variables.

## WhatsApp Cloud API configuration

After the backend is reachable, configure these backend secrets in the hosting dashboard:
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_PHONE_NUMBER_ID`
- `WHATSAPP_WEBHOOK_VERIFY_TOKEN` (at least 16 characters)
- `WHATSAPP_APP_SECRET`

Set the Meta webhook callback URL to:

`https://YOUR-BACKEND-HOST/api/webhooks/whatsapp`

Use the same verify token in Meta and the backend. Subscribe the WhatsApp Business Account to the required webhook fields in Meta's app configuration. The current app has webhook signature verification and Cloud API account health checks, but inbound command dispatch is not implemented yet; do not expect .menu/.play or other WhatsApp commands to execute.

## Production readiness gate

Before production use, migrate SQLite to durable storage, add webhook event processing and idempotency, implement and test inbound command handlers, and deploy to an always-on service. Verify the live Meta account and music provider separately. Never put secrets in Git, browser code, chat messages, or screenshots.
