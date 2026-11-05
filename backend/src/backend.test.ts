import assert from 'node:assert/strict'
import test from 'node:test'

process.env.NODE_ENV = 'test'
process.env.API_KEY = 'test-api-key-123456'

const { whatsappService } = await import('./services/whatsapp.js')
const { searchMusic } = await import('./services/music.js')
const { requireApiKey } = await import('./middleware/auth.js')
const { requestSchema } = await import('./routes/pairing.js')
const { createPairingRequest } = await import('./services/pairing.js')

test('backend health dependencies report safe unconfigured state', async () => {
  await whatsappService.initialize()
  assert.equal(whatsappService.getStatus().service, 'whatsapp')
  assert.equal(whatsappService.getStatus().status, 'unconfigured')
  await assert.rejects(() => whatsappService.requestPairing('919876543210'), /authorized provider adapter/)
})

test('music search fails closed when provider is unavailable', async () => {
  await assert.rejects(() => searchMusic('Numb'), /licensed provider/)
})

test('pairing rejects invalid phone numbers', () => {
  assert.throws(() => requestSchema.parse({ phoneNumber: '12345', serverId: 'server-1' }), /international phone number/)
})

test('pairing failure is persisted when WhatsApp is unconfigured', async () => {
  const pairing = await createPairingRequest('+919876543210', 'server-1')
  assert.equal(pairing.status, 'failed')
  assert.match(pairing.message, /authorized provider adapter/)
})

test('API authentication rejects missing credentials', () => {
  let status = 0
  let body: unknown
  requireApiKey({ header: () => undefined } as never, { status: (value: number) => { status = value; return { json: (value: unknown) => { body = value } } } } as never, (() => undefined) as never)
  assert.equal(status, 401)
  assert.deepEqual(body, { error: 'Unauthorized', code: 'UNAUTHORIZED' })
})
