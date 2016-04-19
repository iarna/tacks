'use strict'
var inherits = require('util').inherits
var BaseTacks = require('./base.js')
var mixinReify = require('./reify.js')
var addConstructors = require('./constructors.js')

module.exports = Tacks

function Tacks (fixture) {
  BaseTacks.call(this, fixture)
}
inherits(Tacks, BaseTacks)
mixinReify(Tacks)
addConstructors(Tacks)
