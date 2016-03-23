'use strict'

module.exports = function Dir (contents) {
  return {
    type: 'dir',
    contents: contents || {}
  }
}
