import { describe, it, expect } from 'vitest'
import { logger } from '../src/lib/logger.js'

describe('Logger', () => {
  it('should export info, warn, error, debug methods', () => {
    expect(typeof logger.info).toBe('function')
    expect(typeof logger.warn).toBe('function')
    expect(typeof logger.error).toBe('function')
    expect(typeof logger.debug).toBe('function')
  })

  it('should not throw when called with message only', () => {
    expect(() => logger.info('test message')).not.toThrow()
    expect(() => logger.error('test error')).not.toThrow()
  })

  it('should not throw when called with meta', () => {
    expect(() => logger.info('test', { key: 'value' })).not.toThrow()
    expect(() => logger.warn('warning', { code: 123 })).not.toThrow()
  })
})
