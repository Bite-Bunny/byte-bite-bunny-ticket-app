import { parseQueryString } from '../parse-query-string'

describe('parseQueryString', () => {
  it('should return empty object for undefined input', () => {
    expect(parseQueryString()).toEqual({})
  })

  it('should return empty object for empty string', () => {
    expect(parseQueryString('')).toEqual({})
  })

  it('should parse simple query string', () => {
    expect(parseQueryString('foo=bar&baz=qux')).toEqual({
      foo: 'bar',
      baz: 'qux',
    })
  })

  it('should decode URL encoded values', () => {
    expect(parseQueryString('name=John%20Doe&city=New%20York')).toEqual({
      name: 'John Doe',
      city: 'New York',
    })
  })

  it('should parse JSON-like values', () => {
    const result = parseQueryString('data=%7B%22key%22%3A%22value%22%7D')
    expect(result).toEqual({
      data: { key: 'value' },
    })
  })

  it('should parse array-like JSON values', () => {
    const result = parseQueryString('items=%5B1%2C2%2C3%5D')
    expect(result).toEqual({
      items: [1, 2, 3],
    })
  })

  it('should handle values that start with { or [', () => {
    const result = parseQueryString('data={"key":"value"}')
    expect(result).toEqual({
      data: { key: 'value' },
    })
  })

  it('should handle invalid JSON gracefully', () => {
    const result = parseQueryString('data=invalid%7Bjson')
    // Should fall back to decoded string
    expect(result.data).toBe('invalid{json')
  })

  it('should handle multiple parameters', () => {
    expect(parseQueryString('name=John&age=30&city=NYC&active=true')).toEqual({
      name: 'John',
      age: '30',
      city: 'NYC',
      active: 'true',
    })
  })

  it('should handle empty values', () => {
    expect(parseQueryString('foo=&bar=baz')).toEqual({
      foo: '',
      bar: 'baz',
    })
  })

  it('should handle special characters', () => {
    expect(parseQueryString('symbol=%26%3D%3F')).toEqual({
      symbol: '&=?',
    })
  })
})
