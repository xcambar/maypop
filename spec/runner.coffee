specFiles = [
  'index.coffee'
]




cs = require 'coffee-script-redux'
cs.register()
mocha = new (require 'mocha')();
mocha.reporter 'spec'
mocha.files = specFiles.map (f)->
  return [__dirname, f].join '/'
mocha.run process.exit
