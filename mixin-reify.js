'use strict'
var fs = require('fs')
var path = require('path')
var mkdirp = require('mkdirp')
var rimraf = require('rimraf')

module.exports = function (Tacks) {
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
    } else if (fixture.type === 'symlink') {
      var filepath = path.resolve(location, fixture.path)
      var dest = fixture.dest
      if (dest[0] === '/') {
        dest = path.resolve(location, dest.slice(1))
      }
      fs.symlinkSync(dest, filepath, 'junction')
    } else {
      throw new Error('Unknown fixture type: ' + fixture.type)
    }
  }

  Tacks.prototype.remove = function (location) {
    rimraf.sync(location)
  }
}
