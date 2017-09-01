const log = require('./log-generator')


const output = process.stdout

/* eslint-disable key-spacing,space-in-parens,no-multi-spaces */
module.exports = {
  debug:   (msg, options) => { output.write(log.debug(  msg, options) + '\n') },
  info:    (msg, options) => { output.write(log.info(   msg, options) + '\n') },
  warning: (msg, options) => { output.write(log.warning(msg, options) + '\n') },
  error:   (msg, options) => { output.write(log.error(  msg, options) + '\n') },
  panic:   (msg, options) => { output.write(log.panic(  msg, options) + '\n'); process.exit(1) },
}
/* eslint-enable */
