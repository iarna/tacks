'use strict'
module.exports = Symlink

function Symlink (dest) {
  if (this == null) return new Symlink(dest)
  if (dest == null || dest === '') throw new Error('Symlinks must have a destination')
  this.type = 'symlink'
  this.contents = dest
}
