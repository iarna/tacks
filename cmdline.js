#!/usr/bin/env node
'use strict'
require('@iarna/cli')(main)

const path = require('path')
const generateFromDir = require('./generate-from-dir.js')

function main (opts, fixturedir) {
  return new Promise((resolve, reject) => {
    if (!fixturedir) {
      console.error(`Usage: ${path.basename(process.argv[1])} fixturedir`)
      return reject(1)
    }
    var fixturedata = generateFromDir(fixturedir)
    console.log(fixturedata)
    return resolve()
  })
}
