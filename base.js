'use strict'
var path = require('path')

var Tacks = module.exports = function (fixture) {
  this.fixture = fixture
  computeFixturePaths('/', fixture)
}
Tacks.prototype = {}

// add path properties to everything relative to the fixture root
function computeFixturePaths (entitypath, fixture) {
  fixture.path = path.relative('/', entitypath)
  if (fixture.type === 'dir') {
    Object.keys(fixture.contents).forEach(function (content) {
      computeFixturePaths(path.join(entitypath, content), fixture.contents[content])
    })
  } else if (fixture.type === 'file' || fixture.type === 'symlink') {
    // do nothing
  } else {
    throw new Error('Unknown fixture type: ' + fixture.type)
  }
}
