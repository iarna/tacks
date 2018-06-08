'use strict'
var path = require('path')
var fs = require('fs')
var Tacks = require('./tacks.js')
var File = Tacks.File
var Dir = Tacks.Dir
var Symlink = Tacks.Symlink

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

function loadFromDir (dir, top) {
  if (!top) top = dir
  var dirInfo = {}
  fs.readdirSync(dir).forEach(function (filename) {
    if (filename === '.git') return
    var filepath = path.join(dir, filename)
    var fileinfo = fs.lstatSync(filepath)
    if (fileinfo.isSymbolicLink()) {
      var dest = fs.readlinkSync(filepath).replace(/[\\/]$/, '')
      var absDest = path.resolve(path.dirname(filepath), dest)
      var relativeDest = path.relative(path.dirname(filepath), absDest)
      // if we're two or more levels up, plot relative to the top level instead of
      // the link point
      if (/^\.\.[/\\]\.\.[/\\]/.test(relativeDest.slice(0,6))) {
        dest = '/' + path.relative(top, absDest)
      } else {
        dest = relativeDest
      }
      dirInfo[filename] = Symlink(dest.replace(/\\/g, '/'))
    } else if (fileinfo.isDirectory()) {
      dirInfo[filename] = loadFromDir(filepath, top)
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
