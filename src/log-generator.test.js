const MockDate = require('mockdate')

const log = require('./log-generator')


const MOCK_DATETIME = '2017-06-01T12:20:35.850Z'
const SERVICE_NAME = 'wrapp.log.js.test'

MockDate.set(MOCK_DATETIME)
process.env.SERVICE_NAME = SERVICE_NAME

  /* eslint-env jest/globals */

describe('log output', () => {
  const result = log.info('some output')

  test('should start with "{"', () => { expect(result[0]).toBe('{') })
  test('should end with "}"', () => { expect(result.substr(result.length - 1)).toBe('}') })
  test('should be parsable JSON', () => { expect(JSON.parse(result)).toBeTruthy() })
})

describe('log output should always contain property:', () => {
  const msg = 'more output'
  const result = JSON.parse(log.info(msg))

  test('"level"', () => { expect(result).toHaveProperty('level', 'info') })
  test('"msg"', () => { expect(result).toHaveProperty('msg', msg) })
  test('"service"', () => { expect(result).toHaveProperty('service', SERVICE_NAME) })
  test('"timestamp"', () => { expect(result).toHaveProperty('timestamp', MOCK_DATETIME) })
})

describe('log output should never contain illegal property:', () => {
  const msg = 'more output'
  const result = JSON.parse(log.info(msg, { hostname: 'should not logged' }))

  test('"hostname"', () => { expect(result.hostname).toBeUndefined() })
})

describe('log output should output mandatory data', () => {
  const result = log.info('msg')

  test('"in order"', () => {
    expect(result).toMatch(/{"service":".*","level":"info","timestamp":".*","msg":"msg"}/)
  })
})

describe('log output with additional attributes should output data', () => {
  const result = log.info('msg', { data: { sub: 1, x: 'x' } })

  test('"with mandatory data order first and then additional attributes"', () => {
    expect(result).toMatch(/{"service":".*","level":"info","timestamp":".*","msg":"msg","data":{"sub":1,"x":"x"}}/)
  })
})

describe('all mandatory data can be overwritten in options object but stay in order:', () => {
  const result = log.info('x', { msg: 'msg', level: 'level', service: 'service', timestamp: 'timestamp' })

  test('"with mandatory data order first and then additional attributes"', () => {
    expect(result).toMatch(/{"service":"service","level":"level","timestamp":"timestamp","msg":"msg"}/)
  })
})

describe('testing all different log levels', () => {
  /* eslint-disable no-multi-spaces,space-in-parens */
  test('debug',   () => expect(JSON.parse(log.debug(''  ))).toHaveProperty('level', 'debug'))
  test('info',    () => expect(JSON.parse(log.info(''   ))).toHaveProperty('level', 'info'))
  test('warning', () => expect(JSON.parse(log.warning(''))).toHaveProperty('level', 'warning'))
  test('error',   () => expect(JSON.parse(log.error(''  ))).toHaveProperty('level', 'error'))
  test('panic',   () => expect(JSON.parse(log.panic(''  ))).toHaveProperty('level', 'panic'))
  /* eslint-enable */
})

describe('logging with additional options', () => {
  const shallowString = 'some small str'
  const deepObject = { live: true, name: 'x', states: ['a', 'b'] }
  const options = { deepObject, shallowString }
  const logObj = JSON.parse(log.info('hej', options))
  const expects = ['deepObject', 'level', 'msg', 'service', 'shallowString', 'timestamp']

  test('should only contain expected details:', () => {
    expect(Object.keys(logObj).sort()).toEqual(expects)
  })
  test('should include shallowString details:', () => {
    expect(logObj).toHaveProperty('shallowString', shallowString)
  })
  test('should include deepObject details:', () => {
    expect(logObj).toHaveProperty('deepObject', deepObject)
  })
})

describe('logging with error', () => {
  const logObj = JSON.parse(log.error('fel', { error: new Error('error') }))
  const error = logObj.error

  describe('should have the expected log fields:', () => {
    test('level', () => expect(logObj).toHaveProperty('level', 'error'))
    test('msg', () => expect(logObj).toHaveProperty('msg', 'fel'))
    test('service', () => expect(logObj).toHaveProperty('service'))
    test('timestamp', () => expect(logObj).toHaveProperty('timestamp'))
    test('errors', () => expect(logObj).toHaveProperty('error'))
  })
  test('should only contain expected error details:', () => {
    expect(Object.keys(error).sort()).toEqual(['message', 'name', 'stack'])
  })
  describe('should have the expected error details:', () => {
    test('message', () => expect(error).toHaveProperty('message', 'error'))
    test('name', () => expect(error).toHaveProperty('name', 'Error'))
    test('stack', () => expect(error).toHaveProperty('stack'))
  })
  describe('should have error stack', () => {
    test('of a respectable length', () => expect(error.stack.length > 5).toBeTruthy())
    describe('each containing the detail', () => {
      const frameProps = ['fileName', 'lineNumber', 'functionName', 'typeName', 'methodName', 'columnNumber', 'native']
      const stack = error.stack

      frameProps.forEach((prop) => {
        test(prop, () => {
          expect(stack.filter(frame => frame[prop] !== undefined).length).toEqual(stack.length)
        })
      })
    })
  })
})

describe('logging with custom error', () => {
  function MyError(message) {
    this.name = 'MyError'
    this.message = message
    this.extra = 42
  }
  MyError.prototype = new Error() // <-- remove this if you do not
                                  //     want MyError to be instanceof Error
  const logObj = JSON.parse(log.error('mitt fel', { error: new MyError('kass') }))
  const error = logObj.error

  test('should only contain expected error details:', () => {
    expect(Object.keys(error).sort()).toEqual(['extra', 'message', 'name', 'stack'])
  })
  describe('should have the extra error details:', () => {
    test('extra', () => expect(error).toHaveProperty('extra', 42))
  })
})

describe('logging an object with a circular reference', () => {
  const circular = {
    someText: 'is like this',
  }
  circular.self = circular

  const logObj = JSON.parse(log.error('mitt fel', { circular }))
  const circularDataObj = logObj.circular
  const circularRef = circularDataObj.self

  test('should only contain expected log data:', () => {
    expect(Object.keys(logObj).sort()).toEqual(['circular', 'level', 'msg', 'service', 'timestamp'])
    expect(Object.keys(circularDataObj).sort()).toEqual(['self', 'someText'])
    expect(circularRef).toBe('~circular')
  })
})
