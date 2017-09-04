const serialize = require('./jsonSerializables').serialize
const circularJSON = require('circular-json')


const illegalProperties = ['hostname']

module.exports = (level, msg, fields = {}) => {
  const result = Object.assign({}, {
    service: process.env.SERVICE_NAME,
    level,
    timestamp: new Date(),
    msg,
  }, fields)

  // Delete all illegal properties
  illegalProperties.forEach((key) => { delete result[key] })

  // Prepare special JSON serialization
  Object.keys(result).forEach((key) => {
    result[key] = serialize(result[key])
  })

  return `${circularJSON.stringify(result)}`
}
