const serialize = require('./json-serializables').serialize


const illegalProperties = ['hostname']

function log(level, msg, options = {}) {
  const result = Object.assign({}, options, {
    level,
    msg,
    service: process.env.SERVICE_NAME,
    timestamp: new Date(),
  })

  // Delete all illegal properties
  illegalProperties.forEach((key) => { delete result[key] })

  // Prepare special JSON serialization
  Object.keys(result).forEach((key) => {
    result[key] = serialize(result[key])
  })

  return `${JSON.stringify(result)}\n`
}

/* eslint-disable key-spacing,space-in-parens,no-multi-spaces */
module.exports = {
  debug:   (msg, options) => log('debug',   msg, options),
  info:    (msg, options) => log('info',    msg, options),
  warning: (msg, options) => log('warning', msg, options),
  error:   (msg, options) => log('error',   msg, options),
  panic:   (msg, options) => log('panic',   msg, options),
}
/* eslint-enable */
