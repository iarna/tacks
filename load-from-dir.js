'use strict'
var path = require('path')
var fs = require('graceful-fs')
var Tacks = require('./base.js')
var File = require('./file.js')
var Dir = require('./dir.js')

module.exports = function (dir) {
  return new Tacks(loadFromDir(dir))
}

function fromJSON (str) {
  try {
    return JSON.parse(str)
  } catch (ex) {
    return
  }
}

function loadFromDir (dir) {
  var dirInfo = {}
  fs.readdirSync(dir).forEach(function (filename) {
    if (filename === '.git') return
    var filepath = path.join(dir, filename)
    var fileinfo = fs.statSync(filepath)
    if (fileinfo.isDirectory()) {
      dirInfo[filename] = loadFromDir(filepath)
    } else {
      var content = fs.readFileSync(filepath)
      var contentStr = content.toString('utf8')
      var contentJSON = fromJSON(contentStr)
      if (contentJSON !== undefined) {
        dirInfo[filename] = File(contentJSON)
      } else if (/[^\-\w\s~`!@#$%^&*()_=+[\]{}|\\;:'",./<>?]/.test(contentStr)) {
        dirInfo[filename] = File(content)
      } else {
        dirInfo[filename] = File(contentStr)
      }
    }
  })
  return Dir(dirInfo)
}
