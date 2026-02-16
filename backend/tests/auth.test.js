import { describe, it, expect } from 'vitest'

describe('Auth Middleware', () => {
  it('should export authenticate function', async () => {
    const auth = await import('../src/middleware/auth.js')
    expect(typeof auth.authenticate).toBe('function')
  })

  it('should export optionalAuth function', async () => {
    const auth = await import('../src/middleware/auth.js')
    expect(typeof auth.optionalAuth).toBe('function')
  })

  it('should export requireRole function', async () => {
    const auth = await import('../src/middleware/auth.js')
    expect(typeof auth.requireRole).toBe('function')
  })

  it('should export generateToken function', async () => {
    const auth = await import('../src/middleware/auth.js')
    expect(typeof auth.generateToken).toBe('function')
  })

  it('generateToken should return a JWT string', async () => {
    const auth = await import('../src/middleware/auth.js')
    const token = auth.generateToken('test-user-id')
    expect(typeof token).toBe('string')
    expect(token.split('.')).toHaveLength(3) // JWT has 3 parts
  })
})
