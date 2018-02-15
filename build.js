var fs = require("fs")
var browserify = require("browserify")

const srcDir = 'src/'
const buildDir = 'dist/'
const babelPresets = ["env", "react"]

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
  
  fs.open(baseOutPath + '.js', 'wx', (err, fd) => {
    console.log(`\n***${name}***`)
    if (err) {
      console.log(`Omitting debug version package ${baseOutPath}.js (file exists)`)
      return
    } else {
      console.log(`Creating debug version package ${baseOutPath}.js`)
    }
    var bundleFs = fs.createWriteStream('', { fd: fd })
    browserify(srcDir + name + '.js', {
      standalone: standaloneName,
      debug: true
    }).transform("babelify", {presets: babelPresets})
      .bundle()
      .pipe(bundleFs)
  })

  fs.open(baseOutPath + '.min.js', 'wx', (err, fd) => {
    if (err) {
      console.log(`Omitting minified package ${baseOutPath}.min.js (file exists)`)
      return
    } else {
      console.log(`Creating minified package ${baseOutPath}.min.js`)
    }
    bundleFs = fs.createWriteStream('', { fd: fd })
    browserify(srcDir + name + '.js', {
      standalone: standaloneName,
    }).transform("babelify", {presets: babelPresets})
      .transform('uglifyify', { global: true  })
      .bundle()
      .pipe(bundleFs)
  })
})



  
