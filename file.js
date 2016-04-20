'use strict'
var path = require('path')
var fs = require('fs')
var inherits = require('util').inherits
var Entry = require('./entry')
module.exports = File

function File (contents) {
  if (this == null) return new File(contents)
  this.type = 'file'
  if (typeof contents === 'object' && !Buffer.isBuffer(contents)) {
    contents = JSON.stringify(contents)
  }
  Entry.call(this, 'file', contents)
}
inherits(File, Entry)

File.prototype.create = function (where) {
  fs.writeFileSync(path.resolve(where, this.path), this.contents)
}
