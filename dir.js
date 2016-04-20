'use strict'
var path = require('path')
var inherits = require('util').inherits
var Entry = require('./entry')
module.exports = Dir

function Dir (contents) {
  if (this == null) return new Dir(contents)
  Entry.call(this, 'dir', contents || {})
}
inherits(Dir, Entry)

Dir.prototype.computePath = function (entitypath) {
  Entry.prototype.computePath.call(this, entitypath)

  var contentNames = Object.keys(this.contents)
  for (var ii in contentNames) {
    var name = contentNames[ii]
    this.contents[name].computePath(path.join(entitypath, name))
  }
}
