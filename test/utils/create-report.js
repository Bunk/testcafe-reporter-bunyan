var buildReporterPlugin = require('testcafe').embeddingUtils.buildReporterPlugin
var pluginFactory = require('../../lib')
var reporterTestCalls = require('./reporter-test-calls')

module.exports = function createReport () {
  var outStream = {
    data: '',

    write: function (text) {
      this.data += text
    }
  }

  var plugin = buildReporterPlugin(pluginFactory, outStream)

  plugin.chalk.enabled = false
  plugin.symbols = { ok: '✓', err: '✖' }

  reporterTestCalls.forEach(function (call) {
    plugin[call.method].apply(plugin, call.args)
  })

  // NOTE: mock stack entries
  return outStream.data.replace(/\s*?\(.+?:\d+:\d+\)/g, ' (some-file:1:1)')
}
