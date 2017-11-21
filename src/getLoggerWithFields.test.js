const getLoggerWithFields = require('./getLoggerWithFields')


const log = getLoggerWithFields({
  info: (msg, fields) => ({ msg, fields }),
})

  /* eslint-env jest/globals */

describe('log output without any fields defined:', () => {
  const result = log.info('text')

  test('should return the "msg"', () => { expect(result).toHaveProperty('msg', 'text') })
  test('should return an empty "fields"', () => { expect(result).toHaveProperty('fields', {}) })
})

describe('log output with fields defined in the log command:', () => {
  const result = log.info('text', { four: 4 })

  test('should return the "msg"', () => { expect(result).toHaveProperty('msg', 'text') })
  test('should return an empty "fields"', () => { expect(result).toHaveProperty('fields', { four: 4 }) })
})

describe('log output with "withFields" default value:', () => {
  const result = log.withFields().info('text')

  test('should return the "msg"', () => { expect(result).toHaveProperty('msg', 'text') })
  test('should return an empty "fields"', () => { expect(result).toHaveProperty('fields', {}) })
})

describe('log output with fields predefined:', () => {
  const result = log.withFields({ five: 5 }).info('text')

  test('should return the "msg"', () => { expect(result).toHaveProperty('msg', 'text') })
  test('should return correct "fields" data', () => { expect(result).toHaveProperty('fields', { five: 5 }) })
})

describe('log output with fields predefined and in the log command:', () => {
  const result = log.withFields({ five: 5 }).info('text', { four: 4 })

  test('should return the "msg"', () => { expect(result).toHaveProperty('msg', 'text') })
  test('should return correct "fields" data', () => { expect(result).toHaveProperty('fields', { five: 5, four: 4 }) })
})

describe('log output with fields predefined and in the log command meta:', () => {
  const result = log.withFields({ f: 5 }).withFields({ t: 3 }).info('text', { d: 4 })

  test('should return the "msg"', () => { expect(result).toHaveProperty('msg', 'text') })
  test('should return an empty "fields"', () => { expect(result).toHaveProperty('fields', { f: 5, t: 3, d: 4 }) })
})
