const logger = require('bunyan').createLogger({name: 'testcafe-reporter-bunyan'})

function factory () {
  return {
    noColors: false,
    startTime: null,
    afterErrorList: false,
    testCount: 0,
    skipped: 0,

    reportTaskStart (startTime, userAgents, testCount) {
      this.startTime = startTime
      this.testCount = testCount

      this.taskLogger = logger.child()
      this.taskLogger.info({ userAgents }, 'Running all tests')
    },

    reportFixtureStart (name, path) {
      this.fixtureLogger = this.taskLogger.child({ fixtureName: name, fixturePath: path })
      this.fixtureLogger.info(`Running test fixture '${name}'`)
    },

    reportTestDone (name, testRunInfo) {
      const testLogger = this.fixtureLogger.child({testName: name})
      const hasErr = !!testRunInfo.errs.length

      const symbol = testRunInfo.skipped
        ? '-' : hasErr
        ? this.symbols.err
        : this.symbols.ok

      let meta = {
        unstable: testRunInfo.unstable,
        screenshotPath: testRunInfo.screenshotPath,
        skipped: testRunInfo.skipped
      }
      let msg = `${symbol} ${name}`

      if (meta.skipped) this.skipped++
      if (meta.unstable) msg += ' (unstable)'
      if (meta.screenshotPath) msg += ` (screenshots: ${meta.screenshotPath})`

      testLogger.info(meta, msg)
      testRunInfo.errs.forEach((err, idx) => {
        var prefix = `${idx + 1}) `
        testLogger.error(this.formatError(err, prefix))
      })
    },

    reportTaskDone (endTime, passed, warnings) {
      const durationMs = endTime - this.startTime
      const duration = this.moment.duration(durationMs).format('h[h] mm[m] ss[s]')

      const meta = {
        duration,
        durationMs,
        testsCount: this.testCount,
        testsPassed: passed,
        testsFailed: this.testCount - passed,
        testsSkipped: this.skipped
      }

      let msg = meta.testsPassed === meta.testsCount
        ? `${meta.testsPassed} passed`
        : `${meta.testsFailed}/${meta.testsCount} failed`

      msg += ` (${duration})`
      if (meta.testsSkipped) {
        msg += `\n${meta.testsSkipped} skipped`
      }

      this.taskLogger.info(meta, msg)

      warnings.forEach(warning => {
        this.taskLogger.warn(warning)
      })
    }
  }
}

factory.logger = logger

module.exports = factory
