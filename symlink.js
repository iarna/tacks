'use strict'

module.exports = function Symlink (dest) {
  return {
    type: 'symlink',
    dest: dest
  }
}
