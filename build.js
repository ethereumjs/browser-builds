var fs = require("fs")
var browserify = require("browserify")

const srcDir = 'src/'
const buildDir = 'dist/'

const standaloneName = 'ethereumjs'
const packages = [
  'ethereumjs-vm',
  'ethereumjs-tx',
  'ethereumjs-icap',
  'ethereumjs-wallet',
  'ethereumjs-abi'
]

packages.forEach(function(name) {
  var version = require('./node_modules/' + name + '/package.json').version
  var outPath = buildDir + name + '/' + name + '-' + version + '.js'
  var bundleFs = fs.createWriteStream(outPath)
  browserify(srcDir + name + '.js', {
    standalone: standaloneName
  })
    .bundle()
    .pipe(bundleFs)
})



  
