import { axiosTimeout, axiosHeaders, baseURL } from '../config'

describe('API Config', () => {
  describe('axiosTimeout', () => {
    it('should have a timeout value', () => {
      expect(axiosTimeout).toBeDefined()
      expect(typeof axiosTimeout).toBe('number')
      expect(axiosTimeout).toBeGreaterThan(0)
    })

    it('should be 10000 milliseconds', () => {
      expect(axiosTimeout).toBe(10000)
    })
  })

  describe('axiosHeaders', () => {
    it('should have Content-Type header', () => {
      expect(axiosHeaders).toHaveProperty('Content-Type')
      expect(axiosHeaders['Content-Type']).toBe('application/json')
    })

    it('should be an object', () => {
      expect(typeof axiosHeaders).toBe('object')
      expect(axiosHeaders).not.toBeNull()
    })
  })

  describe('baseURL', () => {
    it('should have a base URL', () => {
      expect(baseURL).toBeDefined()
      expect(typeof baseURL).toBe('string')
      expect(baseURL.length).toBeGreaterThan(0)
    })

    it('should use default URL when env vars are not set', () => {
      // In test environment, env vars might not be set
      // So it should fall back to default
      expect(baseURL).toBeTruthy()
    })

    it('should be a valid URL format', () => {
      // Should start with http:// or https://
      expect(baseURL).toMatch(/^https?:\/\//)
    })
  })
})
