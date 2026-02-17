import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { encrypt, decrypt } from '../src/lib/encryption.js'
import { randomBytes } from 'node:crypto'

const TEST_KEY = randomBytes(32).toString('hex')

describe('encryption', () => {
  let originalKey

  beforeAll(() => {
    originalKey = process.env.ENCRYPTION_KEY
    process.env.ENCRYPTION_KEY = TEST_KEY
  })

  afterAll(() => {
    if (originalKey !== undefined) {
      process.env.ENCRYPTION_KEY = originalKey
    } else {
      delete process.env.ENCRYPTION_KEY
    }
  })

  it('encrypts and decrypts a string correctly', () => {
    const plaintext = 'ghp_abc123_my_secret_token'
    const encrypted = encrypt(plaintext)
    expect(encrypted).not.toBe(plaintext)
    expect(decrypt(encrypted)).toBe(plaintext)
  })

  it('produces different ciphertext each time (random IV)', () => {
    const plaintext = 'same-input'
    const a = encrypt(plaintext)
    const b = encrypt(plaintext)
    expect(a).not.toBe(b) // Different IVs → different output
    expect(decrypt(a)).toBe(plaintext)
    expect(decrypt(b)).toBe(plaintext)
  })

  it('throws on tampered ciphertext', () => {
    const encrypted = encrypt('secret')
    const tampered = encrypted.slice(0, -2) + 'XX'
    expect(() => decrypt(tampered)).toThrow()
  })

  it('throws when ENCRYPTION_KEY is missing', () => {
    const saved = process.env.ENCRYPTION_KEY
    delete process.env.ENCRYPTION_KEY
    try {
      expect(() => encrypt('test')).toThrow('ENCRYPTION_KEY')
    } finally {
      process.env.ENCRYPTION_KEY = saved
    }
  })
})
