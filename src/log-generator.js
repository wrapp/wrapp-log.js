const serialize = require('./json-serializables').serialize
const circularJSON = require('circular-json')


const illegalProperties = ['hostname']

function log(level, msg, options = {}) {
  const result = Object.assign({}, {
    service: process.env.SERVICE_NAME,
    level,
    timestamp: new Date(),
    msg,
  }, options)

  // Delete all illegal properties
  illegalProperties.forEach((key) => { delete result[key] })

  // Prepare special JSON serialization
  Object.keys(result).forEach((key) => {
    result[key] = serialize(result[key])
  })

  return `${circularJSON.stringify(result)}`
}

/* eslint-disable key-spacing,space-in-parens,no-multi-spaces,prefer-template */
module.exports = {
  debug:   (msg, options) => log('debug',   msg, options),
  info:    (msg, options) => log('info',    msg, options),
  warning: (msg, options) => log('warning', msg, options),
  error:   (msg, options) => log('error',   msg, options),
  panic:   (msg, options) => log('panic',   msg, options),
}
/* eslint-enable */
