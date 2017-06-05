const spawn = require('child_process').spawn


const ownExitCode = 123
const SERVICE_NAME = 'tester'
process.env.SERVICE_NAME = SERVICE_NAME

/**
 * Setup test to run library as intended by external applications.
 * This function spawns a new node process, pipes in code to be executed (log test),
 * and then exits with the global 'ownExitCode' exit code.
 *
 * If the log library exists with a different code than the above, the asserts
 * in this test helper will catch this.
 *
 * @param {string}   logLevel         Log level to test
 * @param {int}      expectedExitCode Which exit code is expected from the spawned process
 * @param            expect           Jest 'expect' assertion function
 * @param            done             'test is done' indicator function
 */
function testLoggingSpawn(logLevel, expectedExitCode, expect, done) {
  const node = spawn('node', { cwd: __dirname })
  const logInput = `
    const log = require('./index');
    log.${logLevel}('hej');
    
    // Exit with this exit code to indicate library did not exit the process
    process.exit(${ownExitCode});
  `
  let logOutput = ''

  node.stdin.write(logInput)
  node.stdin.end()

  node.stdout.on('data', (data) => { logOutput += data })

  node.on('close', (code) => {
    const logJSON = JSON.parse(logOutput)

    expect(code).toBe(expectedExitCode)
    expect(logJSON).toHaveProperty('level', logLevel)
    expect(logJSON).toHaveProperty('msg', 'hej')
    expect(logJSON).toHaveProperty('service', SERVICE_NAME)
    expect(logJSON).toHaveProperty('timestamp')

    done()
  })
}

/* eslint-disable no-multi-spaces */
/* eslint-env jest/globals */
describe('log output', () => {
  test('debug',   (done) => { testLoggingSpawn('debug',   ownExitCode, expect, done) })
  test('info',    (done) => { testLoggingSpawn('info',    ownExitCode, expect, done) })
  test('warning', (done) => { testLoggingSpawn('warning', ownExitCode, expect, done) })
  test('error',   (done) => { testLoggingSpawn('error',   ownExitCode, expect, done) })
  test('panic',   (done) => { testLoggingSpawn('panic',   1,           expect, done) })
})
/* eslint-enable */
