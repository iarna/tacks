'use strict'
var path = require('path')
var fs = require('graceful-fs')

module.exports = function generateFromDir (dir, indent) {
  if (!indent) {
    return "var Tacks = require('tacks')\n" +
      'var File = Tacks.File\n' +
      'var Dir = Tacks.Dir\n' +
      'module.exports = new Tacks(\n' +
      '  ' + generateFromDir(dir, '  ').replace(/,(\n\s+[})])/g, '$1') + '\n' +
      ')'
  }
  var output = 'Dir({\n'
  fs.readdirSync(dir).forEach(function (filename) {
    if (filename === '.git') return
    var filepath = path.join(dir, filename)
    var fileinfo = fs.statSync(filepath)
    output += indent + '  ' + asObjectKey(filename) + ': '
    if (fileinfo.isDirectory()) {
      output += generateFromDir(filepath, indent + '  ')
    } else {
      var content = fs.readFileSync(filepath)
      output += 'File('
      if (content.length === 0) {
        output += "'')"
      } else {
        try {
          var jsonStr = outputAsJSON(indent + '    ', content)
          if (/^[\[{]/.test(jsonStr)) {
            jsonStr = jsonStr.replace(/  ([}\]])$/, '$1)')
          } else {
            jsonStr += '\n' + indent + '  )'
          }
          output += jsonStr
        } catch (ex) {
          if (/[^\-\w\s~`!@#$%^&*()_=+[\]{}|\\;:'",./<>?]/.test(content.toString())) {
            output += outputAsBuffer(indent + '    ', content)
          } else {
            output += outputAsText(indent + '    ', content)
          }
          output += '\n' + indent + '  )'
        }
      }
    }
    output += ',\n'
  })
  return output + indent + '})'
}

function outputAsJSON (indent, content) {
  var parsed = JSON.parse(content)
  return asLiteral(parsed).replace(/\n/g, '\n' + indent)
}

function outputAsText (indent, content) {
  var endsInNewLine = /\n$/.test(content)
  var lines = content.toString('utf8').split(/\n/).map(function (line) { return line + '\n' })
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
  output += ", 'hex')"
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
