var fs = require("fs")
var browserify = require("browserify")

const srcDir = 'src/'
const buildDir = 'dist/'

const standaloneName = 'ethereumjs'
const packages = [
  'ethereumjs-all',
  'ethereumjs-vm',
  'ethereumjs-tx',
  'ethereumjs-icap',
  'ethereumjs-wallet',
  'ethereumjs-wallet-hd',
  'ethereumjs-wallet-thirdparty',
  'ethereumjs-abi'
]

packages.forEach(function(name) {
  console.log('Running browserify for package ' + name + '...')
  var baseName = name.replace('-hd', '').replace('-thirdparty', '')
  var version
  if (name === 'ethereumjs-all') {
    var date = new Date()
    var day  = date.getDate()
    day = (day < 10 ? "0" : "") + day
    version = String(date.getFullYear()) + '-' + String(date.getMonth() + 1) + '-' + String(day)
  } else {
    version = require('./node_modules/' + baseName + '/package.json').version
  } 
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



  
