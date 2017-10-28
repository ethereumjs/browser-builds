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
  console.log('Running browserify for package ' + name + '...')
  var version = require('./node_modules/' + name + '/package.json').version
  var baseOutPath = buildDir + name + '/' + name + '-' + version
  
  console.log("Creating debug version package...")
  var bundleFs = fs.createWriteStream(baseOutPath + '.js')
  browserify(srcDir + name + '.js', {
    standalone: standaloneName,
    debug: true
  }).transform("babelify", {presets: ["es2015", "react"]})
    .bundle()
    .pipe(bundleFs)
  
  console.log("Creating minified package...")
  bundleFs = fs.createWriteStream(baseOutPath + '.min.js')
  browserify(srcDir + name + '.js', {
    standalone: standaloneName,
  }).transform("babelify", {presets: ["es2015", "react"]})
    .transform('uglifyify', { global: true  })
    .bundle()
    .pipe(bundleFs)
})



  
