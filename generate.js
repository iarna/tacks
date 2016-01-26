#!/usr/bin/env node
'use strict'
var Fixture = require('./index.js')

var fixturedata = Fixture.generateFromDir(process.argv[2])
console.log(fixturedata)
