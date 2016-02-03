#!/usr/bin/env node
'use strict'
var argv = require('yargs')
  .usage('Usage: $0 fixturedir')
  .demand(1, 1)
  .argv
var Fixture = require('./index.js')

var fixturedata = Fixture.generateFromDir(argv._[0])
console.log(fixturedata)
