'use strict'
var path = require('path')
var mkdirp = require('mkdirp')
var fs = require('graceful-fs')
var rimraf = require('rimraf')

var Tacks = module.exports = function (fixture) {
  this.fixture = fixture
  computeFixturePaths('/', fixture)
}
Tacks.prototype = {}

// add path properties to everything relative to the fixture root
function computeFixturePaths (entitypath, fixture) {
  fixture.path = entitypath
  if (fixture.type === 'dir') {
    Object.keys(fixture.contents).forEach(function (content) {
      computeFixturePaths(path.join(entitypath, content), fixture.contents[content])
    })
  } else if (fixture.type === 'file') {
    // do nothing
  } else {
    throw new Error('Unknown fixture type: ' + fixture.type)
  }
}

Tacks.File = function File (contents) {
  if (typeof contents === 'object' && !Buffer.isBuffer(contents)) {
    contents = JSON.stringify(contents)
  }
  return {
    type: 'file',
    contents: contents
  }
}

Tacks.Dir = function Dir (contents) {
  return {
    type: 'dir',
    contents: contents || {}
  }
}

Tacks.prototype.create = function (location, fixture) {
  var self = this
  if (!fixture) fixture = self.fixture
  if (fixture.type === 'dir') {
    var subdirpath = path.resolve(location, fixture.path)
    mkdirp.sync(subdirpath)
    Object.keys(fixture.contents).forEach(function (content) {
      self.create(location, fixture.contents[content])
    })
  } else if (fixture.type === 'file') {
    mkdirp.sync(path.resolve(location, fixture.path, '..'))
    fs.writeFileSync(path.resolve(location, fixture.path), fixture.contents)
  } else {
    throw new Error('Unknown fixture type: ' + fixture.type)
  }
}

Tacks.prototype.remove = function (location) {
  rimraf.sync(location)
}
