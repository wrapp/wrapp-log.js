# Wrapp-log

NodeJS JSON producing logging library. See output details below for examples.


### Requirements

NodeJS v7+


### Installation

```bash
npm install wrapp-log
```

or

```bash
yarn add wrapp-log
```


### Usage

#### API

 * `log.debug(msg, [fields])` - Outputs the message with with level: `debug`
 * `log.info(msg, [fields])` - Outputs the message with with level: `info`
 * `log.warning(msg, [fields])` - Outputs the message with with level: `warning`
 * `log.error(msg, [fields])` - Outputs the message with with level: `error`
 * `log.panic(msg, [fields])` - Outputs the message with with level: `panic` then exits the process with status code `1`
 * `log.withFields(fields)` - Generate a new logger object that will always include the fields data in each log output.
 
 The `msg` argument is expected to be string but can be something else as well.
 
 The `fields` argument is required to be undefined or an object. Each value should be a primitive / JSON parsable object.
  
 and error is passed in fields as: `{ error: new Error() }` and will be serialized. See "Output details" below for more info.


#### Input

```js
const log = require('wrapp-log')
 
log.info('Informal message')

try {
  throw new Error('Cannot handle the overload...')
} catch (e) {
  log.error('Something seriously wrong', { error: e })
}

console.log('') // Line break
const reqLog = log.withFields({ request_id: 'abc123' })

reqLog.info('New message')
reqLog.info('Merge fields', { extra: 'is ok' })
reqLog.warning('Overwriting previous set fields', { request_id: 'is allowed and possible' })

console.log('') // Line break

const specLog = reqLog.withFields({ specs: 1337 })

specLog.info('Inception!', { wo: 'ot' })
specLog.info('It\'s possible to override preset fields', { request_id: '321cba' })
specLog.warning('It\'s possible for any field...', { level: 'messed up' })

console.log('') // Killing the process by panic
log.panic('Too much to handle')
```


#### Output

```
{"level":"info","timestamp":"2017-01-09T01:10:01.799Z","msg":"Informal message"}
{"level":"error","timestamp":"2017-01-09T01:10:01.799Z","msg":"Something seriously wrong","error":{"name":"Error","message":"Cannot handle the overload...","stack":[{"fileName":"/Users/wrapp/test-logging.js","lineNumber":6,"functionName":null,"typeName":"Object","methodName":null,"columnNumber":9,"native":false},{"fileName":"module.js","lineNumber":571,"functionName":"Module._compile","typeName":"Module","methodName":"_compile","columnNumber":32,"native":false},{"fileName":"module.js","lineNumber":580,"functionName":"Module._extensions..js","typeName":"Object","methodName":".js","columnNumber":10,"native":false},{"fileName":"module.js","lineNumber":488,"functionName":"Module.load","typeName":"Module","methodName":"load","columnNumber":32,"native":false},{"fileName":"module.js","lineNumber":447,"functionName":"tryModuleLoad","typeName":null,"methodName":null,"columnNumber":12,"native":false},{"fileName":"module.js","lineNumber":439,"functionName":"Module._load","typeName":"Function","methodName":"_load","columnNumber":3,"native":false},{"fileName":"module.js","lineNumber":605,"functionName":"Module.runMain","typeName":"Module","methodName":"runMain","columnNumber":10,"native":false},{"fileName":"bootstrap_node.js","lineNumber":427,"functionName":"run","typeName":null,"methodName":null,"columnNumber":7,"native":false},{"fileName":"bootstrap_node.js","lineNumber":151,"functionName":"startup","typeName":null,"methodName":null,"columnNumber":9,"native":false},{"fileName":"bootstrap_node.js","lineNumber":542,"functionName":null,"typeName":null,"methodName":null,"columnNumber":3,"native":false}]}}

{"level":"info","timestamp":"2017-01-09T01:10:01.799Z","msg":"New message","request_id":"abc123"}
{"level":"info","timestamp":"2017-01-09T01:10:01.799Z","msg":"Merge fields","request_id":"abc123","extra":"is ok"}
{"level":"warning","timestamp":"2017-01-09T01:10:01.799Z","msg":"Overwriting previous set fields","request_id":"is allowed and possible"}

{"level":"info","timestamp":"2017-01-09T01:10:01.799Z","msg":"Inception!","request_id":"abc123","specs":1337,"wo":"ot"}
{"level":"info","timestamp":"2017-01-09T01:10:01.799Z","msg":"It's possible to override preset fields","request_id":"321cba","specs":1337}
{"level":"messed up","timestamp":"2017-01-09T01:10:01.799Z","msg":"It's possible for any field...","request_id":"abc123","specs":1337}

{"level":"panic","timestamp":"2017-01-09T01:10:01.799Z","msg":"Wow, this is just too much!"}
```

[Exited with code 1]


### Output details

All output is performed to standard out. Nothing goes to standard error.
Each log message is on one and the same line and a line break `\n` is added after each message.

The log output will look like the example below, but on one line only.
Any additional properties will be added.

For the `service` attribute to be automatically added to each log line the environment variable `SERVICE_NAME` must be set. If not set, the attribute will not be serialized.

Errors are serialized to some extent (message, name and any attacked properties), and the error stack trace uses npm module [stack-trace](https://www.npmjs.com/package/stack-trace)

The multiline format below is to show the order of data being outputted. Each actual log message will be serialized on one and the same line.  

```
{
  "service":"<service name>",
  "level": "<debug|info|warning|error|panic>",
  "timestamp": "<timestamp>",
  "msg": "<log text>",
  ["additional_properties": "some text| 123 | {\"deep\":\"stuff\"}"]
}
```


#### Circular references

The JSON serialisation are performed by [circular-json](https://www.npmjs.com/package/circular-json). This makes data attributes with circular references possible to be logged. 


### Development

Tests are run with jest: `jest` or `yarn test`/`npm run test` (added coverage measurements)
