const stackTrace = require('stack-trace')


function serializeError(err) {
  const obj = {
    name: err.name,
    message: err.message,
    stack: stackTrace.parse(err),
  }

  Object.keys(err)
    .filter(key => Object.keys(obj).indexOf(key) === -1)
    .forEach((key) => { obj[key] = err[key] })

  return obj
}

module.exports = {
  serialize: (data) => {
    if (data instanceof Error) {
      return serializeError(data)
    }

    return data
  },
}
