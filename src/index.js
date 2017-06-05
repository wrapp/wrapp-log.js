const log = require('./log-generator')


const output = process.stdout

/* eslint-disable key-spacing,space-in-parens,no-multi-spaces */
module.exports = {
  debug:   (msg, options) => { output.write(log.debug(  msg, options)) },
  info:    (msg, options) => { output.write(log.info(   msg, options)) },
  warning: (msg, options) => { output.write(log.warning(msg, options)) },
  error:   (msg, options) => { output.write(log.error(  msg, options)) },
  panic:   (msg, options) => { output.write(log.panic(  msg, options)); process.exit(1) },
}
/* eslint-enable */
