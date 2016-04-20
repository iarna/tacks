'use strict'
module.exports = Dir

function Dir (contents) {
  return {
    type: 'dir',
    contents: contents || {}
  }
}
