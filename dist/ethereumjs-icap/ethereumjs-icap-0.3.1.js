(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ethereumjs = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// base-x encoding
// Forked from https://github.com/cryptocoinjs/bs58
// Originally written by Mike Hearn for BitcoinJ
// Copyright (c) 2011 Google Inc
// Ported to JavaScript by Stefan Thomas
// Merged Buffer refactorings from base58-native by Stephen Pair
// Copyright (c) 2013 BitPay Inc

module.exports = function base (ALPHABET) {
  var ALPHABET_MAP = {}
  var BASE = ALPHABET.length
  var LEADER = ALPHABET.charAt(0)

  // pre-compute lookup table
  for (var i = 0; i < ALPHABET.length; i++) {
    ALPHABET_MAP[ALPHABET.charAt(i)] = i
  }

  function encode (source) {
    if (source.length === 0) return ''

    var digits = [0]
    for (var i = 0; i < source.length; ++i) {
      for (var j = 0, carry = source[i]; j < digits.length; ++j) {
        carry += digits[j] << 8
        digits[j] = carry % BASE
        carry = (carry / BASE) | 0
      }

      while (carry > 0) {
        digits.push(carry % BASE)
        carry = (carry / BASE) | 0
      }
    }

    var string = ''

    // deal with leading zeros
    for (var k = 0; source[k] === 0 && k < source.length - 1; ++k) string += ALPHABET[0]
    // convert digits to a string
    for (var q = digits.length - 1; q >= 0; --q) string += ALPHABET[digits[q]]

    return string
  }

  function decodeUnsafe (string) {
    if (string.length === 0) return []

    var bytes = [0]
    for (var i = 0; i < string.length; i++) {
      var value = ALPHABET_MAP[string[i]]
      if (value === undefined) return

      for (var j = 0, carry = value; j < bytes.length; ++j) {
        carry += bytes[j] * BASE
        bytes[j] = carry & 0xff
        carry >>= 8
      }

      while (carry > 0) {
        bytes.push(carry & 0xff)
        carry >>= 8
      }
    }

    // deal with leading zeros
    for (var k = 0; string[k] === LEADER && k < string.length - 1; ++k) {
      bytes.push(0)
    }

    return bytes.reverse()
  }

  function decode (string) {
    var array = decodeUnsafe(string)
    if (array) return array

    throw new Error('Non-base' + BASE + ' character')
  }

  return {
    encode: encode,
    decodeUnsafe: decodeUnsafe,
    decode: decode
  }
}

},{}],2:[function(require,module,exports){
!function(globals) {
'use strict'

var convertHex = {
  bytesToHex: function(bytes) {
    /*if (typeof bytes.byteLength != 'undefined') {
      var newBytes = []

      if (typeof bytes.buffer != 'undefined')
        bytes = new DataView(bytes.buffer)
      else
        bytes = new DataView(bytes)

      for (var i = 0; i < bytes.byteLength; ++i) {
        newBytes.push(bytes.getUint8(i))
      }
      bytes = newBytes
    }*/
    return arrBytesToHex(bytes)
  },
  hexToBytes: function(hex) {
    if (hex.length % 2 === 1) throw new Error("hexToBytes can't have a string with an odd number of characters.")
    if (hex.indexOf('0x') === 0) hex = hex.slice(2)
    return hex.match(/../g).map(function(x) { return parseInt(x,16) })
  }
}


// PRIVATE

function arrBytesToHex(bytes) {
  return bytes.map(function(x) { return padLeft(x.toString(16),2) }).join('')
}

function padLeft(orig, len) {
  if (orig.length > len) return orig
  return Array(len - orig.length + 1).join('0') + orig
}


if (typeof module !== 'undefined' && module.exports) { //CommonJS
  module.exports = convertHex
} else {
  globals.convertHex = convertHex
}

}(this);
},{}],3:[function(require,module,exports){
var hex = require('convert-hex')

// For simplicity we redefine it, as the default uses lowercase
var BASE36_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
var bs36 = require('base-x')(BASE36_ALPHABET)

var ICAP = {}

ICAP.decodeBBAN = function (bban) {
  var length = bban.length
  if (length === 30 || length === 31) {
    var tmp = hex.bytesToHex(bs36.decode(bban))

    // FIXME: horrible padding code
    while (tmp.length < 40) {
      tmp = '0' + tmp
    }

    // NOTE: certain tools include an extra leading 0, drop that
    if ((tmp.length === 42) && (tmp[0] === '0') && (tmp[1] === '0')) {
      tmp = tmp.slice(2)
    }

    return '0x' + tmp
  } else if (length === 16) {
    return {
      asset: bban.slice(0, 3),
      institution: bban.slice(3, 7),
      client: bban.slice(7, 16)
    }
  } else {
    throw new Error('Not a valid Ethereum BBAN')
  }
}

ICAP.encodeBBAN = function (bban) {
  if (typeof bban === 'object') {
    if (bban.asset.length !== 3 ||
        bban.institution.length !== 4 ||
        bban.client.length !== 9) {
      throw new Error('Invalid \'indirect\' Ethereum BBAN')
    }
    return [ bban.asset, bban.institution, bban.client ].join('').toUpperCase()
  } else if ((bban.length === 42) && (bban[0] === '0') && (bban[1] === 'x')) {
    // Workaround for base-x, see https://github.com/cryptocoinjs/base-x/issues/18
    if ((bban[2] === '0') && (bban[3] === '0')) {
      bban = '0x' + bban.slice(4)
    }

    return bs36.encode(hex.hexToBytes(bban))
  } else {
    throw new Error('Not a valid input for Ethereum BBAN')
  }
}

// ISO13616 reordering and letter translation
// NOTE: we assume input is uppercase only
// based off code from iban.js
function prepare (iban) {
  // move front to the back
  iban = iban.slice(4) + iban.slice(0, 4)

  // translate letters to numbers
  return iban.split('').map(function (n) {
    var code = n.charCodeAt(0)
    // 65 == A, 90 == Z in ASCII
    if (code >= 65 && code <= 90) {
      // A = 10, B = 11, ... Z = 35
      return code - 65 + 10
    } else {
      return n
    }
  }).join('')
}

// Calculate ISO7064 mod 97-10
// NOTE: assumes all numeric input string
function mod9710 (input) {
  var m = 0
  for (var i = 0; i < input.length; i++) {
    m *= 10
    m += input.charCodeAt(i) - 48 // parseInt()
    m %= 97
  }
  return m
}

ICAP.encode = function (bban, print) {
  bban = ICAP.encodeBBAN(bban)

  var checksum = 98 - mod9710(prepare('XE00' + bban))

  // format into 2 digits
  checksum = ('0' + checksum).slice(-2)

  var iban = 'XE' + checksum + bban
  if (print === true) {
    // split a group of 4 chars with spaces
    iban = iban.replace(/(.{4})/g, '$1 ')
  }

  return iban
}

ICAP.decode = function (iban, novalidity) {
  // change from 'print format' to 'electronic format', e.g. remove spaces
  iban = iban.replace(/\ /g, '')

  // check for validity
  if (!novalidity) {
    if (iban.slice(0, 2) !== 'XE') {
      throw new Error('Not in ICAP format')
    }

    if (mod9710(prepare(iban)) !== 1) {
      throw new Error('Invalid checksum in IBAN')
    }
  }

  return ICAP.decodeBBAN(iban.slice(4, 35))
}

/*
 * Convert Ethereum address to ICAP
 * @method fromAddress
 * @param {String} address Address as a hex string.
 * @param {bool} nonstd Accept address which will result in non-standard IBAN
 * @returns {String}
 */
ICAP.fromAddress = function (address, print, nonstd) {
  var ret = ICAP.encode(address, print)

  if ((ret.replace(' ', '').length !== 34) && (nonstd !== true)) {
    throw new Error('Supplied address will result in invalid an IBAN')
  }

  return ret
}

/*
 * Convert asset into ICAP
 * @method fromAsset
 * @param {Object} asset Asset object, must contain the fields asset, institution and client
 * @returns {String}
 */
ICAP.fromAsset = function (asset, print) {
  return ICAP.encode(asset, print)
}

/*
 * Convert an ICAP into an address
 * @method toAddress
 * @param {String} iban IBAN/ICAP, must have an address encoded
 * @returns {String}
 */
ICAP.toAddress = function (iban) {
  var address = ICAP.decode(iban)
  if (typeof address !== 'string') {
    throw new Error('Not an address-encoded ICAP')
  }
  return address
}

/*
 * Convert an ICAP into an asset
 * @method toAsset
 * @param {String} iban IBAN/ICAP, must have an asset encoded
 * @returns {Object}
 */
ICAP.toAsset = function (iban) {
  var asset = ICAP.decode(iban)
  if (typeof asset !== 'object') {
    throw new Error('Not an asset-encoded ICAP')
  }
  return asset
}

ICAP.isICAP = function (iban) {
  try {
    ICAP.decode(iban)
    return true
  } catch (e) {
    return false
  }
}

ICAP.isAddress = function (iban) {
  try {
    ICAP.toAddress(iban)
    return true
  } catch (e) {
    return false
  }
}

ICAP.isAsset = function (iban) {
  try {
    ICAP.toAsset(iban)
    return true
  } catch (e) {
    return false
  }
}

module.exports = ICAP

},{"base-x":1,"convert-hex":2}],4:[function(require,module,exports){
'use strict';

module.exports = {
  ICAP: require('ethereumjs-icap')
};

},{"ethereumjs-icap":3}]},{},[4])(4)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYmFzZS14L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NvbnZlcnQtaGV4L2NvbnZlcnQtaGV4LmpzIiwibm9kZV9tb2R1bGVzL2V0aGVyZXVtanMtaWNhcC9pbmRleC5qcyIsInNyYy9ldGhlcmV1bWpzLWljYXAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM3TUEsT0FBTyxPQUFQLEdBQWlCO0FBQ2YsUUFBTSxRQUFRLGlCQUFSO0FBRFMsQ0FBakIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gYmFzZS14IGVuY29kaW5nXG4vLyBGb3JrZWQgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vY3J5cHRvY29pbmpzL2JzNThcbi8vIE9yaWdpbmFsbHkgd3JpdHRlbiBieSBNaWtlIEhlYXJuIGZvciBCaXRjb2luSlxuLy8gQ29weXJpZ2h0IChjKSAyMDExIEdvb2dsZSBJbmNcbi8vIFBvcnRlZCB0byBKYXZhU2NyaXB0IGJ5IFN0ZWZhbiBUaG9tYXNcbi8vIE1lcmdlZCBCdWZmZXIgcmVmYWN0b3JpbmdzIGZyb20gYmFzZTU4LW5hdGl2ZSBieSBTdGVwaGVuIFBhaXJcbi8vIENvcHlyaWdodCAoYykgMjAxMyBCaXRQYXkgSW5jXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gYmFzZSAoQUxQSEFCRVQpIHtcbiAgdmFyIEFMUEhBQkVUX01BUCA9IHt9XG4gIHZhciBCQVNFID0gQUxQSEFCRVQubGVuZ3RoXG4gIHZhciBMRUFERVIgPSBBTFBIQUJFVC5jaGFyQXQoMClcblxuICAvLyBwcmUtY29tcHV0ZSBsb29rdXAgdGFibGVcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBBTFBIQUJFVC5sZW5ndGg7IGkrKykge1xuICAgIEFMUEhBQkVUX01BUFtBTFBIQUJFVC5jaGFyQXQoaSldID0gaVxuICB9XG5cbiAgZnVuY3Rpb24gZW5jb2RlIChzb3VyY2UpIHtcbiAgICBpZiAoc291cmNlLmxlbmd0aCA9PT0gMCkgcmV0dXJuICcnXG5cbiAgICB2YXIgZGlnaXRzID0gWzBdXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzb3VyY2UubGVuZ3RoOyArK2kpIHtcbiAgICAgIGZvciAodmFyIGogPSAwLCBjYXJyeSA9IHNvdXJjZVtpXTsgaiA8IGRpZ2l0cy5sZW5ndGg7ICsraikge1xuICAgICAgICBjYXJyeSArPSBkaWdpdHNbal0gPDwgOFxuICAgICAgICBkaWdpdHNbal0gPSBjYXJyeSAlIEJBU0VcbiAgICAgICAgY2FycnkgPSAoY2FycnkgLyBCQVNFKSB8IDBcbiAgICAgIH1cblxuICAgICAgd2hpbGUgKGNhcnJ5ID4gMCkge1xuICAgICAgICBkaWdpdHMucHVzaChjYXJyeSAlIEJBU0UpXG4gICAgICAgIGNhcnJ5ID0gKGNhcnJ5IC8gQkFTRSkgfCAwXG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHN0cmluZyA9ICcnXG5cbiAgICAvLyBkZWFsIHdpdGggbGVhZGluZyB6ZXJvc1xuICAgIGZvciAodmFyIGsgPSAwOyBzb3VyY2Vba10gPT09IDAgJiYgayA8IHNvdXJjZS5sZW5ndGggLSAxOyArK2spIHN0cmluZyArPSBBTFBIQUJFVFswXVxuICAgIC8vIGNvbnZlcnQgZGlnaXRzIHRvIGEgc3RyaW5nXG4gICAgZm9yICh2YXIgcSA9IGRpZ2l0cy5sZW5ndGggLSAxOyBxID49IDA7IC0tcSkgc3RyaW5nICs9IEFMUEhBQkVUW2RpZ2l0c1txXV1cblxuICAgIHJldHVybiBzdHJpbmdcbiAgfVxuXG4gIGZ1bmN0aW9uIGRlY29kZVVuc2FmZSAoc3RyaW5nKSB7XG4gICAgaWYgKHN0cmluZy5sZW5ndGggPT09IDApIHJldHVybiBbXVxuXG4gICAgdmFyIGJ5dGVzID0gWzBdXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHJpbmcubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB2YWx1ZSA9IEFMUEhBQkVUX01BUFtzdHJpbmdbaV1dXG4gICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkgcmV0dXJuXG5cbiAgICAgIGZvciAodmFyIGogPSAwLCBjYXJyeSA9IHZhbHVlOyBqIDwgYnl0ZXMubGVuZ3RoOyArK2opIHtcbiAgICAgICAgY2FycnkgKz0gYnl0ZXNbal0gKiBCQVNFXG4gICAgICAgIGJ5dGVzW2pdID0gY2FycnkgJiAweGZmXG4gICAgICAgIGNhcnJ5ID4+PSA4XG4gICAgICB9XG5cbiAgICAgIHdoaWxlIChjYXJyeSA+IDApIHtcbiAgICAgICAgYnl0ZXMucHVzaChjYXJyeSAmIDB4ZmYpXG4gICAgICAgIGNhcnJ5ID4+PSA4XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gZGVhbCB3aXRoIGxlYWRpbmcgemVyb3NcbiAgICBmb3IgKHZhciBrID0gMDsgc3RyaW5nW2tdID09PSBMRUFERVIgJiYgayA8IHN0cmluZy5sZW5ndGggLSAxOyArK2spIHtcbiAgICAgIGJ5dGVzLnB1c2goMClcbiAgICB9XG5cbiAgICByZXR1cm4gYnl0ZXMucmV2ZXJzZSgpXG4gIH1cblxuICBmdW5jdGlvbiBkZWNvZGUgKHN0cmluZykge1xuICAgIHZhciBhcnJheSA9IGRlY29kZVVuc2FmZShzdHJpbmcpXG4gICAgaWYgKGFycmF5KSByZXR1cm4gYXJyYXlcblxuICAgIHRocm93IG5ldyBFcnJvcignTm9uLWJhc2UnICsgQkFTRSArICcgY2hhcmFjdGVyJylcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgZW5jb2RlOiBlbmNvZGUsXG4gICAgZGVjb2RlVW5zYWZlOiBkZWNvZGVVbnNhZmUsXG4gICAgZGVjb2RlOiBkZWNvZGVcbiAgfVxufVxuIiwiIWZ1bmN0aW9uKGdsb2JhbHMpIHtcbid1c2Ugc3RyaWN0J1xuXG52YXIgY29udmVydEhleCA9IHtcbiAgYnl0ZXNUb0hleDogZnVuY3Rpb24oYnl0ZXMpIHtcbiAgICAvKmlmICh0eXBlb2YgYnl0ZXMuYnl0ZUxlbmd0aCAhPSAndW5kZWZpbmVkJykge1xuICAgICAgdmFyIG5ld0J5dGVzID0gW11cblxuICAgICAgaWYgKHR5cGVvZiBieXRlcy5idWZmZXIgIT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgIGJ5dGVzID0gbmV3IERhdGFWaWV3KGJ5dGVzLmJ1ZmZlcilcbiAgICAgIGVsc2VcbiAgICAgICAgYnl0ZXMgPSBuZXcgRGF0YVZpZXcoYnl0ZXMpXG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYnl0ZXMuYnl0ZUxlbmd0aDsgKytpKSB7XG4gICAgICAgIG5ld0J5dGVzLnB1c2goYnl0ZXMuZ2V0VWludDgoaSkpXG4gICAgICB9XG4gICAgICBieXRlcyA9IG5ld0J5dGVzXG4gICAgfSovXG4gICAgcmV0dXJuIGFyckJ5dGVzVG9IZXgoYnl0ZXMpXG4gIH0sXG4gIGhleFRvQnl0ZXM6IGZ1bmN0aW9uKGhleCkge1xuICAgIGlmIChoZXgubGVuZ3RoICUgMiA9PT0gMSkgdGhyb3cgbmV3IEVycm9yKFwiaGV4VG9CeXRlcyBjYW4ndCBoYXZlIGEgc3RyaW5nIHdpdGggYW4gb2RkIG51bWJlciBvZiBjaGFyYWN0ZXJzLlwiKVxuICAgIGlmIChoZXguaW5kZXhPZignMHgnKSA9PT0gMCkgaGV4ID0gaGV4LnNsaWNlKDIpXG4gICAgcmV0dXJuIGhleC5tYXRjaCgvLi4vZykubWFwKGZ1bmN0aW9uKHgpIHsgcmV0dXJuIHBhcnNlSW50KHgsMTYpIH0pXG4gIH1cbn1cblxuXG4vLyBQUklWQVRFXG5cbmZ1bmN0aW9uIGFyckJ5dGVzVG9IZXgoYnl0ZXMpIHtcbiAgcmV0dXJuIGJ5dGVzLm1hcChmdW5jdGlvbih4KSB7IHJldHVybiBwYWRMZWZ0KHgudG9TdHJpbmcoMTYpLDIpIH0pLmpvaW4oJycpXG59XG5cbmZ1bmN0aW9uIHBhZExlZnQob3JpZywgbGVuKSB7XG4gIGlmIChvcmlnLmxlbmd0aCA+IGxlbikgcmV0dXJuIG9yaWdcbiAgcmV0dXJuIEFycmF5KGxlbiAtIG9yaWcubGVuZ3RoICsgMSkuam9pbignMCcpICsgb3JpZ1xufVxuXG5cbmlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiBtb2R1bGUuZXhwb3J0cykgeyAvL0NvbW1vbkpTXG4gIG1vZHVsZS5leHBvcnRzID0gY29udmVydEhleFxufSBlbHNlIHtcbiAgZ2xvYmFscy5jb252ZXJ0SGV4ID0gY29udmVydEhleFxufVxuXG59KHRoaXMpOyIsInZhciBoZXggPSByZXF1aXJlKCdjb252ZXJ0LWhleCcpXG5cbi8vIEZvciBzaW1wbGljaXR5IHdlIHJlZGVmaW5lIGl0LCBhcyB0aGUgZGVmYXVsdCB1c2VzIGxvd2VyY2FzZVxudmFyIEJBU0UzNl9BTFBIQUJFVCA9ICcwMTIzNDU2Nzg5QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVonXG52YXIgYnMzNiA9IHJlcXVpcmUoJ2Jhc2UteCcpKEJBU0UzNl9BTFBIQUJFVClcblxudmFyIElDQVAgPSB7fVxuXG5JQ0FQLmRlY29kZUJCQU4gPSBmdW5jdGlvbiAoYmJhbikge1xuICB2YXIgbGVuZ3RoID0gYmJhbi5sZW5ndGhcbiAgaWYgKGxlbmd0aCA9PT0gMzAgfHwgbGVuZ3RoID09PSAzMSkge1xuICAgIHZhciB0bXAgPSBoZXguYnl0ZXNUb0hleChiczM2LmRlY29kZShiYmFuKSlcblxuICAgIC8vIEZJWE1FOiBob3JyaWJsZSBwYWRkaW5nIGNvZGVcbiAgICB3aGlsZSAodG1wLmxlbmd0aCA8IDQwKSB7XG4gICAgICB0bXAgPSAnMCcgKyB0bXBcbiAgICB9XG5cbiAgICAvLyBOT1RFOiBjZXJ0YWluIHRvb2xzIGluY2x1ZGUgYW4gZXh0cmEgbGVhZGluZyAwLCBkcm9wIHRoYXRcbiAgICBpZiAoKHRtcC5sZW5ndGggPT09IDQyKSAmJiAodG1wWzBdID09PSAnMCcpICYmICh0bXBbMV0gPT09ICcwJykpIHtcbiAgICAgIHRtcCA9IHRtcC5zbGljZSgyKVxuICAgIH1cblxuICAgIHJldHVybiAnMHgnICsgdG1wXG4gIH0gZWxzZSBpZiAobGVuZ3RoID09PSAxNikge1xuICAgIHJldHVybiB7XG4gICAgICBhc3NldDogYmJhbi5zbGljZSgwLCAzKSxcbiAgICAgIGluc3RpdHV0aW9uOiBiYmFuLnNsaWNlKDMsIDcpLFxuICAgICAgY2xpZW50OiBiYmFuLnNsaWNlKDcsIDE2KVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBhIHZhbGlkIEV0aGVyZXVtIEJCQU4nKVxuICB9XG59XG5cbklDQVAuZW5jb2RlQkJBTiA9IGZ1bmN0aW9uIChiYmFuKSB7XG4gIGlmICh0eXBlb2YgYmJhbiA9PT0gJ29iamVjdCcpIHtcbiAgICBpZiAoYmJhbi5hc3NldC5sZW5ndGggIT09IDMgfHxcbiAgICAgICAgYmJhbi5pbnN0aXR1dGlvbi5sZW5ndGggIT09IDQgfHxcbiAgICAgICAgYmJhbi5jbGllbnQubGVuZ3RoICE9PSA5KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgXFwnaW5kaXJlY3RcXCcgRXRoZXJldW0gQkJBTicpXG4gICAgfVxuICAgIHJldHVybiBbIGJiYW4uYXNzZXQsIGJiYW4uaW5zdGl0dXRpb24sIGJiYW4uY2xpZW50IF0uam9pbignJykudG9VcHBlckNhc2UoKVxuICB9IGVsc2UgaWYgKChiYmFuLmxlbmd0aCA9PT0gNDIpICYmIChiYmFuWzBdID09PSAnMCcpICYmIChiYmFuWzFdID09PSAneCcpKSB7XG4gICAgLy8gV29ya2Fyb3VuZCBmb3IgYmFzZS14LCBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2NyeXB0b2NvaW5qcy9iYXNlLXgvaXNzdWVzLzE4XG4gICAgaWYgKChiYmFuWzJdID09PSAnMCcpICYmIChiYmFuWzNdID09PSAnMCcpKSB7XG4gICAgICBiYmFuID0gJzB4JyArIGJiYW4uc2xpY2UoNClcbiAgICB9XG5cbiAgICByZXR1cm4gYnMzNi5lbmNvZGUoaGV4LmhleFRvQnl0ZXMoYmJhbikpXG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgYSB2YWxpZCBpbnB1dCBmb3IgRXRoZXJldW0gQkJBTicpXG4gIH1cbn1cblxuLy8gSVNPMTM2MTYgcmVvcmRlcmluZyBhbmQgbGV0dGVyIHRyYW5zbGF0aW9uXG4vLyBOT1RFOiB3ZSBhc3N1bWUgaW5wdXQgaXMgdXBwZXJjYXNlIG9ubHlcbi8vIGJhc2VkIG9mZiBjb2RlIGZyb20gaWJhbi5qc1xuZnVuY3Rpb24gcHJlcGFyZSAoaWJhbikge1xuICAvLyBtb3ZlIGZyb250IHRvIHRoZSBiYWNrXG4gIGliYW4gPSBpYmFuLnNsaWNlKDQpICsgaWJhbi5zbGljZSgwLCA0KVxuXG4gIC8vIHRyYW5zbGF0ZSBsZXR0ZXJzIHRvIG51bWJlcnNcbiAgcmV0dXJuIGliYW4uc3BsaXQoJycpLm1hcChmdW5jdGlvbiAobikge1xuICAgIHZhciBjb2RlID0gbi5jaGFyQ29kZUF0KDApXG4gICAgLy8gNjUgPT0gQSwgOTAgPT0gWiBpbiBBU0NJSVxuICAgIGlmIChjb2RlID49IDY1ICYmIGNvZGUgPD0gOTApIHtcbiAgICAgIC8vIEEgPSAxMCwgQiA9IDExLCAuLi4gWiA9IDM1XG4gICAgICByZXR1cm4gY29kZSAtIDY1ICsgMTBcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG5cbiAgICB9XG4gIH0pLmpvaW4oJycpXG59XG5cbi8vIENhbGN1bGF0ZSBJU083MDY0IG1vZCA5Ny0xMFxuLy8gTk9URTogYXNzdW1lcyBhbGwgbnVtZXJpYyBpbnB1dCBzdHJpbmdcbmZ1bmN0aW9uIG1vZDk3MTAgKGlucHV0KSB7XG4gIHZhciBtID0gMFxuICBmb3IgKHZhciBpID0gMDsgaSA8IGlucHV0Lmxlbmd0aDsgaSsrKSB7XG4gICAgbSAqPSAxMFxuICAgIG0gKz0gaW5wdXQuY2hhckNvZGVBdChpKSAtIDQ4IC8vIHBhcnNlSW50KClcbiAgICBtICU9IDk3XG4gIH1cbiAgcmV0dXJuIG1cbn1cblxuSUNBUC5lbmNvZGUgPSBmdW5jdGlvbiAoYmJhbiwgcHJpbnQpIHtcbiAgYmJhbiA9IElDQVAuZW5jb2RlQkJBTihiYmFuKVxuXG4gIHZhciBjaGVja3N1bSA9IDk4IC0gbW9kOTcxMChwcmVwYXJlKCdYRTAwJyArIGJiYW4pKVxuXG4gIC8vIGZvcm1hdCBpbnRvIDIgZGlnaXRzXG4gIGNoZWNrc3VtID0gKCcwJyArIGNoZWNrc3VtKS5zbGljZSgtMilcblxuICB2YXIgaWJhbiA9ICdYRScgKyBjaGVja3N1bSArIGJiYW5cbiAgaWYgKHByaW50ID09PSB0cnVlKSB7XG4gICAgLy8gc3BsaXQgYSBncm91cCBvZiA0IGNoYXJzIHdpdGggc3BhY2VzXG4gICAgaWJhbiA9IGliYW4ucmVwbGFjZSgvKC57NH0pL2csICckMSAnKVxuICB9XG5cbiAgcmV0dXJuIGliYW5cbn1cblxuSUNBUC5kZWNvZGUgPSBmdW5jdGlvbiAoaWJhbiwgbm92YWxpZGl0eSkge1xuICAvLyBjaGFuZ2UgZnJvbSAncHJpbnQgZm9ybWF0JyB0byAnZWxlY3Ryb25pYyBmb3JtYXQnLCBlLmcuIHJlbW92ZSBzcGFjZXNcbiAgaWJhbiA9IGliYW4ucmVwbGFjZSgvXFwgL2csICcnKVxuXG4gIC8vIGNoZWNrIGZvciB2YWxpZGl0eVxuICBpZiAoIW5vdmFsaWRpdHkpIHtcbiAgICBpZiAoaWJhbi5zbGljZSgwLCAyKSAhPT0gJ1hFJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgaW4gSUNBUCBmb3JtYXQnKVxuICAgIH1cblxuICAgIGlmIChtb2Q5NzEwKHByZXBhcmUoaWJhbikpICE9PSAxKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY2hlY2tzdW0gaW4gSUJBTicpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIElDQVAuZGVjb2RlQkJBTihpYmFuLnNsaWNlKDQsIDM1KSlcbn1cblxuLypcbiAqIENvbnZlcnQgRXRoZXJldW0gYWRkcmVzcyB0byBJQ0FQXG4gKiBAbWV0aG9kIGZyb21BZGRyZXNzXG4gKiBAcGFyYW0ge1N0cmluZ30gYWRkcmVzcyBBZGRyZXNzIGFzIGEgaGV4IHN0cmluZy5cbiAqIEBwYXJhbSB7Ym9vbH0gbm9uc3RkIEFjY2VwdCBhZGRyZXNzIHdoaWNoIHdpbGwgcmVzdWx0IGluIG5vbi1zdGFuZGFyZCBJQkFOXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG5JQ0FQLmZyb21BZGRyZXNzID0gZnVuY3Rpb24gKGFkZHJlc3MsIHByaW50LCBub25zdGQpIHtcbiAgdmFyIHJldCA9IElDQVAuZW5jb2RlKGFkZHJlc3MsIHByaW50KVxuXG4gIGlmICgocmV0LnJlcGxhY2UoJyAnLCAnJykubGVuZ3RoICE9PSAzNCkgJiYgKG5vbnN0ZCAhPT0gdHJ1ZSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1N1cHBsaWVkIGFkZHJlc3Mgd2lsbCByZXN1bHQgaW4gaW52YWxpZCBhbiBJQkFOJylcbiAgfVxuXG4gIHJldHVybiByZXRcbn1cblxuLypcbiAqIENvbnZlcnQgYXNzZXQgaW50byBJQ0FQXG4gKiBAbWV0aG9kIGZyb21Bc3NldFxuICogQHBhcmFtIHtPYmplY3R9IGFzc2V0IEFzc2V0IG9iamVjdCwgbXVzdCBjb250YWluIHRoZSBmaWVsZHMgYXNzZXQsIGluc3RpdHV0aW9uIGFuZCBjbGllbnRcbiAqIEByZXR1cm5zIHtTdHJpbmd9XG4gKi9cbklDQVAuZnJvbUFzc2V0ID0gZnVuY3Rpb24gKGFzc2V0LCBwcmludCkge1xuICByZXR1cm4gSUNBUC5lbmNvZGUoYXNzZXQsIHByaW50KVxufVxuXG4vKlxuICogQ29udmVydCBhbiBJQ0FQIGludG8gYW4gYWRkcmVzc1xuICogQG1ldGhvZCB0b0FkZHJlc3NcbiAqIEBwYXJhbSB7U3RyaW5nfSBpYmFuIElCQU4vSUNBUCwgbXVzdCBoYXZlIGFuIGFkZHJlc3MgZW5jb2RlZFxuICogQHJldHVybnMge1N0cmluZ31cbiAqL1xuSUNBUC50b0FkZHJlc3MgPSBmdW5jdGlvbiAoaWJhbikge1xuICB2YXIgYWRkcmVzcyA9IElDQVAuZGVjb2RlKGliYW4pXG4gIGlmICh0eXBlb2YgYWRkcmVzcyAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBhbiBhZGRyZXNzLWVuY29kZWQgSUNBUCcpXG4gIH1cbiAgcmV0dXJuIGFkZHJlc3Ncbn1cblxuLypcbiAqIENvbnZlcnQgYW4gSUNBUCBpbnRvIGFuIGFzc2V0XG4gKiBAbWV0aG9kIHRvQXNzZXRcbiAqIEBwYXJhbSB7U3RyaW5nfSBpYmFuIElCQU4vSUNBUCwgbXVzdCBoYXZlIGFuIGFzc2V0IGVuY29kZWRcbiAqIEByZXR1cm5zIHtPYmplY3R9XG4gKi9cbklDQVAudG9Bc3NldCA9IGZ1bmN0aW9uIChpYmFuKSB7XG4gIHZhciBhc3NldCA9IElDQVAuZGVjb2RlKGliYW4pXG4gIGlmICh0eXBlb2YgYXNzZXQgIT09ICdvYmplY3QnKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgYW4gYXNzZXQtZW5jb2RlZCBJQ0FQJylcbiAgfVxuICByZXR1cm4gYXNzZXRcbn1cblxuSUNBUC5pc0lDQVAgPSBmdW5jdGlvbiAoaWJhbikge1xuICB0cnkge1xuICAgIElDQVAuZGVjb2RlKGliYW4pXG4gICAgcmV0dXJuIHRydWVcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbklDQVAuaXNBZGRyZXNzID0gZnVuY3Rpb24gKGliYW4pIHtcbiAgdHJ5IHtcbiAgICBJQ0FQLnRvQWRkcmVzcyhpYmFuKVxuICAgIHJldHVybiB0cnVlXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5JQ0FQLmlzQXNzZXQgPSBmdW5jdGlvbiAoaWJhbikge1xuICB0cnkge1xuICAgIElDQVAudG9Bc3NldChpYmFuKVxuICAgIHJldHVybiB0cnVlXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IElDQVBcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICBJQ0FQOiByZXF1aXJlKCdldGhlcmV1bWpzLWljYXAnKVxufVxuIl19
