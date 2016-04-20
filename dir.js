'use strict'
module.exports = Dir

function Dir (contents) {
  if (this == null) return new Dir(contents)
  this.type = 'dir'
  this.contents = contents || {}
}
