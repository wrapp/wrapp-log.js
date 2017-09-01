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

 * `log.debug(msg, [options])` - Outputs the message with with level: `debug`
 * `log.info(msg, [options])` - Outputs the message with with level: `info`
 * `log.warning(msg, [options])` - Outputs the message with with level: `warning`
 * `log.error(msg, [options])` - Outputs the message with with level: `error`
 * `log.panic(msg, [options])` - Outputs the message with with level: `panic` then exits the process with status code `1`
 
 The `msg` argument is expected to be string but can be something else as well.
 
 The `options` argument is required to be undefined or an object. Each value should be a primitive / JSON parsable object.
  
 and error is passed in options as: `{ error: new Error() }` and will be serialized. See "Output details" below for more info.


#### Input

```js
const log = require('wrapp-log')
 
log.info('Informal message')

try {
  throw new Error('Cannot handle the overload...')
} catch (e) {
  log.error('Something seriously wrong', { error: e })
}

log.panic('Too much to handle')
```


#### Output

```
{"level":"info","msg":"Informal message","timestamp":"2017-06-07T14:02:40.759Z"}
{"error":{"name":"Error","message":"Cannot handle the overload...","stack":[{"fileName":"/Users/wrapp/test-logging.js","lineNumber":6,"functionName":null,"typeName":"Object","methodName":null,"columnNumber":9,"native":false},{"fileName":"module.js","lineNumber":571,"functionName":"Module._compile","typeName":"Module","methodName":"_compile","columnNumber":32,"native":false},{"fileName":"module.js","lineNumber":580,"functionName":"Module._extensions..js","typeName":"Object","methodName":".js","columnNumber":10,"native":false},{"fileName":"module.js","lineNumber":488,"functionName":"Module.load","typeName":"Module","methodName":"load","columnNumber":32,"native":false},{"fileName":"module.js","lineNumber":447,"functionName":"tryModuleLoad","typeName":null,"methodName":null,"columnNumber":12,"native":false},{"fileName":"module.js","lineNumber":439,"functionName":"Module._load","typeName":"Function","methodName":"_load","columnNumber":3,"native":false},{"fileName":"module.js","lineNumber":605,"functionName":"Module.runMain","typeName":"Module","methodName":"runMain","columnNumber":10,"native":false},{"fileName":"bootstrap_node.js","lineNumber":427,"functionName":"run","typeName":null,"methodName":null,"columnNumber":7,"native":false},{"fileName":"bootstrap_node.js","lineNumber":151,"functionName":"startup","typeName":null,"methodName":null,"columnNumber":9,"native":false},{"fileName":"bootstrap_node.js","lineNumber":542,"functionName":null,"typeName":null,"methodName":null,"columnNumber":3,"native":false}]},"level":"error","msg":"Something seriously wrong","timestamp":"2017-06-07T14:02:40.760Z"}
{"level":"panic","msg":"Too much to handle","timestamp":"2017-06-07T14:02:40.762Z"}
```

[Exited with code 1]


### Output details

All output is performed to standard out. Nothing goes to standard error.
Each log message is on one and the same line and a line break `\n` is added after each message.

The log output will look like the example below, but on one line only.
Any additional properties will be added.

Errors are serialized to some extent (message, name and any attacked properties), and the error stack trace uses npm module [stack-trace](https://www.npmjs.com/package/stack-trace)

```
{
  "level": "<debug|info|warning|error|panic>",
  "msg": "<log text>",
  "service":"<service name>",
  "timestamp": "<timestamp>",
  ["additional_properties": "some text| 123 | {\"deep\":\"stuff\"}"]
}
```


#### Circular references

The JSON serialisation are performed by [circular-json](https://www.npmjs.com/package/circular-json). This makes data attributes with circular references possible to be logged. 


### Development

Tests are run with jest: `jest` or `yarn test`/`npm run test` (added coverage measurements)
