#!/usr/bin/env node
'use strict'
var Fixture = require('./fixture.js')

var fixturedata = Fixture.generateFromDir(process.argv[2])
console.log(fixturedata)
