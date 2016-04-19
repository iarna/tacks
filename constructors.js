'use strict'

module.exports = function (Tacks) {
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
  Tacks.Symlink = function Symlink (dest) {
    return {
      type: 'symlink',
      dest: dest
    }
  }
}
