'use strict'
var path = require('path')
module.exports = Entry

function Entry (type, contents) {
  this.type = type
  this.contents = contents
  this.path = null
}
Entry.prototype = {}

Entry.prototype.computePath = function (entitypath) {
  this.path = path.relative('/', entitypath)
}
