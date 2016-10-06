'use strict'
var fs = require('fs')
var path = require('path')

module.exports = Tacks

Tacks.File = require('./file.js')
Tacks.Dir = require('./dir.js')
Tacks.Symlink = require('./symlink.js')

function Tacks (fixture) {
  this.fixture = fixture
  fixture.computePath(path.sep)
}
Tacks.prototype = {}

Tacks.prototype.create = function (location) {
  this.fixture.create(location)
}

Tacks.prototype.remove = function (location) {
  this.fixture.remove(location)
}

Tacks.prototype.toSource = function () {
  return 'new Tacks(\n' +
    this.fixture.toSource().replace(/(^|\n)/g, '$1  ') + '\n)'
}
