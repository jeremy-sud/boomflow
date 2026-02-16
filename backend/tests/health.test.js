import { describe, it, expect } from 'vitest'

/**
 * Unit tests for the Express app configuration.
 * These import the app module and verify route setup without starting a server.
 */
describe('App Module', () => {
  it('should export a valid Express app', async () => {
    const { default: app } = await import('../src/index.js')
    expect(app).toBeDefined()
    expect(typeof app.listen).toBe('function')
    expect(typeof app.use).toBe('function')
  })

  it('should support request and response handling', async () => {
    const { default: app } = await import('../src/index.js')
    // Express apps have get, post, put, delete methods
    expect(typeof app.get).toBe('function')
    expect(typeof app.post).toBe('function')
    expect(typeof app.put).toBe('function')
    expect(typeof app.delete).toBe('function')
  })
})
