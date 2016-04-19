var fs = require('fs')
var path = require('path')
var test = require('tap').test
var rimraf = require('rimraf')
var loadFromDir = require('../load-from-dir.js')
var Tacks = require('../index.js')
var generateFromDir = Tacks.generateFromDir
var File = Tacks.File
var Dir = Tacks.Dir
var Symlink = Tacks.Symlink

var testroot = path.join(__dirname, path.basename(__filename, '.js'))
var testdir = path.join(testroot, 'example')
var testmodule = path.join(testroot, 'example.js')

var fixture = new Tacks(
  Dir({
    'a': Dir({
      'b': Dir({
        'c': Dir({
          'foo.txt': File(''),
          'bar.txt': Symlink('foo.txt'),
          'ascii.txt': Symlink('/ascii.txt')
        })
      })
    }),
    'ascii.txt': File(
      'abc\n'
    ),
    'foo': Dir({
      'foo.txt': Symlink('/a/b/c/foo.txt')
    }),
    'binary.gz': File(new Buffer(
      '1f8b0800d063115700034b4c4ae602004e81884704000000',
      'hex'
    )),
    'empty.txt': File(''),
    'example.json': File({
      'a': true,
      'b': 23,
      'c': 'xyzzy',
      'd': [],
      'e': {},
      'f': null,
      'complex': {
        'xyz': [1, 2, 3, { abc: 'def' }],
        '123': false
      }
    }),
    'x': Dir({
      'y': Dir({
        'z': Dir({
        })
      })
    })
  })
)

function setup () {
  fixture.create(testdir)
}

function cleanup () {
  fixture.remove(testdir)
}

test('setup', function (t) {
  cleanup()
  setup()
  t.done()
})

function compareObjs (t, actual, expected, msg) {
  if (expected === null) return t.is(expected, null, msg)
  if (typeof expected !== 'object') return t.is(expected, actual, msg)
  if (Buffer.isBuffer(expected)) return t.is(expected.compare(actual), 0, msg)
  t.is(Object.keys(actual).length, Object.keys(expected).length, msg + ' size')
  Object.keys(expected).forEach(function (key) {
    compareObjs(t, actual[key], expected[key], msg + ': ' + key)
  })
}

test('loadFromDir', function (t) {
  var model = loadFromDir(testdir)
  compareObjs(t, model, fixture, 'loadFromDir')
  t.done()
})

test('generateFromDir', function (t) {
  var js = generateFromDir(testdir)
  fs.writeFileSync(testmodule, js.replace(/'tacks'/g, "'../../index.js'"))
  var modelFromModule = require(testmodule)
  compareObjs(t, modelFromModule, fixture, 'generateFromDir')
  t.done()
})

test('cleanup', function (t) {
  cleanup()
  try {
    fs.statSync(testdir)
    t.fail(testdir + ' should not exist')
  } catch (ex) {
    t.pass(testdir + ' should not exist')
  }
  rimraf.sync(testroot)
  t.done()
})
