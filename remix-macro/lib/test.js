const path = require('path');
const pluginTester = require('babel-plugin-tester');
const pluginMacros = require('babel-plugin-macros');

pluginTester({
  plugin: pluginMacros,
  snapshot: false,
  fixtures: path.join(__dirname, 'fixures'),
})
