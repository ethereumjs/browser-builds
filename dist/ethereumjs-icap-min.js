(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.EthJS = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';module.exports=function(b){var c={},d=b.length,e=b.charAt(0);// pre-compute lookup table
for(var f=0;f<b.length;f++)c[b.charAt(f)]=f;return{encode:function encode(h){if(0===h.length)return'';var l=[0];for(var m=0;m<h.length;++m){for(var n=0,o=h[m];n<l.length;++n)o+=l[n]<<8,l[n]=o%d,o=0|o/d;for(;0<o;)l.push(o%d),o=0|o/d}// deal with leading zeros
for(var p=0;0===h[p]&&p<h.length-1;++p)l.push(0);// convert digits to a string
for(var q=0,r=l.length-1;q<=r;++q,--r){var s=b[l[q]];l[q]=b[l[r]],l[r]=s}return l.join('')},decode:function decode(h){if(0===h.length)return[];var l=[0];for(var m=0;m<h.length;m++){var n=c[h[m]];if(n===void 0)throw new Error('Non-base'+d+' character');for(var o=0,p=n;o<l.length;++o)p+=l[o]*d,l[o]=255&p,p>>=8;for(;0<p;)l.push(255&p),p>>=8}// deal with leading zeros
for(var q=0;h[q]===e&&q<h.length-1;++q)l.push(0);return l.reverse()}}};

},{}],2:[function(require,module,exports){
'use strict';!function(a){'use strict';// PRIVATE
function b(e){return e.map(function(f){return c(f.toString(16),2)}).join('')}function c(e,f){return e.length>f?e:Array(f-e.length+1).join('0')+e}var d={bytesToHex:function bytesToHex(e){/*if (typeof bytes.byteLength != 'undefined') {
      var newBytes = []

      if (typeof bytes.buffer != 'undefined')
        bytes = new DataView(bytes.buffer)
      else
        bytes = new DataView(bytes)

      for (var i = 0; i < bytes.byteLength; ++i) {
        newBytes.push(bytes.getUint8(i))
      }
      bytes = newBytes
    }*/return b(e)},hexToBytes:function hexToBytes(e){if(1==e.length%2)throw new Error('hexToBytes can\'t have a string with an odd number of characters.');return 0===e.indexOf('0x')&&(e=e.slice(2)),e.match(/../g).map(function(f){return parseInt(f,16)})}};'undefined'!=typeof module&&module.exports?module.exports=d:a.convertHex=d}(void 0);

},{}],3:[function(require,module,exports){
'use strict';var _typeof='function'==typeof Symbol&&'symbol'==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&'function'==typeof Symbol&&obj.constructor===Symbol?'symbol':typeof obj},hex=require('convert-hex'),BASE36_ALPHABET='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',bs36=require('base-x')(BASE36_ALPHABET),ICAP={};// For simplicity we redefine it, as the default uses lowercase
ICAP.decodeBBAN=function(a){var b=a.length;if(30===b||31===b){// FIXME: horrible padding code
for(var c=hex.bytesToHex(bs36.decode(a));40>c.length;)c='0'+c;// NOTE: certain tools include an extra leading 0, drop that
return 42===c.length&&'0'===c[0]&&'0'===c[1]&&(c=c.slice(2)),'0x'+c}if(16===b)return{asset:a.slice(0,3),institution:a.slice(3,7),client:a.slice(7,16)};throw new Error('Not a valid Ethereum BBAN')},ICAP.encodeBBAN=function(a){if('object'==('undefined'==typeof a?'undefined':_typeof(a))){if(3!==a.asset.length||4!==a.institution.length||9!==a.client.length)throw new Error('Invalid \'indirect\' Ethereum BBAN');return[a.asset,a.institution,a.client].join('').toUpperCase()}if(42===a.length&&'0'===a[0]&&'x'===a[1])return'0'===a[2]&&'0'===a[3]&&(a='0x'+a.slice(4)),bs36.encode(hex.hexToBytes(a));throw new Error('Not a valid input for Ethereum BBAN')};// ISO13616 reordering and letter translation
// NOTE: we assume input is uppercase only
// based off code from iban.js
function prepare(a){// translate letters to numbers
return a=a.slice(4)+a.slice(0,4),a.split('').map(function(b){var c=b.charCodeAt(0);// 65 == A, 90 == Z in ASCII
return 65<=c&&90>=c?c-65+10:b}).join('')}// Calculate ISO7064 mod 97-10
// NOTE: assumes all numeric input string
function mod9710(a){var b=0;for(var c=0;c<a.length;c++)b*=10,b+=a.charCodeAt(c)-48,b%=97;return b}ICAP.encode=function(a,b){a=ICAP.encodeBBAN(a);var c=98-mod9710(prepare('XE00'+a));// format into 2 digits
c=('0'+c).slice(-2);var d='XE'+c+a;return!0===b&&(d=d.replace(/(.{4})/g,'$1 ')),d},ICAP.decode=function(a,b){// check for validity
if(a=a.replace(/\ /g,''),!b){if('XE'!==a.slice(0,2))throw new Error('Not in ICAP format');if(1!==mod9710(prepare(a)))throw new Error('Invalid checksum in IBAN')}return ICAP.decodeBBAN(a.slice(4,35))},ICAP.fromAddress=function(a,b,c){var d=ICAP.encode(a,b);if(34!==d.replace(' ','').length&&!0!==c)throw new Error('Supplied address will result in invalid an IBAN');return d},ICAP.fromAsset=function(a,b){return ICAP.encode(a,b)},ICAP.toAddress=function(a){var b=ICAP.decode(a);if('string'!=typeof b)throw new Error('Not an address-encoded ICAP');return b},ICAP.toAsset=function(a){var b=ICAP.decode(a);if('object'!=('undefined'==typeof b?'undefined':_typeof(b)))throw new Error('Not an asset-encoded ICAP');return b},ICAP.isICAP=function(a){try{return ICAP.decode(a),!0}catch(b){return!1}},ICAP.isAddress=function(a){try{return ICAP.toAddress(a),!0}catch(b){return!1}},ICAP.isAsset=function(a){try{return ICAP.toAsset(a),!0}catch(b){return!1}},module.exports=ICAP;

},{"base-x":1,"convert-hex":2}],4:[function(require,module,exports){
'use strict';module.exports={ICAP:require('ethereumjs-icap')};

},{"ethereumjs-icap":3}]},{},[4])(4)
});