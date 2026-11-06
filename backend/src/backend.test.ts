import assert from 'node:assert/strict'
import test from 'node:test'

process.env.NODE_ENV = 'test'
process.env.API_KEY = 'test-api-key-123456'

const { whatsappService } = await import('./services/whatsapp.js')
const { requireApiKey } = await import('./middleware/auth.js')
const { requestSchema } = await import('./routes/pairing.js')
const { createPairingRequest } = await import('./services/pairing.js')

test('WhatsApp webhook receipt does not mark the provider connected', async () => {
  await whatsappService.initialize()
  const before = whatsappService.getStatus().status
  await whatsappService.handleWebhook({ object: 'whatsapp_business_account' })
  assert.equal(whatsappService.getStatus().status, before)
  assert.ok(whatsappService.getStatus().lastWebhookAt)
})

test('Meta Cloud API pairing rejects personal QR/phone pairing', async () => {
  await whatsappService.initialize()
  await assert.rejects(() => whatsappService.requestPairing('919876543210'), /does not support QR|Register and verify/)
})

test('pairing rejects invalid phone numbers', () => {
  assert.throws(() => requestSchema.parse({ phoneNumber: '12345', serverId: 'server-1' }), /international phone number/)
})

test('pairing failure is persisted when WhatsApp is unconfigured', async () => {
  const pairing = await createPairingRequest('919876543210', 'server-1')
  assert.equal(pairing.status, 'failed')
  assert.match(pairing.message, /Configure|Register/)
})

test('API authentication rejects missing credentials', () => {
  let status = 0
  let body: unknown
  requireApiKey({ header: () => undefined } as never, { status: (value: number) => { status = value; return { json: (value: unknown) => { body = value } } } } as never, (() => undefined) as never)
  assert.equal(status, 401)
  assert.deepEqual(body, { error: 'Unauthorized', code: 'UNAUTHORIZED' })
})
