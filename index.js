'use strict'
var path = require('path')
var mkdirp = require('mkdirp')
var fs = require('graceful-fs')
var rimraf = require('rimraf')

var Tacks = module.exports = function (fixture) {
  this.fixture = fixture
  computeFixturePaths('/', fixture)
}
Tacks.prototype = {}

// add path properties to everything relative to the fixture root
function computeFixturePaths (entitypath, fixture) {
  fixture.path = entitypath.slice(1)
  if (fixture.type === 'dir') {
    Object.keys(fixture.contents).forEach(function (content) {
      computeFixturePaths(path.resolve(entitypath, content), fixture.contents[content])
    })
  } else if (fixture.type === 'file') {
    // do nothing
  } else {
    throw new Error('Unknown fixture type: ' + fixture.type)
  }
}

Tacks.File = function File (contents) {
  if (typeof contents === 'object' && !Buffer.isBuffer(contents)) {
    contents = JSON.stringify(contents)
  }
  return {
    type: 'file',
    contents: contents
  }
}

Tacks.Dir = function Dir (contents) {
  return {
    type: 'dir',
    contents: contents || {}
  }
}

Tacks.prototype.create = function (location, fixture) {
  var self = this
  if (!fixture) fixture = self.fixture
  if (fixture.type === 'dir') {
    var subdirpath = path.resolve(location, fixture.path)
    console.log('mkdirp', subdirpath)
    mkdirp.sync(subdirpath)
    Object.keys(fixture.contents).forEach(function (content) {
      self.create(location, fixture.contents[content])
    })
  } else if (fixture.type === 'file') {
    mkdirp.sync(path.resolve(location, fixture.path, '..'))
    console.log('write file', path.resolve(location, fixture.path))
    fs.writeFileSync(path.resolve(location, fixture.path), fixture.contents)
  } else {
    throw new Error('Unknown fixture type: ' + fixture.type)
  }
}

Tacks.prototype.remove = function (location) {
  rimraf.sync(location)
}

var generateFromDir = Tacks.generateFromDir = function (dir, indent) {
  if (!indent) {
    return "'use strict'\n" + 
      "var Tacks = require('underpinning')\n" +
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
    output += indent + '  ' + JSON.stringify(filename) + ': '
    if (fileinfo.isDirectory()) {
      output += generateFromDir(filepath, indent + '  ')
    } else {
      var content = fs.readFileSync(filepath)
      output += 'File('
      try {
        output += outputAsJSON(indent + '    ', content)
      } catch (ex) {
        if (/^LICENSE|^README|[.](js|md)$/.test(filename)) {
          output += outputAsText(indent + '    ', content)
        } else {
          output += outputAsBuffer(indent + '    ', content)
        }
      }
      output += '\n' + indent + '  )'
    }
    output += ',\n'
  })
  return output + indent + '})'
}

function outputAsJSON (indent, content) {
  var parsed = JSON.parse(content)
  return JSON.stringify(parsed, null, 2).replace(/\n/g, '\n' + indent)
}

function outputAsText (indent, content) {
  var endsInNewLine = /\n$/.test(content)
  var lines = content.toString('utf8').split(/\n/).map(function (line) { return line + '\n' })
  if (endsInNewLine) lines.pop()
  var output = '\n' + indent + JSON.stringify(lines.shift())
  lines.forEach(function (line) {
    output += ' +\n' + indent  + JSON.stringify(line)
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
