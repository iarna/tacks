'use strict'
module.exports = Symlink

function Symlink (dest) {
  return {
    type: 'symlink',
    dest: dest
  }
}
