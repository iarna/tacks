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

### PLANS

Include adding a `.mockFs('/tmp/fixture/path/')` function which returns a
patched version of `fs` that, for attempts to read from `/tmp/fixture/path`
returns data from the in memory fixture instead of looking at the
filesystem.  For injection into tested modules with something like
`require-inject`.
