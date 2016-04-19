'use strict'
var inherits = require('util').inherits
var BaseTacks = require('./base.js')
var mixinReify = require('./mixin-reify.js')

module.exports = Tacks

function Tacks (fixture) {
  BaseTacks.call(this, fixture)
}
inherits(Tacks, BaseTacks)
mixinReify(Tacks)

Tacks.File = require('./file.js')
Tacks.Dir = require('./dir.js')
Tacks.Symlink = require('./symlink.js')
