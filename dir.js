'use strict'
var inherits = require('util').inherits
var Entry = require('./entry')
module.exports = Dir

function Dir (contents) {
  if (this == null) return new Dir(contents)
  Entry.call(this, 'dir', contents || {})
}
inherits(Dir, Entry)
