'use strict'
var loadFromDir = require('./load-from-dir.js')

module.exports = function generateFromDir (dir) {
  return "var Tacks = require('tacks')\n" +
      'var File = Tacks.File\n' +
      'var Dir = Tacks.Dir\n' +
      'module.exports = ' + generateObject(dir) + '\n'
}

var generateObject = module.exports.generateObject = function (dir) {
  var model = loadFromDir(dir)
  return 'new Tacks(\n  ' + modelToString(model.fixture, '  ') + '\n)'
}

function modelToString (model, indent) {
  if (model.type === 'dir') {
    return dirToString(model.contents, indent)
  } else if (model.type === 'file') {
    return fileToString(model.contents, indent)
  } else {
    throw new Error("Don't know how to serialize " + model.type)
  }
}

function dirToString (contents, indent) {
  var output = 'Dir({\n'
  Object.keys(contents).forEach(function (filename, ii, keys) {
    var key = asObjectKey(filename)
    var value = modelToString(contents[filename], indent + '  ')
    output += indent + '  ' + key + ': ' + value
    if (ii < keys.length - 1) output += ','
    output += '\n'
  })
  return output + indent + '})'
}

function fileToString (content, indent) {
  if (content.length === 0) return "File('')"
  var output = 'File('
  try {
    var jsonStr = outputAsJSON(indent + '  ', content)
    if (/^[\[{]/.test(jsonStr)) {
      output += jsonStr.replace(/\s\s([}\]])$/, '$1)')
    } else {
      output += jsonStr + '\n' + indent + '  )'
    }
  } catch (ex) {
    if (/[^\-\w\s~`!@#$%^&*()_=+[\]{}|\\;:'",./<>?]/.test(content.toString())) {
      output += outputAsBuffer(indent + '  ', content)
          .replace(/[)]$/, '\n' + indent + '))')
    } else {
      output += outputAsText(indent + '  ', content) +
          '\n' + indent + ')'
    }
  }
  return output
}

function outputAsJSON (indent, content) {
  var parsed = JSON.parse(content)
  return asLiteral(parsed).replace(/\n/g, '\n' + indent)
}

function outputAsText (indent, content) {
  content = content.toString('utf8')
  var endsInNewLine = /\n$/.test(content)
  var lines = content.split(/\n/).map(function (line) { return line + '\n' })
  if (endsInNewLine) lines.pop()
  var output = '\n' + indent + asLiteral(lines.shift())
  lines.forEach(function (line) {
    output += ' +\n' + indent + asLiteral(line)
  })
  return output
}

function outputAsBuffer (indent, content) {
  var chunks = content.toString('hex').match(/.{1,60}/g)
  var output = 'new Buffer(\n'
  output += indent + "'" + chunks.shift() + "'"
  chunks.forEach(function (chunk) {
    output += ' +\n' + indent + "'" + chunk + "'"
  })
  output += ',\n' + indent + "'hex')"
  return output
}

function asObjectKey (key) {
  var isIdent = /^[a-zA-Z$_][a-zA-Z$_0-9]+$/.test(key)
  return isIdent ? key : asLiteral(key)
}

function asLiteral (thing) {
  if (thing === null) return 'null'
  if (thing == null) return 'undefined'
  if (typeof thing === 'boolean' || typeof thing === 'number') {
    return thing.toString()
  } else if (typeof thing === 'string') {
    return asStringLiteral(thing)
  } else if (thing instanceof Array) {
    return asArrayLiteral(thing)
  } else {
    return asObjectLiteral(thing)
  }
}

function asStringLiteral (thing) {
  var str = thing.toString()
    .replace(/\\/g, '\\\\')
    .replace(/[\0]/g, '\\0')
    .replace(/[\b]/g, '\\b')
    .replace(/[\f]/g, '\\f')
    .replace(/[\n]/g, '\\n')
    .replace(/[\r]/g, '\\r')
    .replace(/[\t]/g, '\\t')
    .replace(/[\v]/g, '\\v')
  if (/'/.test(str) && !/"/.test(str)) {
    return '"' + str + '"'
  } else {
    return "'" + str.replace(/'/g, "\\'") + "'"
  }
}

function asArrayLiteral (thing) {
  if (!thing.length) return '[ ]'
  var arr = '[\n'
  function arrayItem (item) {
    return asLiteral(item).replace(/\n(.*)(?=\n)/g, '\n  $1')
  }
  arr += arrayItem(thing.shift())
  thing.forEach(function (item) {
    arr += ',\n' + arrayItem(item)
  })
  arr += '\n]'
  return arr
}

function asObjectLiteral (thing) {
  var keys = Object.keys(thing)
  if (!keys.length) return '{ }'
  var obj = '{\n'
  function objectValue (key) {
    return asObjectKey(key) + ': ' + asLiteral(thing[key]).replace(/\n(.*)(?=\n)/g, '\n  $1')
  }
  obj += objectValue(keys.shift())
  keys.forEach(function (key) {
    obj += ',\n' + objectValue(key)
  })
  obj += '\n}'
  return obj
}
