import { expect, it } from 'vitest'
import { numberToZh, parseSearchParams, serializeSearchParams } from '../shared/utils'

it('numberToZh', () => {
  expect(numberToZh(1234)).toBe('1234')

  expect(numberToZh(123555)).toBe('12.3万')
  expect(numberToZh(120000)).toBe('12万')

  expect(numberToZh(123456789)).toBe('1.2亿')
  expect(numberToZh(100000000)).toBe('1亿')
})

it('parseSearchParams', () => {
  expect(parseSearchParams(new URL('http://localhost?a=1&b=2'))).toEqual({ a: '1', b: '2' })
  expect(parseSearchParams(new URL('http://localhost?a=&b=2'))).toEqual({ b: '2' })
})

it('serializeSearchParams', () => {
  expect(serializeSearchParams({ a: '1', b: '2' })).toBe('a=1&b=2')
  expect(serializeSearchParams({ a: undefined, b: '2' })).toBe('b=2')
  expect(serializeSearchParams({ a: '1', b: null, c: '3' })).toBe('a=1&c=3')
})
