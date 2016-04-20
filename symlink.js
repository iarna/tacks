'use strict'
var inherits = require('util').inherits
var Entry = require('./entry')
module.exports = Symlink

function Symlink (dest) {
  if (this == null) return new Symlink(dest)
  if (dest == null || dest === '') throw new Error('Symlinks must have a destination')
  Entry.call(this, 'symlink', dest)
}
inherits(Symlink, Entry)
