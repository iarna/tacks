## tacks

Generate fixture modules from folders

### USAGE

Generate a fixture from a folder on disk:

```
tacks /path/to/fixture/example > example.js
```

Create and destroy the fixture from your tests:

```
var example = require('./example.js')
example.create('/tmp/fixture/path')
…
example.remove('/tmp/fixture/path')
```

### STATUS

This is very much a "release early" type release.  Still very much in
progress.

### CLASSES

These are used in the generated code. It's totally legit to write them directly though.

```
var Tacks = require('tacks')
```

#### var fixture = new Tacks(dir)

Create a new fixture object based on a `Dir` object, see below.

#### fixture.create('/path/to/fixture')

Take the directory and files described by the fixture and create it in `/path/to/fixture`

#### fixture.remove('/path/to/fixture')

Cleanup a fixture we installed in `/path/to/fixture`.

#### var dir = Tacks.Dir(dirspec)

Creates a new `Dir` object for consumption by `new Tacks`.  `dirspec` is a
object whose properties are the names of files in a directory and whose
values are either `File` objects or `Dir` objects.

#### var file = Tacks.File(filespec)

Creates a new `File` object for use in `Dir` objects. `filespec` can be
either a `String`, a `Buffer` or an `Object`. In the last case, it
will be stringified with `JSON.stringify` before writing it to disk

#### var fixturestr = Tacks.generateFromDir(dir)

This is what's used by the commandline– it generates javascript as a string
from a directory on disk.  It works hard to produce something that looks
like it might have been typed by a human– It translates JSON on disk into
object literals.  And it doesn't quote property names in object literals
unless it has to.  It uses single quotes when it can.  It double quotes when
it has to, and escapes when it has no other choice. It includs plain text
as strings concatenated one per line. For everything else it makes Buffer
objects using hex encoded strings as input.

### WANT TO HAVES

These are things I'll do sooner or late myself.

* Add `yargs` to the command line to have some basic affordances.
* Include adding a `.mockFs('/tmp/fixture/path/')` function which returns a
  patched version of `fs` that, for attempts to read from `/tmp/fixture/path`
  returns data from the in memory fixture instead of looking at the
  filesystem.  For injection into tested modules with something like
  `require-inject`.

### NICE TO HAVES

I'd love to see these, but I may never get time to do them myself.  If
someone else did them though…

* Having some way to control the formatting of the generated output would be
  nice for folks who don't use `standard`… eg, semicolons, indentation,
  default quoting. The right answer might be to generate AST objects for
  use by an existing formatter. Relatedly, it'd be nice to have some
  standard extension method for the generated sourcecode. Right now I make
  use of it just by concattenating source code.

