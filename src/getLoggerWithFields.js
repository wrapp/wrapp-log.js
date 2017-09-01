function getLoggerWithFields(baseLogger, baseFields = {}) {
  const logger = Object.assign({}, baseLogger)

  Object.keys(logger)
    .forEach((key) => {
      logger[key] = (msg, fields = {}) => {
        return baseLogger[key](msg, Object.assign({}, baseFields, fields))
      }
    })

  logger.withFields = (fields = {}) => {
    return getLoggerWithFields(baseLogger, Object.assign({}, baseFields, fields))
  }

  return logger
}

module.exports = getLoggerWithFields
