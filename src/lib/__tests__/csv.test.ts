import { csvToObjects } from '../csv'

describe('csvToObjects', () => {
  it('parses simple CSV into objects', () => {
    const csv = 'name,age\nAlice,30\nBob,25'
    const result = csvToObjects(csv)
    expect(result).toEqual([
      { name: 'Alice', age: '30' },
      { name: 'Bob', age: '25' },
    ])
  })

  it('handles quoted fields with commas', () => {
    const csv = 'name,bio\nAlice,"Likes cats, dogs"\nBob,Simple'
    const result = csvToObjects(csv)
    expect(result[0].bio).toBe('Likes cats, dogs')
    expect(result[1].bio).toBe('Simple')
  })

  it('handles escaped double quotes', () => {
    const csv = 'name,quote\nAlice,"She said ""hello"""\nBob,None'
    const result = csvToObjects(csv)
    expect(result[0].quote).toBe('She said "hello"')
  })

  it('handles \\r\\n line endings', () => {
    const csv = 'a,b\r\n1,2\r\n3,4'
    const result = csvToObjects(csv)
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({ a: '1', b: '2' })
  })

  it('skips empty rows', () => {
    const csv = 'name\nAlice\n\nBob\n'
    const result = csvToObjects(csv)
    expect(result).toHaveLength(2)
  })

  it('returns empty array for header-only CSV', () => {
    expect(csvToObjects('name,age')).toEqual([])
  })

  it('returns empty array for empty string', () => {
    expect(csvToObjects('')).toEqual([])
  })

  it('handles missing trailing columns', () => {
    const csv = 'a,b,c\n1,2\n4,5,6'
    const result = csvToObjects(csv)
    expect(result[0]).toEqual({ a: '1', b: '2', c: '' })
    expect(result[1]).toEqual({ a: '4', b: '5', c: '6' })
  })

  it('trims header whitespace', () => {
    const csv = ' name , age \nAlice,30'
    const result = csvToObjects(csv)
    expect(result[0]).toEqual({ name: 'Alice', age: '30' })
  })

  it('handles quoted fields with newlines', () => {
    const csv = 'name,bio\nAlice,"Line 1\nLine 2"\nBob,Simple'
    const result = csvToObjects(csv)
    expect(result[0].bio).toBe('Line 1\nLine 2')
    expect(result).toHaveLength(2)
  })
})
