(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.EthJS = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
// when used in node, this will actually load the util module we depend on
// versus loading the builtin util module as happens otherwise
// this is a bug in node module loading as far as I am concerned
var util=require('util/'),pSlice=Array.prototype.slice,hasOwn=Object.prototype.hasOwnProperty,assert=module.exports=ok;// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.
// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })
assert.AssertionError=function(d){this.name='AssertionError',this.actual=d.actual,this.expected=d.expected,this.operator=d.operator,d.message?(this.message=d.message,this.generatedMessage=!1):(this.message=getMessage(this),this.generatedMessage=!0);var f=d.stackStartFunction||fail;if(Error.captureStackTrace)Error.captureStackTrace(this,f);else{// non v8 browsers so we can have a stacktrace
var g=new Error;if(g.stack){var h=g.stack,j=f.name,k=h.indexOf('\n'+j);// try to strip useless frames
if(0<=k){// once we have located the function frame
// we need to strip out everything before it (and its line)
var l=h.indexOf('\n',k+1);h=h.substring(l+1)}this.stack=h}}},util.inherits(assert.AssertionError,Error);function replacer(c,d){return util.isUndefined(d)?''+d:util.isNumber(d)&&!isFinite(d)?d.toString():util.isFunction(d)||util.isRegExp(d)?d.toString():d}function truncate(c,d){return util.isString(c)?c.length<d?c:c.slice(0,d):c}function getMessage(c){return truncate(JSON.stringify(c.actual,replacer),128)+' '+c.operator+' '+truncate(JSON.stringify(c.expected,replacer),128)}// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.
// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.
function fail(c,d,f,g,h){throw new assert.AssertionError({message:f,actual:c,expected:d,operator:g,stackStartFunction:h})}// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail=fail;// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.
function ok(c,d){c||fail(c,!0,d,'==',assert.ok)}assert.ok=ok,assert.equal=function(d,f,g){d!=f&&fail(d,f,g,'==',assert.equal)},assert.notEqual=function(d,f,g){d==f&&fail(d,f,g,'!=',assert.notEqual)},assert.deepEqual=function(d,f,g){_deepEqual(d,f)||fail(d,f,g,'deepEqual',assert.deepEqual)};function _deepEqual(c,d){// 7.1. All identical values are equivalent, as determined by ===.
if(c===d)return!0;if(util.isBuffer(c)&&util.isBuffer(d)){if(c.length!=d.length)return!1;for(var f=0;f<c.length;f++)if(c[f]!==d[f])return!1;return!0;// 7.2. If the expected value is a Date object, the actual value is
// equivalent if it is also a Date object that refers to the same time.
}return util.isDate(c)&&util.isDate(d)?c.getTime()===d.getTime():util.isRegExp(c)&&util.isRegExp(d)?c.source===d.source&&c.global===d.global&&c.multiline===d.multiline&&c.lastIndex===d.lastIndex&&c.ignoreCase===d.ignoreCase:util.isObject(c)||util.isObject(d)?objEquiv(c,d):c==d}function isArguments(c){return'[object Arguments]'==Object.prototype.toString.call(c)}function objEquiv(c,d){if(util.isNullOrUndefined(c)||util.isNullOrUndefined(d))return!1;// an identical 'prototype' property.
if(c.prototype!==d.prototype)return!1;// if one is a primitive, the other must be same
if(util.isPrimitive(c)||util.isPrimitive(d))return c===d;var f=isArguments(c),g=isArguments(d);if(f&&!g||!f&&g)return!1;if(f)return c=pSlice.call(c),d=pSlice.call(d),_deepEqual(c,d);var k,l,h=objectKeys(c),j=objectKeys(d);// having the same number of owned properties (keys incorporates
// hasOwnProperty)
if(h.length!=j.length)return!1;//the same set of keys (although not necessarily the same order),
//~~~cheap key test
for(h.sort(),j.sort(),l=h.length-1;0<=l;l--)if(h[l]!=j[l])return!1;//equivalent values for every corresponding key, and
//~~~possibly expensive deep test
for(l=h.length-1;0<=l;l--)if(k=h[l],!_deepEqual(c[k],d[k]))return!1;return!0}// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);
assert.notDeepEqual=function(d,f,g){_deepEqual(d,f)&&fail(d,f,g,'notDeepEqual',assert.notDeepEqual)},assert.strictEqual=function(d,f,g){d!==f&&fail(d,f,g,'===',assert.strictEqual)},assert.notStrictEqual=function(d,f,g){d===f&&fail(d,f,g,'!==',assert.notStrictEqual)};function expectedException(c,d){if(!c||!d)return!1;return'[object RegExp]'==Object.prototype.toString.call(d)?d.test(c):!!(c instanceof d)||!(!0!==d.call({},c))}function _throws(c,d,f,g){var h;util.isString(f)&&(g=f,f=null);try{d()}catch(j){h=j}if(g=(f&&f.name?' ('+f.name+').':'.')+(g?' '+g:'.'),c&&!h&&fail(h,f,'Missing expected exception'+g),!c&&expectedException(h,f)&&fail(h,f,'Got unwanted exception'+g),c&&h&&f&&!expectedException(h,f)||!c&&h)throw h}// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);
assert.throws=function(c,/*optional*/d,/*optional*/f){_throws.apply(this,[!0].concat(pSlice.call(arguments)))},assert.doesNotThrow=function(c,/*optional*/d){_throws.apply(this,[!1].concat(pSlice.call(arguments)))},assert.ifError=function(c){if(c)throw c};var objectKeys=Object.keys||function(c){var d=[];for(var f in c)hasOwn.call(c,f)&&d.push(f);return d};

},{"util/":83}],2:[function(require,module,exports){
'use strict';exports.toByteArray=toByteArray,exports.fromByteArray=fromByteArray;var lookup=[],revLookup=[],Arr='undefined'==typeof Uint8Array?Array:Uint8Array;function init(){var a='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';for(var b=0,c=a.length;b<c;++b)lookup[b]=a[b],revLookup[a.charCodeAt(b)]=b;revLookup['-'.charCodeAt(0)]=62,revLookup['_'.charCodeAt(0)]=63}init();function toByteArray(a){var b,c,d,e,f,g,h=a.length;if(0<h%4)throw new Error('Invalid string. Length must be a multiple of 4');// the number of equal signs (place holders)
// if there are two placeholders, than the two characters before it
// represent one byte
// if there is only one, then the three characters before it represent 2 bytes
// this is just a cheap hack to not do indexOf twice
f='='===a[h-2]?2:'='===a[h-1]?1:0,g=new Arr(3*h/4-f),d=0<f?h-4:h;var k=0;for(b=0,c=0;b<d;b+=4,c+=3)e=revLookup[a.charCodeAt(b)]<<18|revLookup[a.charCodeAt(b+1)]<<12|revLookup[a.charCodeAt(b+2)]<<6|revLookup[a.charCodeAt(b+3)],g[k++]=255&e>>16,g[k++]=255&e>>8,g[k++]=255&e;return 2===f?(e=revLookup[a.charCodeAt(b)]<<2|revLookup[a.charCodeAt(b+1)]>>4,g[k++]=255&e):1==f&&(e=revLookup[a.charCodeAt(b)]<<10|revLookup[a.charCodeAt(b+1)]<<4|revLookup[a.charCodeAt(b+2)]>>2,g[k++]=255&e>>8,g[k++]=255&e),g}function tripletToBase64(a){return lookup[63&a>>18]+lookup[63&a>>12]+lookup[63&a>>6]+lookup[63&a]}function encodeChunk(a,b,c){var d,e=[];for(var f=b;f<c;f+=3)d=(a[f]<<16)+(a[f+1]<<8)+a[f+2],e.push(tripletToBase64(d));return e.join('')}function fromByteArray(a){var b,c=a.length,d=c%3,e='',f=[],g=16383;// if we have 1 byte left, pad 2 bytes
// must be multiple of 3
// go through the array every three bytes, we'll deal with trailing stuff later
for(var h=0,k=c-d;h<k;h+=g)f.push(encodeChunk(a,h,h+g>k?k:h+g));// pad the end with zeros, but make sure to not forget the extra bytes
return 1==d?(b=a[c-1],e+=lookup[b>>2],e+=lookup[63&b<<4],e+='=='):2==d&&(b=(a[c-2]<<8)+a[c-1],e+=lookup[b>>10],e+=lookup[63&b>>4],e+=lookup[63&b<<2],e+='='),f.push(e),f.join('')}

},{}],3:[function(require,module,exports){
(function (Buffer){
'use strict';// Reference https://github.com/bitcoin/bips/blob/master/bip-0066.mediawiki
// Format: 0x30 [total-length] 0x02 [R-length] [R] 0x02 [S-length] [S]
// NOTE: SIGHASH byte ignored AND restricted, truncate before use
function check(a){if(8>a.length)return!1;if(72<a.length)return!1;if(48!==a[0])return!1;if(a[1]!==a.length-2)return!1;if(2!==a[2])return!1;var b=a[3];if(0===b)return!1;if(5+b>=a.length)return!1;if(2!==a[4+b])return!1;var c=a[5+b];return 0!==c&&!(6+b+c!==a.length)&&!(128&a[4])&&(1<b&&0===a[4]&&!(128&a[5])?!1:!(128&a[b+6])&&(1<c&&0===a[b+6]&&!(128&a[b+7])?!1:!0))}function decode(a){if(8>a.length)throw new Error('DER sequence length is too short');if(72<a.length)throw new Error('DER sequence length is too long');if(48!==a[0])throw new Error('Expected DER sequence');if(a[1]!==a.length-2)throw new Error('DER sequence length is invalid');if(2!==a[2])throw new Error('Expected DER integer');var b=a[3];if(0===b)throw new Error('R length is zero');if(5+b>=a.length)throw new Error('R length is too long');if(2!==a[4+b])throw new Error('Expected DER integer (2)');var c=a[5+b];if(0===c)throw new Error('S length is zero');if(6+b+c!==a.length)throw new Error('S length is invalid');if(128&a[4])throw new Error('R value is negative');if(1<b&&0===a[4]&&!(128&a[5]))throw new Error('R value excessively padded');if(128&a[b+6])throw new Error('S value is negative');if(1<c&&0===a[b+6]&&!(128&a[b+7]))throw new Error('S value excessively padded');// non-BIP66 - extract R, S values
return{r:a.slice(4,4+b),s:a.slice(6+b)}}/*
 * Expects r and s to be positive DER integers.
 *
 * The DER format uses the most significant bit as a sign bit (& 0x80).
 * If the significant bit is set AND the integer is positive, a 0x00 is prepended.
 *
 * Examples:
 *
 *      0 =>     0x00
 *      1 =>     0x01
 *     -1 =>     0xff
 *    127 =>     0x7f
 *   -127 =>     0x81
 *    128 =>   0x0080
 *   -128 =>     0x80
 *    255 =>   0x00ff
 *   -255 =>   0xff01
 *  16300 =>   0x3fac
 * -16300 =>   0xc054
 *  62300 => 0x00f35c
 * -62300 => 0xff0ca4
*/function encode(a,b){var c=a.length,d=b.length;if(0===c)throw new Error('R length is zero');if(0===d)throw new Error('S length is zero');if(33<c)throw new Error('R length is too long');if(33<d)throw new Error('S length is too long');if(128&a[0])throw new Error('R value is negative');if(128&b[0])throw new Error('S value is negative');if(1<c&&0===a[0]&&!(128&a[1]))throw new Error('R value excessively padded');if(1<d&&0===b[0]&&!(128&b[1]))throw new Error('S value excessively padded');var e=new Buffer(6+c+d);// 0x30 [total-length] 0x02 [R-length] [R] 0x02 [S-length] [S]
return e[0]=48,e[1]=e.length-2,e[2]=2,e[3]=a.length,a.copy(e,4),e[4+c]=2,e[5+c]=b.length,b.copy(e,6+c),e}module.exports={check:check,decode:decode,encode:encode};

}).call(this,require("buffer").Buffer)
},{"buffer":9}],4:[function(require,module,exports){
'use strict';var _typeof='function'==typeof Symbol&&'symbol'==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&'function'==typeof Symbol&&obj.constructor===Symbol?'symbol':typeof obj};(function(d,f){'use strict';// Utils
function v(ii,ei){if(!ii)throw new Error(ei||'Assertion failed')}// Could use `inherits` module, but don't want to move from single file
// architecture yet.
function S(ii,ei){ii.super_=ei;var ti=function ti(){};ti.prototype=ei.prototype,ii.prototype=new ti,ii.prototype.constructor=ii}// BN
function Z(ii,ei,ti){return Z.isBN(ii)?ii:void(this.negative=0,this.words=null,this.length=0,this.red=null,null!==ii&&(('le'===ei||'be'===ei)&&(ti=ei,ei=10),this._init(ii||0,ei||10,ti||'be')))}function R(ii,ei,ti){var oi=0,li=Math.min(ii.length,ti);for(var ri=ei;ri<li;ri++){var ni=ii.charCodeAt(ri)-48;oi<<=4,oi|=49<=ni&&54>=ni?ni-49+10:17<=ni&&22>=ni?ni-17+10:15&ni}return oi}function L(ii,ei,ti,oi){var li=0,ri=Math.min(ii.length,ti);for(var ni=ei;ni<ri;ni++){var mi=ii.charCodeAt(ni)-48;li*=oi,li+=49<=mi?mi-49+10:17<=mi?mi-17+10:mi}return li}function I(ii){var ei=Array(ii.bitLength());for(var ti=0;ti<ei.length;ti++){var oi=0|ti/26,li=ti%26;ei[ti]=(ii.words[oi]&1<<li)>>>li}return ei}// Number of trailing zero bits
function T(ii,ei,ti){ti.negative=ei.negative^ii.negative;var oi=0|ii.length+ei.length;ti.length=oi,oi=0|oi-1;// Peel one iteration (compiler can't do it, because of code complexity)
var li=0|ii.words[0],ri=0|ei.words[0],ni=li*ri,mi=67108863&ni,ui=0|ni/67108864;ti.words[0]=mi;for(var di=1;di<oi;di++){// Sum all words with the same `i + j = k` and accumulate `ncarry`,
// note that ncarry could be >= 0x3ffffff
var si=ui>>>26,pi=67108863&ui,gi=Math.min(di,ei.length-1);for(var fi=Math.max(0,di-ii.length+1);fi<=gi;fi++){var ai=0|di-fi;li=0|ii.words[ai],ri=0|ei.words[fi],ni=li*ri+pi,si+=0|ni/67108864,pi=67108863&ni}ti.words[di]=0|pi,ui=0|si}return 0==ui?ti.length--:ti.words[di]=0|ui,ti.strip()}// TODO(indutny): it may be reasonable to omit it for users who don't need
// to work with 256-bit numbers, otherwise it gives 20% improvement for 256-bit
// multiplication (like elliptic secp256k1).
function O(ii,ei,ti){ti.negative=ei.negative^ii.negative,ti.length=ii.length+ei.length;var oi=0,li=0;for(var ri=0;ri<ti.length-1;ri++){// Sum all words with the same `i + j = k` and accumulate `ncarry`,
// note that ncarry could be >= 0x3ffffff
var ni=li;li=0;var mi=67108863&oi,ui=Math.min(ri,ei.length-1);for(var di=Math.max(0,ri-ii.length+1);di<=ui;di++){var si=ri-di,pi=0|ii.words[si],gi=0|ei.words[di],fi=pi*gi,ai=67108863&fi;ni=0|ni+(0|fi/67108864),ai=0|ai+mi,mi=67108863&ai,ni=0|ni+(ai>>>26),li+=ni>>>26,ni&=67108863}ti.words[ri]=mi,oi=ni,ni=li}return 0===oi?ti.length--:ti.words[ri]=oi,ti.strip()}function E(ii,ei,ti){var oi=new M;return oi.mulp(ii,ei,ti)}// Cooley-Tukey algorithm for FFT
// slightly revisited to rely on looping instead of recursion
function M(ii,ei){this.x=ii,this.y=ei}// Pseudo-Mersenne prime
function P(ii,ei){this.name=ii,this.p=new Z(ei,16),this.n=this.p.bitLength(),this.k=new Z(1).iushln(this.n).isub(this.p),this.tmp=this._tmp()}function K(){P.call(this,'k256','ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f')}function F(){P.call(this,'p224','ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001')}function H(){P.call(this,'p192','ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff')}function U(){P.call(this,'25519','7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed')}//
// Base reduction engine
//
function J(ii){if('string'==typeof ii){var ei=Z._prime(ii);this.m=ei.p,this.prime=ei}else v(ii.gtn(1),'modulus must be greater than 1'),this.m=ii,this.prime=null}function G(ii){J.call(this,ii),this.shift=this.m.bitLength(),0!=this.shift%26&&(this.shift+=26-this.shift%26),this.r=new Z(1).iushln(this.shift),this.r2=this.imod(this.r.sqr()),this.rinv=this.r._invmp(this.m),this.minv=this.rinv.mul(this.r).isubn(1).div(this.m),this.minv=this.minv.umod(this.r),this.minv=this.r.sub(this.minv)}'object'==('undefined'==typeof d?'undefined':_typeof(d))?d.exports=Z:f.BN=Z,Z.BN=Z,Z.wordSize=26;var Q;try{Q=require('buffer').Buffer}catch(ii){}Z.isBN=function(ei){return!!(ei instanceof Z)||null!==ei&&'object'==('undefined'==typeof ei?'undefined':_typeof(ei))&&ei.constructor.wordSize===Z.wordSize&&Array.isArray(ei.words)},Z.max=function(ei,ti){return 0<ei.cmp(ti)?ei:ti},Z.min=function(ei,ti){return 0>ei.cmp(ti)?ei:ti},Z.prototype._init=function(ei,ti,oi){if('number'==typeof ei)return this._initNumber(ei,ti,oi);if('object'==('undefined'==typeof ei?'undefined':_typeof(ei)))return this._initArray(ei,ti,oi);'hex'===ti&&(ti=16),v(ti===(0|ti)&&2<=ti&&36>=ti),ei=ei.toString().replace(/\s+/g,'');var li=0;'-'===ei[0]&&li++,16===ti?this._parseHex(ei,li):this._parseBase(ei,ti,li),'-'===ei[0]&&(this.negative=1),this.strip(),'le'===oi&&this._initArray(this.toArray(),ti,oi)},Z.prototype._initNumber=function(ei,ti,oi){0>ei&&(this.negative=1,ei=-ei),67108864>ei?(this.words=[67108863&ei],this.length=1):4503599627370496>ei?(this.words=[67108863&ei,67108863&ei/67108864],this.length=2):(v(9007199254740992>ei),this.words=[67108863&ei,67108863&ei/67108864,1],this.length=3),'le'===oi&&this._initArray(this.toArray(),ti,oi)},Z.prototype._initArray=function(ei,ti,oi){if(v('number'==typeof ei.length),0>=ei.length)return this.words=[0],this.length=1,this;this.length=Math.ceil(ei.length/3),this.words=Array(this.length);for(var li=0;li<this.length;li++)this.words[li]=0;var ri,ni,mi=0;if('be'===oi)for(li=ei.length-1,ri=0;0<=li;li-=3)ni=ei[li]|ei[li-1]<<8|ei[li-2]<<16,this.words[ri]|=67108863&ni<<mi,this.words[ri+1]=67108863&ni>>>26-mi,mi+=24,26<=mi&&(mi-=26,ri++);else if('le'===oi)for(li=0,ri=0;li<ei.length;li+=3)ni=ei[li]|ei[li+1]<<8|ei[li+2]<<16,this.words[ri]|=67108863&ni<<mi,this.words[ri+1]=67108863&ni>>>26-mi,mi+=24,26<=mi&&(mi-=26,ri++);return this.strip()},Z.prototype._parseHex=function(ei,ti){this.length=Math.ceil((ei.length-ti)/6),this.words=Array(this.length);for(var oi=0;oi<this.length;oi++)this.words[oi]=0;var li,ri,ni=0;// Scan 24-bit chunks and add them to the number
for(oi=ei.length-6,li=0;oi>=ti;oi-=6)ri=R(ei,oi,oi+6),this.words[li]|=67108863&ri<<ni,this.words[li+1]|=4194303&ri>>>26-ni,ni+=24,26<=ni&&(ni-=26,li++);oi+6!==ti&&(ri=R(ei,ti,oi+6),this.words[li]|=67108863&ri<<ni,this.words[li+1]|=4194303&ri>>>26-ni),this.strip()},Z.prototype._parseBase=function(ei,ti,oi){this.words=[0],this.length=1;// Find length of limb in base
for(var li=0,ri=1;67108863>=ri;ri*=ti)li++;li--,ri=0|ri/ti;var ni=ei.length-oi,mi=ni%li,ui=Math.min(ni,ni-mi)+oi,di=0;for(var si=oi;si<ui;si+=li)di=L(ei,si,si+li,ti),this.imuln(ri),67108864>this.words[0]+di?this.words[0]+=di:this._iaddn(di);if(0!=mi){var pi=1;for(di=L(ei,si,ei.length,ti),si=0;si<mi;si++)pi*=ti;this.imuln(pi),67108864>this.words[0]+di?this.words[0]+=di:this._iaddn(di)}},Z.prototype.copy=function(ei){ei.words=Array(this.length);for(var ti=0;ti<this.length;ti++)ei.words[ti]=this.words[ti];ei.length=this.length,ei.negative=this.negative,ei.red=this.red},Z.prototype.clone=function(){var ei=new Z(null);return this.copy(ei),ei},Z.prototype._expand=function(ei){for(;this.length<ei;)this.words[this.length++]=0;return this},Z.prototype.strip=function(){for(;1<this.length&&0===this.words[this.length-1];)this.length--;return this._normSign()},Z.prototype._normSign=function(){return 1===this.length&&0===this.words[0]&&(this.negative=0),this},Z.prototype.inspect=function(){return(this.red?'<BN-R: ':'<BN: ')+this.toString(16)+'>'};/*

  var zeros = [];
  var groupSizes = [];
  var groupBases = [];

  var s = '';
  var i = -1;
  while (++i < BN.wordSize) {
    zeros[i] = s;
    s += '0';
  }
  groupSizes[0] = 0;
  groupSizes[1] = 0;
  groupBases[0] = 0;
  groupBases[1] = 0;
  var base = 2 - 1;
  while (++base < 36 + 1) {
    var groupSize = 0;
    var groupBase = 1;
    while (groupBase < (1 << BN.wordSize) / base) {
      groupBase *= base;
      groupSize += 1;
    }
    groupSizes[base] = groupSize;
    groupBases[base] = groupBase;
  }

  */var W=['','0','00','000','0000','00000','000000','0000000','00000000','000000000','0000000000','00000000000','000000000000','0000000000000','00000000000000','000000000000000','0000000000000000','00000000000000000','000000000000000000','0000000000000000000','00000000000000000000','000000000000000000000','0000000000000000000000','00000000000000000000000','000000000000000000000000','0000000000000000000000000'],X=[0,0,25,16,12,11,10,9,8,8,7,7,7,7,6,6,6,6,6,6,6,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],Y=[0,0,33554432,43046721,16777216,48828125,60466176,40353607,16777216,43046721,10000000,19487171,35831808,62748517,7529536,11390625,16777216,24137569,34012224,47045881,64000000,4084101,5153632,6436343,7962624,9765625,11881376,14348907,17210368,20511149,24300000,28629151,33554432,39135393,45435424,52521875,60466176];Z.prototype.toString=function(ei,ti){ei=ei||10,ti=0|ti||1;var oi;if(16===ei||'hex'===ei){oi='';var li=0,ri=0;for(var ni=0;ni<this.length;ni++){var mi=this.words[ni],ui=(16777215&(mi<<li|ri)).toString(16);ri=16777215&mi>>>24-li,oi=0!=ri||ni!==this.length-1?W[6-ui.length]+ui+oi:ui+oi,li+=2,26<=li&&(li-=26,ni--)}for(0!=ri&&(oi=ri.toString(16)+oi);0!=oi.length%ti;)oi='0'+oi;return 0!==this.negative&&(oi='-'+oi),oi}if(ei===(0|ei)&&2<=ei&&36>=ei){// var groupSize = Math.floor(BN.wordSize * Math.LN2 / Math.log(base));
var di=X[ei],si=Y[ei];// var groupBase = Math.pow(base, groupSize);
oi='';var pi=this.clone();for(pi.negative=0;!pi.isZero();){var gi=pi.modn(si).toString(ei);pi=pi.idivn(si),oi=pi.isZero()?gi+oi:W[di-gi.length]+gi+oi}for(this.isZero()&&(oi='0'+oi);0!=oi.length%ti;)oi='0'+oi;return 0!==this.negative&&(oi='-'+oi),oi}v(!1,'Base should be between 2 and 36')},Z.prototype.toNumber=function(){var ei=this.words[0];return 2===this.length?ei+=67108864*this.words[1]:3===this.length&&1===this.words[2]?ei+=4503599627370496+67108864*this.words[1]:2<this.length&&v(!1,'Number can only safely store up to 53 bits'),0===this.negative?ei:-ei},Z.prototype.toJSON=function(){return this.toString(16)},Z.prototype.toBuffer=function(ei,ti){return v('undefined'!=typeof Q),this.toArrayLike(Q,ei,ti)},Z.prototype.toArray=function(ei,ti){return this.toArrayLike(Array,ei,ti)},Z.prototype.toArrayLike=function(ei,ti,oi){var li=this.byteLength(),ri=oi||Math.max(1,li);v(li<=ri,'byte array longer than desired length'),v(0<ri,'Requested array length <= 0'),this.strip();var ni=new ei(ri),mi,ui,di=this.clone();if('le'!==ti){// Assume big-endian
for(ui=0;ui<ri-li;ui++)ni[ui]=0;for(ui=0;!di.isZero();ui++)mi=di.andln(255),di.iushrn(8),ni[ri-ui-1]=mi}else{for(ui=0;!di.isZero();ui++)mi=di.andln(255),di.iushrn(8),ni[ui]=mi;for(;ui<ri;ui++)ni[ui]=0}return ni},Z.prototype._countBits=Math.clz32?function(ei){return 32-Math.clz32(ei)}:function(ei){var ti=ei,oi=0;return 4096<=ti&&(oi+=13,ti>>>=13),64<=ti&&(oi+=7,ti>>>=7),8<=ti&&(oi+=4,ti>>>=4),2<=ti&&(oi+=2,ti>>>=2),oi+ti},Z.prototype._zeroBits=function(ei){// Short-cut
if(0===ei)return 26;var ti=ei,oi=0;return 0==(8191&ti)&&(oi+=13,ti>>>=13),0==(127&ti)&&(oi+=7,ti>>>=7),0==(15&ti)&&(oi+=4,ti>>>=4),0==(3&ti)&&(oi+=2,ti>>>=2),0==(1&ti)&&oi++,oi},Z.prototype.bitLength=function(){var ei=this.words[this.length-1],ti=this._countBits(ei);return 26*(this.length-1)+ti},Z.prototype.zeroBits=function(){if(this.isZero())return 0;var ei=0;for(var ti=0;ti<this.length;ti++){var oi=this._zeroBits(this.words[ti]);if(ei+=oi,26!==oi)break}return ei},Z.prototype.byteLength=function(){return Math.ceil(this.bitLength()/8)},Z.prototype.toTwos=function(ei){return 0===this.negative?this.clone():this.abs().inotn(ei).iaddn(1)},Z.prototype.fromTwos=function(ei){return this.testn(ei-1)?this.notn(ei).iaddn(1).ineg():this.clone()},Z.prototype.isNeg=function(){return 0!==this.negative},Z.prototype.neg=function(){return this.clone().ineg()},Z.prototype.ineg=function(){return this.isZero()||(this.negative^=1),this},Z.prototype.iuor=function(ei){for(;this.length<ei.length;)this.words[this.length++]=0;for(var ti=0;ti<ei.length;ti++)this.words[ti]=this.words[ti]|ei.words[ti];return this.strip()},Z.prototype.ior=function(ei){return v(0==(this.negative|ei.negative)),this.iuor(ei)},Z.prototype.or=function(ei){return this.length>ei.length?this.clone().ior(ei):ei.clone().ior(this)},Z.prototype.uor=function(ei){return this.length>ei.length?this.clone().iuor(ei):ei.clone().iuor(this)},Z.prototype.iuand=function(ei){// b = min-length(num, this)
var ti;ti=this.length>ei.length?ei:this;for(var oi=0;oi<ti.length;oi++)this.words[oi]=this.words[oi]&ei.words[oi];return this.length=ti.length,this.strip()},Z.prototype.iand=function(ei){return v(0==(this.negative|ei.negative)),this.iuand(ei)},Z.prototype.and=function(ei){return this.length>ei.length?this.clone().iand(ei):ei.clone().iand(this)},Z.prototype.uand=function(ei){return this.length>ei.length?this.clone().iuand(ei):ei.clone().iuand(this)},Z.prototype.iuxor=function(ei){// a.length > b.length
var ti,oi;this.length>ei.length?(ti=this,oi=ei):(ti=ei,oi=this);for(var li=0;li<oi.length;li++)this.words[li]=ti.words[li]^oi.words[li];if(this!==ti)for(;li<ti.length;li++)this.words[li]=ti.words[li];return this.length=ti.length,this.strip()},Z.prototype.ixor=function(ei){return v(0==(this.negative|ei.negative)),this.iuxor(ei)},Z.prototype.xor=function(ei){return this.length>ei.length?this.clone().ixor(ei):ei.clone().ixor(this)},Z.prototype.uxor=function(ei){return this.length>ei.length?this.clone().iuxor(ei):ei.clone().iuxor(this)},Z.prototype.inotn=function(ei){v('number'==typeof ei&&0<=ei);var ti=0|Math.ceil(ei/26),oi=ei%26;this._expand(ti),0<oi&&ti--;// Handle complete words
for(var li=0;li<ti;li++)this.words[li]=67108863&~this.words[li];// Handle the residue
// And remove leading zeroes
return 0<oi&&(this.words[li]=~this.words[li]&67108863>>26-oi),this.strip()},Z.prototype.notn=function(ei){return this.clone().inotn(ei)},Z.prototype.setn=function(ei,ti){v('number'==typeof ei&&0<=ei);var oi=0|ei/26,li=ei%26;return this._expand(oi+1),this.words[oi]=ti?this.words[oi]|1<<li:this.words[oi]&~(1<<li),this.strip()},Z.prototype.iadd=function(ei){var ti;// negative + positive
if(0!==this.negative&&0===ei.negative)return this.negative=0,ti=this.isub(ei),this.negative^=1,this._normSign();// positive + negative
// a.length > b.length
if(0===this.negative&&0!==ei.negative)return ei.negative=0,ti=this.isub(ei),ei.negative=1,ti._normSign();var oi,li;this.length>ei.length?(oi=this,li=ei):(oi=ei,li=this);var ri=0;for(var ni=0;ni<li.length;ni++)ti=(0|oi.words[ni])+(0|li.words[ni])+ri,this.words[ni]=67108863&ti,ri=ti>>>26;for(;0!=ri&&ni<oi.length;ni++)ti=(0|oi.words[ni])+ri,this.words[ni]=67108863&ti,ri=ti>>>26;if(this.length=oi.length,0!=ri)this.words[this.length]=ri,this.length++;else if(oi!==this)for(;ni<oi.length;ni++)this.words[ni]=oi.words[ni];return this},Z.prototype.add=function(ei){var ti;return 0!==ei.negative&&0===this.negative?(ei.negative=0,ti=this.sub(ei),ei.negative^=1,ti):0===ei.negative&&0!==this.negative?(this.negative=0,ti=ei.sub(this),this.negative=1,ti):this.length>ei.length?this.clone().iadd(ei):ei.clone().iadd(this)},Z.prototype.isub=function(ei){// this - (-num) = this + num
if(0!==ei.negative){ei.negative=0;var ti=this.iadd(ei);return ei.negative=1,ti._normSign();// -this - num = -(this + num)
}// At this point both numbers are positive
if(0!==this.negative)return this.negative=0,this.iadd(ei),this.negative=1,this._normSign();var oi=this.cmp(ei);// Optimization - zeroify
if(0===oi)return this.negative=0,this.length=1,this.words[0]=0,this;// a > b
var li,ri;0<oi?(li=this,ri=ei):(li=ei,ri=this);var ni=0;for(var mi=0;mi<ri.length;mi++)ti=(0|li.words[mi])-(0|ri.words[mi])+ni,ni=ti>>26,this.words[mi]=67108863&ti;for(;0!=ni&&mi<li.length;mi++)ti=(0|li.words[mi])+ni,ni=ti>>26,this.words[mi]=67108863&ti;// Copy rest of the words
if(0==ni&&mi<li.length&&li!==this)for(;mi<li.length;mi++)this.words[mi]=li.words[mi];return this.length=Math.max(this.length,mi),li!==this&&(this.negative=1),this.strip()},Z.prototype.sub=function(ei){return this.clone().isub(ei)};var $=function $(ei,ti,oi){var ui,di,si,li=ei.words,ri=ti.words,ni=oi.words,mi=0,pi=0|li[0],gi=8191&pi,fi=pi>>>13,ai=0|li[1],wi=8191&ai,yi=ai>>>13,vi=0|li[2],ci=8191&vi,bi=vi>>>13,_i=0|li[3],ki=8191&_i,Si=_i>>>13,xi=0|li[4],Zi=8191&xi,qi=xi>>>13,Ri=0|li[5],Bi=8191&Ri,Ai=Ri>>>13,Ni=0|li[6],Li=8191&Ni,ji=Ni>>>13,Ii=0|li[7],zi=8191&Ii,Ti=Ii>>>13,Oi=0|li[8],Ei=8191&Oi,Mi=Oi>>>13,Pi=0|li[9],Ki=8191&Pi,Fi=Pi>>>13,Ci=0|ri[0],Di=8191&Ci,Hi=Ci>>>13,Ui=0|ri[1],Ji=8191&Ui,Gi=Ui>>>13,Qi=0|ri[2],Wi=8191&Qi,Xi=Qi>>>13,Yi=0|ri[3],$i=8191&Yi,Vi=Yi>>>13,ee=0|ri[4],te=8191&ee,oe=ee>>>13,le=0|ri[5],ne=8191&le,me=le>>>13,ue=0|ri[6],de=8191&ue,se=ue>>>13,pe=0|ri[7],ge=8191&pe,he=pe>>>13,fe=0|ri[8],ae=8191&fe,we=fe>>>13,ye=0|ri[9],ve=8191&ye,ce=ye>>>13;oi.negative=ei.negative^ti.negative,oi.length=19,ui=Math.imul(gi,Di),di=Math.imul(gi,Hi),di=0|di+Math.imul(fi,Di),si=Math.imul(fi,Hi);var be=0|(0|mi+ui)+((8191&di)<<13);mi=0|(0|si+(di>>>13))+(be>>>26),be&=67108863,ui=Math.imul(wi,Di),di=Math.imul(wi,Hi),di=0|di+Math.imul(yi,Di),si=Math.imul(yi,Hi),ui=0|ui+Math.imul(gi,Ji),di=0|di+Math.imul(gi,Gi),di=0|di+Math.imul(fi,Ji),si=0|si+Math.imul(fi,Gi);var _e=0|(0|mi+ui)+((8191&di)<<13);mi=0|(0|si+(di>>>13))+(_e>>>26),_e&=67108863,ui=Math.imul(ci,Di),di=Math.imul(ci,Hi),di=0|di+Math.imul(bi,Di),si=Math.imul(bi,Hi),ui=0|ui+Math.imul(wi,Ji),di=0|di+Math.imul(wi,Gi),di=0|di+Math.imul(yi,Ji),si=0|si+Math.imul(yi,Gi),ui=0|ui+Math.imul(gi,Wi),di=0|di+Math.imul(gi,Xi),di=0|di+Math.imul(fi,Wi),si=0|si+Math.imul(fi,Xi);var ke=0|(0|mi+ui)+((8191&di)<<13);mi=0|(0|si+(di>>>13))+(ke>>>26),ke&=67108863,ui=Math.imul(ki,Di),di=Math.imul(ki,Hi),di=0|di+Math.imul(Si,Di),si=Math.imul(Si,Hi),ui=0|ui+Math.imul(ci,Ji),di=0|di+Math.imul(ci,Gi),di=0|di+Math.imul(bi,Ji),si=0|si+Math.imul(bi,Gi),ui=0|ui+Math.imul(wi,Wi),di=0|di+Math.imul(wi,Xi),di=0|di+Math.imul(yi,Wi),si=0|si+Math.imul(yi,Xi),ui=0|ui+Math.imul(gi,$i),di=0|di+Math.imul(gi,Vi),di=0|di+Math.imul(fi,$i),si=0|si+Math.imul(fi,Vi);var Se=0|(0|mi+ui)+((8191&di)<<13);mi=0|(0|si+(di>>>13))+(Se>>>26),Se&=67108863,ui=Math.imul(Zi,Di),di=Math.imul(Zi,Hi),di=0|di+Math.imul(qi,Di),si=Math.imul(qi,Hi),ui=0|ui+Math.imul(ki,Ji),di=0|di+Math.imul(ki,Gi),di=0|di+Math.imul(Si,Ji),si=0|si+Math.imul(Si,Gi),ui=0|ui+Math.imul(ci,Wi),di=0|di+Math.imul(ci,Xi),di=0|di+Math.imul(bi,Wi),si=0|si+Math.imul(bi,Xi),ui=0|ui+Math.imul(wi,$i),di=0|di+Math.imul(wi,Vi),di=0|di+Math.imul(yi,$i),si=0|si+Math.imul(yi,Vi),ui=0|ui+Math.imul(gi,te),di=0|di+Math.imul(gi,oe),di=0|di+Math.imul(fi,te),si=0|si+Math.imul(fi,oe);var xe=0|(0|mi+ui)+((8191&di)<<13);mi=0|(0|si+(di>>>13))+(xe>>>26),xe&=67108863,ui=Math.imul(Bi,Di),di=Math.imul(Bi,Hi),di=0|di+Math.imul(Ai,Di),si=Math.imul(Ai,Hi),ui=0|ui+Math.imul(Zi,Ji),di=0|di+Math.imul(Zi,Gi),di=0|di+Math.imul(qi,Ji),si=0|si+Math.imul(qi,Gi),ui=0|ui+Math.imul(ki,Wi),di=0|di+Math.imul(ki,Xi),di=0|di+Math.imul(Si,Wi),si=0|si+Math.imul(Si,Xi),ui=0|ui+Math.imul(ci,$i),di=0|di+Math.imul(ci,Vi),di=0|di+Math.imul(bi,$i),si=0|si+Math.imul(bi,Vi),ui=0|ui+Math.imul(wi,te),di=0|di+Math.imul(wi,oe),di=0|di+Math.imul(yi,te),si=0|si+Math.imul(yi,oe),ui=0|ui+Math.imul(gi,ne),di=0|di+Math.imul(gi,me),di=0|di+Math.imul(fi,ne),si=0|si+Math.imul(fi,me);var Ze=0|(0|mi+ui)+((8191&di)<<13);mi=0|(0|si+(di>>>13))+(Ze>>>26),Ze&=67108863,ui=Math.imul(Li,Di),di=Math.imul(Li,Hi),di=0|di+Math.imul(ji,Di),si=Math.imul(ji,Hi),ui=0|ui+Math.imul(Bi,Ji),di=0|di+Math.imul(Bi,Gi),di=0|di+Math.imul(Ai,Ji),si=0|si+Math.imul(Ai,Gi),ui=0|ui+Math.imul(Zi,Wi),di=0|di+Math.imul(Zi,Xi),di=0|di+Math.imul(qi,Wi),si=0|si+Math.imul(qi,Xi),ui=0|ui+Math.imul(ki,$i),di=0|di+Math.imul(ki,Vi),di=0|di+Math.imul(Si,$i),si=0|si+Math.imul(Si,Vi),ui=0|ui+Math.imul(ci,te),di=0|di+Math.imul(ci,oe),di=0|di+Math.imul(bi,te),si=0|si+Math.imul(bi,oe),ui=0|ui+Math.imul(wi,ne),di=0|di+Math.imul(wi,me),di=0|di+Math.imul(yi,ne),si=0|si+Math.imul(yi,me),ui=0|ui+Math.imul(gi,de),di=0|di+Math.imul(gi,se),di=0|di+Math.imul(fi,de),si=0|si+Math.imul(fi,se);var qe=0|(0|mi+ui)+((8191&di)<<13);mi=0|(0|si+(di>>>13))+(qe>>>26),qe&=67108863,ui=Math.imul(zi,Di),di=Math.imul(zi,Hi),di=0|di+Math.imul(Ti,Di),si=Math.imul(Ti,Hi),ui=0|ui+Math.imul(Li,Ji),di=0|di+Math.imul(Li,Gi),di=0|di+Math.imul(ji,Ji),si=0|si+Math.imul(ji,Gi),ui=0|ui+Math.imul(Bi,Wi),di=0|di+Math.imul(Bi,Xi),di=0|di+Math.imul(Ai,Wi),si=0|si+Math.imul(Ai,Xi),ui=0|ui+Math.imul(Zi,$i),di=0|di+Math.imul(Zi,Vi),di=0|di+Math.imul(qi,$i),si=0|si+Math.imul(qi,Vi),ui=0|ui+Math.imul(ki,te),di=0|di+Math.imul(ki,oe),di=0|di+Math.imul(Si,te),si=0|si+Math.imul(Si,oe),ui=0|ui+Math.imul(ci,ne),di=0|di+Math.imul(ci,me),di=0|di+Math.imul(bi,ne),si=0|si+Math.imul(bi,me),ui=0|ui+Math.imul(wi,de),di=0|di+Math.imul(wi,se),di=0|di+Math.imul(yi,de),si=0|si+Math.imul(yi,se),ui=0|ui+Math.imul(gi,ge),di=0|di+Math.imul(gi,he),di=0|di+Math.imul(fi,ge),si=0|si+Math.imul(fi,he);var Re=0|(0|mi+ui)+((8191&di)<<13);mi=0|(0|si+(di>>>13))+(Re>>>26),Re&=67108863,ui=Math.imul(Ei,Di),di=Math.imul(Ei,Hi),di=0|di+Math.imul(Mi,Di),si=Math.imul(Mi,Hi),ui=0|ui+Math.imul(zi,Ji),di=0|di+Math.imul(zi,Gi),di=0|di+Math.imul(Ti,Ji),si=0|si+Math.imul(Ti,Gi),ui=0|ui+Math.imul(Li,Wi),di=0|di+Math.imul(Li,Xi),di=0|di+Math.imul(ji,Wi),si=0|si+Math.imul(ji,Xi),ui=0|ui+Math.imul(Bi,$i),di=0|di+Math.imul(Bi,Vi),di=0|di+Math.imul(Ai,$i),si=0|si+Math.imul(Ai,Vi),ui=0|ui+Math.imul(Zi,te),di=0|di+Math.imul(Zi,oe),di=0|di+Math.imul(qi,te),si=0|si+Math.imul(qi,oe),ui=0|ui+Math.imul(ki,ne),di=0|di+Math.imul(ki,me),di=0|di+Math.imul(Si,ne),si=0|si+Math.imul(Si,me),ui=0|ui+Math.imul(ci,de),di=0|di+Math.imul(ci,se),di=0|di+Math.imul(bi,de),si=0|si+Math.imul(bi,se),ui=0|ui+Math.imul(wi,ge),di=0|di+Math.imul(wi,he),di=0|di+Math.imul(yi,ge),si=0|si+Math.imul(yi,he),ui=0|ui+Math.imul(gi,ae),di=0|di+Math.imul(gi,we),di=0|di+Math.imul(fi,ae),si=0|si+Math.imul(fi,we);var Be=0|(0|mi+ui)+((8191&di)<<13);mi=0|(0|si+(di>>>13))+(Be>>>26),Be&=67108863,ui=Math.imul(Ki,Di),di=Math.imul(Ki,Hi),di=0|di+Math.imul(Fi,Di),si=Math.imul(Fi,Hi),ui=0|ui+Math.imul(Ei,Ji),di=0|di+Math.imul(Ei,Gi),di=0|di+Math.imul(Mi,Ji),si=0|si+Math.imul(Mi,Gi),ui=0|ui+Math.imul(zi,Wi),di=0|di+Math.imul(zi,Xi),di=0|di+Math.imul(Ti,Wi),si=0|si+Math.imul(Ti,Xi),ui=0|ui+Math.imul(Li,$i),di=0|di+Math.imul(Li,Vi),di=0|di+Math.imul(ji,$i),si=0|si+Math.imul(ji,Vi),ui=0|ui+Math.imul(Bi,te),di=0|di+Math.imul(Bi,oe),di=0|di+Math.imul(Ai,te),si=0|si+Math.imul(Ai,oe),ui=0|ui+Math.imul(Zi,ne),di=0|di+Math.imul(Zi,me),di=0|di+Math.imul(qi,ne),si=0|si+Math.imul(qi,me),ui=0|ui+Math.imul(ki,de),di=0|di+Math.imul(ki,se),di=0|di+Math.imul(Si,de),si=0|si+Math.imul(Si,se),ui=0|ui+Math.imul(ci,ge),di=0|di+Math.imul(ci,he),di=0|di+Math.imul(bi,ge),si=0|si+Math.imul(bi,he),ui=0|ui+Math.imul(wi,ae),di=0|di+Math.imul(wi,we),di=0|di+Math.imul(yi,ae),si=0|si+Math.imul(yi,we),ui=0|ui+Math.imul(gi,ve),di=0|di+Math.imul(gi,ce),di=0|di+Math.imul(fi,ve),si=0|si+Math.imul(fi,ce);var Ae=0|(0|mi+ui)+((8191&di)<<13);mi=0|(0|si+(di>>>13))+(Ae>>>26),Ae&=67108863,ui=Math.imul(Ki,Ji),di=Math.imul(Ki,Gi),di=0|di+Math.imul(Fi,Ji),si=Math.imul(Fi,Gi),ui=0|ui+Math.imul(Ei,Wi),di=0|di+Math.imul(Ei,Xi),di=0|di+Math.imul(Mi,Wi),si=0|si+Math.imul(Mi,Xi),ui=0|ui+Math.imul(zi,$i),di=0|di+Math.imul(zi,Vi),di=0|di+Math.imul(Ti,$i),si=0|si+Math.imul(Ti,Vi),ui=0|ui+Math.imul(Li,te),di=0|di+Math.imul(Li,oe),di=0|di+Math.imul(ji,te),si=0|si+Math.imul(ji,oe),ui=0|ui+Math.imul(Bi,ne),di=0|di+Math.imul(Bi,me),di=0|di+Math.imul(Ai,ne),si=0|si+Math.imul(Ai,me),ui=0|ui+Math.imul(Zi,de),di=0|di+Math.imul(Zi,se),di=0|di+Math.imul(qi,de),si=0|si+Math.imul(qi,se),ui=0|ui+Math.imul(ki,ge),di=0|di+Math.imul(ki,he),di=0|di+Math.imul(Si,ge),si=0|si+Math.imul(Si,he),ui=0|ui+Math.imul(ci,ae),di=0|di+Math.imul(ci,we),di=0|di+Math.imul(bi,ae),si=0|si+Math.imul(bi,we),ui=0|ui+Math.imul(wi,ve),di=0|di+Math.imul(wi,ce),di=0|di+Math.imul(yi,ve),si=0|si+Math.imul(yi,ce);var Ne=0|(0|mi+ui)+((8191&di)<<13);mi=0|(0|si+(di>>>13))+(Ne>>>26),Ne&=67108863,ui=Math.imul(Ki,Wi),di=Math.imul(Ki,Xi),di=0|di+Math.imul(Fi,Wi),si=Math.imul(Fi,Xi),ui=0|ui+Math.imul(Ei,$i),di=0|di+Math.imul(Ei,Vi),di=0|di+Math.imul(Mi,$i),si=0|si+Math.imul(Mi,Vi),ui=0|ui+Math.imul(zi,te),di=0|di+Math.imul(zi,oe),di=0|di+Math.imul(Ti,te),si=0|si+Math.imul(Ti,oe),ui=0|ui+Math.imul(Li,ne),di=0|di+Math.imul(Li,me),di=0|di+Math.imul(ji,ne),si=0|si+Math.imul(ji,me),ui=0|ui+Math.imul(Bi,de),di=0|di+Math.imul(Bi,se),di=0|di+Math.imul(Ai,de),si=0|si+Math.imul(Ai,se),ui=0|ui+Math.imul(Zi,ge),di=0|di+Math.imul(Zi,he),di=0|di+Math.imul(qi,ge),si=0|si+Math.imul(qi,he),ui=0|ui+Math.imul(ki,ae),di=0|di+Math.imul(ki,we),di=0|di+Math.imul(Si,ae),si=0|si+Math.imul(Si,we),ui=0|ui+Math.imul(ci,ve),di=0|di+Math.imul(ci,ce),di=0|di+Math.imul(bi,ve),si=0|si+Math.imul(bi,ce);var Le=0|(0|mi+ui)+((8191&di)<<13);mi=0|(0|si+(di>>>13))+(Le>>>26),Le&=67108863,ui=Math.imul(Ki,$i),di=Math.imul(Ki,Vi),di=0|di+Math.imul(Fi,$i),si=Math.imul(Fi,Vi),ui=0|ui+Math.imul(Ei,te),di=0|di+Math.imul(Ei,oe),di=0|di+Math.imul(Mi,te),si=0|si+Math.imul(Mi,oe),ui=0|ui+Math.imul(zi,ne),di=0|di+Math.imul(zi,me),di=0|di+Math.imul(Ti,ne),si=0|si+Math.imul(Ti,me),ui=0|ui+Math.imul(Li,de),di=0|di+Math.imul(Li,se),di=0|di+Math.imul(ji,de),si=0|si+Math.imul(ji,se),ui=0|ui+Math.imul(Bi,ge),di=0|di+Math.imul(Bi,he),di=0|di+Math.imul(Ai,ge),si=0|si+Math.imul(Ai,he),ui=0|ui+Math.imul(Zi,ae),di=0|di+Math.imul(Zi,we),di=0|di+Math.imul(qi,ae),si=0|si+Math.imul(qi,we),ui=0|ui+Math.imul(ki,ve),di=0|di+Math.imul(ki,ce),di=0|di+Math.imul(Si,ve),si=0|si+Math.imul(Si,ce);var je=0|(0|mi+ui)+((8191&di)<<13);mi=0|(0|si+(di>>>13))+(je>>>26),je&=67108863,ui=Math.imul(Ki,te),di=Math.imul(Ki,oe),di=0|di+Math.imul(Fi,te),si=Math.imul(Fi,oe),ui=0|ui+Math.imul(Ei,ne),di=0|di+Math.imul(Ei,me),di=0|di+Math.imul(Mi,ne),si=0|si+Math.imul(Mi,me),ui=0|ui+Math.imul(zi,de),di=0|di+Math.imul(zi,se),di=0|di+Math.imul(Ti,de),si=0|si+Math.imul(Ti,se),ui=0|ui+Math.imul(Li,ge),di=0|di+Math.imul(Li,he),di=0|di+Math.imul(ji,ge),si=0|si+Math.imul(ji,he),ui=0|ui+Math.imul(Bi,ae),di=0|di+Math.imul(Bi,we),di=0|di+Math.imul(Ai,ae),si=0|si+Math.imul(Ai,we),ui=0|ui+Math.imul(Zi,ve),di=0|di+Math.imul(Zi,ce),di=0|di+Math.imul(qi,ve),si=0|si+Math.imul(qi,ce);var Ie=0|(0|mi+ui)+((8191&di)<<13);mi=0|(0|si+(di>>>13))+(Ie>>>26),Ie&=67108863,ui=Math.imul(Ki,ne),di=Math.imul(Ki,me),di=0|di+Math.imul(Fi,ne),si=Math.imul(Fi,me),ui=0|ui+Math.imul(Ei,de),di=0|di+Math.imul(Ei,se),di=0|di+Math.imul(Mi,de),si=0|si+Math.imul(Mi,se),ui=0|ui+Math.imul(zi,ge),di=0|di+Math.imul(zi,he),di=0|di+Math.imul(Ti,ge),si=0|si+Math.imul(Ti,he),ui=0|ui+Math.imul(Li,ae),di=0|di+Math.imul(Li,we),di=0|di+Math.imul(ji,ae),si=0|si+Math.imul(ji,we),ui=0|ui+Math.imul(Bi,ve),di=0|di+Math.imul(Bi,ce),di=0|di+Math.imul(Ai,ve),si=0|si+Math.imul(Ai,ce);var ze=0|(0|mi+ui)+((8191&di)<<13);mi=0|(0|si+(di>>>13))+(ze>>>26),ze&=67108863,ui=Math.imul(Ki,de),di=Math.imul(Ki,se),di=0|di+Math.imul(Fi,de),si=Math.imul(Fi,se),ui=0|ui+Math.imul(Ei,ge),di=0|di+Math.imul(Ei,he),di=0|di+Math.imul(Mi,ge),si=0|si+Math.imul(Mi,he),ui=0|ui+Math.imul(zi,ae),di=0|di+Math.imul(zi,we),di=0|di+Math.imul(Ti,ae),si=0|si+Math.imul(Ti,we),ui=0|ui+Math.imul(Li,ve),di=0|di+Math.imul(Li,ce),di=0|di+Math.imul(ji,ve),si=0|si+Math.imul(ji,ce);var Te=0|(0|mi+ui)+((8191&di)<<13);mi=0|(0|si+(di>>>13))+(Te>>>26),Te&=67108863,ui=Math.imul(Ki,ge),di=Math.imul(Ki,he),di=0|di+Math.imul(Fi,ge),si=Math.imul(Fi,he),ui=0|ui+Math.imul(Ei,ae),di=0|di+Math.imul(Ei,we),di=0|di+Math.imul(Mi,ae),si=0|si+Math.imul(Mi,we),ui=0|ui+Math.imul(zi,ve),di=0|di+Math.imul(zi,ce),di=0|di+Math.imul(Ti,ve),si=0|si+Math.imul(Ti,ce);var Oe=0|(0|mi+ui)+((8191&di)<<13);mi=0|(0|si+(di>>>13))+(Oe>>>26),Oe&=67108863,ui=Math.imul(Ki,ae),di=Math.imul(Ki,we),di=0|di+Math.imul(Fi,ae),si=Math.imul(Fi,we),ui=0|ui+Math.imul(Ei,ve),di=0|di+Math.imul(Ei,ce),di=0|di+Math.imul(Mi,ve),si=0|si+Math.imul(Mi,ce);var Ee=0|(0|mi+ui)+((8191&di)<<13);mi=0|(0|si+(di>>>13))+(Ee>>>26),Ee&=67108863,ui=Math.imul(Ki,ve),di=Math.imul(Ki,ce),di=0|di+Math.imul(Fi,ve),si=Math.imul(Fi,ce);var Me=0|(0|mi+ui)+((8191&di)<<13);return mi=0|(0|si+(di>>>13))+(Me>>>26),Me&=67108863,ni[0]=be,ni[1]=_e,ni[2]=ke,ni[3]=Se,ni[4]=xe,ni[5]=Ze,ni[6]=qe,ni[7]=Re,ni[8]=Be,ni[9]=Ae,ni[10]=Ne,ni[11]=Le,ni[12]=je,ni[13]=Ie,ni[14]=ze,ni[15]=Te,ni[16]=Oe,ni[17]=Ee,ni[18]=Me,0!=mi&&(ni[19]=mi,oi.length++),oi};// Polyfill comb
Math.imul||($=T),Z.prototype.mulTo=function(ei,ti){var oi,li=this.length+ei.length;return oi=10===this.length&&10===ei.length?$(this,ei,ti):63>li?T(this,ei,ti):1024>li?O(this,ei,ti):E(this,ei,ti),oi},M.prototype.makeRBT=function(ei){var ti=Array(ei),oi=Z.prototype._countBits(ei)-1;for(var li=0;li<ei;li++)ti[li]=this.revBin(li,oi,ei);return ti},M.prototype.revBin=function(ei,ti,oi){if(0===ei||ei===oi-1)return ei;var li=0;for(var ri=0;ri<ti;ri++)li|=(1&ei)<<ti-ri-1,ei>>=1;return li},M.prototype.permute=function(ei,ti,oi,li,ri,ni){for(var mi=0;mi<ni;mi++)li[mi]=ti[ei[mi]],ri[mi]=oi[ei[mi]]},M.prototype.transform=function(ei,ti,oi,li,ri,ni){this.permute(ni,ei,ti,oi,li,ri);for(var mi=1;mi<ri;mi<<=1){var ui=mi<<1,di=Math.cos(2*Math.PI/ui),si=Math.sin(2*Math.PI/ui);for(var pi=0;pi<ri;pi+=ui){var gi=di,fi=si;for(var ai=0;ai<mi;ai++){var wi=oi[pi+ai],yi=li[pi+ai],vi=oi[pi+ai+mi],ci=li[pi+ai+mi],bi=gi*vi-fi*ci;ci=gi*ci+fi*vi,vi=bi,oi[pi+ai]=wi+vi,li[pi+ai]=yi+ci,oi[pi+ai+mi]=wi-vi,li[pi+ai+mi]=yi-ci,ai!==ui&&(bi=di*gi-si*fi,fi=di*fi+si*gi,gi=bi)}}}},M.prototype.guessLen13b=function(ei,ti){var oi=1|Math.max(ti,ei),li=1&oi,ri=0;for(oi=0|oi/2;oi;oi=oi>>>1)ri++;return 1<<ri+1+li},M.prototype.conjugate=function(ei,ti,oi){if(!(1>=oi))for(var li=0;li<oi/2;li++){var ri=ei[li];ei[li]=ei[oi-li-1],ei[oi-li-1]=ri,ri=ti[li],ti[li]=-ti[oi-li-1],ti[oi-li-1]=-ri}},M.prototype.normalize13b=function(ei,ti){var oi=0;for(var li=0;li<ti/2;li++){var ri=8192*Math.round(ei[2*li+1]/ti)+Math.round(ei[2*li]/ti)+oi;ei[li]=67108863&ri,oi=67108864>ri?0:0|ri/67108864}return ei},M.prototype.convert13b=function(ei,ti,oi,li){var ri=0;for(var ni=0;ni<ti;ni++)ri=ri+(0|ei[ni]),oi[2*ni]=8191&ri,ri=ri>>>13,oi[2*ni+1]=8191&ri,ri=ri>>>13;// Pad with zeroes
for(ni=2*ti;ni<li;++ni)oi[ni]=0;v(0==ri),v(0==(-8192&ri))},M.prototype.stub=function(ei){var ti=Array(ei);for(var oi=0;oi<ei;oi++)ti[oi]=0;return ti},M.prototype.mulp=function(ei,ti,oi){var li=2*this.guessLen13b(ei.length,ti.length),ri=this.makeRBT(li),ni=this.stub(li),mi=Array(li),ui=Array(li),di=Array(li),si=Array(li),pi=Array(li),gi=Array(li),fi=oi.words;fi.length=li,this.convert13b(ei.words,ei.length,mi,li),this.convert13b(ti.words,ti.length,si,li),this.transform(mi,ni,ui,di,li,ri),this.transform(si,ni,pi,gi,li,ri);for(var ai=0;ai<li;ai++){var wi=ui[ai]*pi[ai]-di[ai]*gi[ai];di[ai]=ui[ai]*gi[ai]+di[ai]*pi[ai],ui[ai]=wi}return this.conjugate(ui,di,li),this.transform(ui,di,fi,ni,li,ri),this.conjugate(fi,ni,li),this.normalize13b(fi,li),oi.negative=ei.negative^ti.negative,oi.length=ei.length+ti.length,oi.strip()},Z.prototype.mul=function(ei){var ti=new Z(null);return ti.words=Array(this.length+ei.length),this.mulTo(ei,ti)},Z.prototype.mulf=function(ei){var ti=new Z(null);return ti.words=Array(this.length+ei.length),E(this,ei,ti)},Z.prototype.imul=function(ei){return this.clone().mulTo(ei,this)},Z.prototype.imuln=function(ei){v('number'==typeof ei),v(67108864>ei);// Carry
var ti=0;for(var oi=0;oi<this.length;oi++){var li=(0|this.words[oi])*ei,ri=(67108863&li)+(67108863&ti);ti>>=26,ti+=0|li/67108864,ti+=ri>>>26,this.words[oi]=67108863&ri}return 0!=ti&&(this.words[oi]=ti,this.length++),this},Z.prototype.muln=function(ei){return this.clone().imuln(ei)},Z.prototype.sqr=function(){return this.mul(this)},Z.prototype.isqr=function(){return this.imul(this.clone())},Z.prototype.pow=function(ei){var ti=I(ei);if(0===ti.length)return new Z(1);// Skip leading zeroes
var oi=this;for(var li=0;li<ti.length&&!(0!==ti[li]);li++,oi=oi.sqr());if(++li<ti.length)for(var ri=oi.sqr();li<ti.length;li++,ri=ri.sqr())0===ti[li]||(oi=oi.mul(ri));return oi},Z.prototype.iushln=function(ei){v('number'==typeof ei&&0<=ei);var ti=ei%26,oi=(ei-ti)/26,li;if(0!=ti){var ri=0;for(li=0;li<this.length;li++){var ni=this.words[li]&67108863>>>26-ti<<26-ti,mi=(0|this.words[li])-ni<<ti;this.words[li]=mi|ri,ri=ni>>>26-ti}ri&&(this.words[li]=ri,this.length++)}if(0!=oi){for(li=this.length-1;0<=li;li--)this.words[li+oi]=this.words[li];for(li=0;li<oi;li++)this.words[li]=0;this.length+=oi}return this.strip()},Z.prototype.ishln=function(ei){return v(0===this.negative),this.iushln(ei)},Z.prototype.iushrn=function(ei,ti,oi){v('number'==typeof ei&&0<=ei);var li;li=ti?(ti-ti%26)/26:0;var ri=ei%26,ni=Math.min((ei-ri)/26,this.length),mi=oi;// Extended mode, copy masked part
if(li-=ni,li=Math.max(0,li),mi){for(var ui=0;ui<ni;ui++)mi.words[ui]=this.words[ui];mi.length=ni}if(0===ni);else if(this.length>ni)for(this.length-=ni,ui=0;ui<this.length;ui++)this.words[ui]=this.words[ui+ni];else this.words[0]=0,this.length=1;var di=0;for(ui=this.length-1;0<=ui&&(0!=di||ui>=li);ui--){var si=0|this.words[ui];this.words[ui]=di<<26-ri|si>>>ri,di=si&(67108863^67108863>>>ri<<ri)}// Push carried bits as a mask
return mi&&0!=di&&(mi.words[mi.length++]=di),0===this.length&&(this.words[0]=0,this.length=1),this.strip()},Z.prototype.ishrn=function(ei,ti,oi){return v(0===this.negative),this.iushrn(ei,ti,oi)},Z.prototype.shln=function(ei){return this.clone().ishln(ei)},Z.prototype.ushln=function(ei){return this.clone().iushln(ei)},Z.prototype.shrn=function(ei){return this.clone().ishrn(ei)},Z.prototype.ushrn=function(ei){return this.clone().iushrn(ei)},Z.prototype.testn=function(ei){v('number'==typeof ei&&0<=ei);var ti=ei%26,oi=(ei-ti)/26;// Fast case: bit is much higher than all existing words
if(this.length<=oi)return!1;// Check bit and return
var li=this.words[oi];return!!(li&1<<ti)},Z.prototype.imaskn=function(ei){v('number'==typeof ei&&0<=ei);var ti=ei%26,oi=(ei-ti)/26;return(v(0===this.negative,'imaskn works only with positive numbers'),this.length<=oi)?this:(0!=ti&&oi++,this.length=Math.min(oi,this.length),0!=ti&&(this.words[this.length-1]&=67108863^67108863>>>ti<<ti),this.strip())},Z.prototype.maskn=function(ei){return this.clone().imaskn(ei)},Z.prototype.iaddn=function(ei){// Add without checks
return v('number'==typeof ei),v(67108864>ei),0>ei?this.isubn(-ei):0===this.negative?this._iaddn(ei):1===this.length&&(0|this.words[0])<ei?(this.words[0]=ei-(0|this.words[0]),this.negative=0,this):(this.negative=0,this.isubn(ei),this.negative=1,this);// Possible sign change
},Z.prototype._iaddn=function(ei){this.words[0]+=ei;// Carry
for(var ti=0;ti<this.length&&67108864<=this.words[ti];ti++)this.words[ti]-=67108864,ti===this.length-1?this.words[ti+1]=1:this.words[ti+1]++;return this.length=Math.max(this.length,ti+1),this},Z.prototype.isubn=function(ei){if(v('number'==typeof ei),v(67108864>ei),0>ei)return this.iaddn(-ei);if(0!==this.negative)return this.negative=0,this.iaddn(ei),this.negative=1,this;if(this.words[0]-=ei,1===this.length&&0>this.words[0])this.words[0]=-this.words[0],this.negative=1;else// Carry
for(var ti=0;ti<this.length&&0>this.words[ti];ti++)this.words[ti]+=67108864,this.words[ti+1]-=1;return this.strip()},Z.prototype.addn=function(ei){return this.clone().iaddn(ei)},Z.prototype.subn=function(ei){return this.clone().isubn(ei)},Z.prototype.iabs=function(){return this.negative=0,this},Z.prototype.abs=function(){return this.clone().iabs()},Z.prototype._ishlnsubmul=function(ei,ti,oi){var ri,li=ei.length+oi;this._expand(li);var ni,mi=0;for(ri=0;ri<ei.length;ri++){ni=(0|this.words[ri+oi])+mi;var ui=(0|ei.words[ri])*ti;ni-=67108863&ui,mi=(ni>>26)-(0|ui/67108864),this.words[ri+oi]=67108863&ni}for(;ri<this.length-oi;ri++)ni=(0|this.words[ri+oi])+mi,mi=ni>>26,this.words[ri+oi]=67108863&ni;if(0==mi)return this.strip();// Subtraction overflow
for(v(-1==mi),mi=0,ri=0;ri<this.length;ri++)ni=-(0|this.words[ri])+mi,mi=ni>>26,this.words[ri]=67108863&ni;return this.negative=1,this.strip()},Z.prototype._wordDiv=function(ei,ti){var oi=this.length-ei.length,li=this.clone(),ri=ei,ni=0|ri.words[ri.length-1],mi=this._countBits(ni);// Normalize
oi=26-mi,0!=oi&&(ri=ri.ushln(oi),li.iushln(oi),ni=0|ri.words[ri.length-1]);// Initialize quotient
var di,ui=li.length-ri.length;if('mod'!==ti){di=new Z(null),di.length=ui+1,di.words=Array(di.length);for(var si=0;si<di.length;si++)di.words[si]=0}var pi=li.clone()._ishlnsubmul(ri,1,ui);0===pi.negative&&(li=pi,di&&(di.words[ui]=1));for(var gi=ui-1;0<=gi;gi--){var fi=67108864*(0|li.words[ri.length+gi])+(0|li.words[ri.length+gi-1]);// NOTE: (qj / bhi) is (0x3ffffff * 0x4000000 + 0x3ffffff) / 0x2000000 max
// (0x7ffffff)
for(fi=Math.min(0|fi/ni,67108863),li._ishlnsubmul(ri,fi,gi);0!==li.negative;)fi--,li.negative=0,li._ishlnsubmul(ri,1,gi),li.isZero()||(li.negative^=1);di&&(di.words[gi]=fi)}return di&&di.strip(),li.strip(),'div'!==ti&&0!=oi&&li.iushrn(oi),{div:di||null,mod:li}},Z.prototype.divmod=function(ei,ti,oi){if(v(!ei.isZero()),this.isZero())return{div:new Z(0),mod:new Z(0)};var li,ri,ni;// Very short reduction
return 0!==this.negative&&0===ei.negative?(ni=this.neg().divmod(ei,ti),'mod'!==ti&&(li=ni.div.neg()),'div'!==ti&&(ri=ni.mod.neg(),oi&&0!==ri.negative&&ri.iadd(ei)),{div:li,mod:ri}):0===this.negative&&0!==ei.negative?(ni=this.divmod(ei.neg(),ti),'mod'!==ti&&(li=ni.div.neg()),{div:li,mod:ni.mod}):0==(this.negative&ei.negative)?ei.length>this.length||0>this.cmp(ei)?{div:new Z(0),mod:this}:1===ei.length?'div'===ti?{div:this.divn(ei.words[0]),mod:null}:'mod'===ti?{div:null,mod:new Z(this.modn(ei.words[0]))}:{div:this.divn(ei.words[0]),mod:new Z(this.modn(ei.words[0]))}:this._wordDiv(ei,ti):(ni=this.neg().divmod(ei.neg(),ti),'div'!==ti&&(ri=ni.mod.neg(),oi&&0!==ri.negative&&ri.isub(ei)),{div:ni.div,mod:ri});// Both numbers are positive at this point
// Strip both numbers to approximate shift value
},Z.prototype.div=function(ei){return this.divmod(ei,'div',!1).div},Z.prototype.mod=function(ei){return this.divmod(ei,'mod',!1).mod},Z.prototype.umod=function(ei){return this.divmod(ei,'mod',!0).mod},Z.prototype.divRound=function(ei){var ti=this.divmod(ei);// Fast case - exact division
if(ti.mod.isZero())return ti.div;var oi=0===ti.div.negative?ti.mod:ti.mod.isub(ei),li=ei.ushrn(1),ri=ei.andln(1),ni=oi.cmp(li);// Round down
return 0>ni||1===ri&&0===ni?ti.div:0===ti.div.negative?ti.div.iaddn(1):ti.div.isubn(1);// Round up
},Z.prototype.modn=function(ei){v(67108863>=ei);var ti=0;for(var oi=this.length-1;0<=oi;oi--)ti=(67108864%ei*ti+(0|this.words[oi]))%ei;return ti},Z.prototype.idivn=function(ei){v(67108863>=ei);var ti=0;for(var oi=this.length-1;0<=oi;oi--){var li=(0|this.words[oi])+67108864*ti;this.words[oi]=0|li/ei,ti=li%ei}return this.strip()},Z.prototype.divn=function(ei){return this.clone().idivn(ei)},Z.prototype.egcd=function(ei){v(0===ei.negative),v(!ei.isZero());var ti=this,oi=ei.clone();ti=0===ti.negative?ti.clone():ti.umod(ei);// A * x + B * y = x
// C * x + D * y = y
for(var li=new Z(1),ri=new Z(0),ni=new Z(0),mi=new Z(1),ui=0;ti.isEven()&&oi.isEven();)ti.iushrn(1),oi.iushrn(1),++ui;for(var di=oi.clone(),si=ti.clone();!ti.isZero();){for(var pi=0,gi=1;0==(ti.words[0]&gi)&&26>pi;++pi,gi<<=1);if(0<pi)for(ti.iushrn(pi);0<pi--;)(li.isOdd()||ri.isOdd())&&(li.iadd(di),ri.isub(si)),li.iushrn(1),ri.iushrn(1);for(var fi=0,ai=1;0==(oi.words[0]&ai)&&26>fi;++fi,ai<<=1);if(0<fi)for(oi.iushrn(fi);0<fi--;)(ni.isOdd()||mi.isOdd())&&(ni.iadd(di),mi.isub(si)),ni.iushrn(1),mi.iushrn(1);0<=ti.cmp(oi)?(ti.isub(oi),li.isub(ni),ri.isub(mi)):(oi.isub(ti),ni.isub(li),mi.isub(ri))}return{a:ni,b:mi,gcd:oi.iushln(ui)}},Z.prototype._invmp=function(ei){v(0===ei.negative),v(!ei.isZero());var ti=this,oi=ei.clone();ti=0===ti.negative?ti.clone():ti.umod(ei);for(var li=new Z(1),ri=new Z(0),ni=oi.clone();0<ti.cmpn(1)&&0<oi.cmpn(1);){for(var mi=0,ui=1;0==(ti.words[0]&ui)&&26>mi;++mi,ui<<=1);if(0<mi)for(ti.iushrn(mi);0<mi--;)li.isOdd()&&li.iadd(ni),li.iushrn(1);for(var di=0,si=1;0==(oi.words[0]&si)&&26>di;++di,si<<=1);if(0<di)for(oi.iushrn(di);0<di--;)ri.isOdd()&&ri.iadd(ni),ri.iushrn(1);0<=ti.cmp(oi)?(ti.isub(oi),li.isub(ri)):(oi.isub(ti),ri.isub(li))}var pi;return pi=0===ti.cmpn(1)?li:ri,0>pi.cmpn(0)&&pi.iadd(ei),pi},Z.prototype.gcd=function(ei){if(this.isZero())return ei.abs();if(ei.isZero())return this.abs();var ti=this.clone(),oi=ei.clone();ti.negative=0,oi.negative=0;// Remove common factor of two
for(var li=0;ti.isEven()&&oi.isEven();li++)ti.iushrn(1),oi.iushrn(1);do{for(;ti.isEven();)ti.iushrn(1);for(;oi.isEven();)oi.iushrn(1);var ri=ti.cmp(oi);if(0>ri){// Swap `a` and `b` to make `a` always bigger than `b`
var ni=ti;ti=oi,oi=ni}else if(0===ri||0===oi.cmpn(1))break;ti.isub(oi)}while(!0);return oi.iushln(li)},Z.prototype.invm=function(ei){return this.egcd(ei).a.umod(ei)},Z.prototype.isEven=function(){return 0==(1&this.words[0])},Z.prototype.isOdd=function(){return 1==(1&this.words[0])},Z.prototype.andln=function(ei){return this.words[0]&ei},Z.prototype.bincn=function(ei){v('number'==typeof ei);var ti=ei%26,oi=(ei-ti)/26,li=1<<ti;// Fast case: bit is much higher than all existing words
if(this.length<=oi)return this._expand(oi+1),this.words[oi]|=li,this;// Add bit and propagate, if needed
var ri=li;for(var ni=oi;0!=ri&&ni<this.length;ni++){var mi=0|this.words[ni];mi+=ri,ri=mi>>>26,mi&=67108863,this.words[ni]=mi}return 0!=ri&&(this.words[ni]=ri,this.length++),this},Z.prototype.isZero=function(){return 1===this.length&&0===this.words[0]},Z.prototype.cmpn=function(ei){var ti=0>ei;if(0!==this.negative&&!ti)return-1;if(0===this.negative&&ti)return 1;this.strip();var oi;if(1<this.length)oi=1;else{ti&&(ei=-ei),v(67108863>=ei,'Number is too big');var li=0|this.words[0];oi=li===ei?0:li<ei?-1:1}return 0===this.negative?oi:0|-oi},Z.prototype.cmp=function(ei){if(0!==this.negative&&0===ei.negative)return-1;if(0===this.negative&&0!==ei.negative)return 1;var ti=this.ucmp(ei);return 0===this.negative?ti:0|-ti},Z.prototype.ucmp=function(ei){// At this point both numbers have the same sign
if(this.length>ei.length)return 1;if(this.length<ei.length)return-1;var ti=0;for(var oi=this.length-1;0<=oi;oi--){var li=0|this.words[oi],ri=0|ei.words[oi];if(li!=ri){li<ri?ti=-1:li>ri&&(ti=1);break}}return ti},Z.prototype.gtn=function(ei){return 1===this.cmpn(ei)},Z.prototype.gt=function(ei){return 1===this.cmp(ei)},Z.prototype.gten=function(ei){return 0<=this.cmpn(ei)},Z.prototype.gte=function(ei){return 0<=this.cmp(ei)},Z.prototype.ltn=function(ei){return-1===this.cmpn(ei)},Z.prototype.lt=function(ei){return-1===this.cmp(ei)},Z.prototype.lten=function(ei){return 0>=this.cmpn(ei)},Z.prototype.lte=function(ei){return 0>=this.cmp(ei)},Z.prototype.eqn=function(ei){return 0===this.cmpn(ei)},Z.prototype.eq=function(ei){return 0===this.cmp(ei)},Z.red=function(ei){return new J(ei)},Z.prototype.toRed=function(ei){return v(!this.red,'Already a number in reduction context'),v(0===this.negative,'red works only with positives'),ei.convertTo(this)._forceRed(ei)},Z.prototype.fromRed=function(){return v(this.red,'fromRed works only with numbers in reduction context'),this.red.convertFrom(this)},Z.prototype._forceRed=function(ei){return this.red=ei,this},Z.prototype.forceRed=function(ei){return v(!this.red,'Already a number in reduction context'),this._forceRed(ei)},Z.prototype.redAdd=function(ei){return v(this.red,'redAdd works only with red numbers'),this.red.add(this,ei)},Z.prototype.redIAdd=function(ei){return v(this.red,'redIAdd works only with red numbers'),this.red.iadd(this,ei)},Z.prototype.redSub=function(ei){return v(this.red,'redSub works only with red numbers'),this.red.sub(this,ei)},Z.prototype.redISub=function(ei){return v(this.red,'redISub works only with red numbers'),this.red.isub(this,ei)},Z.prototype.redShl=function(ei){return v(this.red,'redShl works only with red numbers'),this.red.shl(this,ei)},Z.prototype.redMul=function(ei){return v(this.red,'redMul works only with red numbers'),this.red._verify2(this,ei),this.red.mul(this,ei)},Z.prototype.redIMul=function(ei){return v(this.red,'redMul works only with red numbers'),this.red._verify2(this,ei),this.red.imul(this,ei)},Z.prototype.redSqr=function(){return v(this.red,'redSqr works only with red numbers'),this.red._verify1(this),this.red.sqr(this)},Z.prototype.redISqr=function(){return v(this.red,'redISqr works only with red numbers'),this.red._verify1(this),this.red.isqr(this)},Z.prototype.redSqrt=function(){return v(this.red,'redSqrt works only with red numbers'),this.red._verify1(this),this.red.sqrt(this)},Z.prototype.redInvm=function(){return v(this.red,'redInvm works only with red numbers'),this.red._verify1(this),this.red.invm(this)},Z.prototype.redNeg=function(){return v(this.red,'redNeg works only with red numbers'),this.red._verify1(this),this.red.neg(this)},Z.prototype.redPow=function(ei){return v(this.red&&!ei.red,'redPow(normalNum)'),this.red._verify1(this),this.red.pow(this,ei)};// Prime numbers with efficient reduction
var V={k256:null,p224:null,p192:null,p25519:null};P.prototype._tmp=function(){var ei=new Z(null);return ei.words=Array(Math.ceil(this.n/13)),ei},P.prototype.ireduce=function(ei){// Assumes that `num` is less than `P^2`
// num = HI * (2 ^ N - K) + HI * K + LO = HI * K + LO (mod P)
var oi,ti=ei;do this.split(ti,this.tmp),ti=this.imulK(ti),ti=ti.iadd(this.tmp),oi=ti.bitLength();while(oi>this.n);var li=oi<this.n?-1:ti.ucmp(this.p);return 0===li?(ti.words[0]=0,ti.length=1):0<li?ti.isub(this.p):ti.strip(),ti},P.prototype.split=function(ei,ti){ei.iushrn(this.n,0,ti)},P.prototype.imulK=function(ei){return ei.imul(this.k)},S(K,P),K.prototype.split=function(ei,ti){// 256 = 9 * 26 + 22
var oi=4194303,li=Math.min(ei.length,9);for(var ri=0;ri<li;ri++)ti.words[ri]=ei.words[ri];if(ti.length=li,9>=ei.length)return ei.words[0]=0,void(ei.length=1);// Shift by 9 limbs
var ni=ei.words[9];for(ti.words[ti.length++]=ni&oi,ri=10;ri<ei.length;ri++){var mi=0|ei.words[ri];ei.words[ri-10]=(mi&oi)<<4|ni>>>22,ni=mi}ni>>>=22,ei.words[ri-10]=ni,ei.length-=0===ni&&10<ei.length?10:9},K.prototype.imulK=function(ei){ei.words[ei.length]=0,ei.words[ei.length+1]=0,ei.length+=2;// bounded at: 0x40 * 0x3ffffff + 0x3d0 = 0x100000390
var ti=0;for(var oi=0;oi<ei.length;oi++){var li=0|ei.words[oi];ti+=977*li,ei.words[oi]=67108863&ti,ti=64*li+(0|ti/67108864)}// Fast length reduction
return 0===ei.words[ei.length-1]&&(ei.length--,0===ei.words[ei.length-1]&&ei.length--),ei},S(F,P),S(H,P),S(U,P),U.prototype.imulK=function(ei){// K = 0x13
var ti=0;for(var oi=0;oi<ei.length;oi++){var li=19*(0|ei.words[oi])+ti,ri=67108863&li;li>>>=26,ei.words[oi]=ri,ti=li}return 0!=ti&&(ei.words[ei.length++]=ti),ei},Z._prime=function(ei){// Cached version of prime
if(V[ei])return V[ei];var ii;if('k256'===ei)ii=new K;else if('p224'===ei)ii=new F;else if('p192'===ei)ii=new H;else if('p25519'===ei)ii=new U;else throw new Error('Unknown prime '+ei);return V[ei]=ii,ii},J.prototype._verify1=function(ei){v(0===ei.negative,'red works only with positives'),v(ei.red,'red works only with red numbers')},J.prototype._verify2=function(ei,ti){v(0==(ei.negative|ti.negative),'red works only with positives'),v(ei.red&&ei.red===ti.red,'red works only with red numbers')},J.prototype.imod=function(ei){return this.prime?this.prime.ireduce(ei)._forceRed(this):ei.umod(this.m)._forceRed(this)},J.prototype.neg=function(ei){return ei.isZero()?ei.clone():this.m.sub(ei)._forceRed(this)},J.prototype.add=function(ei,ti){this._verify2(ei,ti);var oi=ei.add(ti);return 0<=oi.cmp(this.m)&&oi.isub(this.m),oi._forceRed(this)},J.prototype.iadd=function(ei,ti){this._verify2(ei,ti);var oi=ei.iadd(ti);return 0<=oi.cmp(this.m)&&oi.isub(this.m),oi},J.prototype.sub=function(ei,ti){this._verify2(ei,ti);var oi=ei.sub(ti);return 0>oi.cmpn(0)&&oi.iadd(this.m),oi._forceRed(this)},J.prototype.isub=function(ei,ti){this._verify2(ei,ti);var oi=ei.isub(ti);return 0>oi.cmpn(0)&&oi.iadd(this.m),oi},J.prototype.shl=function(ei,ti){return this._verify1(ei),this.imod(ei.ushln(ti))},J.prototype.imul=function(ei,ti){return this._verify2(ei,ti),this.imod(ei.imul(ti))},J.prototype.mul=function(ei,ti){return this._verify2(ei,ti),this.imod(ei.mul(ti))},J.prototype.isqr=function(ei){return this.imul(ei,ei.clone())},J.prototype.sqr=function(ei){return this.mul(ei,ei)},J.prototype.sqrt=function(ei){if(ei.isZero())return ei.clone();var ti=this.m.andln(3);// Fast case
if(v(1==ti%2),3===ti){var oi=this.m.add(new Z(1)).iushrn(2);return this.pow(ei,oi)}// Tonelli-Shanks algorithm (Totally unoptimized and slow)
//
// Find Q and S, that Q * 2 ^ S = (P - 1)
for(var li=this.m.subn(1),ri=0;!li.isZero()&&0===li.andln(1);)ri++,li.iushrn(1);v(!li.isZero());var ni=new Z(1).toRed(this),mi=ni.redNeg(),ui=this.m.subn(1).iushrn(1),di=this.m.bitLength();// Find quadratic non-residue
// NOTE: Max is such because of generalized Riemann hypothesis.
for(di=new Z(2*di*di).toRed(this);0!==this.pow(di,ui).cmp(mi);)di.redIAdd(mi);for(var si=this.pow(di,li),pi=this.pow(ei,li.addn(1).iushrn(1)),gi=this.pow(ei,li),fi=ri;0!==gi.cmp(ni);){var ai=gi;for(var wi=0;0!==ai.cmp(ni);wi++)ai=ai.redSqr();v(wi<fi);var yi=this.pow(si,new Z(1).iushln(fi-wi-1));pi=pi.redMul(yi),si=yi.redSqr(),gi=gi.redMul(si),fi=wi}return pi},J.prototype.invm=function(ei){var ti=ei._invmp(this.m);return 0===ti.negative?this.imod(ti):(ti.negative=0,this.imod(ti).redNeg())},J.prototype.pow=function(ei,ti){if(ti.isZero())return new Z(1);if(0===ti.cmpn(1))return ei.clone();var oi=4,li=Array(1<<oi);li[0]=new Z(1).toRed(this),li[1]=ei;for(var ri=2;ri<li.length;ri++)li[ri]=this.mul(li[ri-1],ei);var ni=li[0],mi=0,ui=0,di=ti.bitLength()%26;for(0==di&&(di=26),ri=ti.length-1;0<=ri;ri--){var si=ti.words[ri];for(var pi=di-1;0<=pi;pi--){var gi=1&si>>pi;if(ni!==li[0]&&(ni=this.sqr(ni)),0==gi&&0==mi){ui=0;continue}mi<<=1,mi|=gi,ui++,ui!=oi&&(0!==ri||0!==pi)||(ni=this.mul(ni,li[mi]),ui=0,mi=0)}di=26}return ni},J.prototype.convertTo=function(ei){var ti=ei.umod(this.m);return ti===ei?ti.clone():ti},J.prototype.convertFrom=function(ei){var ti=ei.clone();return ti.red=null,ti},Z.mont=function(ei){return new G(ei)},S(G,J),G.prototype.convertTo=function(ei){return this.imod(ei.ushln(this.shift))},G.prototype.convertFrom=function(ei){var ti=this.imod(ei.mul(this.rinv));return ti.red=null,ti},G.prototype.imul=function(ei,ti){if(ei.isZero()||ti.isZero())return ei.words[0]=0,ei.length=1,ei;var oi=ei.imul(ti),li=oi.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m),ri=oi.isub(li).iushrn(this.shift),ni=ri;return 0<=ri.cmp(this.m)?ni=ri.isub(this.m):0>ri.cmpn(0)&&(ni=ri.iadd(this.m)),ni._forceRed(this)},G.prototype.mul=function(ei,ti){if(ei.isZero()||ti.isZero())return new Z(0)._forceRed(this);var oi=ei.mul(ti),li=oi.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m),ri=oi.isub(li).iushrn(this.shift),ni=ri;return 0<=ri.cmp(this.m)?ni=ri.isub(this.m):0>ri.cmpn(0)&&(ni=ri.iadd(this.m)),ni._forceRed(this)},G.prototype.invm=function(ei){// (AR)^-1 * R^2 = (A^-1 * R^-1) * R^2 = A^-1 * R
var ti=this.imod(ei._invmp(this.m).mul(this.r2));return ti._forceRed(this)}})('undefined'==typeof module||module,void 0);

},{"buffer":9}],5:[function(require,module,exports){
'use strict';var _typeof='function'==typeof Symbol&&'symbol'==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&'function'==typeof Symbol&&obj.constructor===Symbol?'symbol':typeof obj},r;module.exports=function(b){return r||(r=new Rand(null)),r.generate(b)};function Rand(a){this.rand=a}if(module.exports.Rand=Rand,Rand.prototype.generate=function(b){return this._rand(b)},'object'==('undefined'==typeof window?'undefined':_typeof(window)))Rand.prototype._rand=window.crypto&&window.crypto.getRandomValues?function(b){var c=new Uint8Array(b);return window.crypto.getRandomValues(c),c}:window.msCrypto&&window.msCrypto.getRandomValues?function(b){var c=new Uint8Array(b);return window.msCrypto.getRandomValues(c),c}:function(){throw new Error('Not implemented yet')};else// Node.js or Web worker
try{var crypto=require('crypto');Rand.prototype._rand=function(b){return crypto.randomBytes(b)}}catch(a){Rand.prototype._rand=function(c){var d=new Uint8Array(c);for(var f=0;f<d.length;f++)d[f]=this.rand.getByte();return d}}

},{"crypto":6}],6:[function(require,module,exports){
"use strict";

},{}],7:[function(require,module,exports){
(function (Buffer){
'use strict';var Sha3=require('js-sha3'),hashLengths=[224,256,384,512],hash=function hash(a){if(a!==void 0&&-1==hashLengths.indexOf(a))throw new Error('Unsupported hash length');this.content=[],this.bitcount=a?'keccak_'+a:'keccak_512'};hash.prototype.update=function(a){if(Buffer.isBuffer(a))this.content.push(a);else if('string'==typeof a)this.content.push(new Buffer(a));else throw new Error('Unsupported argument to update');return this},hash.prototype.digest=function(a){var b=Sha3[this.bitcount](Buffer.concat(this.content));if('hex'===a)return b;if('binary'===a||void 0===a)return new Buffer(b,'hex').toString('binary');throw new Error('Unsupported encoding for digest: '+a)},module.exports={SHA3Hash:hash};

}).call(this,require("buffer").Buffer)
},{"buffer":9,"js-sha3":47}],8:[function(require,module,exports){
(function (global){
'use strict';var buffer=require('buffer'),Buffer=buffer.Buffer,SlowBuffer=buffer.SlowBuffer,MAX_LEN=buffer.kMaxLength||2147483647;exports.alloc=function(b,c,d){if('function'==typeof Buffer.alloc)return Buffer.alloc(b,c,d);if('number'==typeof d)throw new TypeError('encoding must not be number');if('number'!=typeof b)throw new TypeError('size must be a number');if(b>MAX_LEN)throw new RangeError('size is too large');var e=d,f=c;f===void 0&&(e=void 0,f=0);var g=new Buffer(b);if('string'==typeof f)for(var h=new Buffer(f,e),j=h.length,k=-1;++k<b;)g[k]=h[k%j];else g.fill(f);return g},exports.allocUnsafe=function(b){if('function'==typeof Buffer.allocUnsafe)return Buffer.allocUnsafe(b);if('number'!=typeof b)throw new TypeError('size must be a number');if(b>MAX_LEN)throw new RangeError('size is too large');return new Buffer(b)},exports.from=function(b,c,d){if('function'==typeof Buffer.from&&(!global.Uint8Array||Uint8Array.from!==Buffer.from))return Buffer.from(b,c,d);if('number'==typeof b)throw new TypeError('"value" argument must not be a number');if('string'==typeof b)return new Buffer(b,c);if('undefined'!=typeof ArrayBuffer&&b instanceof ArrayBuffer){var e=c;if(1===arguments.length)return new Buffer(b);'undefined'==typeof e&&(e=0);var f=d;if('undefined'==typeof f&&(f=b.byteLength-e),e>=b.byteLength)throw new RangeError('\'offset\' is out of bounds');if(f>b.byteLength-e)throw new RangeError('\'length\' is out of bounds');return new Buffer(b.slice(e,e+f))}if(Buffer.isBuffer(b)){var g=new Buffer(b.length);return b.copy(g,0,0,b.length),g}if(b){if(Array.isArray(b)||'undefined'!=typeof ArrayBuffer&&b.buffer instanceof ArrayBuffer||'length'in b)return new Buffer(b);if('Buffer'===b.type&&Array.isArray(b.data))return new Buffer(b.data)}throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')},exports.allocUnsafeSlow=function(b){if('function'==typeof Buffer.allocUnsafeSlow)return Buffer.allocUnsafeSlow(b);if('number'!=typeof b)throw new TypeError('size must be a number');if(b>=MAX_LEN)throw new RangeError('size is too large');return new SlowBuffer(b)};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"buffer":9}],9:[function(require,module,exports){
(function (global){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 *//* eslint-disable no-proto */'use strict';var base64=require('base64-js'),ieee754=require('ieee754'),isArray=require('isarray');exports.Buffer=Buffer,exports.SlowBuffer=SlowBuffer,exports.INSPECT_MAX_BYTES=50,Buffer.TYPED_ARRAY_SUPPORT=global.TYPED_ARRAY_SUPPORT===void 0?typedArraySupport():global.TYPED_ARRAY_SUPPORT,exports.kMaxLength=kMaxLength();function typedArraySupport(){try{var d=new Uint8Array(1);return d.__proto__={__proto__:Uint8Array.prototype,foo:function foo(){return 42}},42===d.foo()&&// typed array instances can be augmented
'function'==typeof d.subarray&&// chrome 9-10 lack `subarray`
0===d.subarray(1,1).byteLength;// ie10 has broken `subarray`
}catch(f){return!1}}function kMaxLength(){return Buffer.TYPED_ARRAY_SUPPORT?2147483647:1073741823}function createBuffer(d,f){if(kMaxLength()<f)throw new RangeError('Invalid typed array length');return Buffer.TYPED_ARRAY_SUPPORT?(d=new Uint8Array(f),d.__proto__=Buffer.prototype):(null===d&&(d=new Buffer(f)),d.length=f),d}/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */function Buffer(d,f,g){if(!Buffer.TYPED_ARRAY_SUPPORT&&!(this instanceof Buffer))return new Buffer(d,f,g);// Common case.
if('number'==typeof d){if('string'==typeof f)throw new Error('If encoding is specified then the first argument must be a string');return allocUnsafe(this,d)}return from(this,d,f,g)}Buffer.poolSize=8192,Buffer._augment=function(d){return d.__proto__=Buffer.prototype,d};function from(d,f,g,h){if('number'==typeof f)throw new TypeError('"value" argument must not be a number');return'undefined'!=typeof ArrayBuffer&&f instanceof ArrayBuffer?fromArrayBuffer(d,f,g,h):'string'==typeof f?fromString(d,f,g):fromObject(d,f)}/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/Buffer.from=function(d,f,g){return from(null,d,f,g)},Buffer.TYPED_ARRAY_SUPPORT&&(Buffer.prototype.__proto__=Uint8Array.prototype,Buffer.__proto__=Uint8Array,'undefined'!=typeof Symbol&&Symbol.species&&Buffer[Symbol.species]===Buffer&&Object.defineProperty(Buffer,Symbol.species,{value:null,configurable:!0}));function assertSize(d){if('number'!=typeof d)throw new TypeError('"size" argument must be a number');else if(0>d)throw new RangeError('"size" argument must not be negative')}function alloc(d,f,g,h){return assertSize(f),0>=f?createBuffer(d,f):void 0===g?createBuffer(d,f):'string'==typeof h?createBuffer(d,f).fill(g,h):createBuffer(d,f).fill(g)}/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/Buffer.alloc=function(d,f,g){return alloc(null,d,f,g)};function allocUnsafe(d,f){if(assertSize(f),d=createBuffer(d,0>f?0:0|checked(f)),!Buffer.TYPED_ARRAY_SUPPORT)for(var g=0;g<f;++g)d[g]=0;return d}/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */Buffer.allocUnsafe=function(d){return allocUnsafe(null,d)},Buffer.allocUnsafeSlow=function(d){return allocUnsafe(null,d)};function fromString(d,f,g){if(('string'!=typeof g||''===g)&&(g='utf8'),!Buffer.isEncoding(g))throw new TypeError('"encoding" must be a valid string encoding');var h=0|byteLength(f,g);d=createBuffer(d,h);var k=d.write(f,g);return k!==h&&(d=d.slice(0,k)),d}function fromArrayLike(d,f){var g=0>f.length?0:0|checked(f.length);d=createBuffer(d,g);for(var h=0;h<g;h+=1)d[h]=255&f[h];return d}function fromArrayBuffer(d,f,g,h){// this throws if `array` is not a valid ArrayBuffer
if(f.byteLength,0>g||f.byteLength<g)throw new RangeError('\'offset\' is out of bounds');if(f.byteLength<g+(h||0))throw new RangeError('\'length\' is out of bounds');return f=void 0===g&&void 0===h?new Uint8Array(f):void 0===h?new Uint8Array(f,g):new Uint8Array(f,g,h),Buffer.TYPED_ARRAY_SUPPORT?(d=f,d.__proto__=Buffer.prototype):d=fromArrayLike(d,f),d}function fromObject(d,f){if(Buffer.isBuffer(f)){var g=0|checked(f.length);return(d=createBuffer(d,g),0===d.length)?d:(f.copy(d,0,0,g),d)}if(f){if('undefined'!=typeof ArrayBuffer&&f.buffer instanceof ArrayBuffer||'length'in f)return'number'!=typeof f.length||isnan(f.length)?createBuffer(d,0):fromArrayLike(d,f);if('Buffer'===f.type&&isArray(f.data))return fromArrayLike(d,f.data)}throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')}function checked(d){// Note: cannot use `length < kMaxLength()` here because that fails when
// length is NaN (which is otherwise coerced to zero.)
if(d>=kMaxLength())throw new RangeError('Attempt to allocate Buffer larger than maximum size: 0x'+kMaxLength().toString(16)+' bytes');return 0|d}function SlowBuffer(d){return+d!=d&&(d=0),Buffer.alloc(+d)}Buffer.isBuffer=function(f){return!!(null!=f&&f._isBuffer)},Buffer.compare=function(f,g){if(!Buffer.isBuffer(f)||!Buffer.isBuffer(g))throw new TypeError('Arguments must be Buffers');if(f===g)return 0;var h=f.length,k=g.length;for(var l=0,o=Math.min(h,k);l<o;++l)if(f[l]!==g[l]){h=f[l],k=g[l];break}return h<k?-1:k<h?1:0},Buffer.isEncoding=function(f){switch((f+'').toLowerCase()){case'hex':case'utf8':case'utf-8':case'ascii':case'latin1':case'binary':case'base64':case'ucs2':case'ucs-2':case'utf16le':case'utf-16le':return!0;default:return!1;}},Buffer.concat=function(f,g){if(!isArray(f))throw new TypeError('"list" argument must be an Array of Buffers');if(0===f.length)return Buffer.alloc(0);var h;if(g===void 0)for(g=0,h=0;h<f.length;++h)g+=f[h].length;var k=Buffer.allocUnsafe(g),l=0;for(h=0;h<f.length;++h){var o=f[h];if(!Buffer.isBuffer(o))throw new TypeError('"list" argument must be an Array of Buffers');o.copy(k,l),l+=o.length}return k};function byteLength(d,f){if(Buffer.isBuffer(d))return d.length;if('undefined'!=typeof ArrayBuffer&&'function'==typeof ArrayBuffer.isView&&(ArrayBuffer.isView(d)||d instanceof ArrayBuffer))return d.byteLength;'string'!=typeof d&&(d=''+d);var g=d.length;if(0===g)return 0;// Use a for loop to avoid recursion
for(var h=!1;;)switch(f){case'ascii':case'latin1':case'binary':return g;case'utf8':case'utf-8':case void 0:return utf8ToBytes(d).length;case'ucs2':case'ucs-2':case'utf16le':case'utf-16le':return 2*g;case'hex':return g>>>1;case'base64':return base64ToBytes(d).length;default:if(h)return utf8ToBytes(d).length;// assume utf8
f=(''+f).toLowerCase(),h=!0;}}Buffer.byteLength=byteLength;function slowToString(d,f,g){var h=!1;// No need to verify that "this.length <= MAX_UINT32" since it's a read-only
// property of a typed array.
// This behaves neither like String nor Uint8Array in that we set start/end
// to their upper/lower bounds if the value passed is out of range.
// undefined is handled specially as per ECMA-262 6th Edition,
// Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
// Return early if start > this.length. Done here to prevent potential uint32
// coercion fail below.
if((void 0===f||0>f)&&(f=0),f>this.length)return'';if((void 0===g||g>this.length)&&(g=this.length),0>=g)return'';// Force coersion to uint32. This will also coerce falsey/NaN values to 0.
if(g>>>=0,f>>>=0,g<=f)return'';for(d||(d='utf8');!0;)switch(d){case'hex':return hexSlice(this,f,g);case'utf8':case'utf-8':return utf8Slice(this,f,g);case'ascii':return asciiSlice(this,f,g);case'latin1':case'binary':return latin1Slice(this,f,g);case'base64':return base64Slice(this,f,g);case'ucs2':case'ucs-2':case'utf16le':case'utf-16le':return utf16leSlice(this,f,g);default:if(h)throw new TypeError('Unknown encoding: '+d);d=(d+'').toLowerCase(),h=!0;}}// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer=!0;function swap(d,f,g){var h=d[f];d[f]=d[g],d[g]=h}Buffer.prototype.swap16=function(){var f=this.length;if(0!=f%2)throw new RangeError('Buffer size must be a multiple of 16-bits');for(var g=0;g<f;g+=2)swap(this,g,g+1);return this},Buffer.prototype.swap32=function(){var f=this.length;if(0!=f%4)throw new RangeError('Buffer size must be a multiple of 32-bits');for(var g=0;g<f;g+=4)swap(this,g,g+3),swap(this,g+1,g+2);return this},Buffer.prototype.swap64=function(){var f=this.length;if(0!=f%8)throw new RangeError('Buffer size must be a multiple of 64-bits');for(var g=0;g<f;g+=8)swap(this,g,g+7),swap(this,g+1,g+6),swap(this,g+2,g+5),swap(this,g+3,g+4);return this},Buffer.prototype.toString=function(){var f=0|this.length;return 0==f?'':0===arguments.length?utf8Slice(this,0,f):slowToString.apply(this,arguments)},Buffer.prototype.equals=function(f){if(!Buffer.isBuffer(f))throw new TypeError('Argument must be a Buffer');return this===f||0===Buffer.compare(this,f)},Buffer.prototype.inspect=function(){var f='',g=exports.INSPECT_MAX_BYTES;return 0<this.length&&(f=this.toString('hex',0,g).match(/.{2}/g).join(' '),this.length>g&&(f+=' ... ')),'<Buffer '+f+'>'},Buffer.prototype.compare=function(f,g,h,k,l){if(!Buffer.isBuffer(f))throw new TypeError('Argument must be a Buffer');if(void 0===g&&(g=0),void 0===h&&(h=f?f.length:0),void 0===k&&(k=0),void 0===l&&(l=this.length),0>g||h>f.length||0>k||l>this.length)throw new RangeError('out of range index');if(k>=l&&g>=h)return 0;if(k>=l)return-1;if(g>=h)return 1;if(g>>>=0,h>>>=0,k>>>=0,l>>>=0,this===f)return 0;var o=l-k,p=h-g,q=Math.min(o,p),r=this.slice(k,l),s=f.slice(g,h);for(var t=0;t<q;++t)if(r[t]!==s[t]){o=r[t],p=s[t];break}return o<p?-1:p<o?1:0};// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf(d,f,g,h,k){// Empty buffer means no match
if(0===d.length)return-1;// Normalize byteOffset
if('string'==typeof g?(h=g,g=0):2147483647<g?g=2147483647:-2147483648>g&&(g=-2147483648),g=+g,isNaN(g)&&(g=k?0:d.length-1),0>g&&(g=d.length+g),g>=d.length){if(k)return-1;g=d.length-1}else if(0>g)if(k)g=0;else return-1;// Normalize val
// Finally, search either indexOf (if dir is true) or lastIndexOf
if('string'==typeof f&&(f=Buffer.from(f,h)),Buffer.isBuffer(f))// Special case: looking for empty string/buffer always fails
return 0===f.length?-1:arrayIndexOf(d,f,g,h,k);if('number'==typeof f)// Search for a byte value [0-255]
return(f=255&f,Buffer.TYPED_ARRAY_SUPPORT&&'function'==typeof Uint8Array.prototype.indexOf)?k?Uint8Array.prototype.indexOf.call(d,f,g):Uint8Array.prototype.lastIndexOf.call(d,f,g):arrayIndexOf(d,[f],g,h,k);throw new TypeError('val must be string, number or Buffer')}function arrayIndexOf(d,f,g,h,k){function l(v,w){return 1===o?v[w]:v.readUInt16BE(w*o)}var o=1,p=d.length,q=f.length;if(void 0!==h&&(h=(h+'').toLowerCase(),'ucs2'===h||'ucs-2'===h||'utf16le'===h||'utf-16le'===h)){if(2>d.length||2>f.length)return-1;o=2,p/=2,q/=2,g/=2}var r;if(k){var s=-1;for(r=g;r<p;r++)if(l(d,r)!==l(f,-1==s?0:r-s))-1!=s&&(r-=r-s),s=-1;else if(-1==s&&(s=r),r-s+1===q)return s*o}else for(g+q>p&&(g=p-q),r=g;0<=r;r--){var t=!0;for(var u=0;u<q;u++)if(l(d,r+u)!==l(f,u)){t=!1;break}if(t)return r}return-1}Buffer.prototype.includes=function(f,g,h){return-1!==this.indexOf(f,g,h)},Buffer.prototype.indexOf=function(f,g,h){return bidirectionalIndexOf(this,f,g,h,!0)},Buffer.prototype.lastIndexOf=function(f,g,h){return bidirectionalIndexOf(this,f,g,h,!1)};function hexWrite(d,f,g,h){g=+g||0;var k=d.length-g;h?(h=+h,h>k&&(h=k)):h=k;// must be an even number of digits
var l=f.length;if(0!=l%2)throw new TypeError('Invalid hex string');h>l/2&&(h=l/2);for(var o=0;o<h;++o){var p=parseInt(f.substr(2*o,2),16);if(isNaN(p))return o;d[g+o]=p}return o}function utf8Write(d,f,g,h){return blitBuffer(utf8ToBytes(f,d.length-g),d,g,h)}function asciiWrite(d,f,g,h){return blitBuffer(asciiToBytes(f),d,g,h)}function latin1Write(d,f,g,h){return asciiWrite(d,f,g,h)}function base64Write(d,f,g,h){return blitBuffer(base64ToBytes(f),d,g,h)}function ucs2Write(d,f,g,h){return blitBuffer(utf16leToBytes(f,d.length-g),d,g,h)}Buffer.prototype.write=function(f,g,h,k){// Buffer#write(string)
if(void 0===g)k='utf8',h=this.length,g=0;else if(void 0===h&&'string'==typeof g)k=g,h=this.length,g=0;else if(isFinite(g))g=0|g,isFinite(h)?(h=0|h,void 0===k&&(k='utf8')):(k=h,h=void 0);else throw new Error('Buffer.write(string, encoding, offset[, length]) is no longer supported');var l=this.length-g;if((void 0===h||h>l)&&(h=l),0<f.length&&(0>h||0>g)||g>this.length)throw new RangeError('Attempt to write outside buffer bounds');k||(k='utf8');for(var o=!1;;)switch(k){case'hex':return hexWrite(this,f,g,h);case'utf8':case'utf-8':return utf8Write(this,f,g,h);case'ascii':return asciiWrite(this,f,g,h);case'latin1':case'binary':return latin1Write(this,f,g,h);case'base64':// Warning: maxLength not taken into account in base64Write
return base64Write(this,f,g,h);case'ucs2':case'ucs-2':case'utf16le':case'utf-16le':return ucs2Write(this,f,g,h);default:if(o)throw new TypeError('Unknown encoding: '+k);k=(''+k).toLowerCase(),o=!0;}},Buffer.prototype.toJSON=function(){return{type:'Buffer',data:Array.prototype.slice.call(this._arr||this,0)}};function base64Slice(d,f,g){return 0===f&&g===d.length?base64.fromByteArray(d):base64.fromByteArray(d.slice(f,g))}function utf8Slice(d,f,g){g=Math.min(d.length,g);for(var h=[],k=f;k<g;){var l=d[k],o=null,p=239<l?4:223<l?3:191<l?2:1;if(k+p<=g){var q,r,s,t;1==p?128>l&&(o=l):2==p?(q=d[k+1],128==(192&q)&&(t=(31&l)<<6|63&q,127<t&&(o=t))):3==p?(q=d[k+1],r=d[k+2],128==(192&q)&&128==(192&r)&&(t=(15&l)<<12|(63&q)<<6|63&r,2047<t&&(55296>t||57343<t)&&(o=t))):4==p?(q=d[k+1],r=d[k+2],s=d[k+3],128==(192&q)&&128==(192&r)&&128==(192&s)&&(t=(15&l)<<18|(63&q)<<12|(63&r)<<6|63&s,65535<t&&1114112>t&&(o=t))):void 0}null===o?(o=65533,p=1):65535<o&&(o-=65536,h.push(55296|1023&o>>>10),o=56320|1023&o),h.push(o),k+=p}return decodeCodePointsArray(h)}// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH=4096;function decodeCodePointsArray(d){var f=d.length;if(f<=MAX_ARGUMENTS_LENGTH)return String.fromCharCode.apply(String,d);// avoid extra slice()
// Decode in chunks to avoid "call stack size exceeded".
for(var g='',h=0;h<f;)g+=String.fromCharCode.apply(String,d.slice(h,h+=MAX_ARGUMENTS_LENGTH));return g}function asciiSlice(d,f,g){var h='';g=Math.min(d.length,g);for(var k=f;k<g;++k)h+=String.fromCharCode(127&d[k]);return h}function latin1Slice(d,f,g){var h='';g=Math.min(d.length,g);for(var k=f;k<g;++k)h+=String.fromCharCode(d[k]);return h}function hexSlice(d,f,g){var h=d.length;(!f||0>f)&&(f=0),(!g||0>g||g>h)&&(g=h);var k='';for(var l=f;l<g;++l)k+=toHex(d[l]);return k}function utf16leSlice(d,f,g){var h=d.slice(f,g),k='';for(var l=0;l<h.length;l+=2)k+=String.fromCharCode(h[l]+256*h[l+1]);return k}Buffer.prototype.slice=function(f,g){var h=this.length;f=~~f,g=g===void 0?h:~~g,0>f?(f+=h,0>f&&(f=0)):f>h&&(f=h),0>g?(g+=h,0>g&&(g=0)):g>h&&(g=h),g<f&&(g=f);var k;if(Buffer.TYPED_ARRAY_SUPPORT)k=this.subarray(f,g),k.__proto__=Buffer.prototype;else{var l=g-f;k=new Buffer(l,void 0);for(var o=0;o<l;++o)k[o]=this[o+f]}return k};/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */function checkOffset(d,f,g){if(0!=d%1||0>d)throw new RangeError('offset is not uint');if(d+f>g)throw new RangeError('Trying to access beyond buffer length')}Buffer.prototype.readUIntLE=function(f,g,h){f=0|f,g=0|g,h||checkOffset(f,g,this.length);for(var k=this[f],l=1,o=0;++o<g&&(l*=256);)k+=this[f+o]*l;return k},Buffer.prototype.readUIntBE=function(f,g,h){f=0|f,g=0|g,h||checkOffset(f,g,this.length);for(var k=this[f+--g],l=1;0<g&&(l*=256);)k+=this[f+--g]*l;return k},Buffer.prototype.readUInt8=function(f,g){return g||checkOffset(f,1,this.length),this[f]},Buffer.prototype.readUInt16LE=function(f,g){return g||checkOffset(f,2,this.length),this[f]|this[f+1]<<8},Buffer.prototype.readUInt16BE=function(f,g){return g||checkOffset(f,2,this.length),this[f]<<8|this[f+1]},Buffer.prototype.readUInt32LE=function(f,g){return g||checkOffset(f,4,this.length),(this[f]|this[f+1]<<8|this[f+2]<<16)+16777216*this[f+3]},Buffer.prototype.readUInt32BE=function(f,g){return g||checkOffset(f,4,this.length),16777216*this[f]+(this[f+1]<<16|this[f+2]<<8|this[f+3])},Buffer.prototype.readIntLE=function(f,g,h){f=0|f,g=0|g,h||checkOffset(f,g,this.length);for(var k=this[f],l=1,o=0;++o<g&&(l*=256);)k+=this[f+o]*l;return l*=128,k>=l&&(k-=Math.pow(2,8*g)),k},Buffer.prototype.readIntBE=function(f,g,h){f=0|f,g=0|g,h||checkOffset(f,g,this.length);for(var k=g,l=1,o=this[f+--k];0<k&&(l*=256);)o+=this[f+--k]*l;return l*=128,o>=l&&(o-=Math.pow(2,8*g)),o},Buffer.prototype.readInt8=function(f,g){return g||checkOffset(f,1,this.length),128&this[f]?-1*(255-this[f]+1):this[f]},Buffer.prototype.readInt16LE=function(f,g){g||checkOffset(f,2,this.length);var h=this[f]|this[f+1]<<8;return 32768&h?4294901760|h:h},Buffer.prototype.readInt16BE=function(f,g){g||checkOffset(f,2,this.length);var h=this[f+1]|this[f]<<8;return 32768&h?4294901760|h:h},Buffer.prototype.readInt32LE=function(f,g){return g||checkOffset(f,4,this.length),this[f]|this[f+1]<<8|this[f+2]<<16|this[f+3]<<24},Buffer.prototype.readInt32BE=function(f,g){return g||checkOffset(f,4,this.length),this[f]<<24|this[f+1]<<16|this[f+2]<<8|this[f+3]},Buffer.prototype.readFloatLE=function(f,g){return g||checkOffset(f,4,this.length),ieee754.read(this,f,!0,23,4)},Buffer.prototype.readFloatBE=function(f,g){return g||checkOffset(f,4,this.length),ieee754.read(this,f,!1,23,4)},Buffer.prototype.readDoubleLE=function(f,g){return g||checkOffset(f,8,this.length),ieee754.read(this,f,!0,52,8)},Buffer.prototype.readDoubleBE=function(f,g){return g||checkOffset(f,8,this.length),ieee754.read(this,f,!1,52,8)};function checkInt(d,f,g,h,k,l){if(!Buffer.isBuffer(d))throw new TypeError('"buffer" argument must be a Buffer instance');if(f>k||f<l)throw new RangeError('"value" argument is out of bounds');if(g+h>d.length)throw new RangeError('Index out of range')}Buffer.prototype.writeUIntLE=function(f,g,h,k){if(f=+f,g=0|g,h=0|h,!k){var l=Math.pow(2,8*h)-1;checkInt(this,f,g,h,l,0)}var o=1,p=0;for(this[g]=255&f;++p<h&&(o*=256);)this[g+p]=255&f/o;return g+h},Buffer.prototype.writeUIntBE=function(f,g,h,k){if(f=+f,g=0|g,h=0|h,!k){var l=Math.pow(2,8*h)-1;checkInt(this,f,g,h,l,0)}var o=h-1,p=1;for(this[g+o]=255&f;0<=--o&&(p*=256);)this[g+o]=255&f/p;return g+h},Buffer.prototype.writeUInt8=function(f,g,h){return f=+f,g=0|g,h||checkInt(this,f,g,1,255,0),Buffer.TYPED_ARRAY_SUPPORT||(f=Math.floor(f)),this[g]=255&f,g+1};function objectWriteUInt16(d,f,g,h){0>f&&(f=65535+f+1);for(var k=0,l=Math.min(d.length-g,2);k<l;++k)d[g+k]=(f&255<<8*(h?k:1-k))>>>8*(h?k:1-k)}Buffer.prototype.writeUInt16LE=function(f,g,h){return f=+f,g=0|g,h||checkInt(this,f,g,2,65535,0),Buffer.TYPED_ARRAY_SUPPORT?(this[g]=255&f,this[g+1]=f>>>8):objectWriteUInt16(this,f,g,!0),g+2},Buffer.prototype.writeUInt16BE=function(f,g,h){return f=+f,g=0|g,h||checkInt(this,f,g,2,65535,0),Buffer.TYPED_ARRAY_SUPPORT?(this[g]=f>>>8,this[g+1]=255&f):objectWriteUInt16(this,f,g,!1),g+2};function objectWriteUInt32(d,f,g,h){0>f&&(f=4294967295+f+1);for(var k=0,l=Math.min(d.length-g,4);k<l;++k)d[g+k]=255&f>>>8*(h?k:3-k)}Buffer.prototype.writeUInt32LE=function(f,g,h){return f=+f,g=0|g,h||checkInt(this,f,g,4,4294967295,0),Buffer.TYPED_ARRAY_SUPPORT?(this[g+3]=f>>>24,this[g+2]=f>>>16,this[g+1]=f>>>8,this[g]=255&f):objectWriteUInt32(this,f,g,!0),g+4},Buffer.prototype.writeUInt32BE=function(f,g,h){return f=+f,g=0|g,h||checkInt(this,f,g,4,4294967295,0),Buffer.TYPED_ARRAY_SUPPORT?(this[g]=f>>>24,this[g+1]=f>>>16,this[g+2]=f>>>8,this[g+3]=255&f):objectWriteUInt32(this,f,g,!1),g+4},Buffer.prototype.writeIntLE=function(f,g,h,k){if(f=+f,g=0|g,!k){var l=Math.pow(2,8*h-1);checkInt(this,f,g,h,l-1,-l)}var o=0,p=1,q=0;for(this[g]=255&f;++o<h&&(p*=256);)0>f&&0==q&&0!==this[g+o-1]&&(q=1),this[g+o]=255&(f/p>>0)-q;return g+h},Buffer.prototype.writeIntBE=function(f,g,h,k){if(f=+f,g=0|g,!k){var l=Math.pow(2,8*h-1);checkInt(this,f,g,h,l-1,-l)}var o=h-1,p=1,q=0;for(this[g+o]=255&f;0<=--o&&(p*=256);)0>f&&0==q&&0!==this[g+o+1]&&(q=1),this[g+o]=255&(f/p>>0)-q;return g+h},Buffer.prototype.writeInt8=function(f,g,h){return f=+f,g=0|g,h||checkInt(this,f,g,1,127,-128),Buffer.TYPED_ARRAY_SUPPORT||(f=Math.floor(f)),0>f&&(f=255+f+1),this[g]=255&f,g+1},Buffer.prototype.writeInt16LE=function(f,g,h){return f=+f,g=0|g,h||checkInt(this,f,g,2,32767,-32768),Buffer.TYPED_ARRAY_SUPPORT?(this[g]=255&f,this[g+1]=f>>>8):objectWriteUInt16(this,f,g,!0),g+2},Buffer.prototype.writeInt16BE=function(f,g,h){return f=+f,g=0|g,h||checkInt(this,f,g,2,32767,-32768),Buffer.TYPED_ARRAY_SUPPORT?(this[g]=f>>>8,this[g+1]=255&f):objectWriteUInt16(this,f,g,!1),g+2},Buffer.prototype.writeInt32LE=function(f,g,h){return f=+f,g=0|g,h||checkInt(this,f,g,4,2147483647,-2147483648),Buffer.TYPED_ARRAY_SUPPORT?(this[g]=255&f,this[g+1]=f>>>8,this[g+2]=f>>>16,this[g+3]=f>>>24):objectWriteUInt32(this,f,g,!0),g+4},Buffer.prototype.writeInt32BE=function(f,g,h){return f=+f,g=0|g,h||checkInt(this,f,g,4,2147483647,-2147483648),0>f&&(f=4294967295+f+1),Buffer.TYPED_ARRAY_SUPPORT?(this[g]=f>>>24,this[g+1]=f>>>16,this[g+2]=f>>>8,this[g+3]=255&f):objectWriteUInt32(this,f,g,!1),g+4};function checkIEEE754(d,f,g,h,k,l){if(g+h>d.length)throw new RangeError('Index out of range');if(0>g)throw new RangeError('Index out of range')}function writeFloat(d,f,g,h,k){return k||checkIEEE754(d,f,g,4,3.4028234663852886e+38,-3.4028234663852886e+38),ieee754.write(d,f,g,h,23,4),g+4}Buffer.prototype.writeFloatLE=function(f,g,h){return writeFloat(this,f,g,!0,h)},Buffer.prototype.writeFloatBE=function(f,g,h){return writeFloat(this,f,g,!1,h)};function writeDouble(d,f,g,h,k){return k||checkIEEE754(d,f,g,8,1.7976931348623157e+308,-1.7976931348623157e+308),ieee754.write(d,f,g,h,52,8),g+8}Buffer.prototype.writeDoubleLE=function(f,g,h){return writeDouble(this,f,g,!0,h)},Buffer.prototype.writeDoubleBE=function(f,g,h){return writeDouble(this,f,g,!1,h)},Buffer.prototype.copy=function(f,g,h,k){// Copy 0 bytes; we're done
if(h||(h=0),k||0===k||(k=this.length),g>=f.length&&(g=f.length),g||(g=0),0<k&&k<h&&(k=h),k===h)return 0;if(0===f.length||0===this.length)return 0;// Fatal error conditions
if(0>g)throw new RangeError('targetStart out of bounds');if(0>h||h>=this.length)throw new RangeError('sourceStart out of bounds');if(0>k)throw new RangeError('sourceEnd out of bounds');// Are we oob?
k>this.length&&(k=this.length),f.length-g<k-h&&(k=f.length-g+h);var o,l=k-h;if(this===f&&h<g&&g<k)// descending copy from end
for(o=l-1;0<=o;--o)f[o+g]=this[o+h];else if(1000>l||!Buffer.TYPED_ARRAY_SUPPORT)// ascending copy from start
for(o=0;o<l;++o)f[o+g]=this[o+h];else Uint8Array.prototype.set.call(f,this.subarray(h,h+l),g);return l},Buffer.prototype.fill=function(f,g,h,k){// Handle string cases:
if('string'==typeof f){if('string'==typeof g?(k=g,g=0,h=this.length):'string'==typeof h&&(k=h,h=this.length),1===f.length){var l=f.charCodeAt(0);256>l&&(f=l)}if(void 0!==k&&'string'!=typeof k)throw new TypeError('encoding must be a string');if('string'==typeof k&&!Buffer.isEncoding(k))throw new TypeError('Unknown encoding: '+k)}else'number'==typeof f&&(f=255&f);// Invalid ranges are not set to a default, so can range check early.
if(0>g||this.length<g||this.length<h)throw new RangeError('Out of range index');if(h<=g)return this;g=g>>>0,h=h===void 0?this.length:h>>>0,f||(f=0);var o;if('number'==typeof f)for(o=g;o<h;++o)this[o]=f;else{var p=Buffer.isBuffer(f)?f:utf8ToBytes(new Buffer(f,k).toString()),q=p.length;for(o=0;o<h-g;++o)this[o+g]=p[o%q]}return this};// HELPER FUNCTIONS
// ================
var INVALID_BASE64_RE=/[^+\/0-9A-Za-z-_]/g;function base64clean(d){// Node converts strings with length < 2 to ''
if(d=stringtrim(d).replace(INVALID_BASE64_RE,''),2>d.length)return'';// Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
for(;0!=d.length%4;)d=d+'=';return d}function stringtrim(d){return d.trim?d.trim():d.replace(/^\s+|\s+$/g,'')}function toHex(d){return 16>d?'0'+d.toString(16):d.toString(16)}function utf8ToBytes(d,f){f=f||1/0;var g,h=d.length,k=null,l=[];for(var o=0;o<h;++o){// is surrogate component
if(g=d.charCodeAt(o),55295<g&&57344>g){// last char was a lead
if(!k){// no lead yet
if(56319<g){-1<(f-=3)&&l.push(239,191,189);continue}else if(o+1===h){-1<(f-=3)&&l.push(239,191,189);continue}// valid lead
k=g;continue}// 2 leads in a row
if(56320>g){-1<(f-=3)&&l.push(239,191,189),k=g;continue}// valid surrogate pair
g=(k-55296<<10|g-56320)+65536}else k&&-1<(f-=3)&&l.push(239,191,189);// encode utf8
if(k=null,128>g){if(0>(f-=1))break;l.push(g)}else if(2048>g){if(0>(f-=2))break;l.push(192|g>>6,128|63&g)}else if(65536>g){if(0>(f-=3))break;l.push(224|g>>12,128|63&g>>6,128|63&g)}else if(1114112>g){if(0>(f-=4))break;l.push(240|g>>18,128|63&g>>12,128|63&g>>6,128|63&g)}else throw new Error('Invalid code point')}return l}function asciiToBytes(d){var f=[];for(var g=0;g<d.length;++g)f.push(255&d.charCodeAt(g));return f}function utf16leToBytes(d,f){var g,h,k,l=[];for(var o=0;o<d.length&&!(0>(f-=2));++o)g=d.charCodeAt(o),h=g>>8,k=g%256,l.push(k),l.push(h);return l}function base64ToBytes(d){return base64.toByteArray(base64clean(d))}function blitBuffer(d,f,g,h){for(var k=0;k<h&&!(k+g>=f.length||k>=d.length);++k)f[k+g]=d[k];return k}function isnan(d){return d!==d;// eslint-disable-line no-self-compare
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"base64-js":2,"ieee754":43,"isarray":46}],10:[function(require,module,exports){
(function (Buffer){
'use strict';var Transform=require('stream').Transform,inherits=require('inherits'),StringDecoder=require('string_decoder').StringDecoder;module.exports=CipherBase,inherits(CipherBase,Transform);function CipherBase(a){Transform.call(this),this.hashMode='string'==typeof a,this.hashMode?this[a]=this._finalOrDigest:this.final=this._finalOrDigest,this._decoder=null,this._encoding=null}CipherBase.prototype.update=function(a,b,c){'string'==typeof a&&(a=new Buffer(a,b));var d=this._update(a);return this.hashMode?this:(c&&(d=this._toString(d,c)),d)},CipherBase.prototype.setAutoPadding=function(){},CipherBase.prototype.getAuthTag=function(){throw new Error('trying to get auth tag in unsupported state')},CipherBase.prototype.setAuthTag=function(){throw new Error('trying to set auth tag in unsupported state')},CipherBase.prototype.setAAD=function(){throw new Error('trying to set aad in unsupported state')},CipherBase.prototype._transform=function(a,b,c){var d;try{this.hashMode?this._update(a):this.push(this._update(a))}catch(f){d=f}finally{c(d)}},CipherBase.prototype._flush=function(a){var b;try{this.push(this._final())}catch(c){b=c}finally{a(b)}},CipherBase.prototype._finalOrDigest=function(a){var b=this._final()||new Buffer('');return a&&(b=this._toString(b,a,!0)),b},CipherBase.prototype._toString=function(a,b,c){if(this._decoder||(this._decoder=new StringDecoder(b),this._encoding=b),this._encoding!==b)throw new Error('can\'t switch encodings');var d=this._decoder.write(a);return c&&(d+=this._decoder.end()),d};

}).call(this,require("buffer").Buffer)
},{"buffer":9,"inherits":44,"stream":78,"string_decoder":79}],11:[function(require,module,exports){
(function (Buffer){
'use strict';var _typeof='function'==typeof Symbol&&'symbol'==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&'function'==typeof Symbol&&obj.constructor===Symbol?'symbol':typeof obj};// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(a){return Array.isArray?Array.isArray(a):'[object Array]'===objectToString(a)}exports.isArray=isArray;function isBoolean(a){return'boolean'==typeof a}exports.isBoolean=isBoolean;function isNull(a){return null===a}exports.isNull=isNull;function isNullOrUndefined(a){return null==a}exports.isNullOrUndefined=isNullOrUndefined;function isNumber(a){return'number'==typeof a}exports.isNumber=isNumber;function isString(a){return'string'==typeof a}exports.isString=isString;function isSymbol(a){return'symbol'==('undefined'==typeof a?'undefined':_typeof(a))}exports.isSymbol=isSymbol;function isUndefined(a){return void 0===a}exports.isUndefined=isUndefined;function isRegExp(a){return'[object RegExp]'===objectToString(a)}exports.isRegExp=isRegExp;function isObject(a){return'object'==('undefined'==typeof a?'undefined':_typeof(a))&&null!==a}exports.isObject=isObject;function isDate(a){return'[object Date]'===objectToString(a)}exports.isDate=isDate;function isError(a){return'[object Error]'===objectToString(a)||a instanceof Error}exports.isError=isError;function isFunction(a){return'function'==typeof a}exports.isFunction=isFunction;function isPrimitive(a){return null===a||'boolean'==typeof a||'number'==typeof a||'string'==typeof a||'symbol'==('undefined'==typeof a?'undefined':_typeof(a))||// ES6 symbol
'undefined'==typeof a}exports.isPrimitive=isPrimitive,exports.isBuffer=Buffer.isBuffer;function objectToString(a){return Object.prototype.toString.call(a)}

}).call(this,{"isBuffer":require("../../is-buffer/index.js")})
},{"../../is-buffer/index.js":45}],12:[function(require,module,exports){
(function (Buffer){
'use strict';var inherits=require('inherits'),md5=require('./md5'),rmd160=require('ripemd160'),sha=require('sha.js'),Base=require('cipher-base');function HashNoConstructor(a){Base.call(this,'digest'),this._hash=a,this.buffers=[]}inherits(HashNoConstructor,Base),HashNoConstructor.prototype._update=function(a){this.buffers.push(a)},HashNoConstructor.prototype._final=function(){var a=Buffer.concat(this.buffers),b=this._hash(a);return this.buffers=null,b};function Hash(a){Base.call(this,'digest'),this._hash=a}inherits(Hash,Base),Hash.prototype._update=function(a){this._hash.update(a)},Hash.prototype._final=function(){return this._hash.digest()},module.exports=function(b){return b=b.toLowerCase(),'md5'===b?new HashNoConstructor(md5):'rmd160'===b||'ripemd160'===b?new HashNoConstructor(rmd160):new Hash(sha(b))};

}).call(this,require("buffer").Buffer)
},{"./md5":14,"buffer":9,"cipher-base":10,"inherits":44,"ripemd160":62,"sha.js":71}],13:[function(require,module,exports){
(function (Buffer){
'use strict';var intSize=4,zeroBuffer=new Buffer(intSize);zeroBuffer.fill(0);var chrsz=8;function toArray(a,b){if(0!=a.length%intSize){var c=a.length+(intSize-a.length%intSize);a=Buffer.concat([a,zeroBuffer],c)}var d=[],e=b?a.readInt32BE:a.readInt32LE;for(var f=0;f<a.length;f+=intSize)d.push(e.call(a,f));return d}function toBuffer(a,b,c){var d=new Buffer(b),e=c?d.writeInt32BE:d.writeInt32LE;for(var f=0;f<a.length;f++)e.call(d,a[f],4*f,!0);return d}function hash(a,b,c,d){Buffer.isBuffer(a)||(a=new Buffer(a));var e=b(toArray(a,d),a.length*chrsz);return toBuffer(e,c,d)}exports.hash=hash;

}).call(this,require("buffer").Buffer)
},{"buffer":9}],14:[function(require,module,exports){
'use strict';/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */var helpers=require('./helpers');/*
 * Calculate the MD5 of an array of little-endian words, and a bit length
 */function core_md5(e,f){e[f>>5]|=128<<f%32,e[(f+64>>>9<<4)+14]=f;var g=1732584193,h=-271733879,j=-1732584194,k=271733878;for(var l=0;l<e.length;l+=16){var m=g,n=h,o=j,p=k;g=md5_ff(g,h,j,k,e[l+0],7,-680876936),k=md5_ff(k,g,h,j,e[l+1],12,-389564586),j=md5_ff(j,k,g,h,e[l+2],17,606105819),h=md5_ff(h,j,k,g,e[l+3],22,-1044525330),g=md5_ff(g,h,j,k,e[l+4],7,-176418897),k=md5_ff(k,g,h,j,e[l+5],12,1200080426),j=md5_ff(j,k,g,h,e[l+6],17,-1473231341),h=md5_ff(h,j,k,g,e[l+7],22,-45705983),g=md5_ff(g,h,j,k,e[l+8],7,1770035416),k=md5_ff(k,g,h,j,e[l+9],12,-1958414417),j=md5_ff(j,k,g,h,e[l+10],17,-42063),h=md5_ff(h,j,k,g,e[l+11],22,-1990404162),g=md5_ff(g,h,j,k,e[l+12],7,1804603682),k=md5_ff(k,g,h,j,e[l+13],12,-40341101),j=md5_ff(j,k,g,h,e[l+14],17,-1502002290),h=md5_ff(h,j,k,g,e[l+15],22,1236535329),g=md5_gg(g,h,j,k,e[l+1],5,-165796510),k=md5_gg(k,g,h,j,e[l+6],9,-1069501632),j=md5_gg(j,k,g,h,e[l+11],14,643717713),h=md5_gg(h,j,k,g,e[l+0],20,-373897302),g=md5_gg(g,h,j,k,e[l+5],5,-701558691),k=md5_gg(k,g,h,j,e[l+10],9,38016083),j=md5_gg(j,k,g,h,e[l+15],14,-660478335),h=md5_gg(h,j,k,g,e[l+4],20,-405537848),g=md5_gg(g,h,j,k,e[l+9],5,568446438),k=md5_gg(k,g,h,j,e[l+14],9,-1019803690),j=md5_gg(j,k,g,h,e[l+3],14,-187363961),h=md5_gg(h,j,k,g,e[l+8],20,1163531501),g=md5_gg(g,h,j,k,e[l+13],5,-1444681467),k=md5_gg(k,g,h,j,e[l+2],9,-51403784),j=md5_gg(j,k,g,h,e[l+7],14,1735328473),h=md5_gg(h,j,k,g,e[l+12],20,-1926607734),g=md5_hh(g,h,j,k,e[l+5],4,-378558),k=md5_hh(k,g,h,j,e[l+8],11,-2022574463),j=md5_hh(j,k,g,h,e[l+11],16,1839030562),h=md5_hh(h,j,k,g,e[l+14],23,-35309556),g=md5_hh(g,h,j,k,e[l+1],4,-1530992060),k=md5_hh(k,g,h,j,e[l+4],11,1272893353),j=md5_hh(j,k,g,h,e[l+7],16,-155497632),h=md5_hh(h,j,k,g,e[l+10],23,-1094730640),g=md5_hh(g,h,j,k,e[l+13],4,681279174),k=md5_hh(k,g,h,j,e[l+0],11,-358537222),j=md5_hh(j,k,g,h,e[l+3],16,-722521979),h=md5_hh(h,j,k,g,e[l+6],23,76029189),g=md5_hh(g,h,j,k,e[l+9],4,-640364487),k=md5_hh(k,g,h,j,e[l+12],11,-421815835),j=md5_hh(j,k,g,h,e[l+15],16,530742520),h=md5_hh(h,j,k,g,e[l+2],23,-995338651),g=md5_ii(g,h,j,k,e[l+0],6,-198630844),k=md5_ii(k,g,h,j,e[l+7],10,1126891415),j=md5_ii(j,k,g,h,e[l+14],15,-1416354905),h=md5_ii(h,j,k,g,e[l+5],21,-57434055),g=md5_ii(g,h,j,k,e[l+12],6,1700485571),k=md5_ii(k,g,h,j,e[l+3],10,-1894986606),j=md5_ii(j,k,g,h,e[l+10],15,-1051523),h=md5_ii(h,j,k,g,e[l+1],21,-2054922799),g=md5_ii(g,h,j,k,e[l+8],6,1873313359),k=md5_ii(k,g,h,j,e[l+15],10,-30611744),j=md5_ii(j,k,g,h,e[l+6],15,-1560198380),h=md5_ii(h,j,k,g,e[l+13],21,1309151649),g=md5_ii(g,h,j,k,e[l+4],6,-145523070),k=md5_ii(k,g,h,j,e[l+11],10,-1120210379),j=md5_ii(j,k,g,h,e[l+2],15,718787259),h=md5_ii(h,j,k,g,e[l+9],21,-343485551),g=safe_add(g,m),h=safe_add(h,n),j=safe_add(j,o),k=safe_add(k,p)}return[g,h,j,k]}/*
 * These functions implement the four basic operations the algorithm uses.
 */function md5_cmn(e,f,g,h,j,k){return safe_add(bit_rol(safe_add(safe_add(f,e),safe_add(h,k)),j),g)}function md5_ff(e,f,g,h,j,k,l){return md5_cmn(f&g|~f&h,e,f,j,k,l)}function md5_gg(e,f,g,h,j,k,l){return md5_cmn(f&h|g&~h,e,f,j,k,l)}function md5_hh(e,f,g,h,j,k,l){return md5_cmn(f^g^h,e,f,j,k,l)}function md5_ii(e,f,g,h,j,k,l){return md5_cmn(g^(f|~h),e,f,j,k,l)}/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */function safe_add(e,f){var g=(65535&e)+(65535&f);return(e>>16)+(f>>16)+(g>>16)<<16|65535&g}/*
 * Bitwise rotate a 32-bit number to the left.
 */function bit_rol(e,f){return e<<f|e>>>32-f}module.exports=function(f){return helpers.hash(f,core_md5,16)};

},{"./helpers":13}],15:[function(require,module,exports){
'use strict';var elliptic=exports;elliptic.version=require('../package.json').version,elliptic.utils=require('./elliptic/utils'),elliptic.rand=require('brorand'),elliptic.hmacDRBG=require('./elliptic/hmac-drbg'),elliptic.curve=require('./elliptic/curve'),elliptic.curves=require('./elliptic/curves'),elliptic.ec=require('./elliptic/ec'),elliptic.eddsa=require('./elliptic/eddsa');

},{"../package.json":31,"./elliptic/curve":18,"./elliptic/curves":21,"./elliptic/ec":22,"./elliptic/eddsa":25,"./elliptic/hmac-drbg":28,"./elliptic/utils":30,"brorand":5}],16:[function(require,module,exports){
'use strict';var BN=require('bn.js'),elliptic=require('../../elliptic'),utils=elliptic.utils,getNAF=utils.getNAF,getJSF=utils.getJSF,assert=utils.assert;function BaseCurve(c,d){this.type=c,this.p=new BN(d.p,16),this.red=d.prime?BN.red(d.prime):BN.mont(this.p),this.zero=new BN(0).toRed(this.red),this.one=new BN(1).toRed(this.red),this.two=new BN(2).toRed(this.red),this.n=d.n&&new BN(d.n,16),this.g=d.g&&this.pointFromJSON(d.g,d.gRed),this._wnafT1=[,,,,],this._wnafT2=[,,,,],this._wnafT3=[,,,,],this._wnafT4=[,,,,];// Generalized Greg Maxwell's trick
var e=this.n&&this.p.div(this.n);!e||0<e.cmpn(100)?this.redN=null:(this._maxwellTrick=!0,this.redN=this.n.toRed(this.red))}module.exports=BaseCurve,BaseCurve.prototype.point=function(){throw new Error('Not implemented')},BaseCurve.prototype.validate=function(){throw new Error('Not implemented')},BaseCurve.prototype._fixedNafMul=function(d,e){assert(d.precomputed);var f=d._getDoubles(),g=getNAF(e,1),h=(1<<f.step+1)-(0==f.step%2?2:1);h/=3;// Translate into more windowed form
var l=[];for(var m=0;m<g.length;m+=f.step){var n=0;for(var e=m+f.step-1;e>=m;e--)n=(n<<1)+g[e];l.push(n)}var o=this.jpoint(null,null,null),q=this.jpoint(null,null,null);for(var s=h;0<s;s--){for(var m=0;m<l.length;m++){var n=l[m];n===s?q=q.mixedAdd(f.points[m]):n===-s&&(q=q.mixedAdd(f.points[m].neg()))}o=o.add(q)}return o.toP()},BaseCurve.prototype._wnafMul=function(d,e){var f=4,g=d._getNAFPoints(f);// Precompute window
f=g.wnd;var h=g.points,l=getNAF(e,f),m=this.jpoint(null,null,null);// Get NAF form
// Add `this`*(N+1) for every w-NAF index
for(var n=l.length-1;0<=n;n--){// Count zeroes
for(var e=0;0<=n&&0===l[n];n--)e++;if(0<=n&&e++,m=m.dblp(e),0>n)break;var o=l[n];assert(0!==o),m='affine'===d.type?0<o?m.mixedAdd(h[o-1>>1]):m.mixedAdd(h[-o-1>>1].neg()):0<o?m.add(h[o-1>>1]):m.add(h[-o-1>>1].neg())}return'affine'===d.type?m.toP():m},BaseCurve.prototype._wnafMulAdd=function(d,e,f,g,h){var l=this._wnafT1,m=this._wnafT2,n=this._wnafT3,o=0;// Fill all arrays
for(var q=0;q<g;q++){var s=e[q],t=s._getNAFPoints(d);l[q]=t.wnd,m[q]=t.points}// Comb small window NAFs
for(var q=g-1;1<=q;q-=2){var u=q-1,v=q;if(1!==l[u]||1!==l[v]){n[u]=getNAF(f[u],l[u]),n[v]=getNAF(f[v],l[v]),o=Math.max(n[u].length,o),o=Math.max(n[v].length,o);continue}var y=[e[u],/* 1 */null,/* 3 */null,/* 5 */e[v]/* 7 */];// Try to avoid Projective points, if possible
0===e[u].y.cmp(e[v].y)?(y[1]=e[u].add(e[v]),y[2]=e[u].toJ().mixedAdd(e[v].neg())):0===e[u].y.cmp(e[v].y.redNeg())?(y[1]=e[u].toJ().mixedAdd(e[v]),y[2]=e[u].add(e[v].neg())):(y[1]=e[u].toJ().mixedAdd(e[v]),y[2]=e[u].toJ().mixedAdd(e[v].neg()));var A=[-3,-1,-5,-7,0,7,5,1,3],B=getJSF(f[u],f[v]);o=Math.max(B[0].length,o),n[u]=Array(o),n[v]=Array(o);for(var C=0;C<o;C++){var D=0|B[0][C],E=0|B[1][C];n[u][C]=A[3*(D+1)+(E+1)],n[v][C]=0,m[u]=y}}var F=this.jpoint(null,null,null),G=this._wnafT4;for(var q=o;0<=q;q--){for(var H=0;0<=q;){var J=!0;for(var C=0;C<g;C++)G[C]=0|n[C][q],0!==G[C]&&(J=!1);if(!J)break;H++,q--}if(0<=q&&H++,F=F.dblp(H),0>q)break;for(var C=0;C<g;C++){var s,K=G[C];if(0===K)continue;else 0<K?s=m[C][K-1>>1]:0>K&&(s=m[C][-K-1>>1].neg());F='affine'===s.type?F.mixedAdd(s):F.add(s)}}// Zeroify references
for(var q=0;q<g;q++)m[q]=null;return h?F:F.toP()};function BasePoint(c,d){this.curve=c,this.type=d,this.precomputed=null}BaseCurve.BasePoint=BasePoint,BasePoint.prototype.eq=function()/*other*/{throw new Error('Not implemented')},BasePoint.prototype.validate=function(){return this.curve.validate(this)},BaseCurve.prototype.decodePoint=function(d,e){d=utils.toArray(d,e);var f=this.p.byteLength();// uncompressed, hybrid-odd, hybrid-even
if((4===d[0]||6===d[0]||7===d[0])&&d.length-1==2*f){6===d[0]?assert(0==d[d.length-1]%2):7===d[0]&&assert(1==d[d.length-1]%2);var g=this.point(d.slice(1,1+f),d.slice(1+f,1+2*f));return g}if((2===d[0]||3===d[0])&&d.length-1===f)return this.pointFromX(d.slice(1,1+f),3===d[0]);throw new Error('Unknown point format')},BasePoint.prototype.encodeCompressed=function(d){return this.encode(d,!0)},BasePoint.prototype._encode=function(d){var e=this.curve.p.byteLength(),f=this.getX().toArray('be',e);return d?[this.getY().isEven()?2:3].concat(f):[4].concat(f,this.getY().toArray('be',e))},BasePoint.prototype.encode=function(d,e){return utils.encode(this._encode(e),d)},BasePoint.prototype.precompute=function(d){if(this.precomputed)return this;var e={doubles:null,naf:null,beta:null};return e.naf=this._getNAFPoints(8),e.doubles=this._getDoubles(4,d),e.beta=this._getBeta(),this.precomputed=e,this},BasePoint.prototype._hasDoubles=function(d){if(!this.precomputed)return!1;var e=this.precomputed.doubles;return!!e&&e.points.length>=Math.ceil((d.bitLength()+1)/e.step)},BasePoint.prototype._getDoubles=function(d,e){if(this.precomputed&&this.precomputed.doubles)return this.precomputed.doubles;var f=[this],g=this;for(var h=0;h<e;h+=d){for(var l=0;l<d;l++)g=g.dbl();f.push(g)}return{step:d,points:f}},BasePoint.prototype._getNAFPoints=function(d){if(this.precomputed&&this.precomputed.naf)return this.precomputed.naf;var e=[this],f=(1<<d)-1,g=1===f?null:this.dbl();for(var h=1;h<f;h++)e[h]=e[h-1].add(g);return{wnd:d,points:e}},BasePoint.prototype._getBeta=function(){return null},BasePoint.prototype.dblp=function(d){var e=this;for(var f=0;f<d;f++)e=e.dbl();return e};

},{"../../elliptic":15,"bn.js":4}],17:[function(require,module,exports){
'use strict';var curve=require('../curve'),elliptic=require('../../elliptic'),BN=require('bn.js'),inherits=require('inherits'),Base=curve.base,assert=elliptic.utils.assert;function EdwardsCurve(i){this.twisted=1!=(0|i.a),this.mOneA=this.twisted&&-1==(0|i.a),this.extended=this.mOneA,Base.call(this,'edwards',i),this.a=new BN(i.a,16).umod(this.red.m),this.a=this.a.toRed(this.red),this.c=new BN(i.c,16).toRed(this.red),this.c2=this.c.redSqr(),this.d=new BN(i.d,16).toRed(this.red),this.dd=this.d.redAdd(this.d),assert(!this.twisted||0===this.c.fromRed().cmpn(1)),this.oneC=1==(0|i.c)}inherits(EdwardsCurve,Base),module.exports=EdwardsCurve,EdwardsCurve.prototype._mulA=function(l){return this.mOneA?l.redNeg():this.a.redMul(l)},EdwardsCurve.prototype._mulC=function(l){return this.oneC?l:this.c.redMul(l)},EdwardsCurve.prototype.jpoint=function(l,m,n,o){return this.point(l,m,n,o)},EdwardsCurve.prototype.pointFromX=function(l,m){l=new BN(l,16),l.red||(l=l.toRed(this.red));var n=l.redSqr(),o=this.c2.redSub(this.a.redMul(n)),q=this.one.redSub(this.c2.redMul(this.d).redMul(n)),r=o.redMul(q.redInvm()),s=r.redSqrt();if(0!==s.redSqr().redSub(r).cmp(this.zero))throw new Error('invalid point');var u=s.fromRed().isOdd();return(m&&!u||!m&&u)&&(s=s.redNeg()),this.point(l,s)},EdwardsCurve.prototype.pointFromY=function(l,m){l=new BN(l,16),l.red||(l=l.toRed(this.red));// x^2 = (y^2 - 1) / (d y^2 + 1)
var n=l.redSqr(),o=n.redSub(this.one),q=n.redMul(this.d).redAdd(this.one),r=o.redMul(q.redInvm());if(0===r.cmp(this.zero))if(m)throw new Error('invalid point');else return this.point(this.zero,l);var s=r.redSqrt();if(0!==s.redSqr().redSub(r).cmp(this.zero))throw new Error('invalid point');return s.isOdd()!==m&&(s=s.redNeg()),this.point(s,l)},EdwardsCurve.prototype.validate=function(l){if(l.isInfinity())return!0;// Curve: A * X^2 + Y^2 = C^2 * (1 + D * X^2 * Y^2)
l.normalize();var m=l.x.redSqr(),n=l.y.redSqr(),o=m.redMul(this.a).redAdd(n),q=this.c2.redMul(this.one.redAdd(this.d.redMul(m).redMul(n)));return 0===o.cmp(q)};function Point(i,l,m,n,o){Base.BasePoint.call(this,i,'projective'),null===l&&null===m&&null===n?(this.x=this.curve.zero,this.y=this.curve.one,this.z=this.curve.one,this.t=this.curve.zero,this.zOne=!0):(this.x=new BN(l,16),this.y=new BN(m,16),this.z=n?new BN(n,16):this.curve.one,this.t=o&&new BN(o,16),!this.x.red&&(this.x=this.x.toRed(this.curve.red)),!this.y.red&&(this.y=this.y.toRed(this.curve.red)),!this.z.red&&(this.z=this.z.toRed(this.curve.red)),this.t&&!this.t.red&&(this.t=this.t.toRed(this.curve.red)),this.zOne=this.z===this.curve.one,this.curve.extended&&!this.t&&(this.t=this.x.redMul(this.y),!this.zOne&&(this.t=this.t.redMul(this.z.redInvm()))))}inherits(Point,Base.BasePoint),EdwardsCurve.prototype.pointFromJSON=function(l){return Point.fromJSON(this,l)},EdwardsCurve.prototype.point=function(l,m,n,o){return new Point(this,l,m,n,o)},Point.fromJSON=function(l,m){return new Point(l,m[0],m[1],m[2])},Point.prototype.inspect=function(){return this.isInfinity()?'<EC Point Infinity>':'<EC Point x: '+this.x.fromRed().toString(16,2)+' y: '+this.y.fromRed().toString(16,2)+' z: '+this.z.fromRed().toString(16,2)+'>'},Point.prototype.isInfinity=function(){// XXX This code assumes that zero is always zero in red
return 0===this.x.cmpn(0)&&0===this.y.cmp(this.z)},Point.prototype._extDbl=function(){// hyperelliptic.org/EFD/g1p/auto-twisted-extended-1.html
//     #doubling-dbl-2008-hwcd
// 4M + 4S
// A = X1^2
var l=this.x.redSqr(),m=this.y.redSqr(),n=this.z.redSqr();// B = Y1^2
// C = 2 * Z1^2
n=n.redIAdd(n);// D = a * A
var o=this.curve._mulA(l),q=this.x.redAdd(this.y).redSqr().redISub(l).redISub(m),r=o.redAdd(m),s=r.redSub(n),u=o.redSub(m),v=q.redMul(s),w=r.redMul(u),A=q.redMul(u),B=s.redMul(r);// E = (X1 + Y1)^2 - A - B
// G = D + B
// F = G - C
// H = D - B
// X3 = E * F
// Y3 = G * H
// T3 = E * H
// Z3 = F * G
return this.curve.point(v,w,B,A)},Point.prototype._projDbl=function(){// hyperelliptic.org/EFD/g1p/auto-twisted-projective.html
//     #doubling-dbl-2008-bbjlp
//     #doubling-dbl-2007-bl
// and others
// Generally 3M + 4S or 2M + 4S
// B = (X1 + Y1)^2
var l=this.x.redAdd(this.y).redSqr(),m=this.x.redSqr(),n=this.y.redSqr(),o,q,r;// C = X1^2
// D = Y1^2
if(this.curve.twisted){// E = a * C
var s=this.curve._mulA(m),u=s.redAdd(n);// F = E + D
if(this.zOne)o=l.redSub(m).redSub(n).redMul(u.redSub(this.curve.two)),q=u.redMul(s.redSub(n)),r=u.redSqr().redSub(u).redSub(u);else{// H = Z1^2
var v=this.z.redSqr(),w=u.redSub(v).redISub(v);// J = F - 2 * H
// X3 = (B-C-D)*J
o=l.redSub(m).redISub(n).redMul(w),q=u.redMul(s.redSub(n)),r=u.redMul(w)}}else{// E = C + D
var s=m.redAdd(n),v=this.curve._mulC(this.c.redMul(this.z)).redSqr(),w=s.redSub(v).redSub(v);// H = (c * Z1)^2
// J = E - 2 * H
// X3 = c * (B - E) * J
o=this.curve._mulC(l.redISub(s)).redMul(w),q=this.curve._mulC(s).redMul(m.redISub(n)),r=s.redMul(w)}return this.curve.point(o,q,r)},Point.prototype.dbl=function(){return this.isInfinity()?this:this.curve.extended?this._extDbl():this._projDbl();// Double in extended coordinates
},Point.prototype._extAdd=function(l){// hyperelliptic.org/EFD/g1p/auto-twisted-extended-1.html
//     #addition-add-2008-hwcd-3
// 8M
// A = (Y1 - X1) * (Y2 - X2)
var m=this.y.redSub(this.x).redMul(l.y.redSub(l.x)),n=this.y.redAdd(this.x).redMul(l.y.redAdd(l.x)),o=this.t.redMul(this.curve.dd).redMul(l.t),q=this.z.redMul(l.z.redAdd(l.z)),r=n.redSub(m),s=q.redSub(o),u=q.redAdd(o),v=n.redAdd(m),w=r.redMul(s),A=u.redMul(v),B=r.redMul(v),C=s.redMul(u);// B = (Y1 + X1) * (Y2 + X2)
// C = T1 * k * T2
// D = Z1 * 2 * Z2
// E = B - A
// F = D - C
// G = D + C
// H = B + A
// X3 = E * F
// Y3 = G * H
// T3 = E * H
// Z3 = F * G
return this.curve.point(w,A,C,B)},Point.prototype._projAdd=function(l){// hyperelliptic.org/EFD/g1p/auto-twisted-projective.html
//     #addition-add-2008-bbjlp
//     #addition-add-2007-bl
// 10M + 1S
// A = Z1 * Z2
var A,B,m=this.z.redMul(l.z),n=m.redSqr(),o=this.x.redMul(l.x),q=this.y.redMul(l.y),r=this.curve.d.redMul(o).redMul(q),s=n.redSub(r),u=n.redAdd(r),v=this.x.redAdd(this.y).redMul(l.x.redAdd(l.y)).redISub(o).redISub(q),w=m.redMul(s).redMul(v);// B = A^2
// C = X1 * X2
// D = Y1 * Y2
// E = d * C * D
// F = B - E
// G = B + E
// X3 = A * F * ((X1 + Y1) * (X2 + Y2) - C - D)
return this.curve.twisted?(A=m.redMul(u).redMul(q.redSub(this.curve._mulA(o))),B=s.redMul(u)):(A=m.redMul(u).redMul(q.redSub(o)),B=this.curve._mulC(s).redMul(u)),this.curve.point(w,A,B)},Point.prototype.add=function(l){return this.isInfinity()?l:l.isInfinity()?this:this.curve.extended?this._extAdd(l):this._projAdd(l)},Point.prototype.mul=function(l){return this._hasDoubles(l)?this.curve._fixedNafMul(this,l):this.curve._wnafMul(this,l)},Point.prototype.mulAdd=function(l,m,n){return this.curve._wnafMulAdd(1,[this,m],[l,n],2,!1)},Point.prototype.jmulAdd=function(l,m,n){return this.curve._wnafMulAdd(1,[this,m],[l,n],2,!0)},Point.prototype.normalize=function(){if(this.zOne)return this;// Normalize coordinates
var l=this.z.redInvm();return this.x=this.x.redMul(l),this.y=this.y.redMul(l),this.t&&(this.t=this.t.redMul(l)),this.z=this.curve.one,this.zOne=!0,this},Point.prototype.neg=function(){return this.curve.point(this.x.redNeg(),this.y,this.z,this.t&&this.t.redNeg())},Point.prototype.getX=function(){return this.normalize(),this.x.fromRed()},Point.prototype.getY=function(){return this.normalize(),this.y.fromRed()},Point.prototype.eq=function(l){return this===l||0===this.getX().cmp(l.getX())&&0===this.getY().cmp(l.getY())},Point.prototype.eqXToP=function(l){var m=l.toRed(this.curve.red).redMul(this.z);if(0===this.x.cmp(m))return!0;for(var n=l.clone(),o=this.curve.redN.redMul(this.z);;){if(n.iadd(this.curve.n),0<=n.cmp(this.curve.p))return!1;if(m.redIAdd(o),0===this.x.cmp(m))return!0}return!1},Point.prototype.toP=Point.prototype.normalize,Point.prototype.mixedAdd=Point.prototype.add;

},{"../../elliptic":15,"../curve":18,"bn.js":4,"inherits":44}],18:[function(require,module,exports){
'use strict';var curve=exports;curve.base=require('./base'),curve.short=require('./short'),curve.mont=require('./mont'),curve.edwards=require('./edwards');

},{"./base":16,"./edwards":17,"./mont":19,"./short":20}],19:[function(require,module,exports){
'use strict';var curve=require('../curve'),BN=require('bn.js'),inherits=require('inherits'),Base=curve.base,elliptic=require('../../elliptic'),utils=elliptic.utils;function MontCurve(e){Base.call(this,'mont',e),this.a=new BN(e.a,16).toRed(this.red),this.b=new BN(e.b,16).toRed(this.red),this.i4=new BN(4).toRed(this.red).redInvm(),this.two=new BN(2).toRed(this.red),this.a24=this.i4.redMul(this.a.redAdd(this.two))}inherits(MontCurve,Base),module.exports=MontCurve,MontCurve.prototype.validate=function(f){var g=f.normalize().x,h=g.redSqr(),j=h.redMul(g).redAdd(h.redMul(this.a)).redAdd(g),l=j.redSqrt();return 0===l.redSqr().cmp(j)};function Point(e,f,g){Base.BasePoint.call(this,e,'projective'),null===f&&null===g?(this.x=this.curve.one,this.z=this.curve.zero):(this.x=new BN(f,16),this.z=new BN(g,16),!this.x.red&&(this.x=this.x.toRed(this.curve.red)),!this.z.red&&(this.z=this.z.toRed(this.curve.red)))}inherits(Point,Base.BasePoint),MontCurve.prototype.decodePoint=function(f,g){return this.point(utils.toArray(f,g),1)},MontCurve.prototype.point=function(f,g){return new Point(this,f,g)},MontCurve.prototype.pointFromJSON=function(f){return Point.fromJSON(this,f)},Point.prototype.precompute=function(){// No-op
},Point.prototype._encode=function(){return this.getX().toArray('be',this.curve.p.byteLength())},Point.fromJSON=function(f,g){return new Point(f,g[0],g[1]||f.one)},Point.prototype.inspect=function(){return this.isInfinity()?'<EC Point Infinity>':'<EC Point x: '+this.x.fromRed().toString(16,2)+' z: '+this.z.fromRed().toString(16,2)+'>'},Point.prototype.isInfinity=function(){// XXX This code assumes that zero is always zero in red
return 0===this.z.cmpn(0)},Point.prototype.dbl=function(){// http://hyperelliptic.org/EFD/g1p/auto-montgom-xz.html#doubling-dbl-1987-m-3
// 2M + 2S + 4A
// A = X1 + Z1
var f=this.x.redAdd(this.z),g=f.redSqr(),h=this.x.redSub(this.z),j=h.redSqr(),l=g.redSub(j),m=g.redMul(j),n=l.redMul(j.redAdd(this.curve.a24.redMul(l)));// AA = A^2
// B = X1 - Z1
// BB = B^2
// C = AA - BB
// X3 = AA * BB
// Z3 = C * (BB + A24 * C)
return this.curve.point(m,n)},Point.prototype.add=function(){throw new Error('Not supported on Montgomery curve')},Point.prototype.diffAdd=function(f,g){// http://hyperelliptic.org/EFD/g1p/auto-montgom-xz.html#diffadd-dadd-1987-m-3
// 4M + 2S + 6A
// A = X2 + Z2
var h=this.x.redAdd(this.z),j=this.x.redSub(this.z),l=f.x.redAdd(f.z),m=f.x.redSub(f.z),n=m.redMul(h),o=l.redMul(j),q=g.z.redMul(n.redAdd(o).redSqr()),r=g.x.redMul(n.redISub(o).redSqr());// B = X2 - Z2
// C = X3 + Z3
// D = X3 - Z3
// DA = D * A
// CB = C * B
// X5 = Z1 * (DA + CB)^2
// Z5 = X1 * (DA - CB)^2
return this.curve.point(q,r)},Point.prototype.mul=function(f){var g=f.clone(),h=this,j=this.curve.point(null,null),l=this;// (N / 2) * Q + Q
// (N / 2) * Q
// Q
for(var m=[];0!==g.cmpn(0);g.iushrn(1))m.push(g.andln(1));for(var n=m.length-1;0<=n;n--)0===m[n]?(h=h.diffAdd(j,l),j=j.dbl()):(j=h.diffAdd(j,l),h=h.dbl());return j},Point.prototype.mulAdd=function(){throw new Error('Not supported on Montgomery curve')},Point.prototype.jumlAdd=function(){throw new Error('Not supported on Montgomery curve')},Point.prototype.eq=function(f){return 0===this.getX().cmp(f.getX())},Point.prototype.normalize=function(){return this.x=this.x.redMul(this.z.redInvm()),this.z=this.curve.one,this},Point.prototype.getX=function(){return this.normalize(),this.x.fromRed()};

},{"../../elliptic":15,"../curve":18,"bn.js":4,"inherits":44}],20:[function(require,module,exports){
'use strict';var curve=require('../curve'),elliptic=require('../../elliptic'),BN=require('bn.js'),inherits=require('inherits'),Base=curve.base,assert=elliptic.utils.assert;function ShortCurve(g){Base.call(this,'short',g),this.a=new BN(g.a,16).toRed(this.red),this.b=new BN(g.b,16).toRed(this.red),this.tinv=this.two.redInvm(),this.zeroA=0===this.a.fromRed().cmpn(0),this.threeA=0===this.a.fromRed().sub(this.p).cmpn(-3),this.endo=this._getEndomorphism(g),this._endoWnafT1=[,,,,],this._endoWnafT2=[,,,,]}inherits(ShortCurve,Base),module.exports=ShortCurve,ShortCurve.prototype._getEndomorphism=function(l){// No efficient endomorphism
if(this.zeroA&&this.g&&this.n&&1===this.p.modn(3)){// Compute beta and lambda, that lambda * P = (beta * Px; Py)
var n,o;if(l.beta)n=new BN(l.beta,16).toRed(this.red);else{var w=this._getEndoRoots(this.p);// Choose the smallest beta
n=0>w[0].cmp(w[1])?w[0]:w[1],n=n.toRed(this.red)}if(l.lambda)o=new BN(l.lambda,16);else{// Choose the lambda that is matching selected beta
var A=this._getEndoRoots(this.n);0===this.g.mul(A[0]).x.cmp(this.g.x.redMul(n))?o=A[0]:(o=A[1],assert(0===this.g.mul(o).x.cmp(this.g.x.redMul(n))))}// Get basis vectors, used for balanced length-two representation
var B;return B=l.basis?l.basis.map(function(C){return{a:new BN(C.a,16),b:new BN(C.b,16)}}):this._getEndoBasis(o),{beta:n,lambda:o,basis:B}}},ShortCurve.prototype._getEndoRoots=function(l){// Find roots of for x^2 + x + 1 in F
// Root = (-1 +- Sqrt(-3)) / 2
//
var n=l===this.p?this.red:BN.mont(l),o=new BN(2).toRed(n).redInvm(),w=o.redNeg(),A=new BN(3).toRed(n).redNeg().redSqrt().redMul(o),B=w.redAdd(A).fromRed(),C=w.redSub(A).fromRed();return[B,C]},ShortCurve.prototype._getEndoBasis=function(l){// 3.74
// Run EGCD, until r(L + 1) < aprxSqrt
// NOTE: all vectors are roots of: a + b * lambda = 0 (mod n)
// First vector
// Second vector
for(// aprxSqrt >= sqrt(this.n)
var E,F,G,H,I,J,K,M,N,n=this.n.ushrn(Math.floor(this.n.bitLength()/2)),o=l,w=this.n.clone(),A=new BN(1),B=new BN(0),C=new BN(0),D=new BN(1),L=0;0!==o.cmpn(0);){var O=w.div(o);M=w.sub(O.mul(o)),N=C.sub(O.mul(A));var P=D.sub(O.mul(B));if(!G&&0>M.cmp(n))E=K.neg(),F=A,G=M.neg(),H=N;else if(G&&2==++L)break;K=M,w=o,o=M,C=A,A=N,D=B,B=P}I=M.neg(),J=N;var Q=G.sqr().add(H.sqr()),R=I.sqr().add(J.sqr());return 0<=R.cmp(Q)&&(I=E,J=F),G.negative&&(G=G.neg(),H=H.neg()),I.negative&&(I=I.neg(),J=J.neg()),[{a:G,b:H},{a:I,b:J}]},ShortCurve.prototype._endoSplit=function(l){var n=this.endo.basis,o=n[0],w=n[1],A=w.b.mul(l).divRound(this.n),B=o.b.neg().mul(l).divRound(this.n),C=A.mul(o.a),D=B.mul(w.a),E=A.mul(o.b),F=B.mul(w.b),G=l.sub(C).sub(D),H=E.add(F).neg();// Calculate answer
return{k1:G,k2:H}},ShortCurve.prototype.pointFromX=function(l,n){l=new BN(l,16),l.red||(l=l.toRed(this.red));var o=l.redSqr().redMul(l).redIAdd(l.redMul(this.a)).redIAdd(this.b),w=o.redSqrt();if(0!==w.redSqr().redSub(o).cmp(this.zero))throw new Error('invalid point');// XXX Is there any way to tell if the number is odd without converting it
// to non-red form?
var A=w.fromRed().isOdd();return(n&&!A||!n&&A)&&(w=w.redNeg()),this.point(l,w)},ShortCurve.prototype.validate=function(l){if(l.inf)return!0;var n=l.x,o=l.y,w=this.a.redMul(n),A=n.redSqr().redMul(n).redIAdd(w).redIAdd(this.b);return 0===o.redSqr().redISub(A).cmpn(0)},ShortCurve.prototype._endoWnafMulAdd=function(l,n,o){var w=this._endoWnafT1,A=this._endoWnafT2;for(var B=0;B<l.length;B++){var C=this._endoSplit(n[B]),D=l[B],E=D._getBeta();C.k1.negative&&(C.k1.ineg(),D=D.neg(!0)),C.k2.negative&&(C.k2.ineg(),E=E.neg(!0)),w[2*B]=D,w[2*B+1]=E,A[2*B]=C.k1,A[2*B+1]=C.k2}var F=this._wnafMulAdd(1,w,A,2*B,o);// Clean-up references to points and coefficients
for(var G=0;G<2*B;G++)w[G]=null,A[G]=null;return F};function Point(g,l,n,o){Base.BasePoint.call(this,g,'affine'),null===l&&null===n?(this.x=null,this.y=null,this.inf=!0):(this.x=new BN(l,16),this.y=new BN(n,16),o&&(this.x.forceRed(this.curve.red),this.y.forceRed(this.curve.red)),!this.x.red&&(this.x=this.x.toRed(this.curve.red)),!this.y.red&&(this.y=this.y.toRed(this.curve.red)),this.inf=!1)}inherits(Point,Base.BasePoint),ShortCurve.prototype.point=function(l,n,o){return new Point(this,l,n,o)},ShortCurve.prototype.pointFromJSON=function(l,n){return Point.fromJSON(this,l,n)},Point.prototype._getBeta=function(){if(this.curve.endo){var l=this.precomputed;if(l&&l.beta)return l.beta;var n=this.curve.point(this.x.redMul(this.curve.endo.beta),this.y);if(l){var o=this.curve,w=function w(A){return o.point(A.x.redMul(o.endo.beta),A.y)};l.beta=n,n.precomputed={beta:null,naf:l.naf&&{wnd:l.naf.wnd,points:l.naf.points.map(w)},doubles:l.doubles&&{step:l.doubles.step,points:l.doubles.points.map(w)}}}return n}},Point.prototype.toJSON=function(){return this.precomputed?[this.x,this.y,this.precomputed&&{doubles:this.precomputed.doubles&&{step:this.precomputed.doubles.step,points:this.precomputed.doubles.points.slice(1)},naf:this.precomputed.naf&&{wnd:this.precomputed.naf.wnd,points:this.precomputed.naf.points.slice(1)}}]:[this.x,this.y]},Point.fromJSON=function(l,n,o){function w(C){return l.point(C[0],C[1],o)}'string'==typeof n&&(n=JSON.parse(n));var A=l.point(n[0],n[1],o);if(!n[2])return A;var B=n[2];return A.precomputed={beta:null,doubles:B.doubles&&{step:B.doubles.step,points:[A].concat(B.doubles.points.map(w))},naf:B.naf&&{wnd:B.naf.wnd,points:[A].concat(B.naf.points.map(w))}},A},Point.prototype.inspect=function(){return this.isInfinity()?'<EC Point Infinity>':'<EC Point x: '+this.x.fromRed().toString(16,2)+' y: '+this.y.fromRed().toString(16,2)+'>'},Point.prototype.isInfinity=function(){return this.inf},Point.prototype.add=function(l){// O + P = P
if(this.inf)return l;// P + O = P
if(l.inf)return this;// P + P = 2P
if(this.eq(l))return this.dbl();// P + (-P) = O
if(this.neg().eq(l))return this.curve.point(null,null);// P + Q = O
if(0===this.x.cmp(l.x))return this.curve.point(null,null);var n=this.y.redSub(l.y);0!==n.cmpn(0)&&(n=n.redMul(this.x.redSub(l.x).redInvm()));var o=n.redSqr().redISub(this.x).redISub(l.x),w=n.redMul(this.x.redSub(o)).redISub(this.y);return this.curve.point(o,w)},Point.prototype.dbl=function(){if(this.inf)return this;// 2P = O
var l=this.y.redAdd(this.y);if(0===l.cmpn(0))return this.curve.point(null,null);var n=this.curve.a,o=this.x.redSqr(),w=l.redInvm(),A=o.redAdd(o).redIAdd(o).redIAdd(n).redMul(w),B=A.redSqr().redISub(this.x.redAdd(this.x)),C=A.redMul(this.x.redSub(B)).redISub(this.y);return this.curve.point(B,C)},Point.prototype.getX=function(){return this.x.fromRed()},Point.prototype.getY=function(){return this.y.fromRed()},Point.prototype.mul=function(l){return(l=new BN(l,16),this._hasDoubles(l))?this.curve._fixedNafMul(this,l):this.curve.endo?this.curve._endoWnafMulAdd([this],[l]):this.curve._wnafMul(this,l)},Point.prototype.mulAdd=function(l,n,o){var w=[this,n],A=[l,o];return this.curve.endo?this.curve._endoWnafMulAdd(w,A):this.curve._wnafMulAdd(1,w,A,2)},Point.prototype.jmulAdd=function(l,n,o){var w=[this,n],A=[l,o];return this.curve.endo?this.curve._endoWnafMulAdd(w,A,!0):this.curve._wnafMulAdd(1,w,A,2,!0)},Point.prototype.eq=function(l){return this===l||this.inf===l.inf&&(this.inf||0===this.x.cmp(l.x)&&0===this.y.cmp(l.y))},Point.prototype.neg=function(l){if(this.inf)return this;var n=this.curve.point(this.x,this.y.redNeg());if(l&&this.precomputed){var o=this.precomputed,w=function w(A){return A.neg()};n.precomputed={naf:o.naf&&{wnd:o.naf.wnd,points:o.naf.points.map(w)},doubles:o.doubles&&{step:o.doubles.step,points:o.doubles.points.map(w)}}}return n},Point.prototype.toJ=function(){if(this.inf)return this.curve.jpoint(null,null,null);var l=this.curve.jpoint(this.x,this.y,this.curve.one);return l};function JPoint(g,l,n,o){Base.BasePoint.call(this,g,'jacobian'),null===l&&null===n&&null===o?(this.x=this.curve.one,this.y=this.curve.one,this.z=new BN(0)):(this.x=new BN(l,16),this.y=new BN(n,16),this.z=new BN(o,16)),this.x.red||(this.x=this.x.toRed(this.curve.red)),this.y.red||(this.y=this.y.toRed(this.curve.red)),this.z.red||(this.z=this.z.toRed(this.curve.red)),this.zOne=this.z===this.curve.one}inherits(JPoint,Base.BasePoint),ShortCurve.prototype.jpoint=function(l,n,o){return new JPoint(this,l,n,o)},JPoint.prototype.toP=function(){if(this.isInfinity())return this.curve.point(null,null);var l=this.z.redInvm(),n=l.redSqr(),o=this.x.redMul(n),w=this.y.redMul(n).redMul(l);return this.curve.point(o,w)},JPoint.prototype.neg=function(){return this.curve.jpoint(this.x,this.y.redNeg(),this.z)},JPoint.prototype.add=function(l){// O + P = P
if(this.isInfinity())return l;// P + O = P
if(l.isInfinity())return this;// 12M + 4S + 7A
var n=l.z.redSqr(),o=this.z.redSqr(),w=this.x.redMul(n),A=l.x.redMul(o),B=this.y.redMul(n.redMul(l.z)),C=l.y.redMul(o.redMul(this.z)),D=w.redSub(A),E=B.redSub(C);if(0===D.cmpn(0)){if(0!==E.cmpn(0))return this.curve.jpoint(null,null,null);return this.dbl()}var F=D.redSqr(),G=F.redMul(D),H=w.redMul(F),I=E.redSqr().redIAdd(G).redISub(H).redISub(H),J=E.redMul(H.redISub(I)).redISub(B.redMul(G)),K=this.z.redMul(l.z).redMul(D);return this.curve.jpoint(I,J,K)},JPoint.prototype.mixedAdd=function(l){// O + P = P
if(this.isInfinity())return l.toJ();// P + O = P
if(l.isInfinity())return this;// 8M + 3S + 7A
var n=this.z.redSqr(),o=this.x,w=l.x.redMul(n),A=this.y,B=l.y.redMul(n).redMul(this.z),C=o.redSub(w),D=A.redSub(B);if(0===C.cmpn(0)){if(0!==D.cmpn(0))return this.curve.jpoint(null,null,null);return this.dbl()}var E=C.redSqr(),F=E.redMul(C),G=o.redMul(E),H=D.redSqr().redIAdd(F).redISub(G).redISub(G),I=D.redMul(G.redISub(H)).redISub(A.redMul(F)),J=this.z.redMul(C);return this.curve.jpoint(H,I,J)},JPoint.prototype.dblp=function(l){if(0===l)return this;if(this.isInfinity())return this;if(!l)return this.dbl();if(this.curve.zeroA||this.curve.threeA){var n=this;for(var o=0;o<l;o++)n=n.dbl();return n}// 1M + 2S + 1A + N * (4S + 5M + 8A)
// N = 1 => 6M + 6S + 9A
var w=this.curve.a,A=this.curve.tinv,B=this.x,C=this.y,D=this.z,E=D.redSqr().redSqr(),F=C.redAdd(C);// Reuse results
for(var o=0;o<l;o++){var G=B.redSqr(),H=F.redSqr(),I=H.redSqr(),J=G.redAdd(G).redIAdd(G).redIAdd(w.redMul(E)),K=B.redMul(H),L=J.redSqr().redISub(K.redAdd(K)),M=K.redISub(L),N=J.redMul(M);N=N.redIAdd(N).redISub(I);var O=F.redMul(D);o+1<l&&(E=E.redMul(I)),B=L,D=O,F=N}return this.curve.jpoint(B,F.redMul(A),D)},JPoint.prototype.dbl=function(){if(this.isInfinity())return this;return this.curve.zeroA?this._zeroDbl():this.curve.threeA?this._threeDbl():this._dbl()},JPoint.prototype._zeroDbl=function(){var l,n,o;// Z = 1
if(this.zOne){// hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html
//     #doubling-mdbl-2007-bl
// 1M + 5S + 14A
// XX = X1^2
var w=this.x.redSqr(),A=this.y.redSqr(),B=A.redSqr(),C=this.x.redAdd(A).redSqr().redISub(w).redISub(B);// YY = Y1^2
// YYYY = YY^2
// S = 2 * ((X1 + YY)^2 - XX - YYYY)
C=C.redIAdd(C);// M = 3 * XX + a; a = 0
var D=w.redAdd(w).redIAdd(w),E=D.redSqr().redISub(C).redISub(C),F=B.redIAdd(B);// T = M ^ 2 - 2*S
// 8 * YYYY
F=F.redIAdd(F),F=F.redIAdd(F),l=E,n=D.redMul(C.redISub(E)).redISub(F),o=this.y.redAdd(this.y)}else{// hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html
//     #doubling-dbl-2009-l
// 2M + 5S + 13A
// A = X1^2
var G=this.x.redSqr(),H=this.y.redSqr(),I=H.redSqr(),J=this.x.redAdd(H).redSqr().redISub(G).redISub(I);// B = Y1^2
// C = B^2
// D = 2 * ((X1 + B)^2 - A - C)
J=J.redIAdd(J);// E = 3 * A
var K=G.redAdd(G).redIAdd(G),L=K.redSqr(),M=I.redIAdd(I);// F = E^2
// 8 * C
M=M.redIAdd(M),M=M.redIAdd(M),l=L.redISub(J).redISub(J),n=K.redMul(J.redISub(l)).redISub(M),o=this.y.redMul(this.z),o=o.redIAdd(o)}return this.curve.jpoint(l,n,o)},JPoint.prototype._threeDbl=function(){var l,n,o;// Z = 1
if(this.zOne){// hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-3.html
//     #doubling-mdbl-2007-bl
// 1M + 5S + 15A
// XX = X1^2
var w=this.x.redSqr(),A=this.y.redSqr(),B=A.redSqr(),C=this.x.redAdd(A).redSqr().redISub(w).redISub(B);// YY = Y1^2
// YYYY = YY^2
// S = 2 * ((X1 + YY)^2 - XX - YYYY)
C=C.redIAdd(C);// M = 3 * XX + a
var D=w.redAdd(w).redIAdd(w).redIAdd(this.curve.a),E=D.redSqr().redISub(C).redISub(C);// T = M^2 - 2 * S
// X3 = T
l=E;// Y3 = M * (S - T) - 8 * YYYY
var F=B.redIAdd(B);F=F.redIAdd(F),F=F.redIAdd(F),n=D.redMul(C.redISub(E)).redISub(F),o=this.y.redAdd(this.y)}else{// hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-3.html#doubling-dbl-2001-b
// 3M + 5S
// delta = Z1^2
var G=this.z.redSqr(),H=this.y.redSqr(),I=this.x.redMul(H),J=this.x.redSub(G).redMul(this.x.redAdd(G));// gamma = Y1^2
// beta = X1 * gamma
// alpha = 3 * (X1 - delta) * (X1 + delta)
J=J.redAdd(J).redIAdd(J);// X3 = alpha^2 - 8 * beta
var K=I.redIAdd(I);K=K.redIAdd(K);var L=K.redAdd(K);l=J.redSqr().redISub(L),o=this.y.redAdd(this.z).redSqr().redISub(H).redISub(G);// Y3 = alpha * (4 * beta - X3) - 8 * gamma^2
var M=H.redSqr();M=M.redIAdd(M),M=M.redIAdd(M),M=M.redIAdd(M),n=J.redMul(K.redISub(l)).redISub(M)}return this.curve.jpoint(l,n,o)},JPoint.prototype._dbl=function(){var l=this.curve.a,n=this.x,o=this.y,w=this.z,A=w.redSqr().redSqr(),B=n.redSqr(),C=o.redSqr(),D=B.redAdd(B).redIAdd(B).redIAdd(l.redMul(A)),E=n.redAdd(n);// 4M + 6S + 10A
E=E.redIAdd(E);var F=E.redMul(C),G=D.redSqr().redISub(F.redAdd(F)),H=F.redISub(G),I=C.redSqr();I=I.redIAdd(I),I=I.redIAdd(I),I=I.redIAdd(I);var J=D.redMul(H).redISub(I),K=o.redAdd(o).redMul(w);return this.curve.jpoint(G,J,K)},JPoint.prototype.trpl=function(){if(!this.curve.zeroA)return this.dbl().add(this);// hyperelliptic.org/EFD/g1p/auto-shortw-jacobian-0.html#tripling-tpl-2007-bl
// 5M + 10S + ...
// XX = X1^2
var l=this.x.redSqr(),n=this.y.redSqr(),o=this.z.redSqr(),w=n.redSqr(),A=l.redAdd(l).redIAdd(l),B=A.redSqr(),C=this.x.redAdd(n).redSqr().redISub(l).redISub(w);// YY = Y1^2
// ZZ = Z1^2
// YYYY = YY^2
// M = 3 * XX + a * ZZ2; a = 0
// MM = M^2
// E = 6 * ((X1 + YY)^2 - XX - YYYY) - MM
C=C.redIAdd(C),C=C.redAdd(C).redIAdd(C),C=C.redISub(B);// EE = E^2
var D=C.redSqr(),E=w.redIAdd(w);// T = 16*YYYY
E=E.redIAdd(E),E=E.redIAdd(E),E=E.redIAdd(E);// U = (M + E)^2 - MM - EE - T
var F=A.redIAdd(C).redSqr().redISub(B).redISub(D).redISub(E),G=n.redMul(F);// X3 = 4 * (X1 * EE - 4 * YY * U)
G=G.redIAdd(G),G=G.redIAdd(G);var H=this.x.redMul(D).redISub(G);H=H.redIAdd(H),H=H.redIAdd(H);// Y3 = 8 * Y1 * (U * (T - U) - E * EE)
var I=this.y.redMul(F.redMul(E.redISub(F)).redISub(C.redMul(D)));I=I.redIAdd(I),I=I.redIAdd(I),I=I.redIAdd(I);// Z3 = (Z1 + E)^2 - ZZ - EE
var J=this.z.redAdd(C).redSqr().redISub(o).redISub(D);return this.curve.jpoint(H,I,J)},JPoint.prototype.mul=function(l,n){return l=new BN(l,n),this.curve._wnafMul(this,l)},JPoint.prototype.eq=function(l){if('affine'===l.type)return this.eq(l.toJ());if(this===l)return!0;// x1 * z2^2 == x2 * z1^2
var n=this.z.redSqr(),o=l.z.redSqr();if(0!==this.x.redMul(o).redISub(l.x.redMul(n)).cmpn(0))return!1;// y1 * z2^3 == y2 * z1^3
var w=n.redMul(this.z),A=o.redMul(l.z);return 0===this.y.redMul(A).redISub(l.y.redMul(w)).cmpn(0)},JPoint.prototype.eqXToP=function(l){var n=this.z.redSqr(),o=l.toRed(this.curve.red).redMul(n);if(0===this.x.cmp(o))return!0;for(var w=l.clone(),A=this.curve.redN.redMul(n);;){if(w.iadd(this.curve.n),0<=w.cmp(this.curve.p))return!1;if(o.redIAdd(A),0===this.x.cmp(o))return!0}return!1},JPoint.prototype.inspect=function(){return this.isInfinity()?'<EC JPoint Infinity>':'<EC JPoint x: '+this.x.toString(16,2)+' y: '+this.y.toString(16,2)+' z: '+this.z.toString(16,2)+'>'},JPoint.prototype.isInfinity=function(){// XXX This code assumes that zero is always zero in red
return 0===this.z.cmpn(0)};

},{"../../elliptic":15,"../curve":18,"bn.js":4,"inherits":44}],21:[function(require,module,exports){
'use strict';var curves=exports,hash=require('hash.js'),elliptic=require('../elliptic'),assert=elliptic.utils.assert;function PresetCurve(a){this.curve='short'===a.type?new elliptic.curve.short(a):'edwards'===a.type?new elliptic.curve.edwards(a):new elliptic.curve.mont(a),this.g=this.curve.g,this.n=this.curve.n,this.hash=a.hash,assert(this.g.validate(),'Invalid curve'),assert(this.g.mul(this.n).isInfinity(),'Invalid curve, G*N != O')}curves.PresetCurve=PresetCurve;function defineCurve(a,b){Object.defineProperty(curves,a,{configurable:!0,enumerable:!0,get:function get(){var c=new PresetCurve(b);return Object.defineProperty(curves,a,{configurable:!0,enumerable:!0,value:c}),c}})}defineCurve('p192',{type:'short',prime:'p192',p:'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff',a:'ffffffff ffffffff ffffffff fffffffe ffffffff fffffffc',b:'64210519 e59c80e7 0fa7e9ab 72243049 feb8deec c146b9b1',n:'ffffffff ffffffff ffffffff 99def836 146bc9b1 b4d22831',hash:hash.sha256,gRed:!1,g:['188da80e b03090f6 7cbf20eb 43a18800 f4ff0afd 82ff1012','07192b95 ffc8da78 631011ed 6b24cdd5 73f977a1 1e794811']}),defineCurve('p224',{type:'short',prime:'p224',p:'ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001',a:'ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff fffffffe',b:'b4050a85 0c04b3ab f5413256 5044b0b7 d7bfd8ba 270b3943 2355ffb4',n:'ffffffff ffffffff ffffffff ffff16a2 e0b8f03e 13dd2945 5c5c2a3d',hash:hash.sha256,gRed:!1,g:['b70e0cbd 6bb4bf7f 321390b9 4a03c1d3 56c21122 343280d6 115c1d21','bd376388 b5f723fb 4c22dfe6 cd4375a0 5a074764 44d58199 85007e34']}),defineCurve('p256',{type:'short',prime:null,p:'ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff ffffffff',a:'ffffffff 00000001 00000000 00000000 00000000 ffffffff ffffffff fffffffc',b:'5ac635d8 aa3a93e7 b3ebbd55 769886bc 651d06b0 cc53b0f6 3bce3c3e 27d2604b',n:'ffffffff 00000000 ffffffff ffffffff bce6faad a7179e84 f3b9cac2 fc632551',hash:hash.sha256,gRed:!1,g:['6b17d1f2 e12c4247 f8bce6e5 63a440f2 77037d81 2deb33a0 f4a13945 d898c296','4fe342e2 fe1a7f9b 8ee7eb4a 7c0f9e16 2bce3357 6b315ece cbb64068 37bf51f5']}),defineCurve('p384',{type:'short',prime:null,p:'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 ffffffff',a:'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe ffffffff 00000000 00000000 fffffffc',b:'b3312fa7 e23ee7e4 988e056b e3f82d19 181d9c6e fe814112 0314088f 5013875a c656398d 8a2ed19d 2a85c8ed d3ec2aef',n:'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff c7634d81 f4372ddf 581a0db2 48b0a77a ecec196a ccc52973',hash:hash.sha384,gRed:!1,g:['aa87ca22 be8b0537 8eb1c71e f320ad74 6e1d3b62 8ba79b98 59f741e0 82542a38 5502f25d bf55296c 3a545e38 72760ab7','3617de4a 96262c6f 5d9e98bf 9292dc29 f8f41dbd 289a147c e9da3113 b5f0b8c0 0a60b1ce 1d7e819d 7a431d7c 90ea0e5f']}),defineCurve('p521',{type:'short',prime:null,p:'000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff',a:'000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffc',b:'00000051 953eb961 8e1c9a1f 929a21a0 b68540ee a2da725b 99b315f3 b8b48991 8ef109e1 56193951 ec7e937b 1652c0bd 3bb1bf07 3573df88 3d2c34f1 ef451fd4 6b503f00',n:'000001ff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffa 51868783 bf2f966b 7fcc0148 f709a5d0 3bb5c9b8 899c47ae bb6fb71e 91386409',hash:hash.sha512,gRed:!1,g:['000000c6 858e06b7 0404e9cd 9e3ecb66 2395b442 9c648139 053fb521 f828af60 6b4d3dba a14b5e77 efe75928 fe1dc127 a2ffa8de 3348b3c1 856a429b f97e7e31 c2e5bd66','00000118 39296a78 9a3bc004 5c8a5fb4 2c7d1bd9 98f54449 579b4468 17afbd17 273e662c 97ee7299 5ef42640 c550b901 3fad0761 353c7086 a272c240 88be9476 9fd16650']}),defineCurve('curve25519',{type:'mont',prime:'p25519',p:'7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed',a:'76d06',b:'0',n:'1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed',hash:hash.sha256,gRed:!1,g:['9']}),defineCurve('ed25519',{type:'edwards',prime:'p25519',p:'7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed',a:'-1',c:'1',// -121665 * (121666^(-1)) (mod P)
d:'52036cee2b6ffe73 8cc740797779e898 00700a4d4141d8ab 75eb4dca135978a3',n:'1000000000000000 0000000000000000 14def9dea2f79cd6 5812631a5cf5d3ed',hash:hash.sha256,gRed:!1,g:['216936d3cd6e53fec0a4e231fdd6dc5c692cc7609525a7b2c9562d608f25d51a','6666666666666666666666666666666666666666666666666666666666666658']});var pre;try{pre=require('./precomputed/secp256k1')}catch(a){pre=void 0}defineCurve('secp256k1',{type:'short',prime:'k256',p:'ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f',a:'0',b:'7',n:'ffffffff ffffffff ffffffff fffffffe baaedce6 af48a03b bfd25e8c d0364141',h:'1',hash:hash.sha256,// Precomputed endomorphism
beta:'7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee',lambda:'5363ad4cc05c30e0a5261c028812645a122e22ea20816678df02967c1b23bd72',basis:[{a:'3086d221a7d46bcde86c90e49284eb15',b:'-e4437ed6010e88286f547fa90abfe4c3'},{a:'114ca50f7a8e2f3f657c1108d9d44cfd8',b:'3086d221a7d46bcde86c90e49284eb15'}],gRed:!1,g:['79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798','483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8',pre]});

},{"../elliptic":15,"./precomputed/secp256k1":29,"hash.js":37}],22:[function(require,module,exports){
'use strict';var _typeof='function'==typeof Symbol&&'symbol'==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&'function'==typeof Symbol&&obj.constructor===Symbol?'symbol':typeof obj},BN=require('bn.js'),elliptic=require('../../elliptic'),utils=elliptic.utils,assert=utils.assert,KeyPair=require('./key'),Signature=require('./signature');function EC(a){return this instanceof EC?void('string'==typeof a&&(assert(elliptic.curves.hasOwnProperty(a),'Unknown curve '+a),a=elliptic.curves[a]),a instanceof elliptic.curves.PresetCurve&&(a={curve:a}),this.curve=a.curve.curve,this.n=this.curve.n,this.nh=this.n.ushrn(1),this.g=this.curve.g,this.g=a.curve.g,this.g.precompute(a.curve.n.bitLength()+1),this.hash=a.hash||a.curve.hash):new EC(a);// Shortcut `elliptic.ec(curve-name)`
}module.exports=EC,EC.prototype.keyPair=function(b){return new KeyPair(this,b)},EC.prototype.keyFromPrivate=function(b,c){return KeyPair.fromPrivate(this,b,c)},EC.prototype.keyFromPublic=function(b,c){return KeyPair.fromPublic(this,b,c)},EC.prototype.genKeyPair=function(b){b||(b={});// Instantiate Hmac_DRBG
var c=new elliptic.hmacDRBG({hash:this.hash,pers:b.pers,entropy:b.entropy||elliptic.rand(this.hash.hmacStrength),nonce:this.n.toArray()}),d=this.n.byteLength(),f=this.n.sub(new BN(2));do{var g=new BN(c.generate(d));if(0<g.cmp(f))continue;return g.iaddn(1),this.keyFromPrivate(g)}while(!0)},EC.prototype._truncateToN=function(b,c){var d=8*b.byteLength()-this.n.bitLength();return 0<d&&(b=b.ushrn(d)),!c&&0<=b.cmp(this.n)?b.sub(this.n):b},EC.prototype.sign=function(b,c,d,f){'object'==('undefined'==typeof d?'undefined':_typeof(d))&&(f=d,d=null),f||(f={}),c=this.keyFromPrivate(c,d),b=this._truncateToN(new BN(b,16));// Zero-extend key to provide enough entropy
var g=this.n.byteLength(),h=c.getPrivate().toArray('be',g),l=b.toArray('be',g),m=new elliptic.hmacDRBG({hash:this.hash,entropy:h,nonce:l,pers:f.pers,persEnc:f.persEnc}),o=this.n.sub(new BN(1));// Zero-extend nonce to have the same byte size as N
// Instantiate Hmac_DRBG
// Number of bytes to generate
for(var q=0;;q++){var t=f.k?f.k(q):new BN(m.generate(this.n.byteLength()));// Use complement of `s`, if it is > `n / 2`
if(t=this._truncateToN(t,!0),!(0>=t.cmpn(1)||0<=t.cmp(o))){var u=this.g.mul(t);if(!u.isInfinity()){var v=u.getX(),w=v.umod(this.n);if(0!==w.cmpn(0)){var x=t.invm(this.n).mul(w.mul(c.getPrivate()).iadd(b));if(x=x.umod(this.n),0!==x.cmpn(0)){var y=(u.getY().isOdd()?1:0)|(0===v.cmp(w)?0:2);return f.canonical&&0<x.cmp(this.nh)&&(x=this.n.sub(x),y^=1),new Signature({r:w,s:x,recoveryParam:y})}}}}}},EC.prototype.verify=function(b,c,d,f){b=this._truncateToN(new BN(b,16)),d=this.keyFromPublic(d,f),c=new Signature(c,'hex');// Perform primitive values validation
var g=c.r,h=c.s;if(0>g.cmpn(1)||0<=g.cmp(this.n))return!1;if(0>h.cmpn(1)||0<=h.cmp(this.n))return!1;// Validate signature
var l=h.invm(this.n),m=l.mul(b).umod(this.n),o=l.mul(g).umod(this.n);if(!this.curve._maxwellTrick){var q=this.g.mulAdd(m,d.getPublic(),o);return!q.isInfinity()&&0===q.getX().umod(this.n).cmp(g)}// NOTE: Greg Maxwell's trick, inspired by:
// https://git.io/vad3K
var q=this.g.jmulAdd(m,d.getPublic(),o);return!q.isInfinity()&&q.eqXToP(g);// Compare `p.x` of Jacobian point with `r`,
// this will do `p.x == r * p.z^2` instead of multiplying `p.x` by the
// inverse of `p.z^2`
},EC.prototype.recoverPubKey=function(a,b,c,d){assert((3&c)===c,'The recovery param is more than two bits'),b=new Signature(b,d);var f=this.n,g=new BN(a),h=b.r,l=b.s,m=1&c,o=c>>1;// A set LSB signifies that the y-coordinate is odd
if(0<=h.cmp(this.curve.p.umod(this.curve.n))&&o)throw new Error('Unable to find sencond key candinate');// 1.1. Let x = r + jn.
h=o?this.curve.pointFromX(h.add(this.curve.n),m):this.curve.pointFromX(h,m);var q=b.r.invm(f),t=f.sub(g).mul(q).umod(f),u=l.mul(q).umod(f);// 1.6.1 Compute Q = r^-1 (sR -  eG)
//               Q = r^-1 (sR + -eG)
return this.g.mulAdd(t,h,u)},EC.prototype.getKeyRecoveryParam=function(a,b,c,d){if(b=new Signature(b,d),null!==b.recoveryParam)return b.recoveryParam;for(var f=0;4>f;f++){var g;try{g=this.recoverPubKey(a,b,f)}catch(h){continue}if(g.eq(c))return f}throw new Error('Unable to find valid recovery factor')};

},{"../../elliptic":15,"./key":23,"./signature":24,"bn.js":4}],23:[function(require,module,exports){
'use strict';var BN=require('bn.js');function KeyPair(a,b){this.ec=a,this.priv=null,this.pub=null,b.priv&&this._importPrivate(b.priv,b.privEnc),b.pub&&this._importPublic(b.pub,b.pubEnc)}module.exports=KeyPair,KeyPair.fromPublic=function(b,c,d){return c instanceof KeyPair?c:new KeyPair(b,{pub:c,pubEnc:d})},KeyPair.fromPrivate=function(b,c,d){return c instanceof KeyPair?c:new KeyPair(b,{priv:c,privEnc:d})},KeyPair.prototype.validate=function(){var b=this.getPublic();return b.isInfinity()?{result:!1,reason:'Invalid public key'}:b.validate()?b.mul(this.ec.curve.n).isInfinity()?{result:!0,reason:null}:{result:!1,reason:'Public key * N != O'}:{result:!1,reason:'Public key is not a point'}},KeyPair.prototype.getPublic=function(b,c){return'string'==typeof b&&(c=b,b=null),this.pub||(this.pub=this.ec.g.mul(this.priv)),c?this.pub.encode(c,b):this.pub},KeyPair.prototype.getPrivate=function(b){return'hex'===b?this.priv.toString(16,2):this.priv},KeyPair.prototype._importPrivate=function(b,c){this.priv=new BN(b,c||16),this.priv=this.priv.umod(this.ec.curve.n)},KeyPair.prototype._importPublic=function(b,c){return b.x||b.y?void(this.pub=this.ec.curve.point(b.x,b.y)):void(this.pub=this.ec.curve.decodePoint(b,c))},KeyPair.prototype.derive=function(b){return b.mul(this.priv).getX()},KeyPair.prototype.sign=function(b,c,d){return this.ec.sign(b,this,c,d)},KeyPair.prototype.verify=function(b,c){return this.ec.verify(b,c,this)},KeyPair.prototype.inspect=function(){return'<Key priv: '+(this.priv&&this.priv.toString(16,2))+' pub: '+(this.pub&&this.pub.inspect())+' >'};

},{"bn.js":4}],24:[function(require,module,exports){
'use strict';var BN=require('bn.js'),elliptic=require('../../elliptic'),utils=elliptic.utils,assert=utils.assert;function Signature(a,b){return a instanceof Signature?a:void(!this._importDER(a,b)&&(assert(a.r&&a.s,'Signature without r or s'),this.r=new BN(a.r,16),this.s=new BN(a.s,16),this.recoveryParam=void 0===a.recoveryParam?null:a.recoveryParam))}module.exports=Signature;function Position(){this.place=0}function getLength(a,b){var c=a[b.place++];if(!(128&c))return c;var d=0;for(var e=0,f=b.place;e<(15&c);e++,f++)d<<=8,d|=a[f];return b.place=f,d}function rmPadding(a){for(var b=0,c=a.length-1;!a[b]&&!(128&a[b+1])&&b<c;)b++;return 0===b?a:a.slice(b)}Signature.prototype._importDER=function(b,c){b=utils.toArray(b,c);var d=new Position;if(48!==b[d.place++])return!1;var e=getLength(b,d);if(e+d.place!==b.length)return!1;if(2!==b[d.place++])return!1;var f=getLength(b,d),g=b.slice(d.place,f+d.place);if(d.place+=f,2!==b[d.place++])return!1;var h=getLength(b,d);if(b.length!==h+d.place)return!1;var j=b.slice(d.place,h+d.place);return 0===g[0]&&128&g[1]&&(g=g.slice(1)),0===j[0]&&128&j[1]&&(j=j.slice(1)),this.r=new BN(g),this.s=new BN(j),this.recoveryParam=null,!0};function constructLength(a,b){if(128>b)return void a.push(b);var c=1+(Math.log(b)/Math.LN2>>>3);for(a.push(128|c);--c;)a.push(255&b>>>(c<<3));a.push(b)}Signature.prototype.toDER=function(b){var c=this.r.toArray(),d=this.s.toArray();// Pad values
for(128&c[0]&&(c=[0].concat(c)),128&d[0]&&(d=[0].concat(d)),c=rmPadding(c),d=rmPadding(d);!d[0]&&!(128&d[1]);)d=d.slice(1);var e=[2];constructLength(e,c.length),e=e.concat(c),e.push(2),constructLength(e,d.length);var f=e.concat(d),g=[48];return constructLength(g,f.length),g=g.concat(f),utils.encode(g,b)};

},{"../../elliptic":15,"bn.js":4}],25:[function(require,module,exports){
'use strict';var hash=require('hash.js'),elliptic=require('../../elliptic'),utils=elliptic.utils,assert=utils.assert,parseBytes=utils.parseBytes,KeyPair=require('./key'),Signature=require('./signature');function EDDSA(a){if(assert('ed25519'===a,'only tested with ed25519 so far'),!(this instanceof EDDSA))return new EDDSA(a);var a=elliptic.curves[a].curve;this.curve=a,this.g=a.g,this.g.precompute(a.n.bitLength()+1),this.pointClass=a.point().constructor,this.encodingLength=Math.ceil(a.n.bitLength()/8),this.hash=hash.sha512}module.exports=EDDSA,EDDSA.prototype.sign=function(b,c){b=parseBytes(b);var d=this.keyFromSecret(c),e=this.hashInt(d.messagePrefix(),b),f=this.g.mul(e),g=this.encodePoint(f),j=this.hashInt(g,d.pubBytes(),b).mul(d.priv()),k=e.add(j).umod(this.curve.n);return this.makeSignature({R:f,S:k,Rencoded:g})},EDDSA.prototype.verify=function(b,c,d){b=parseBytes(b),c=this.makeSignature(c);var e=this.keyFromPublic(d),f=this.hashInt(c.Rencoded(),e.pubBytes(),b),g=this.g.mul(c.S()),j=c.R().add(e.pub().mul(f));return j.eq(g)},EDDSA.prototype.hashInt=function(){var b=this.hash();for(var c=0;c<arguments.length;c++)b.update(arguments[c]);return utils.intFromLE(b.digest()).umod(this.curve.n)},EDDSA.prototype.keyFromPublic=function(b){return KeyPair.fromPublic(this,b)},EDDSA.prototype.keyFromSecret=function(b){return KeyPair.fromSecret(this,b)},EDDSA.prototype.makeSignature=function(b){return b instanceof Signature?b:new Signature(this,b)},EDDSA.prototype.encodePoint=function(b){var c=b.getY().toArray('le',this.encodingLength);return c[this.encodingLength-1]|=b.getX().isOdd()?128:0,c},EDDSA.prototype.decodePoint=function(b){b=utils.parseBytes(b);var c=b.length-1,d=b.slice(0,c).concat(-129&b[c]),e=0!=(128&b[c]),f=utils.intFromLE(d);return this.curve.pointFromY(f,e)},EDDSA.prototype.encodeInt=function(b){return b.toArray('le',this.encodingLength)},EDDSA.prototype.decodeInt=function(b){return utils.intFromLE(b)},EDDSA.prototype.isPoint=function(b){return b instanceof this.pointClass};

},{"../../elliptic":15,"./key":26,"./signature":27,"hash.js":37}],26:[function(require,module,exports){
'use strict';var elliptic=require('../../elliptic'),utils=elliptic.utils,assert=utils.assert,parseBytes=utils.parseBytes,cachedProperty=utils.cachedProperty;/**
* @param {EDDSA} eddsa - instance
* @param {Object} params - public/private key parameters
*
* @param {Array<Byte>} [params.secret] - secret seed bytes
* @param {Point} [params.pub] - public key point (aka `A` in eddsa terms)
* @param {Array<Byte>} [params.pub] - public key point encoded as bytes
*
*/function KeyPair(b,c){this.eddsa=b,this._secret=parseBytes(c.secret),b.isPoint(c.pub)?this._pub=c.pub:this._pubBytes=parseBytes(c.pub)}KeyPair.fromPublic=function(c,d){return d instanceof KeyPair?d:new KeyPair(c,{pub:d})},KeyPair.fromSecret=function(c,d){return d instanceof KeyPair?d:new KeyPair(c,{secret:d})},KeyPair.prototype.secret=function(){return this._secret},cachedProperty(KeyPair,'pubBytes',function(){return this.eddsa.encodePoint(this.pub())}),cachedProperty(KeyPair,'pub',function(){return this._pubBytes?this.eddsa.decodePoint(this._pubBytes):this.eddsa.g.mul(this.priv())}),cachedProperty(KeyPair,'privBytes',function(){var c=this.eddsa,d=this.hash(),e=c.encodingLength-1,f=d.slice(0,c.encodingLength);return f[0]&=248,f[e]&=127,f[e]|=64,f}),cachedProperty(KeyPair,'priv',function(){return this.eddsa.decodeInt(this.privBytes())}),cachedProperty(KeyPair,'hash',function(){return this.eddsa.hash().update(this.secret()).digest()}),cachedProperty(KeyPair,'messagePrefix',function(){return this.hash().slice(this.eddsa.encodingLength)}),KeyPair.prototype.sign=function(c){return assert(this._secret,'KeyPair can only verify'),this.eddsa.sign(c,this)},KeyPair.prototype.verify=function(c,d){return this.eddsa.verify(c,d,this)},KeyPair.prototype.getSecret=function(c){return assert(this._secret,'KeyPair is public only'),utils.encode(this.secret(),c)},KeyPair.prototype.getPublic=function(c){return utils.encode(this.pubBytes(),c)},module.exports=KeyPair;

},{"../../elliptic":15}],27:[function(require,module,exports){
'use strict';var _typeof='function'==typeof Symbol&&'symbol'==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&'function'==typeof Symbol&&obj.constructor===Symbol?'symbol':typeof obj},BN=require('bn.js'),elliptic=require('../../elliptic'),utils=elliptic.utils,assert=utils.assert,cachedProperty=utils.cachedProperty,parseBytes=utils.parseBytes;/**
* @param {EDDSA} eddsa - eddsa instance
* @param {Array<Bytes>|Object} sig -
* @param {Array<Bytes>|Point} [sig.R] - R point as Point or bytes
* @param {Array<Bytes>|bn} [sig.S] - S scalar as bn or bytes
* @param {Array<Bytes>} [sig.Rencoded] - R point encoded
* @param {Array<Bytes>} [sig.Sencoded] - S scalar encoded
*/function Signature(a,b){this.eddsa=a,'object'!=('undefined'==typeof b?'undefined':_typeof(b))&&(b=parseBytes(b)),Array.isArray(b)&&(b={R:b.slice(0,a.encodingLength),S:b.slice(a.encodingLength)}),assert(b.R&&b.S,'Signature without R or S'),a.isPoint(b.R)&&(this._R=b.R),b.S instanceof BN&&(this._S=b.S),this._Rencoded=Array.isArray(b.R)?b.R:b.Rencoded,this._Sencoded=Array.isArray(b.S)?b.S:b.Sencoded}cachedProperty(Signature,'S',function(){return this.eddsa.decodeInt(this.Sencoded())}),cachedProperty(Signature,'R',function(){return this.eddsa.decodePoint(this.Rencoded())}),cachedProperty(Signature,'Rencoded',function(){return this.eddsa.encodePoint(this.R())}),cachedProperty(Signature,'Sencoded',function(){return this.eddsa.encodeInt(this.S())}),Signature.prototype.toBytes=function(){return this.Rencoded().concat(this.Sencoded())},Signature.prototype.toHex=function(){return utils.encode(this.toBytes(),'hex').toUpperCase()},module.exports=Signature;

},{"../../elliptic":15,"bn.js":4}],28:[function(require,module,exports){
'use strict';var hash=require('hash.js'),elliptic=require('../elliptic'),utils=elliptic.utils,assert=utils.assert;function HmacDRBG(a){if(!(this instanceof HmacDRBG))return new HmacDRBG(a);this.hash=a.hash,this.predResist=!!a.predResist,this.outLen=this.hash.outSize,this.minEntropy=a.minEntropy||this.hash.hmacStrength,this.reseed=null,this.reseedInterval=null,this.K=null,this.V=null;var b=utils.toArray(a.entropy,a.entropyEnc),c=utils.toArray(a.nonce,a.nonceEnc),d=utils.toArray(a.pers,a.persEnc);assert(b.length>=this.minEntropy/8,'Not enough entropy. Minimum is: '+this.minEntropy+' bits'),this._init(b,c,d)}module.exports=HmacDRBG,HmacDRBG.prototype._init=function(b,c,d){var e=b.concat(c).concat(d);this.K=Array(this.outLen/8),this.V=Array(this.outLen/8);for(var f=0;f<this.V.length;f++)this.K[f]=0,this.V[f]=1;this._update(e),this.reseed=1,this.reseedInterval=281474976710656},HmacDRBG.prototype._hmac=function(){return new hash.hmac(this.hash,this.K)},HmacDRBG.prototype._update=function(b){var c=this._hmac().update(this.V).update([0]);b&&(c=c.update(b)),this.K=c.digest(),this.V=this._hmac().update(this.V).digest(),b&&(this.K=this._hmac().update(this.V).update([1]).update(b).digest(),this.V=this._hmac().update(this.V).digest())},HmacDRBG.prototype.reseed=function(b,c,d,e){'string'!=typeof c&&(e=d,d=c,c=null),b=utils.toBuffer(b,c),d=utils.toBuffer(d,e),assert(b.length>=this.minEntropy/8,'Not enough entropy. Minimum is: '+this.minEntropy+' bits'),this._update(b.concat(d||[])),this.reseed=1},HmacDRBG.prototype.generate=function(b,c,d,e){if(this.reseed>this.reseedInterval)throw new Error('Reseed is required');// Optional encoding
'string'!=typeof c&&(e=d,d=c,c=null),d&&(d=utils.toArray(d,e),this._update(d));for(var f=[];f.length<b;)this.V=this._hmac().update(this.V).digest(),f=f.concat(this.V);var g=f.slice(0,b);return this._update(d),this.reseed++,utils.encode(g,c)};

},{"../elliptic":15,"hash.js":37}],29:[function(require,module,exports){
'use strict';module.exports={doubles:{step:4,points:[['e60fce93b59e9ec53011aabc21c23e97b2a31369b87a5ae9c44ee89e2a6dec0a','f7e3507399e595929db99f34f57937101296891e44d23f0be1f32cce69616821'],['8282263212c609d9ea2a6e3e172de238d8c39cabd5ac1ca10646e23fd5f51508','11f8a8098557dfe45e8256e830b60ace62d613ac2f7b17bed31b6eaff6e26caf'],['175e159f728b865a72f99cc6c6fc846de0b93833fd2222ed73fce5b551e5b739','d3506e0d9e3c79eba4ef97a51ff71f5eacb5955add24345c6efa6ffee9fed695'],['363d90d447b00c9c99ceac05b6262ee053441c7e55552ffe526bad8f83ff4640','4e273adfc732221953b445397f3363145b9a89008199ecb62003c7f3bee9de9'],['8b4b5f165df3c2be8c6244b5b745638843e4a781a15bcd1b69f79a55dffdf80c','4aad0a6f68d308b4b3fbd7813ab0da04f9e336546162ee56b3eff0c65fd4fd36'],['723cbaa6e5db996d6bf771c00bd548c7b700dbffa6c0e77bcb6115925232fcda','96e867b5595cc498a921137488824d6e2660a0653779494801dc069d9eb39f5f'],['eebfa4d493bebf98ba5feec812c2d3b50947961237a919839a533eca0e7dd7fa','5d9a8ca3970ef0f269ee7edaf178089d9ae4cdc3a711f712ddfd4fdae1de8999'],['100f44da696e71672791d0a09b7bde459f1215a29b3c03bfefd7835b39a48db0','cdd9e13192a00b772ec8f3300c090666b7ff4a18ff5195ac0fbd5cd62bc65a09'],['e1031be262c7ed1b1dc9227a4a04c017a77f8d4464f3b3852c8acde6e534fd2d','9d7061928940405e6bb6a4176597535af292dd419e1ced79a44f18f29456a00d'],['feea6cae46d55b530ac2839f143bd7ec5cf8b266a41d6af52d5e688d9094696d','e57c6b6c97dce1bab06e4e12bf3ecd5c981c8957cc41442d3155debf18090088'],['da67a91d91049cdcb367be4be6ffca3cfeed657d808583de33fa978bc1ec6cb1','9bacaa35481642bc41f463f7ec9780e5dec7adc508f740a17e9ea8e27a68be1d'],['53904faa0b334cdda6e000935ef22151ec08d0f7bb11069f57545ccc1a37b7c0','5bc087d0bc80106d88c9eccac20d3c1c13999981e14434699dcb096b022771c8'],['8e7bcd0bd35983a7719cca7764ca906779b53a043a9b8bcaeff959f43ad86047','10b7770b2a3da4b3940310420ca9514579e88e2e47fd68b3ea10047e8460372a'],['385eed34c1cdff21e6d0818689b81bde71a7f4f18397e6690a841e1599c43862','283bebc3e8ea23f56701de19e9ebf4576b304eec2086dc8cc0458fe5542e5453'],['6f9d9b803ecf191637c73a4413dfa180fddf84a5947fbc9c606ed86c3fac3a7','7c80c68e603059ba69b8e2a30e45c4d47ea4dd2f5c281002d86890603a842160'],['3322d401243c4e2582a2147c104d6ecbf774d163db0f5e5313b7e0e742d0e6bd','56e70797e9664ef5bfb019bc4ddaf9b72805f63ea2873af624f3a2e96c28b2a0'],['85672c7d2de0b7da2bd1770d89665868741b3f9af7643397721d74d28134ab83','7c481b9b5b43b2eb6374049bfa62c2e5e77f17fcc5298f44c8e3094f790313a6'],['948bf809b1988a46b06c9f1919413b10f9226c60f668832ffd959af60c82a0a','53a562856dcb6646dc6b74c5d1c3418c6d4dff08c97cd2bed4cb7f88d8c8e589'],['6260ce7f461801c34f067ce0f02873a8f1b0e44dfc69752accecd819f38fd8e8','bc2da82b6fa5b571a7f09049776a1ef7ecd292238051c198c1a84e95b2b4ae17'],['e5037de0afc1d8d43d8348414bbf4103043ec8f575bfdc432953cc8d2037fa2d','4571534baa94d3b5f9f98d09fb990bddbd5f5b03ec481f10e0e5dc841d755bda'],['e06372b0f4a207adf5ea905e8f1771b4e7e8dbd1c6a6c5b725866a0ae4fce725','7a908974bce18cfe12a27bb2ad5a488cd7484a7787104870b27034f94eee31dd'],['213c7a715cd5d45358d0bbf9dc0ce02204b10bdde2a3f58540ad6908d0559754','4b6dad0b5ae462507013ad06245ba190bb4850f5f36a7eeddff2c27534b458f2'],['4e7c272a7af4b34e8dbb9352a5419a87e2838c70adc62cddf0cc3a3b08fbd53c','17749c766c9d0b18e16fd09f6def681b530b9614bff7dd33e0b3941817dcaae6'],['fea74e3dbe778b1b10f238ad61686aa5c76e3db2be43057632427e2840fb27b6','6e0568db9b0b13297cf674deccb6af93126b596b973f7b77701d3db7f23cb96f'],['76e64113f677cf0e10a2570d599968d31544e179b760432952c02a4417bdde39','c90ddf8dee4e95cf577066d70681f0d35e2a33d2b56d2032b4b1752d1901ac01'],['c738c56b03b2abe1e8281baa743f8f9a8f7cc643df26cbee3ab150242bcbb891','893fb578951ad2537f718f2eacbfbbbb82314eef7880cfe917e735d9699a84c3'],['d895626548b65b81e264c7637c972877d1d72e5f3a925014372e9f6588f6c14b','febfaa38f2bc7eae728ec60818c340eb03428d632bb067e179363ed75d7d991f'],['b8da94032a957518eb0f6433571e8761ceffc73693e84edd49150a564f676e03','2804dfa44805a1e4d7c99cc9762808b092cc584d95ff3b511488e4e74efdf6e7'],['e80fea14441fb33a7d8adab9475d7fab2019effb5156a792f1a11778e3c0df5d','eed1de7f638e00771e89768ca3ca94472d155e80af322ea9fcb4291b6ac9ec78'],['a301697bdfcd704313ba48e51d567543f2a182031efd6915ddc07bbcc4e16070','7370f91cfb67e4f5081809fa25d40f9b1735dbf7c0a11a130c0d1a041e177ea1'],['90ad85b389d6b936463f9d0512678de208cc330b11307fffab7ac63e3fb04ed4','e507a3620a38261affdcbd9427222b839aefabe1582894d991d4d48cb6ef150'],['8f68b9d2f63b5f339239c1ad981f162ee88c5678723ea3351b7b444c9ec4c0da','662a9f2dba063986de1d90c2b6be215dbbea2cfe95510bfdf23cbf79501fff82'],['e4f3fb0176af85d65ff99ff9198c36091f48e86503681e3e6686fd5053231e11','1e63633ad0ef4f1c1661a6d0ea02b7286cc7e74ec951d1c9822c38576feb73bc'],['8c00fa9b18ebf331eb961537a45a4266c7034f2f0d4e1d0716fb6eae20eae29e','efa47267fea521a1a9dc343a3736c974c2fadafa81e36c54e7d2a4c66702414b'],['e7a26ce69dd4829f3e10cec0a9e98ed3143d084f308b92c0997fddfc60cb3e41','2a758e300fa7984b471b006a1aafbb18d0a6b2c0420e83e20e8a9421cf2cfd51'],['b6459e0ee3662ec8d23540c223bcbdc571cbcb967d79424f3cf29eb3de6b80ef','67c876d06f3e06de1dadf16e5661db3c4b3ae6d48e35b2ff30bf0b61a71ba45'],['d68a80c8280bb840793234aa118f06231d6f1fc67e73c5a5deda0f5b496943e8','db8ba9fff4b586d00c4b1f9177b0e28b5b0e7b8f7845295a294c84266b133120'],['324aed7df65c804252dc0270907a30b09612aeb973449cea4095980fc28d3d5d','648a365774b61f2ff130c0c35aec1f4f19213b0c7e332843967224af96ab7c84'],['4df9c14919cde61f6d51dfdbe5fee5dceec4143ba8d1ca888e8bd373fd054c96','35ec51092d8728050974c23a1d85d4b5d506cdc288490192ebac06cad10d5d'],['9c3919a84a474870faed8a9c1cc66021523489054d7f0308cbfc99c8ac1f98cd','ddb84f0f4a4ddd57584f044bf260e641905326f76c64c8e6be7e5e03d4fc599d'],['6057170b1dd12fdf8de05f281d8e06bb91e1493a8b91d4cc5a21382120a959e5','9a1af0b26a6a4807add9a2daf71df262465152bc3ee24c65e899be932385a2a8'],['a576df8e23a08411421439a4518da31880cef0fba7d4df12b1a6973eecb94266','40a6bf20e76640b2c92b97afe58cd82c432e10a7f514d9f3ee8be11ae1b28ec8'],['7778a78c28dec3e30a05fe9629de8c38bb30d1f5cf9a3a208f763889be58ad71','34626d9ab5a5b22ff7098e12f2ff580087b38411ff24ac563b513fc1fd9f43ac'],['928955ee637a84463729fd30e7afd2ed5f96274e5ad7e5cb09eda9c06d903ac','c25621003d3f42a827b78a13093a95eeac3d26efa8a8d83fc5180e935bcd091f'],['85d0fef3ec6db109399064f3a0e3b2855645b4a907ad354527aae75163d82751','1f03648413a38c0be29d496e582cf5663e8751e96877331582c237a24eb1f962'],['ff2b0dce97eece97c1c9b6041798b85dfdfb6d8882da20308f5404824526087e','493d13fef524ba188af4c4dc54d07936c7b7ed6fb90e2ceb2c951e01f0c29907'],['827fbbe4b1e880ea9ed2b2e6301b212b57f1ee148cd6dd28780e5e2cf856e241','c60f9c923c727b0b71bef2c67d1d12687ff7a63186903166d605b68baec293ec'],['eaa649f21f51bdbae7be4ae34ce6e5217a58fdce7f47f9aa7f3b58fa2120e2b3','be3279ed5bbbb03ac69a80f89879aa5a01a6b965f13f7e59d47a5305ba5ad93d'],['e4a42d43c5cf169d9391df6decf42ee541b6d8f0c9a137401e23632dda34d24f','4d9f92e716d1c73526fc99ccfb8ad34ce886eedfa8d8e4f13a7f7131deba9414'],['1ec80fef360cbdd954160fadab352b6b92b53576a88fea4947173b9d4300bf19','aeefe93756b5340d2f3a4958a7abbf5e0146e77f6295a07b671cdc1cc107cefd'],['146a778c04670c2f91b00af4680dfa8bce3490717d58ba889ddb5928366642be','b318e0ec3354028add669827f9d4b2870aaa971d2f7e5ed1d0b297483d83efd0'],['fa50c0f61d22e5f07e3acebb1aa07b128d0012209a28b9776d76a8793180eef9','6b84c6922397eba9b72cd2872281a68a5e683293a57a213b38cd8d7d3f4f2811'],['da1d61d0ca721a11b1a5bf6b7d88e8421a288ab5d5bba5220e53d32b5f067ec2','8157f55a7c99306c79c0766161c91e2966a73899d279b48a655fba0f1ad836f1'],['a8e282ff0c9706907215ff98e8fd416615311de0446f1e062a73b0610d064e13','7f97355b8db81c09abfb7f3c5b2515888b679a3e50dd6bd6cef7c73111f4cc0c'],['174a53b9c9a285872d39e56e6913cab15d59b1fa512508c022f382de8319497c','ccc9dc37abfc9c1657b4155f2c47f9e6646b3a1d8cb9854383da13ac079afa73'],['959396981943785c3d3e57edf5018cdbe039e730e4918b3d884fdff09475b7ba','2e7e552888c331dd8ba0386a4b9cd6849c653f64c8709385e9b8abf87524f2fd'],['d2a63a50ae401e56d645a1153b109a8fcca0a43d561fba2dbb51340c9d82b151','e82d86fb6443fcb7565aee58b2948220a70f750af484ca52d4142174dcf89405'],['64587e2335471eb890ee7896d7cfdc866bacbdbd3839317b3436f9b45617e073','d99fcdd5bf6902e2ae96dd6447c299a185b90a39133aeab358299e5e9faf6589'],['8481bde0e4e4d885b3a546d3e549de042f0aa6cea250e7fd358d6c86dd45e458','38ee7b8cba5404dd84a25bf39cecb2ca900a79c42b262e556d64b1b59779057e'],['13464a57a78102aa62b6979ae817f4637ffcfed3c4b1ce30bcd6303f6caf666b','69be159004614580ef7e433453ccb0ca48f300a81d0942e13f495a907f6ecc27'],['bc4a9df5b713fe2e9aef430bcc1dc97a0cd9ccede2f28588cada3a0d2d83f366','d3a81ca6e785c06383937adf4b798caa6e8a9fbfa547b16d758d666581f33c1'],['8c28a97bf8298bc0d23d8c749452a32e694b65e30a9472a3954ab30fe5324caa','40a30463a3305193378fedf31f7cc0eb7ae784f0451cb9459e71dc73cbef9482'],['8ea9666139527a8c1dd94ce4f071fd23c8b350c5a4bb33748c4ba111faccae0','620efabbc8ee2782e24e7c0cfb95c5d735b783be9cf0f8e955af34a30e62b945'],['dd3625faef5ba06074669716bbd3788d89bdde815959968092f76cc4eb9a9787','7a188fa3520e30d461da2501045731ca941461982883395937f68d00c644a573'],['f710d79d9eb962297e4f6232b40e8f7feb2bc63814614d692c12de752408221e','ea98e67232d3b3295d3b535532115ccac8612c721851617526ae47a9c77bfc82']]},naf:{wnd:7,points:[['f9308a019258c31049344f85f89d5229b531c845836f99b08601f113bce036f9','388f7b0f632de8140fe337e62a37f3566500a99934c2231b6cb9fd7584b8e672'],['2f8bde4d1a07209355b4a7250a5c5128e88b84bddc619ab7cba8d569b240efe4','d8ac222636e5e3d6d4dba9dda6c9c426f788271bab0d6840dca87d3aa6ac62d6'],['5cbdf0646e5db4eaa398f365f2ea7a0e3d419b7e0330e39ce92bddedcac4f9bc','6aebca40ba255960a3178d6d861a54dba813d0b813fde7b5a5082628087264da'],['acd484e2f0c7f65309ad178a9f559abde09796974c57e714c35f110dfc27ccbe','cc338921b0a7d9fd64380971763b61e9add888a4375f8e0f05cc262ac64f9c37'],['774ae7f858a9411e5ef4246b70c65aac5649980be5c17891bbec17895da008cb','d984a032eb6b5e190243dd56d7b7b365372db1e2dff9d6a8301d74c9c953c61b'],['f28773c2d975288bc7d1d205c3748651b075fbc6610e58cddeeddf8f19405aa8','ab0902e8d880a89758212eb65cdaf473a1a06da521fa91f29b5cb52db03ed81'],['d7924d4f7d43ea965a465ae3095ff41131e5946f3c85f79e44adbcf8e27e080e','581e2872a86c72a683842ec228cc6defea40af2bd896d3a5c504dc9ff6a26b58'],['defdea4cdb677750a420fee807eacf21eb9898ae79b9768766e4faa04a2d4a34','4211ab0694635168e997b0ead2a93daeced1f4a04a95c0f6cfb199f69e56eb77'],['2b4ea0a797a443d293ef5cff444f4979f06acfebd7e86d277475656138385b6c','85e89bc037945d93b343083b5a1c86131a01f60c50269763b570c854e5c09b7a'],['352bbf4a4cdd12564f93fa332ce333301d9ad40271f8107181340aef25be59d5','321eb4075348f534d59c18259dda3e1f4a1b3b2e71b1039c67bd3d8bcf81998c'],['2fa2104d6b38d11b0230010559879124e42ab8dfeff5ff29dc9cdadd4ecacc3f','2de1068295dd865b64569335bd5dd80181d70ecfc882648423ba76b532b7d67'],['9248279b09b4d68dab21a9b066edda83263c3d84e09572e269ca0cd7f5453714','73016f7bf234aade5d1aa71bdea2b1ff3fc0de2a887912ffe54a32ce97cb3402'],['daed4f2be3a8bf278e70132fb0beb7522f570e144bf615c07e996d443dee8729','a69dce4a7d6c98e8d4a1aca87ef8d7003f83c230f3afa726ab40e52290be1c55'],['c44d12c7065d812e8acf28d7cbb19f9011ecd9e9fdf281b0e6a3b5e87d22e7db','2119a460ce326cdc76c45926c982fdac0e106e861edf61c5a039063f0e0e6482'],['6a245bf6dc698504c89a20cfded60853152b695336c28063b61c65cbd269e6b4','e022cf42c2bd4a708b3f5126f16a24ad8b33ba48d0423b6efd5e6348100d8a82'],['1697ffa6fd9de627c077e3d2fe541084ce13300b0bec1146f95ae57f0d0bd6a5','b9c398f186806f5d27561506e4557433a2cf15009e498ae7adee9d63d01b2396'],['605bdb019981718b986d0f07e834cb0d9deb8360ffb7f61df982345ef27a7479','2972d2de4f8d20681a78d93ec96fe23c26bfae84fb14db43b01e1e9056b8c49'],['62d14dab4150bf497402fdc45a215e10dcb01c354959b10cfe31c7e9d87ff33d','80fc06bd8cc5b01098088a1950eed0db01aa132967ab472235f5642483b25eaf'],['80c60ad0040f27dade5b4b06c408e56b2c50e9f56b9b8b425e555c2f86308b6f','1c38303f1cc5c30f26e66bad7fe72f70a65eed4cbe7024eb1aa01f56430bd57a'],['7a9375ad6167ad54aa74c6348cc54d344cc5dc9487d847049d5eabb0fa03c8fb','d0e3fa9eca8726909559e0d79269046bdc59ea10c70ce2b02d499ec224dc7f7'],['d528ecd9b696b54c907a9ed045447a79bb408ec39b68df504bb51f459bc3ffc9','eecf41253136e5f99966f21881fd656ebc4345405c520dbc063465b521409933'],['49370a4b5f43412ea25f514e8ecdad05266115e4a7ecb1387231808f8b45963','758f3f41afd6ed428b3081b0512fd62a54c3f3afbb5b6764b653052a12949c9a'],['77f230936ee88cbbd73df930d64702ef881d811e0e1498e2f1c13eb1fc345d74','958ef42a7886b6400a08266e9ba1b37896c95330d97077cbbe8eb3c7671c60d6'],['f2dac991cc4ce4b9ea44887e5c7c0bce58c80074ab9d4dbaeb28531b7739f530','e0dedc9b3b2f8dad4da1f32dec2531df9eb5fbeb0598e4fd1a117dba703a3c37'],['463b3d9f662621fb1b4be8fbbe2520125a216cdfc9dae3debcba4850c690d45b','5ed430d78c296c3543114306dd8622d7c622e27c970a1de31cb377b01af7307e'],['f16f804244e46e2a09232d4aff3b59976b98fac14328a2d1a32496b49998f247','cedabd9b82203f7e13d206fcdf4e33d92a6c53c26e5cce26d6579962c4e31df6'],['caf754272dc84563b0352b7a14311af55d245315ace27c65369e15f7151d41d1','cb474660ef35f5f2a41b643fa5e460575f4fa9b7962232a5c32f908318a04476'],['2600ca4b282cb986f85d0f1709979d8b44a09c07cb86d7c124497bc86f082120','4119b88753c15bd6a693b03fcddbb45d5ac6be74ab5f0ef44b0be9475a7e4b40'],['7635ca72d7e8432c338ec53cd12220bc01c48685e24f7dc8c602a7746998e435','91b649609489d613d1d5e590f78e6d74ecfc061d57048bad9e76f302c5b9c61'],['754e3239f325570cdbbf4a87deee8a66b7f2b33479d468fbc1a50743bf56cc18','673fb86e5bda30fb3cd0ed304ea49a023ee33d0197a695d0c5d98093c536683'],['e3e6bd1071a1e96aff57859c82d570f0330800661d1c952f9fe2694691d9b9e8','59c9e0bba394e76f40c0aa58379a3cb6a5a2283993e90c4167002af4920e37f5'],['186b483d056a033826ae73d88f732985c4ccb1f32ba35f4b4cc47fdcf04aa6eb','3b952d32c67cf77e2e17446e204180ab21fb8090895138b4a4a797f86e80888b'],['df9d70a6b9876ce544c98561f4be4f725442e6d2b737d9c91a8321724ce0963f','55eb2dafd84d6ccd5f862b785dc39d4ab157222720ef9da217b8c45cf2ba2417'],['5edd5cc23c51e87a497ca815d5dce0f8ab52554f849ed8995de64c5f34ce7143','efae9c8dbc14130661e8cec030c89ad0c13c66c0d17a2905cdc706ab7399a868'],['290798c2b6476830da12fe02287e9e777aa3fba1c355b17a722d362f84614fba','e38da76dcd440621988d00bcf79af25d5b29c094db2a23146d003afd41943e7a'],['af3c423a95d9f5b3054754efa150ac39cd29552fe360257362dfdecef4053b45','f98a3fd831eb2b749a93b0e6f35cfb40c8cd5aa667a15581bc2feded498fd9c6'],['766dbb24d134e745cccaa28c99bf274906bb66b26dcf98df8d2fed50d884249a','744b1152eacbe5e38dcc887980da38b897584a65fa06cedd2c924f97cbac5996'],['59dbf46f8c94759ba21277c33784f41645f7b44f6c596a58ce92e666191abe3e','c534ad44175fbc300f4ea6ce648309a042ce739a7919798cd85e216c4a307f6e'],['f13ada95103c4537305e691e74e9a4a8dd647e711a95e73cb62dc6018cfd87b8','e13817b44ee14de663bf4bc808341f326949e21a6a75c2570778419bdaf5733d'],['7754b4fa0e8aced06d4167a2c59cca4cda1869c06ebadfb6488550015a88522c','30e93e864e669d82224b967c3020b8fa8d1e4e350b6cbcc537a48b57841163a2'],['948dcadf5990e048aa3874d46abef9d701858f95de8041d2a6828c99e2262519','e491a42537f6e597d5d28a3224b1bc25df9154efbd2ef1d2cbba2cae5347d57e'],['7962414450c76c1689c7b48f8202ec37fb224cf5ac0bfa1570328a8a3d7c77ab','100b610ec4ffb4760d5c1fc133ef6f6b12507a051f04ac5760afa5b29db83437'],['3514087834964b54b15b160644d915485a16977225b8847bb0dd085137ec47ca','ef0afbb2056205448e1652c48e8127fc6039e77c15c2378b7e7d15a0de293311'],['d3cc30ad6b483e4bc79ce2c9dd8bc54993e947eb8df787b442943d3f7b527eaf','8b378a22d827278d89c5e9be8f9508ae3c2ad46290358630afb34db04eede0a4'],['1624d84780732860ce1c78fcbfefe08b2b29823db913f6493975ba0ff4847610','68651cf9b6da903e0914448c6cd9d4ca896878f5282be4c8cc06e2a404078575'],['733ce80da955a8a26902c95633e62a985192474b5af207da6df7b4fd5fc61cd4','f5435a2bd2badf7d485a4d8b8db9fcce3e1ef8e0201e4578c54673bc1dc5ea1d'],['15d9441254945064cf1a1c33bbd3b49f8966c5092171e699ef258dfab81c045c','d56eb30b69463e7234f5137b73b84177434800bacebfc685fc37bbe9efe4070d'],['a1d0fcf2ec9de675b612136e5ce70d271c21417c9d2b8aaaac138599d0717940','edd77f50bcb5a3cab2e90737309667f2641462a54070f3d519212d39c197a629'],['e22fbe15c0af8ccc5780c0735f84dbe9a790badee8245c06c7ca37331cb36980','a855babad5cd60c88b430a69f53a1a7a38289154964799be43d06d77d31da06'],['311091dd9860e8e20ee13473c1155f5f69635e394704eaa74009452246cfa9b3','66db656f87d1f04fffd1f04788c06830871ec5a64feee685bd80f0b1286d8374'],['34c1fd04d301be89b31c0442d3e6ac24883928b45a9340781867d4232ec2dbdf','9414685e97b1b5954bd46f730174136d57f1ceeb487443dc5321857ba73abee'],['f219ea5d6b54701c1c14de5b557eb42a8d13f3abbcd08affcc2a5e6b049b8d63','4cb95957e83d40b0f73af4544cccf6b1f4b08d3c07b27fb8d8c2962a400766d1'],['d7b8740f74a8fbaab1f683db8f45de26543a5490bca627087236912469a0b448','fa77968128d9c92ee1010f337ad4717eff15db5ed3c049b3411e0315eaa4593b'],['32d31c222f8f6f0ef86f7c98d3a3335ead5bcd32abdd94289fe4d3091aa824bf','5f3032f5892156e39ccd3d7915b9e1da2e6dac9e6f26e961118d14b8462e1661'],['7461f371914ab32671045a155d9831ea8793d77cd59592c4340f86cbc18347b5','8ec0ba238b96bec0cbdddcae0aa442542eee1ff50c986ea6b39847b3cc092ff6'],['ee079adb1df1860074356a25aa38206a6d716b2c3e67453d287698bad7b2b2d6','8dc2412aafe3be5c4c5f37e0ecc5f9f6a446989af04c4e25ebaac479ec1c8c1e'],['16ec93e447ec83f0467b18302ee620f7e65de331874c9dc72bfd8616ba9da6b5','5e4631150e62fb40d0e8c2a7ca5804a39d58186a50e497139626778e25b0674d'],['eaa5f980c245f6f038978290afa70b6bd8855897f98b6aa485b96065d537bd99','f65f5d3e292c2e0819a528391c994624d784869d7e6ea67fb18041024edc07dc'],['78c9407544ac132692ee1910a02439958ae04877151342ea96c4b6b35a49f51','f3e0319169eb9b85d5404795539a5e68fa1fbd583c064d2462b675f194a3ddb4'],['494f4be219a1a77016dcd838431aea0001cdc8ae7a6fc688726578d9702857a5','42242a969283a5f339ba7f075e36ba2af925ce30d767ed6e55f4b031880d562c'],['a598a8030da6d86c6bc7f2f5144ea549d28211ea58faa70ebf4c1e665c1fe9b5','204b5d6f84822c307e4b4a7140737aec23fc63b65b35f86a10026dbd2d864e6b'],['c41916365abb2b5d09192f5f2dbeafec208f020f12570a184dbadc3e58595997','4f14351d0087efa49d245b328984989d5caf9450f34bfc0ed16e96b58fa9913'],['841d6063a586fa475a724604da03bc5b92a2e0d2e0a36acfe4c73a5514742881','73867f59c0659e81904f9a1c7543698e62562d6744c169ce7a36de01a8d6154'],['5e95bb399a6971d376026947f89bde2f282b33810928be4ded112ac4d70e20d5','39f23f366809085beebfc71181313775a99c9aed7d8ba38b161384c746012865'],['36e4641a53948fd476c39f8a99fd974e5ec07564b5315d8bf99471bca0ef2f66','d2424b1b1abe4eb8164227b085c9aa9456ea13493fd563e06fd51cf5694c78fc'],['336581ea7bfbbb290c191a2f507a41cf5643842170e914faeab27c2c579f726','ead12168595fe1be99252129b6e56b3391f7ab1410cd1e0ef3dcdcabd2fda224'],['8ab89816dadfd6b6a1f2634fcf00ec8403781025ed6890c4849742706bd43ede','6fdcef09f2f6d0a044e654aef624136f503d459c3e89845858a47a9129cdd24e'],['1e33f1a746c9c5778133344d9299fcaa20b0938e8acff2544bb40284b8c5fb94','60660257dd11b3aa9c8ed618d24edff2306d320f1d03010e33a7d2057f3b3b6'],['85b7c1dcb3cec1b7ee7f30ded79dd20a0ed1f4cc18cbcfcfa410361fd8f08f31','3d98a9cdd026dd43f39048f25a8847f4fcafad1895d7a633c6fed3c35e999511'],['29df9fbd8d9e46509275f4b125d6d45d7fbe9a3b878a7af872a2800661ac5f51','b4c4fe99c775a606e2d8862179139ffda61dc861c019e55cd2876eb2a27d84b'],['a0b1cae06b0a847a3fea6e671aaf8adfdfe58ca2f768105c8082b2e449fce252','ae434102edde0958ec4b19d917a6a28e6b72da1834aff0e650f049503a296cf2'],['4e8ceafb9b3e9a136dc7ff67e840295b499dfb3b2133e4ba113f2e4c0e121e5','cf2174118c8b6d7a4b48f6d534ce5c79422c086a63460502b827ce62a326683c'],['d24a44e047e19b6f5afb81c7ca2f69080a5076689a010919f42725c2b789a33b','6fb8d5591b466f8fc63db50f1c0f1c69013f996887b8244d2cdec417afea8fa3'],['ea01606a7a6c9cdd249fdfcfacb99584001edd28abbab77b5104e98e8e3b35d4','322af4908c7312b0cfbfe369f7a7b3cdb7d4494bc2823700cfd652188a3ea98d'],['af8addbf2b661c8a6c6328655eb96651252007d8c5ea31be4ad196de8ce2131f','6749e67c029b85f52a034eafd096836b2520818680e26ac8f3dfbcdb71749700'],['e3ae1974566ca06cc516d47e0fb165a674a3dabcfca15e722f0e3450f45889','2aeabe7e4531510116217f07bf4d07300de97e4874f81f533420a72eeb0bd6a4'],['591ee355313d99721cf6993ffed1e3e301993ff3ed258802075ea8ced397e246','b0ea558a113c30bea60fc4775460c7901ff0b053d25ca2bdeee98f1a4be5d196'],['11396d55fda54c49f19aa97318d8da61fa8584e47b084945077cf03255b52984','998c74a8cd45ac01289d5833a7beb4744ff536b01b257be4c5767bea93ea57a4'],['3c5d2a1ba39c5a1790000738c9e0c40b8dcdfd5468754b6405540157e017aa7a','b2284279995a34e2f9d4de7396fc18b80f9b8b9fdd270f6661f79ca4c81bd257'],['cc8704b8a60a0defa3a99a7299f2e9c3fbc395afb04ac078425ef8a1793cc030','bdd46039feed17881d1e0862db347f8cf395b74fc4bcdc4e940b74e3ac1f1b13'],['c533e4f7ea8555aacd9777ac5cad29b97dd4defccc53ee7ea204119b2889b197','6f0a256bc5efdf429a2fb6242f1a43a2d9b925bb4a4b3a26bb8e0f45eb596096'],['c14f8f2ccb27d6f109f6d08d03cc96a69ba8c34eec07bbcf566d48e33da6593','c359d6923bb398f7fd4473e16fe1c28475b740dd098075e6c0e8649113dc3a38'],['a6cbc3046bc6a450bac24789fa17115a4c9739ed75f8f21ce441f72e0b90e6ef','21ae7f4680e889bb130619e2c0f95a360ceb573c70603139862afd617fa9b9f'],['347d6d9a02c48927ebfb86c1359b1caf130a3c0267d11ce6344b39f99d43cc38','60ea7f61a353524d1c987f6ecec92f086d565ab687870cb12689ff1e31c74448'],['da6545d2181db8d983f7dcb375ef5866d47c67b1bf31c8cf855ef7437b72656a','49b96715ab6878a79e78f07ce5680c5d6673051b4935bd897fea824b77dc208a'],['c40747cc9d012cb1a13b8148309c6de7ec25d6945d657146b9d5994b8feb1111','5ca560753be2a12fc6de6caf2cb489565db936156b9514e1bb5e83037e0fa2d4'],['4e42c8ec82c99798ccf3a610be870e78338c7f713348bd34c8203ef4037f3502','7571d74ee5e0fb92a7a8b33a07783341a5492144cc54bcc40a94473693606437'],['3775ab7089bc6af823aba2e1af70b236d251cadb0c86743287522a1b3b0dedea','be52d107bcfa09d8bcb9736a828cfa7fac8db17bf7a76a2c42ad961409018cf7'],['cee31cbf7e34ec379d94fb814d3d775ad954595d1314ba8846959e3e82f74e26','8fd64a14c06b589c26b947ae2bcf6bfa0149ef0be14ed4d80f448a01c43b1c6d'],['b4f9eaea09b6917619f6ea6a4eb5464efddb58fd45b1ebefcdc1a01d08b47986','39e5c9925b5a54b07433a4f18c61726f8bb131c012ca542eb24a8ac07200682a'],['d4263dfc3d2df923a0179a48966d30ce84e2515afc3dccc1b77907792ebcc60e','62dfaf07a0f78feb30e30d6295853ce189e127760ad6cf7fae164e122a208d54'],['48457524820fa65a4f8d35eb6930857c0032acc0a4a2de422233eeda897612c4','25a748ab367979d98733c38a1fa1c2e7dc6cc07db2d60a9ae7a76aaa49bd0f77'],['dfeeef1881101f2cb11644f3a2afdfc2045e19919152923f367a1767c11cceda','ecfb7056cf1de042f9420bab396793c0c390bde74b4bbdff16a83ae09a9a7517'],['6d7ef6b17543f8373c573f44e1f389835d89bcbc6062ced36c82df83b8fae859','cd450ec335438986dfefa10c57fea9bcc521a0959b2d80bbf74b190dca712d10'],['e75605d59102a5a2684500d3b991f2e3f3c88b93225547035af25af66e04541f','f5c54754a8f71ee540b9b48728473e314f729ac5308b06938360990e2bfad125'],['eb98660f4c4dfaa06a2be453d5020bc99a0c2e60abe388457dd43fefb1ed620c','6cb9a8876d9cb8520609af3add26cd20a0a7cd8a9411131ce85f44100099223e'],['13e87b027d8514d35939f2e6892b19922154596941888336dc3563e3b8dba942','fef5a3c68059a6dec5d624114bf1e91aac2b9da568d6abeb2570d55646b8adf1'],['ee163026e9fd6fe017c38f06a5be6fc125424b371ce2708e7bf4491691e5764a','1acb250f255dd61c43d94ccc670d0f58f49ae3fa15b96623e5430da0ad6c62b2'],['b268f5ef9ad51e4d78de3a750c2dc89b1e626d43505867999932e5db33af3d80','5f310d4b3c99b9ebb19f77d41c1dee018cf0d34fd4191614003e945a1216e423'],['ff07f3118a9df035e9fad85eb6c7bfe42b02f01ca99ceea3bf7ffdba93c4750d','438136d603e858a3a5c440c38eccbaddc1d2942114e2eddd4740d098ced1f0d8'],['8d8b9855c7c052a34146fd20ffb658bea4b9f69e0d825ebec16e8c3ce2b526a1','cdb559eedc2d79f926baf44fb84ea4d44bcf50fee51d7ceb30e2e7f463036758'],['52db0b5384dfbf05bfa9d472d7ae26dfe4b851ceca91b1eba54263180da32b63','c3b997d050ee5d423ebaf66a6db9f57b3180c902875679de924b69d84a7b375'],['e62f9490d3d51da6395efd24e80919cc7d0f29c3f3fa48c6fff543becbd43352','6d89ad7ba4876b0b22c2ca280c682862f342c8591f1daf5170e07bfd9ccafa7d'],['7f30ea2476b399b4957509c88f77d0191afa2ff5cb7b14fd6d8e7d65aaab1193','ca5ef7d4b231c94c3b15389a5f6311e9daff7bb67b103e9880ef4bff637acaec'],['5098ff1e1d9f14fb46a210fada6c903fef0fb7b4a1dd1d9ac60a0361800b7a00','9731141d81fc8f8084d37c6e7542006b3ee1b40d60dfe5362a5b132fd17ddc0'],['32b78c7de9ee512a72895be6b9cbefa6e2f3c4ccce445c96b9f2c81e2778ad58','ee1849f513df71e32efc3896ee28260c73bb80547ae2275ba497237794c8753c'],['e2cb74fddc8e9fbcd076eef2a7c72b0ce37d50f08269dfc074b581550547a4f7','d3aa2ed71c9dd2247a62df062736eb0baddea9e36122d2be8641abcb005cc4a4'],['8438447566d4d7bedadc299496ab357426009a35f235cb141be0d99cd10ae3a8','c4e1020916980a4da5d01ac5e6ad330734ef0d7906631c4f2390426b2edd791f'],['4162d488b89402039b584c6fc6c308870587d9c46f660b878ab65c82c711d67e','67163e903236289f776f22c25fb8a3afc1732f2b84b4e95dbda47ae5a0852649'],['3fad3fa84caf0f34f0f89bfd2dcf54fc175d767aec3e50684f3ba4a4bf5f683d','cd1bc7cb6cc407bb2f0ca647c718a730cf71872e7d0d2a53fa20efcdfe61826'],['674f2600a3007a00568c1a7ce05d0816c1fb84bf1370798f1c69532faeb1a86b','299d21f9413f33b3edf43b257004580b70db57da0b182259e09eecc69e0d38a5'],['d32f4da54ade74abb81b815ad1fb3b263d82d6c692714bcff87d29bd5ee9f08f','f9429e738b8e53b968e99016c059707782e14f4535359d582fc416910b3eea87'],['30e4e670435385556e593657135845d36fbb6931f72b08cb1ed954f1e3ce3ff6','462f9bce619898638499350113bbc9b10a878d35da70740dc695a559eb88db7b'],['be2062003c51cc3004682904330e4dee7f3dcd10b01e580bf1971b04d4cad297','62188bc49d61e5428573d48a74e1c655b1c61090905682a0d5558ed72dccb9bc'],['93144423ace3451ed29e0fb9ac2af211cb6e84a601df5993c419859fff5df04a','7c10dfb164c3425f5c71a3f9d7992038f1065224f72bb9d1d902a6d13037b47c'],['b015f8044f5fcbdcf21ca26d6c34fb8197829205c7b7d2a7cb66418c157b112c','ab8c1e086d04e813744a655b2df8d5f83b3cdc6faa3088c1d3aea1454e3a1d5f'],['d5e9e1da649d97d89e4868117a465a3a4f8a18de57a140d36b3f2af341a21b52','4cb04437f391ed73111a13cc1d4dd0db1693465c2240480d8955e8592f27447a'],['d3ae41047dd7ca065dbf8ed77b992439983005cd72e16d6f996a5316d36966bb','bd1aeb21ad22ebb22a10f0303417c6d964f8cdd7df0aca614b10dc14d125ac46'],['463e2763d885f958fc66cdd22800f0a487197d0a82e377b49f80af87c897b065','bfefacdb0e5d0fd7df3a311a94de062b26b80c61fbc97508b79992671ef7ca7f'],['7985fdfd127c0567c6f53ec1bb63ec3158e597c40bfe747c83cddfc910641917','603c12daf3d9862ef2b25fe1de289aed24ed291e0ec6708703a5bd567f32ed03'],['74a1ad6b5f76e39db2dd249410eac7f99e74c59cb83d2d0ed5ff1543da7703e9','cc6157ef18c9c63cd6193d83631bbea0093e0968942e8c33d5737fd790e0db08'],['30682a50703375f602d416664ba19b7fc9bab42c72747463a71d0896b22f6da3','553e04f6b018b4fa6c8f39e7f311d3176290d0e0f19ca73f17714d9977a22ff8'],['9e2158f0d7c0d5f26c3791efefa79597654e7a2b2464f52b1ee6c1347769ef57','712fcdd1b9053f09003a3481fa7762e9ffd7c8ef35a38509e2fbf2629008373'],['176e26989a43c9cfeba4029c202538c28172e566e3c4fce7322857f3be327d66','ed8cc9d04b29eb877d270b4878dc43c19aefd31f4eee09ee7b47834c1fa4b1c3'],['75d46efea3771e6e68abb89a13ad747ecf1892393dfc4f1b7004788c50374da8','9852390a99507679fd0b86fd2b39a868d7efc22151346e1a3ca4726586a6bed8'],['809a20c67d64900ffb698c4c825f6d5f2310fb0451c869345b7319f645605721','9e994980d9917e22b76b061927fa04143d096ccc54963e6a5ebfa5f3f8e286c1'],['1b38903a43f7f114ed4500b4eac7083fdefece1cf29c63528d563446f972c180','4036edc931a60ae889353f77fd53de4a2708b26b6f5da72ad3394119daf408f9']]}};

},{}],30:[function(require,module,exports){
'use strict';var utils=exports,BN=require('bn.js');utils.assert=function(b,d){if(!b)throw new Error(d||'Assertion failed')};function toArray(a,b){if(Array.isArray(a))return a.slice();if(!a)return[];var d=[];if('string'!=typeof a){for(var e=0;e<a.length;e++)d[e]=0|a[e];return d}if(!b)for(var e=0;e<a.length;e++){var f=a.charCodeAt(e),g=f>>8,h=255&f;g?d.push(g,h):d.push(h)}else if('hex'===b){a=a.replace(/[^a-z0-9]+/ig,''),0!=a.length%2&&(a='0'+a);for(var e=0;e<a.length;e+=2)d.push(parseInt(a[e]+a[e+1],16))}return d}utils.toArray=toArray;function zero2(a){return 1===a.length?'0'+a:a}utils.zero2=zero2;function toHex(a){var b='';for(var d=0;d<a.length;d++)b+=zero2(a[d].toString(16));return b}utils.toHex=toHex,utils.encode=function(b,d){return'hex'===d?toHex(b):b};// Represent num in a w-NAF form
function getNAF(a,b){for(var d=[],e=1<<b+1,f=a.clone();0<=f.cmpn(1);){var g;if(f.isOdd()){var h=f.andln(e-1);g=h>(e>>1)-1?(e>>1)-h:h,f.isubn(g)}else g=0;d.push(g);// Optimization, shift by word if possible
var j=0!==f.cmpn(0)&&0===f.andln(e-1)?b+1:1;for(var l=1;l<j;l++)d.push(0);f.iushrn(j)}return d}utils.getNAF=getNAF;// Represent k1, k2 in a Joint Sparse Form
function getJSF(a,b){var d=[[],[]];a=a.clone(),b=b.clone();for(var e=0,f=0;0<a.cmpn(-e)||0<b.cmpn(-f);){// First phase
var g=3&a.andln(3)+e,h=3&b.andln(3)+f;3==g&&(g=-1),3==h&&(h=-1);var j;if(0==(1&g))j=0;else{var l=7&a.andln(7)+e;j=(3==l||5==l)&&2==h?-g:g}d[0].push(j);var m;if(0==(1&h))m=0;else{var l=7&b.andln(7)+f;m=(3==l||5==l)&&2==g?-h:h}d[1].push(m),2*e===j+1&&(e=1-e),2*f===m+1&&(f=1-f),a.iushrn(1),b.iushrn(1)}return d}utils.getJSF=getJSF;function cachedProperty(a,b,d){var e='_'+b;a.prototype[b]=function(){return this[e]===void 0?this[e]=d.call(this):this[e]}}utils.cachedProperty=cachedProperty;function parseBytes(a){return'string'==typeof a?utils.toArray(a,'hex'):a}utils.parseBytes=parseBytes;function intFromLE(a){return new BN(a,'hex','le')}utils.intFromLE=intFromLE;

},{"bn.js":4}],31:[function(require,module,exports){
module.exports={
  "_args": [
    [
      {
        "raw": "elliptic@^6.0.0",
        "scope": null,
        "escapedName": "elliptic",
        "name": "elliptic",
        "rawSpec": "^6.0.0",
        "spec": ">=6.0.0 <7.0.0",
        "type": "range"
      },
      "/Users/pelleb/code/browser-builds/node_modules/browserify-sign"
    ]
  ],
  "_from": "elliptic@>=6.0.0 <7.0.0",
  "_id": "elliptic@6.3.2",
  "_inCache": true,
  "_installable": true,
  "_location": "/elliptic",
  "_nodeVersion": "6.3.0",
  "_npmOperationalInternal": {
    "host": "packages-16-east.internal.npmjs.com",
    "tmp": "tmp/elliptic-6.3.2.tgz_1473938837205_0.3108903462998569"
  },
  "_npmUser": {
    "name": "indutny",
    "email": "fedor@indutny.com"
  },
  "_npmVersion": "3.10.3",
  "_phantomChildren": {},
  "_requested": {
    "raw": "elliptic@^6.0.0",
    "scope": null,
    "escapedName": "elliptic",
    "name": "elliptic",
    "rawSpec": "^6.0.0",
    "spec": ">=6.0.0 <7.0.0",
    "type": "range"
  },
  "_requiredBy": [
    "/browserify-sign",
    "/create-ecdh"
  ],
  "_resolved": "https://registry.npmjs.org/elliptic/-/elliptic-6.3.2.tgz",
  "_shasum": "e4c81e0829cf0a65ab70e998b8232723b5c1bc48",
  "_shrinkwrap": null,
  "_spec": "elliptic@^6.0.0",
  "_where": "/Users/pelleb/code/browser-builds/node_modules/browserify-sign",
  "author": {
    "name": "Fedor Indutny",
    "email": "fedor@indutny.com"
  },
  "bugs": {
    "url": "https://github.com/indutny/elliptic/issues"
  },
  "dependencies": {
    "bn.js": "^4.4.0",
    "brorand": "^1.0.1",
    "hash.js": "^1.0.0",
    "inherits": "^2.0.1"
  },
  "description": "EC cryptography",
  "devDependencies": {
    "brfs": "^1.4.3",
    "coveralls": "^2.11.3",
    "grunt": "^0.4.5",
    "grunt-browserify": "^5.0.0",
    "grunt-contrib-connect": "^1.0.0",
    "grunt-contrib-copy": "^1.0.0",
    "grunt-contrib-uglify": "^1.0.1",
    "grunt-mocha-istanbul": "^3.0.1",
    "grunt-saucelabs": "^8.6.2",
    "istanbul": "^0.4.2",
    "jscs": "^2.9.0",
    "jshint": "^2.6.0",
    "mocha": "^2.1.0"
  },
  "directories": {},
  "dist": {
    "shasum": "e4c81e0829cf0a65ab70e998b8232723b5c1bc48",
    "tarball": "https://registry.npmjs.org/elliptic/-/elliptic-6.3.2.tgz"
  },
  "files": [
    "lib"
  ],
  "gitHead": "cbace4683a4a548dc0306ef36756151a20299cd5",
  "homepage": "https://github.com/indutny/elliptic",
  "keywords": [
    "EC",
    "Elliptic",
    "curve",
    "Cryptography"
  ],
  "license": "MIT",
  "main": "lib/elliptic.js",
  "maintainers": [
    {
      "name": "indutny",
      "email": "fedor@indutny.com"
    }
  ],
  "name": "elliptic",
  "optionalDependencies": {},
  "readme": "ERROR: No README data found!",
  "repository": {
    "type": "git",
    "url": "git+ssh://git@github.com/indutny/elliptic.git"
  },
  "scripts": {
    "jscs": "jscs benchmarks/*.js lib/*.js lib/**/*.js lib/**/**/*.js test/index.js",
    "jshint": "jscs benchmarks/*.js lib/*.js lib/**/*.js lib/**/**/*.js test/index.js",
    "lint": "npm run jscs && npm run jshint",
    "test": "npm run lint && npm run unit",
    "unit": "istanbul test _mocha --reporter=spec test/index.js",
    "version": "grunt dist && git add dist/"
  },
  "version": "6.3.2"
}

},{}],32:[function(require,module,exports){
module.exports={
  "genesisGasLimit": {
    "v": 5000,
    "d": "Gas limit of the Genesis block."
  },
  "genesisDifficulty": {
    "v": 17179869184,
    "d": "Difficulty of the Genesis block."
  },
  "genesisNonce": {
    "v": "0x0000000000000042",
    "d": "the geneis nonce"
  },
  "genesisExtraData": {
    "v": "0x11bbe8db4e347b4e8c937c1c8370e4b5ed33adb3db69cbdb7a38e1e50b1b82fa",
    "d": "extra data "
  },
  "genesisHash": {
    "v": "0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3",
    "d": "genesis hash"
  },
  "genesisStateRoot": {
    "v": "0xd7f8974fb5ac78d9ac099b9ad5018bedc2ce0a72dad1827a1709da30580f0544",
    "d": "the genesis state root"
  },
  "minGasLimit": {
    "v": 5000,
    "d": "Minimum the gas limit may ever be."
  },
  "gasLimitBoundDivisor": {
    "v": 1024,
    "d": "The bound divisor of the gas limit, used in update calculations."
  },
  "minimumDifficulty": {
    "v": 131072,
    "d": "The minimum that the difficulty may ever be."
  },
  "difficultyBoundDivisor": {
    "v": 2048,
    "d": "The bound divisor of the difficulty, used in the update calculations."
  },
  "durationLimit": {
    "v": 13,
    "d": "The decision boundary on the blocktime duration used to determine whether difficulty should go up or not."
  },
  "maximumExtraDataSize": {
    "v": 32,
    "d": "Maximum size extra data may be after Genesis."
  },
  "epochDuration": {
    "v": 30000,
    "d": "Duration between proof-of-work epochs."
  },
  "stackLimit": {
    "v": 1024,
    "d": "Maximum size of VM stack allowed."
  },
  "callCreateDepth": {
    "v": 1024,
    "d": "Maximum depth of call/create stack."
  },

  "tierStepGas": {
    "v": [0, 2, 3, 5, 8, 10, 20],
    "d": "Once per operation, for a selection of them."
  },
  "expGas": {
    "v": 10,
    "d": "Once per EXP instuction."
  },
  "expByteGas": {
    "v": 10,
    "d": "Times ceil(log256(exponent)) for the EXP instruction."
  },

  "sha3Gas": {
    "v": 30,
    "d": "Once per SHA3 operation."
  },
  "sha3WordGas": {
    "v": 6,
    "d": "Once per word of the SHA3 operation's data."
  },
  "sloadGas": {
    "v": 50,
    "d": "Once per SLOAD operation."
  },
  "sstoreSetGas": {
    "v": 20000,
    "d": "Once per SSTORE operation if the zeroness changes from zero."
  },
  "sstoreResetGas": {
    "v": 5000,
    "d": "Once per SSTORE operation if the zeroness does not change from zero."
  },
  "sstoreRefundGas": {
    "v": 15000,
    "d": "Once per SSTORE operation if the zeroness changes to zero."
  },
  "jumpdestGas": {
    "v": 1,
    "d": "Refunded gas, once per SSTORE operation if the zeroness changes to zero."
  },

  "logGas": {
    "v": 375,
    "d": "Per LOG* operation."
  },
  "logDataGas": {
    "v": 8,
    "d": "Per byte in a LOG* operation's data."
  },
  "logTopicGas": {
    "v": 375,
    "d": "Multiplied by the * of the LOG*, per LOG transaction. e.g. LOG0 incurs 0 * c_txLogTopicGas, LOG4 incurs 4 * c_txLogTopicGas."
  },

  "createGas": {
    "v": 32000,
    "d": "Once per CREATE operation & contract-creation transaction."
  },

  "callGas": {
    "v": 40,
    "d": "Once per CALL operation & message call transaction."
  },
  "callStipend": {
    "v": 2300,
    "d": "Free gas given at beginning of call."
  },
  "callValueTransferGas": {
    "v": 9000,
    "d": "Paid for CALL when the value transfor is non-zero."
  },
  "callNewAccountGas": {
    "v": 25000,
    "d": "Paid for CALL when the destination address didn't exist prior."
  },

  "suicideRefundGas": {
    "v": 24000,
    "d": "Refunded following a suicide operation."
  },

  "memoryGas": {
    "v": 3,
    "d": "Times the address of the (highest referenced byte in memory + 1). NOTE: referencing happens on read, write and in instructions such as RETURN and CALL."
  },
  "quadCoeffDiv": {
    "v": 512,
    "d": "Divisor for the quadratic particle of the memory cost equation."
  },

  "createDataGas": {
    "v": 200,
    "d": ""
  },
  "txGas": {
    "v": 21000,
    "d": "Per transaction. NOTE: Not payable on data of calls between transactions."
  },
  "txCreation": {
    "v": 32000,
    "d": "the cost of creating a contract via tx"
  },
  "txDataZeroGas": {
    "v": 4,
    "d": "Per byte of data attached to a transaction that equals zero. NOTE: Not payable on data of calls between transactions."
  },
  "txDataNonZeroGas": {
    "v": 68,
    "d": "Per byte of data attached to a transaction that is not equal to zero. NOTE: Not payable on data of calls between transactions."
  },

  "copyGas": {
    "v": 3,
    "d": "Multiplied by the number of 32-byte words that are copied (round up) for any *COPY operation and added."
  },

  "ecrecoverGas": {
    "v": 3000,
    "d": ""
  },
  "sha256Gas": {
    "v": 60,
    "d": ""
  },
  "sha256WordGas": {
    "v": 12,
    "d": ""
  },
  "ripemd160Gas": {
    "v": 600,
    "d": ""
  },
  "ripemd160WordGas": {
    "v": 120,
    "d": ""
  },
  "identityGas": {
    "v": 15,
    "d": ""
  },
  "identityWordGas": {
    "v": 3,
    "d": ""
  },
  "minerReward": {
    "v": "5000000000000000000",
    "d": "the amount a miner get rewarded for mining a block"
  },
  "ommerReward": {
    "v": "625000000000000000",
    "d": "The amount of wei a miner of an uncle block gets for being inculded in the blockchain"
  },
  "niblingReward": {
    "v": "156250000000000000",
    "d": "the amount a miner gets for inculding a uncle"
  },
  "homeSteadForkNumber": {
    "v": 1000000,
    "d": "the block that the homestead fork started at"
  },
  "timebombPeriod": {
    "v": 100000,
    "d": "Exponential difficulty timebomb period"
  },
  "freeBlockPeriod": {
    "v": 2
  }
}

},{}],33:[function(require,module,exports){
'use strict';module.exports=require('./params.json');

},{"./params.json":32}],34:[function(require,module,exports){
(function (Buffer){
'use strict';var ethUtil=require('ethereumjs-util'),fees=require('ethereum-common/params'),BN=ethUtil.BN,N_DIV_2=new BN('7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a0',16),Transaction=module.exports=function(a){// Define Properties
var b=[{name:'nonce',length:32,allowLess:!0,default:new Buffer([])},{name:'gasPrice',length:32,allowLess:!0,default:new Buffer([])},{name:'gasLimit',alias:'gas',length:32,allowLess:!0,default:new Buffer([])},{name:'to',allowZero:!0,length:20,default:new Buffer([])},{name:'value',length:32,allowLess:!0,default:new Buffer([])},{name:'data',alias:'input',allowZero:!0,default:new Buffer([])},{name:'v',length:1,default:new Buffer([28])},{name:'r',length:32,allowLess:!0,default:new Buffer([])},{name:'s',length:32,allowLess:!0,default:new Buffer([])}];/**
   * Returns the rlp encoding of the transaction
   * @method serialize
   * @return {Buffer}
   */// attached serialize
ethUtil.defineProperties(this,b,a),Object.defineProperty(this,'from',{enumerable:!0,configurable:!0,get:this.getSenderAddress.bind(this)}),this._homestead=!0};// secp256k1n/2
/**
 * Creates a new transaction object
 * @constructor
 * @class {Buffer|Array} data a transaction can be initiailized with either a buffer containing the RLP serialized transaction or an array of buffers relating to each of the tx Properties, listed in order below in the exmple. Or lastly an Object containing the Properties of the transaction like in the Usage example
 *
 * For Object and Arrays each of the elements can either be a Buffer, a hex-prefixed (0x) String , Number, or an object with a toBuffer method such as Bignum
 * @example
 * var rawTx = {
 *   nonce: '00',
 *   gasPrice: '09184e72a000',
 *   gasLimit: '2710',
 *   to: '0000000000000000000000000000000000000000',
 *   value: '00',
 *   data: '7f7465737432000000000000000000000000000000000000000000000000000000600057',
 *   v: '1c',
 *   r: '5e1d3a76fbf824220eafc8c79ad578ad2b67d01b0c2425eb1f1347e8f50882ab',
 *   s '5bd428537f05f9830e93792f90ea6a3e2d1ee84952dd96edbae9f658f831ab13'
 * };
 * var tx = new Transaction(rawTx);
 * @prop {Buffer} raw The raw rlp decoded transaction
 * @prop {Buffer} nonce
 * @prop {Buffer} to the to address
 * @prop {Buffer} value the amount of ether sent
 * @prop {Buffer} data this will contain the data of the message or the init of a contract
 * @prop {Buffer} v EC signature parameter
 * @prop {Buffer} r EC signature parameter
 * @prop {Buffer} s EC recovery ID
 *//**
 * If the tx's `to` is to the creation address
 * @method toCreationAddress
 * @return {Boolean}
 */Transaction.prototype.toCreationAddress=function(){return''===this.to.toString('hex')},Transaction.prototype.hash=function(a){var b=void 0;// create hash
return'undefined'==typeof a&&(a=!0),b=a?this.raw:this.raw.slice(0,6),ethUtil.rlphash(b)},Transaction.prototype.getSenderAddress=function(){if(this._from)return this._from;var a=this.getSenderPublicKey();return this._from=ethUtil.publicToAddress(a),this._from},Transaction.prototype.getSenderPublicKey=function(){return this._senderPubKey&&this._senderPubKey.length||this.verifySignature(),this._senderPubKey},Transaction.prototype.verifySignature=function(){var a=this.hash(!1);// All transaction signatures whose s-value is greater than secp256k1n/2 are considered invalid.
if(this._homestead&&1===new BN(this.s).cmp(N_DIV_2))return!1;try{this._senderPubKey=ethUtil.ecrecover(a,this.v,this.r,this.s)}catch(b){return!1}return!!this._senderPubKey},Transaction.prototype.sign=function(a){var b=this.hash(!1),c=ethUtil.ecsign(b,a);Object.assign(this,c)},Transaction.prototype.getDataFee=function(){var a=this.raw[5],b=new BN(0);for(var c=0;c<a.length;c++)0===a[c]?b.iaddn(fees.txDataZeroGas.v):b.iaddn(fees.txDataNonZeroGas.v);return b},Transaction.prototype.getBaseFee=function(){var a=this.getDataFee().iaddn(fees.txGas.v);return this._homestead&&this.toCreationAddress()&&a.iaddn(fees.txCreation.v),a},Transaction.prototype.getUpfrontCost=function(){return new BN(this.gasLimit).imul(new BN(this.gasPrice)).iadd(new BN(this.value))},Transaction.prototype.validate=function(a){var b=[];return this.verifySignature()||b.push('Invalid Signature'),0<this.getBaseFee().cmp(new BN(this.gasLimit))&&b.push(['gas limit is to low. Need at least '+this.getBaseFee()]),void 0===a||!1===a?0===b.length:b.join(' ')};

}).call(this,require("buffer").Buffer)
},{"buffer":9,"ethereum-common/params":33,"ethereumjs-util":35}],35:[function(require,module,exports){
(function (Buffer){
'use strict';var _typeof='function'==typeof Symbol&&'symbol'==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&'function'==typeof Symbol&&obj.constructor===Symbol?'symbol':typeof obj},SHA3=require('keccakjs'),secp256k1=require('secp256k1'),assert=require('assert'),rlp=require('rlp'),BN=require('bn.js'),createHash=require('create-hash');/**
 * the max integer that this VM can handle (a ```BN```)
 * @var {BN} MAX_INTEGER
 */exports.MAX_INTEGER=new BN('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',16),exports.TWO_POW256=new BN('10000000000000000000000000000000000000000000000000000000000000000',16),exports.SHA3_NULL_S='c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470',exports.SHA3_NULL=new Buffer(exports.SHA3_NULL_S,'hex'),exports.SHA3_RLP_ARRAY_S='1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347',exports.SHA3_RLP_ARRAY=new Buffer(exports.SHA3_RLP_ARRAY_S,'hex'),exports.SHA3_RLP_S='56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421',exports.SHA3_RLP=new Buffer(exports.SHA3_RLP_S,'hex'),exports.BN=BN,exports.rlp=rlp,exports.secp256k1=secp256k1,exports.zeros=function(b){var c=new Buffer(b);return c.fill(0),c},exports.setLengthLeft=exports.setLength=function(b,c,e){var f=exports.zeros(c);return b=exports.toBuffer(b),e?b.length<c?(b.copy(f),f):b.slice(0,c):b.length<c?(b.copy(f,c-b.length),f):b.slice(-c)},exports.setLengthRight=function(b,c){return exports.setLength(b,c,!0)},exports.unpad=exports.stripZeros=function(b){b=exports.stripHexPrefix(b);for(var c=b[0];0<b.length&&'0'===c.toString();)b=b.slice(1),c=b[0];return b},exports.toBuffer=function(b){if(!Buffer.isBuffer(b))if(Array.isArray(b))b=new Buffer(b);else if('string'==typeof b)b=exports.isHexPrefixed(b)?new Buffer(exports.padToEven(exports.stripHexPrefix(b)),'hex'):new Buffer(b);else if('number'==typeof b)b=exports.intToBuffer(b);else if(null===b||void 0===b)b=new Buffer([]);else if(b.toArray)b=new Buffer(b.toArray());else throw new Error('invalid type');return b},exports.intToHex=function(b){assert(0==b%1,'number is not a integer'),assert(0<=b,'number must be positive');var c=b.toString(16);return c.length%2&&(c='0'+c),'0x'+c},exports.intToBuffer=function(b){var c=exports.intToHex(b);return new Buffer(c.slice(2),'hex')},exports.bufferToInt=function(b){return parseInt(exports.bufferToHex(b),16)},exports.bufferToHex=function(b){return b=exports.toBuffer(b),0===b.length?0:'0x'+b.toString('hex')},exports.fromSigned=function(b){return new BN(b).fromTwos(256)},exports.toUnsigned=function(b){return new Buffer(b.toTwos(256).toArray())},exports.sha3=function(b,c){b=exports.toBuffer(b),c||(c=256);var e=new SHA3(c);return b&&e.update(b),new Buffer(e.digest('hex'),'hex')},exports.sha256=function(b){return b=exports.toBuffer(b),createHash('sha256').update(b).digest()},exports.ripemd160=function(b,c){b=exports.toBuffer(b);var e=createHash('rmd160').update(b).digest();return!0===c?exports.setLength(e,32):e},exports.rlphash=function(b){return exports.sha3(rlp.encode(b))},exports.isValidPrivate=function(b){return secp256k1.privateKeyVerify(b)},exports.isValidPublic=function(b,c){return 64===b.length?secp256k1.publicKeyVerify(Buffer.concat([new Buffer([4]),b])):!!c&&secp256k1.publicKeyVerify(b)},exports.pubToAddress=exports.publicToAddress=function(b,c){// Only take the lower 160bits of the hash
return b=exports.toBuffer(b),c&&64!==b.length&&(b=secp256k1.publicKeyConvert(b,!1).slice(1)),assert(64===b.length),exports.sha3(b).slice(-20)};/**
 * Returns the ethereum public key of a given private key
 * @method privateToPublic
 * @param {Buffer} privateKey A private key must be 256 bits wide
 * @return {Buffer}
 */var privateToPublic=exports.privateToPublic=function(b){// skip the type flag and use the X, Y points
return b=exports.toBuffer(b),secp256k1.publicKeyCreate(b,!1).slice(1)};/**
 * Converts a public key to the Ethereum format.
 * @method importPublic
 * @param {Buffer} publicKey
 * @return {Buffer}
 */exports.importPublic=function(b){return b=exports.toBuffer(b),64!==b.length&&(b=secp256k1.publicKeyConvert(b,!1).slice(1)),b},exports.ecsign=function(b,c){var e=secp256k1.sign(b,c),f={};return f.r=e.signature.slice(0,32),f.s=e.signature.slice(32,64),f.v=e.recovery+27,f},exports.ecrecover=function(b,c,e,f){var g=Buffer.concat([exports.setLength(e,32),exports.setLength(f,32)],64),j=exports.bufferToInt(c)-27;if(0!=j&&1!=j)throw new Error('Invalid signature v value');var k=secp256k1.recover(b,g,j);return secp256k1.publicKeyConvert(k,!1).slice(1)},exports.toRpcSig=function(b,c,e){// geth (and the RPC eth_sign method) uses the 65 byte format used by Bitcoin
// FIXME: this might change in the future - https://github.com/ethereum/go-ethereum/issues/2053
return exports.bufferToHex(Buffer.concat([c,e,exports.toBuffer(b-27)]))},exports.fromRpcSig=function(b){b=exports.toBuffer(b);var c=b[64];// support both versions of `eth_sign` responses
return 27>c&&(c+=27),{v:c,r:b.slice(0,32),s:b.slice(32,64)}},exports.privateToAddress=function(b){return exports.publicToAddress(privateToPublic(b))},exports.isValidAddress=function(b){return /^0x[0-9a-fA-F]{40}$/i.test(b)},exports.toChecksumAddress=function(b){b=exports.stripHexPrefix(b).toLowerCase();var c=exports.sha3(b).toString('hex'),e='0x';for(var f=0;f<b.length;f++)e+=8<=parseInt(c[f],16)?b[f].toUpperCase():b[f];return e},exports.isValidChecksumAddress=function(b){return exports.isValidAddress(b)&&exports.toChecksumAddress(b)===b},exports.generateAddress=function(b,c){// Only take the lower 160bits of the hash
return b=exports.toBuffer(b),c=new BN(c),c=c.isZero()?null:new Buffer(c.toArray()),exports.rlphash([b,c]).slice(-20)},exports.isPrecompiled=function(b){var c=exports.unpad(b);return 1===c.length&&0<c[0]&&5>c[0]},exports.isHexPrefixed=function(b){return'0x'===b.slice(0,2)},exports.stripHexPrefix=function(b){return'string'==typeof b?exports.isHexPrefixed(b)?b.slice(2):b:b},exports.addHexPrefix=function(b){return'string'==typeof b?exports.isHexPrefixed(b)?b:'0x'+b:b},exports.padToEven=function(b){return b.length%2&&(b='0'+b),b},exports.baToJSON=function(b){if(Buffer.isBuffer(b))return'0x'+b.toString('hex');if(b instanceof Array){var c=[];for(var e=0;e<b.length;e++)c.push(exports.baToJSON(b[e]));return c}},exports.defineProperties=function(b,c,e){// if the constuctor is passed data
if(b.raw=[],b._fields=[],b.toJSON=function(g){if(g){var j={};return b._fields.forEach(function(k){j[k]='0x'+b[k].toString('hex')}),j}return exports.baToJSON(this.raw)},b.serialize=function(){return rlp.encode(b.raw)},c.forEach(function(g,j){function k(){return b.raw[j]}function l(m){m=exports.toBuffer(m),'00'!==m.toString('hex')||g.allowZero||(m=new Buffer([])),g.allowLess&&g.length?(m=exports.stripZeros(m),assert(g.length>=m.length,'The field '+g.name+' must not have more '+g.length+' bytes')):!(g.allowZero&&0===m.length)&&g.length&&assert(g.length===m.length,'The field '+g.name+' must have byte length of '+g.length),b.raw[j]=m}b._fields.push(g.name),Object.defineProperty(b,g.name,{enumerable:!0,configurable:!0,get:k,set:l}),g.default&&(b[g.name]=g.default),g.alias&&Object.defineProperty(b,g.alias,{enumerable:!1,configurable:!0,set:l,get:k})}),e)if('string'==typeof e&&(e=new Buffer(exports.stripHexPrefix(e),'hex')),Buffer.isBuffer(e)&&(e=rlp.decode(e)),Array.isArray(e)){if(e.length>b._fields.length)throw new Error('wrong number of fields in data');// make sure all the items are buffers
e.forEach(function(g,j){b[b._fields[j]]=exports.toBuffer(g)})}else if('object'==('undefined'==typeof e?'undefined':_typeof(e)))for(var f in e)-1!==b._fields.indexOf(f)&&(b[f]=e[f]);else throw new Error('invalid data')};

}).call(this,require("buffer").Buffer)
},{"assert":1,"bn.js":4,"buffer":9,"create-hash":12,"keccakjs":48,"rlp":63,"secp256k1":64}],36:[function(require,module,exports){
'use strict';var _typeof='function'==typeof Symbol&&'symbol'==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&'function'==typeof Symbol&&obj.constructor===Symbol?'symbol':typeof obj};// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
function EventEmitter(){this._events=this._events||{},this._maxListeners=this._maxListeners||void 0}module.exports=EventEmitter,EventEmitter.EventEmitter=EventEmitter,EventEmitter.prototype._events=void 0,EventEmitter.prototype._maxListeners=void 0,EventEmitter.defaultMaxListeners=10,EventEmitter.prototype.setMaxListeners=function(a){if(!isNumber(a)||0>a||isNaN(a))throw TypeError('n must be a positive number');return this._maxListeners=a,this},EventEmitter.prototype.emit=function(a){var b,c,d,e,f,h;// If there is no 'error' event listener then throw.
if(this._events||(this._events={}),'error'===a&&(!this._events.error||isObject(this._events.error)&&!this._events.error.length))if(b=arguments[1],b instanceof Error)throw b;// Unhandled 'error' event
else{// At least give some kind of context to the user
var j=new Error('Uncaught, unspecified "error" event. ('+b+')');throw j.context=b,j}if(c=this._events[a],isUndefined(c))return!1;if(isFunction(c))switch(arguments.length){// fast cases
case 1:c.call(this);break;case 2:c.call(this,arguments[1]);break;case 3:c.call(this,arguments[1],arguments[2]);break;// slower
default:e=Array.prototype.slice.call(arguments,1),c.apply(this,e);}else if(isObject(c))for(e=Array.prototype.slice.call(arguments,1),h=c.slice(),d=h.length,f=0;f<d;f++)h[f].apply(this,e);return!0},EventEmitter.prototype.addListener=function(a,b){var c;if(!isFunction(b))throw TypeError('listener must be a function');return this._events||(this._events={}),this._events.newListener&&this.emit('newListener',a,isFunction(b.listener)?b.listener:b),this._events[a]?isObject(this._events[a])?this._events[a].push(b):this._events[a]=[this._events[a],b]:this._events[a]=b,isObject(this._events[a])&&!this._events[a].warned&&(c=isUndefined(this._maxListeners)?EventEmitter.defaultMaxListeners:this._maxListeners,c&&0<c&&this._events[a].length>c&&(this._events[a].warned=!0,console.error('(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.',this._events[a].length),'function'==typeof console.trace&&console.trace())),this},EventEmitter.prototype.on=EventEmitter.prototype.addListener,EventEmitter.prototype.once=function(a,b){function c(){this.removeListener(a,c),d||(d=!0,b.apply(this,arguments))}if(!isFunction(b))throw TypeError('listener must be a function');var d=!1;return c.listener=b,this.on(a,c),this},EventEmitter.prototype.removeListener=function(a,b){var c,d,e,f;if(!isFunction(b))throw TypeError('listener must be a function');if(!this._events||!this._events[a])return this;if(c=this._events[a],e=c.length,d=-1,c===b||isFunction(c.listener)&&c.listener===b)delete this._events[a],this._events.removeListener&&this.emit('removeListener',a,b);else if(isObject(c)){for(f=e;0<f--;)if(c[f]===b||c[f].listener&&c[f].listener===b){d=f;break}if(0>d)return this;1===c.length?(c.length=0,delete this._events[a]):c.splice(d,1),this._events.removeListener&&this.emit('removeListener',a,b)}return this},EventEmitter.prototype.removeAllListeners=function(a){var b,c;if(!this._events)return this;// not listening for removeListener, no need to emit
if(!this._events.removeListener)return 0===arguments.length?this._events={}:this._events[a]&&delete this._events[a],this;// emit removeListener for all listeners on all events
if(0===arguments.length){for(b in this._events)'removeListener'===b||this.removeAllListeners(b);return this.removeAllListeners('removeListener'),this._events={},this}if(c=this._events[a],isFunction(c))this.removeListener(a,c);else if(c)// LIFO order
for(;c.length;)this.removeListener(a,c[c.length-1]);return delete this._events[a],this},EventEmitter.prototype.listeners=function(a){var b;return b=this._events&&this._events[a]?isFunction(this._events[a])?[this._events[a]]:this._events[a].slice():[],b},EventEmitter.prototype.listenerCount=function(a){if(this._events){var b=this._events[a];if(isFunction(b))return 1;if(b)return b.length}return 0},EventEmitter.listenerCount=function(a,b){return a.listenerCount(b)};function isFunction(a){return'function'==typeof a}function isNumber(a){return'number'==typeof a}function isObject(a){return'object'==('undefined'==typeof a?'undefined':_typeof(a))&&null!==a}function isUndefined(a){return void 0===a}

},{}],37:[function(require,module,exports){
'use strict';var hash=exports;hash.utils=require('./hash/utils'),hash.common=require('./hash/common'),hash.sha=require('./hash/sha'),hash.ripemd=require('./hash/ripemd'),hash.hmac=require('./hash/hmac'),hash.sha1=hash.sha.sha1,hash.sha256=hash.sha.sha256,hash.sha224=hash.sha.sha224,hash.sha384=hash.sha.sha384,hash.sha512=hash.sha.sha512,hash.ripemd160=hash.ripemd.ripemd160;

},{"./hash/common":38,"./hash/hmac":39,"./hash/ripemd":40,"./hash/sha":41,"./hash/utils":42}],38:[function(require,module,exports){
'use strict';var hash=require('../hash'),utils=hash.utils,assert=utils.assert;function BlockHash(){this.pending=null,this.pendingTotal=0,this.blockSize=this.constructor.blockSize,this.outSize=this.constructor.outSize,this.hmacStrength=this.constructor.hmacStrength,this.padLength=this.constructor.padLength/8,this.endian='big',this._delta8=this.blockSize/8,this._delta32=this.blockSize/32}exports.BlockHash=BlockHash,BlockHash.prototype.update=function(b,c){// Enough data, try updating
if(b=utils.toArray(b,c),this.pending=this.pending?this.pending.concat(b):b,this.pendingTotal+=b.length,this.pending.length>=this._delta8){b=this.pending;// Process pending data in blocks
var d=b.length%this._delta8;this.pending=b.slice(b.length-d,b.length),0===this.pending.length&&(this.pending=null),b=utils.join32(b,0,b.length-d,this.endian);for(var e=0;e<b.length;e+=this._delta32)this._update(b,e,e+this._delta32)}return this},BlockHash.prototype.digest=function(b){return this.update(this._pad()),assert(null===this.pending),this._digest(b)},BlockHash.prototype._pad=function(){var b=this.pendingTotal,c=this._delta8,d=c-(b+this.padLength)%c,e=Array(d+this.padLength);e[0]=128;for(var f=1;f<d;f++)e[f]=0;// Append length
if(b<<=3,'big'===this.endian){for(var g=8;g<this.padLength;g++)e[f++]=0;e[f++]=0,e[f++]=0,e[f++]=0,e[f++]=0,e[f++]=255&b>>>24,e[f++]=255&b>>>16,e[f++]=255&b>>>8,e[f++]=255&b}else{e[f++]=255&b,e[f++]=255&b>>>8,e[f++]=255&b>>>16,e[f++]=255&b>>>24,e[f++]=0,e[f++]=0,e[f++]=0,e[f++]=0;for(var g=8;g<this.padLength;g++)e[f++]=0}return e};

},{"../hash":37}],39:[function(require,module,exports){
'use strict';var hmac=exports,hash=require('../hash'),utils=hash.utils,assert=utils.assert;function Hmac(a,b,c){return this instanceof Hmac?void(this.Hash=a,this.blockSize=a.blockSize/8,this.outSize=a.outSize/8,this.inner=null,this.outer=null,this._init(utils.toArray(b,c))):new Hmac(a,b,c)}module.exports=Hmac,Hmac.prototype._init=function(b){b.length>this.blockSize&&(b=new this.Hash().update(b).digest()),assert(b.length<=this.blockSize);// Add padding to key
for(var c=b.length;c<this.blockSize;c++)b.push(0);for(var c=0;c<b.length;c++)b[c]^=54;this.inner=new this.Hash().update(b);// 0x36 ^ 0x5c = 0x6a
for(var c=0;c<b.length;c++)b[c]^=106;this.outer=new this.Hash().update(b)},Hmac.prototype.update=function(b,c){return this.inner.update(b,c),this},Hmac.prototype.digest=function(b){return this.outer.update(this.inner.digest()),this.outer.digest(b)};

},{"../hash":37}],40:[function(require,module,exports){
'use strict';var hash=require('../hash'),utils=hash.utils,rotl32=utils.rotl32,sum32=utils.sum32,sum32_3=utils.sum32_3,sum32_4=utils.sum32_4,BlockHash=hash.common.BlockHash;function RIPEMD160(){return this instanceof RIPEMD160?void(BlockHash.call(this),this.h=[1732584193,4023233417,2562383102,271733878,3285377520],this.endian='little'):new RIPEMD160}utils.inherits(RIPEMD160,BlockHash),exports.ripemd160=RIPEMD160,RIPEMD160.blockSize=512,RIPEMD160.outSize=160,RIPEMD160.hmacStrength=192,RIPEMD160.padLength=64,RIPEMD160.prototype._update=function(b,c){var d=this.h[0],e=this.h[1],g=this.h[2],h=this.h[3],i=this.h[4],k=d,l=e,m=g,n=h,o=i;for(var p=0;80>p;p++){var q=sum32(rotl32(sum32_4(d,f(p,e,g,h),b[r[p]+c],K(p)),s[p]),i);d=i,i=h,h=rotl32(g,10),g=e,e=q,q=sum32(rotl32(sum32_4(k,f(79-p,l,m,n),b[rh[p]+c],Kh(p)),sh[p]),o),k=o,o=n,n=rotl32(m,10),m=l,l=q}q=sum32_3(this.h[1],g,n),this.h[1]=sum32_3(this.h[2],h,o),this.h[2]=sum32_3(this.h[3],i,k),this.h[3]=sum32_3(this.h[4],d,l),this.h[4]=sum32_3(this.h[0],e,m),this.h[0]=q},RIPEMD160.prototype._digest=function(b){return'hex'===b?utils.toHex32(this.h,'little'):utils.split32(this.h,'little')};function f(a,b,c,d){if(15>=a)return b^c^d;return 31>=a?b&c|~b&d:47>=a?(b|~c)^d:63>=a?b&d|c&~d:b^(c|~d)}function K(a){if(15>=a)return 0;return 31>=a?1518500249:47>=a?1859775393:63>=a?2400959708:2840853838}function Kh(a){if(15>=a)return 1352829926;return 31>=a?1548603684:47>=a?1836072691:63>=a?2053994217:0}var r=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8,3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2,4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13],rh=[5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12,6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2,15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14,12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11],s=[11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8,7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12,11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12,9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6],sh=[8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6,9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11,9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8,8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11];

},{"../hash":37}],41:[function(require,module,exports){
'use strict';var hash=require('../hash'),utils=hash.utils,assert=utils.assert,rotr32=utils.rotr32,rotl32=utils.rotl32,sum32=utils.sum32,sum32_4=utils.sum32_4,sum32_5=utils.sum32_5,rotr64_hi=utils.rotr64_hi,rotr64_lo=utils.rotr64_lo,shr64_hi=utils.shr64_hi,shr64_lo=utils.shr64_lo,sum64=utils.sum64,sum64_hi=utils.sum64_hi,sum64_lo=utils.sum64_lo,sum64_4_hi=utils.sum64_4_hi,sum64_4_lo=utils.sum64_4_lo,sum64_5_hi=utils.sum64_5_hi,sum64_5_lo=utils.sum64_5_lo,BlockHash=hash.common.BlockHash,sha256_K=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],sha512_K=[1116352408,3609767458,1899447441,602891725,3049323471,3964484399,3921009573,2173295548,961987163,4081628472,1508970993,3053834265,2453635748,2937671579,2870763221,3664609560,3624381080,2734883394,310598401,1164996542,607225278,1323610764,1426881987,3590304994,1925078388,4068182383,2162078206,991336113,2614888103,633803317,3248222580,3479774868,3835390401,2666613458,4022224774,944711139,264347078,2341262773,604807628,2007800933,770255983,1495990901,1249150122,1856431235,1555081692,3175218132,1996064986,2198950837,2554220882,3999719339,2821834349,766784016,2952996808,2566594879,3210313671,3203337956,3336571891,1034457026,3584528711,2466948901,113926993,3758326383,338241895,168717936,666307205,1188179964,773529912,1546045734,1294757372,1522805485,1396182291,2643833823,1695183700,2343527390,1986661051,1014477480,2177026350,1206759142,2456956037,344077627,2730485921,1290863460,2820302411,3158454273,3259730800,3505952657,3345764771,106217008,3516065817,3606008344,3600352804,1432725776,4094571909,1467031594,275423344,851169720,430227734,3100823752,506948616,1363258195,659060556,3750685593,883997877,3785050280,958139571,3318307427,1322822218,3812723403,1537002063,2003034995,1747873779,3602036899,1955562222,1575990012,2024104815,1125592928,2227730452,2716904306,2361852424,442776044,2428436474,593698344,2756734187,3733110249,3204031479,2999351573,3329325298,3815920427,3391569614,3928383900,3515267271,566280711,3940187606,3454069534,4118630271,4000239992,116418474,1914138554,174292421,2731055270,289380356,3203993006,460393269,320620315,685471733,587496836,852142971,1086792851,1017036298,365543100,1126000580,2618297676,1288033470,3409855158,1501505948,4234509866,1607167915,987167468,1816402316,1246189591],sha1_K=[1518500249,1859775393,2400959708,3395469782];function SHA256(){return this instanceof SHA256?void(BlockHash.call(this),this.h=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225],this.k=sha256_K,this.W=Array(64)):new SHA256}utils.inherits(SHA256,BlockHash),exports.sha256=SHA256,SHA256.blockSize=512,SHA256.outSize=256,SHA256.hmacStrength=192,SHA256.padLength=64,SHA256.prototype._update=function(k,l){var m=this.W;for(var n=0;16>n;n++)m[n]=k[l+n];for(;n<m.length;n++)m[n]=sum32_4(g1_256(m[n-2]),m[n-7],g0_256(m[n-15]),m[n-16]);var o=this.h[0],p=this.h[1],q=this.h[2],u=this.h[3],v=this.h[4],w=this.h[5],A=this.h[6],B=this.h[7];assert(this.k.length===m.length);for(var n=0;n<m.length;n++){var C=sum32_5(B,s1_256(v),ch32(v,w,A),this.k[n],m[n]),D=sum32(s0_256(o),maj32(o,p,q));B=A,A=w,w=v,v=sum32(u,C),u=q,q=p,p=o,o=sum32(C,D)}this.h[0]=sum32(this.h[0],o),this.h[1]=sum32(this.h[1],p),this.h[2]=sum32(this.h[2],q),this.h[3]=sum32(this.h[3],u),this.h[4]=sum32(this.h[4],v),this.h[5]=sum32(this.h[5],w),this.h[6]=sum32(this.h[6],A),this.h[7]=sum32(this.h[7],B)},SHA256.prototype._digest=function(k){return'hex'===k?utils.toHex32(this.h,'big'):utils.split32(this.h,'big')};function SHA224(){return this instanceof SHA224?void(SHA256.call(this),this.h=[3238371032,914150663,812702999,4144912697,4290775857,1750603025,1694076839,3204075428]):new SHA224}utils.inherits(SHA224,SHA256),exports.sha224=SHA224,SHA224.blockSize=512,SHA224.outSize=224,SHA224.hmacStrength=192,SHA224.padLength=64,SHA224.prototype._digest=function(k){// Just truncate output
return'hex'===k?utils.toHex32(this.h.slice(0,7),'big'):utils.split32(this.h.slice(0,7),'big')};function SHA512(){return this instanceof SHA512?void(BlockHash.call(this),this.h=[1779033703,4089235720,3144134277,2227873595,1013904242,4271175723,2773480762,1595750129,1359893119,2917565137,2600822924,725511199,528734635,4215389547,1541459225,327033209],this.k=sha512_K,this.W=Array(160)):new SHA512}utils.inherits(SHA512,BlockHash),exports.sha512=SHA512,SHA512.blockSize=1024,SHA512.outSize=512,SHA512.hmacStrength=192,SHA512.padLength=128,SHA512.prototype._prepareBlock=function(k,l){var m=this.W;// 32 x 32bit words
for(var n=0;32>n;n++)m[n]=k[l+n];for(;n<m.length;n+=2){var o=g1_512_hi(m[n-4],m[n-3]),p=g1_512_lo(m[n-4],m[n-3]),q=m[n-14],u=m[n-13],v=g0_512_hi(m[n-30],m[n-29]),w=g0_512_lo(m[n-30],m[n-29]),A=m[n-32],B=m[n-31];// i - 2
// i - 7
// i - 15
// i - 16
m[n]=sum64_4_hi(o,p,q,u,v,w,A,B),m[n+1]=sum64_4_lo(o,p,q,u,v,w,A,B)}},SHA512.prototype._update=function(k,l){this._prepareBlock(k,l);var m=this.W,n=this.h[0],o=this.h[1],p=this.h[2],q=this.h[3],u=this.h[4],v=this.h[5],w=this.h[6],A=this.h[7],B=this.h[8],C=this.h[9],D=this.h[10],E=this.h[11],F=this.h[12],G=this.h[13],H=this.h[14],I=this.h[15];assert(this.k.length===m.length);for(var J=0;J<m.length;J+=2){var K=H,L=I,M=s1_512_hi(B,C),N=s1_512_lo(B,C),O=ch64_hi(B,C,D,E,F,G),P=ch64_lo(B,C,D,E,F,G),Q=this.k[J],R=this.k[J+1],S=m[J],T=m[J+1],U=sum64_5_hi(K,L,M,N,O,P,Q,R,S,T),V=sum64_5_lo(K,L,M,N,O,P,Q,R,S,T),K=s0_512_hi(n,o),L=s0_512_lo(n,o),M=maj64_hi(n,o,p,q,u,v),N=maj64_lo(n,o,p,q,u,v),X=sum64_hi(K,L,M,N),Y=sum64_lo(K,L,M,N);H=F,I=G,F=D,G=E,D=B,E=C,B=sum64_hi(w,A,U,V),C=sum64_lo(A,A,U,V),w=u,A=v,u=p,v=q,p=n,q=o,n=sum64_hi(U,V,X,Y),o=sum64_lo(U,V,X,Y)}sum64(this.h,0,n,o),sum64(this.h,2,p,q),sum64(this.h,4,u,v),sum64(this.h,6,w,A),sum64(this.h,8,B,C),sum64(this.h,10,D,E),sum64(this.h,12,F,G),sum64(this.h,14,H,I)},SHA512.prototype._digest=function(k){return'hex'===k?utils.toHex32(this.h,'big'):utils.split32(this.h,'big')};function SHA384(){return this instanceof SHA384?void(SHA512.call(this),this.h=[3418070365,3238371032,1654270250,914150663,2438529370,812702999,355462360,4144912697,1731405415,4290775857,2394180231,1750603025,3675008525,1694076839,1203062813,3204075428]):new SHA384}utils.inherits(SHA384,SHA512),exports.sha384=SHA384,SHA384.blockSize=1024,SHA384.outSize=384,SHA384.hmacStrength=192,SHA384.padLength=128,SHA384.prototype._digest=function(k){return'hex'===k?utils.toHex32(this.h.slice(0,12),'big'):utils.split32(this.h.slice(0,12),'big')};function SHA1(){return this instanceof SHA1?void(BlockHash.call(this),this.h=[1732584193,4023233417,2562383102,271733878,3285377520],this.W=Array(80)):new SHA1}utils.inherits(SHA1,BlockHash),exports.sha1=SHA1,SHA1.blockSize=512,SHA1.outSize=160,SHA1.hmacStrength=80,SHA1.padLength=64,SHA1.prototype._update=function(k,l){var m=this.W;for(var n=0;16>n;n++)m[n]=k[l+n];for(;n<m.length;n++)m[n]=rotl32(m[n-3]^m[n-8]^m[n-14]^m[n-16],1);var o=this.h[0],p=this.h[1],q=this.h[2],u=this.h[3],v=this.h[4];for(var n=0;n<m.length;n++){var w=~~(n/20),A=sum32_5(rotl32(o,5),ft_1(w,p,q,u),v,m[n],sha1_K[w]);v=u,u=q,q=rotl32(p,30),p=o,o=A}this.h[0]=sum32(this.h[0],o),this.h[1]=sum32(this.h[1],p),this.h[2]=sum32(this.h[2],q),this.h[3]=sum32(this.h[3],u),this.h[4]=sum32(this.h[4],v)},SHA1.prototype._digest=function(k){return'hex'===k?utils.toHex32(this.h,'big'):utils.split32(this.h,'big')};function ch32(j,k,l){return j&k^~j&l}function maj32(j,k,l){return j&k^j&l^k&l}function p32(j,k,l){return j^k^l}function s0_256(j){return rotr32(j,2)^rotr32(j,13)^rotr32(j,22)}function s1_256(j){return rotr32(j,6)^rotr32(j,11)^rotr32(j,25)}function g0_256(j){return rotr32(j,7)^rotr32(j,18)^j>>>3}function g1_256(j){return rotr32(j,17)^rotr32(j,19)^j>>>10}function ft_1(j,k,l,m){return 0===j?ch32(k,l,m):1===j||3===j?p32(k,l,m):2===j?maj32(k,l,m):void 0}function ch64_hi(j,k,l,m,n,o){var p=j&l^~j&n;return 0>p&&(p+=4294967296),p}function ch64_lo(j,k,l,m,n,o){var p=k&m^~k&o;return 0>p&&(p+=4294967296),p}function maj64_hi(j,k,l,m,n,o){var p=j&l^j&n^l&n;return 0>p&&(p+=4294967296),p}function maj64_lo(j,k,l,m,n,o){var p=k&m^k&o^m&o;return 0>p&&(p+=4294967296),p}function s0_512_hi(j,k){var l=rotr64_hi(j,k,28),m=rotr64_hi(k,j,2),n=rotr64_hi(k,j,7),o=l^m^n;// 34
// 39
return 0>o&&(o+=4294967296),o}function s0_512_lo(j,k){var l=rotr64_lo(j,k,28),m=rotr64_lo(k,j,2),n=rotr64_lo(k,j,7),o=l^m^n;// 34
// 39
return 0>o&&(o+=4294967296),o}function s1_512_hi(j,k){var l=rotr64_hi(j,k,14),m=rotr64_hi(j,k,18),n=rotr64_hi(k,j,9),o=l^m^n;// 41
return 0>o&&(o+=4294967296),o}function s1_512_lo(j,k){var l=rotr64_lo(j,k,14),m=rotr64_lo(j,k,18),n=rotr64_lo(k,j,9),o=l^m^n;// 41
return 0>o&&(o+=4294967296),o}function g0_512_hi(j,k){var l=rotr64_hi(j,k,1),m=rotr64_hi(j,k,8),n=shr64_hi(j,k,7),o=l^m^n;return 0>o&&(o+=4294967296),o}function g0_512_lo(j,k){var l=rotr64_lo(j,k,1),m=rotr64_lo(j,k,8),n=shr64_lo(j,k,7),o=l^m^n;return 0>o&&(o+=4294967296),o}function g1_512_hi(j,k){var l=rotr64_hi(j,k,19),m=rotr64_hi(k,j,29),n=shr64_hi(j,k,6),o=l^m^n;// 61
return 0>o&&(o+=4294967296),o}function g1_512_lo(j,k){var l=rotr64_lo(j,k,19),m=rotr64_lo(k,j,29),n=shr64_lo(j,k,6),o=l^m^n;// 61
return 0>o&&(o+=4294967296),o}

},{"../hash":37}],42:[function(require,module,exports){
'use strict';var utils=exports,inherits=require('inherits');function toArray(f,g){if(Array.isArray(f))return f.slice();if(!f)return[];var h=[];if(!('string'==typeof f))for(var j=0;j<f.length;j++)h[j]=0|f[j];else if(!g)for(var j=0;j<f.length;j++){var l=f.charCodeAt(j),n=l>>8,o=255&l;n?h.push(n,o):h.push(o)}else if('hex'===g){f=f.replace(/[^a-z0-9]+/ig,''),0!=f.length%2&&(f='0'+f);for(var j=0;j<f.length;j+=2)h.push(parseInt(f[j]+f[j+1],16))}return h}utils.toArray=toArray;function toHex(f){var g='';for(var h=0;h<f.length;h++)g+=zero2(f[h].toString(16));return g}utils.toHex=toHex;function htonl(f){return(f>>>24|65280&f>>>8|16711680&f<<8|(255&f)<<24)>>>0}utils.htonl=htonl;function toHex32(f,g){var h='';for(var j=0;j<f.length;j++){var l=f[j];'little'===g&&(l=htonl(l)),h+=zero8(l.toString(16))}return h}utils.toHex32=toHex32;function zero2(f){return 1===f.length?'0'+f:f}utils.zero2=zero2;function zero8(f){if(7===f.length)return'0'+f;return 6===f.length?'00'+f:5===f.length?'000'+f:4===f.length?'0000'+f:3===f.length?'00000'+f:2===f.length?'000000'+f:1===f.length?'0000000'+f:f}utils.zero8=zero8;function join32(f,g,h,j){var l=h-g;assert(0==l%4);var n=Array(l/4);for(var o=0,p=g;o<n.length;o++,p+=4){var q;q='big'===j?f[p]<<24|f[p+1]<<16|f[p+2]<<8|f[p+3]:f[p+3]<<24|f[p+2]<<16|f[p+1]<<8|f[p],n[o]=q>>>0}return n}utils.join32=join32;function split32(f,g){var h=Array(4*f.length);for(var j=0,l=0;j<f.length;j++,l+=4){var n=f[j];'big'===g?(h[l]=n>>>24,h[l+1]=255&n>>>16,h[l+2]=255&n>>>8,h[l+3]=255&n):(h[l+3]=n>>>24,h[l+2]=255&n>>>16,h[l+1]=255&n>>>8,h[l]=255&n)}return h}utils.split32=split32;function rotr32(f,g){return f>>>g|f<<32-g}utils.rotr32=rotr32;function rotl32(f,g){return f<<g|f>>>32-g}utils.rotl32=rotl32;function sum32(f,g){return f+g>>>0}utils.sum32=sum32;function sum32_3(f,g,h){return f+g+h>>>0}utils.sum32_3=sum32_3;function sum32_4(f,g,h,j){return f+g+h+j>>>0}utils.sum32_4=sum32_4;function sum32_5(f,g,h,j,l){return f+g+h+j+l>>>0}utils.sum32_5=sum32_5;function assert(f,g){if(!f)throw new Error(g||'Assertion failed')}utils.assert=assert,utils.inherits=inherits;function sum64(f,g,h,j){var l=f[g],n=f[g+1],o=j+n>>>0,p=(o<j?1:0)+h+l;f[g]=p>>>0,f[g+1]=o}exports.sum64=sum64;function sum64_hi(f,g,h,j){var l=(g+j>>>0<g?1:0)+f+h;return l>>>0};exports.sum64_hi=sum64_hi;function sum64_lo(f,g,h,j){return g+j>>>0};exports.sum64_lo=sum64_lo;function sum64_4_hi(f,g,h,j,l,n,o,p){var q=0,s=g;s=s+j>>>0,q+=s<g?1:0,s=s+n>>>0,q+=s<n?1:0,s=s+p>>>0,q+=s<p?1:0;var t=f+h+l+o+q;return t>>>0};exports.sum64_4_hi=sum64_4_hi;function sum64_4_lo(f,g,h,j,l,n,o,p){return g+j+n+p>>>0};exports.sum64_4_lo=sum64_4_lo;function sum64_5_hi(f,g,h,j,l,n,o,p,q,s){var t=0,u=g;u=u+j>>>0,t+=u<g?1:0,u=u+n>>>0,t+=u<n?1:0,u=u+p>>>0,t+=u<p?1:0,u=u+s>>>0,t+=u<s?1:0;var v=f+h+l+o+q+t;return v>>>0};exports.sum64_5_hi=sum64_5_hi;function sum64_5_lo(f,g,h,j,l,n,o,p,q,s){return g+j+n+p+s>>>0};exports.sum64_5_lo=sum64_5_lo;function rotr64_hi(f,g,h){return(g<<32-h|f>>>h)>>>0};exports.rotr64_hi=rotr64_hi;function rotr64_lo(f,g,h){return(f<<32-h|g>>>h)>>>0};exports.rotr64_lo=rotr64_lo;function shr64_hi(f,g,h){return f>>>h};exports.shr64_hi=shr64_hi;function shr64_lo(f,g,h){return(f<<32-h|g>>>h)>>>0};exports.shr64_lo=shr64_lo;

},{"inherits":44}],43:[function(require,module,exports){
"use strict";exports.read=function(a,b,f,g,h){var j,k,l=8*h-g-1,n=(1<<l)-1,o=n>>1,p=-7,q=f?h-1:0,r=f?-1:1,t=a[b+q];for(q+=r,j=t&(1<<-p)-1,t>>=-p,p+=l;0<p;j=256*j+a[b+q],q+=r,p-=8);for(k=j&(1<<-p)-1,j>>=-p,p+=g;0<p;k=256*k+a[b+q],q+=r,p-=8);if(0===j)j=1-o;else{if(j===n)return k?NaN:(t?-1:1)*(1/0);k=k+Math.pow(2,g),j=j-o}return(t?-1:1)*k*Math.pow(2,j-g)},exports.write=function(a,b,f,g,h,j){var k,l,n,o=8*j-h-1,p=(1<<o)-1,q=p>>1,r=23===h?Math.pow(2,-24)-Math.pow(2,-77):0,t=g?0:j-1,u=g?1:-1,v=0>b||0===b&&0>1/b?1:0;for(b=Math.abs(b),isNaN(b)||b===1/0?(l=isNaN(b)?1:0,k=p):(k=Math.floor(Math.log(b)/Math.LN2),1>b*(n=Math.pow(2,-k))&&(k--,n*=2),b+=1<=k+q?r/n:r*Math.pow(2,1-q),2<=b*n&&(k++,n/=2),k+q>=p?(l=0,k=p):1<=k+q?(l=(b*n-1)*Math.pow(2,h),k=k+q):(l=b*Math.pow(2,q-1)*Math.pow(2,h),k=0));8<=h;a[f+t]=255&l,t+=u,l/=256,h-=8);for(k=k<<h|l,o+=h;0<o;a[f+t]=255&k,t+=u,k/=256,o-=8);a[f+t-u]|=128*v};

},{}],44:[function(require,module,exports){
'use strict';module.exports='function'==typeof Object.create?function(b,c){b.super_=c,b.prototype=Object.create(c.prototype,{constructor:{value:b,enumerable:!1,writable:!0,configurable:!0}})}:function(b,c){b.super_=c;var d=function d(){};d.prototype=c.prototype,b.prototype=new d,b.prototype.constructor=b};

},{}],45:[function(require,module,exports){
'use strict';module.exports=function(a){return null!=a&&(isBuffer(a)||isSlowBuffer(a)||!!a._isBuffer)};function isBuffer(a){return!!a.constructor&&'function'==typeof a.constructor.isBuffer&&a.constructor.isBuffer(a)}// For Node v0.10 support. Remove this eventually.
function isSlowBuffer(a){return'function'==typeof a.readFloatLE&&'function'==typeof a.slice&&isBuffer(a.slice(0,0))}

},{}],46:[function(require,module,exports){
'use strict';var toString={}.toString;module.exports=Array.isArray||function(a){return'[object Array]'==toString.call(a)};

},{}],47:[function(require,module,exports){
(function (global){
'use strict';/*
 * js-sha3 v0.3.1
 * https://github.com/emn178/js-sha3
 *
 * Copyright 2015, emn178@gmail.com
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/MIT
 */;(function(a,b){'use strict';var c='undefined'!=typeof module;c&&(a=global,a.JS_SHA3_TEST&&(a.navigator={userAgent:'Chrome'}));var d=(a.JS_SHA3_TEST||!c)&&-1!=navigator.userAgent.indexOf('Chrome'),e='0123456789abcdef'.split(''),f=[1,256,65536,16777216],g=[6,1536,393216,100663296],j=[0,8,16,24],k=[1,0,32898,0,32906,2147483648,2147516416,2147483648,32907,0,2147483649,0,2147516545,2147483648,32777,2147483648,138,0,136,0,2147516425,0,2147483658,0,2147516555,0,139,2147483648,32905,2147483648,32771,2147483648,32770,2147483648,128,2147483648,32778,0,2147483658,2147483648,2147516545,2147483648,32896,2147483648,2147483649,0,2147516424,2147483648],m=[],o=[],p=function p(y){return x(y,224,f)},q=function q(y){return x(y,256,f)},r=function r(y){return x(y,384,f)},t=function t(y){return x(y,224,g)},u=function u(y){return x(y,256,g)},v=function v(y){return x(y,384,g)},w=function w(y){return x(y,512,g)},x=function x(y,z,A){var B='string'!=typeof y;B&&y.constructor==a.ArrayBuffer&&(y=new Uint8Array(y)),z===b&&(z=512,A=f);var C,D,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,$,_,aa,ba,ca,da,ea,fa,ga,ha,ia,ja,ka,la,ma,na,oa,pa,qa,ra,sa,ta,ua,va,wa,xa,ya,za,Aa,Ba,Ca,Da,Ea,Fa,Ga,Ha,Ia,Ja,Ka,La,Ma,Na,Oa,Pa,Qa,Ra,E=!1,F=0,G=0,H=y.length,Sa=(1600-2*z)/32,Ta=4*Sa;for(J=0;50>J;++J)o[J]=0;C=0;do{for(m[0]=C,J=1;J<Sa+1;++J)m[J]=0;if(B)for(J=G;F<H&&J<Ta;++F)m[J>>2]|=y[F]<<j[3&J++];else for(J=G;F<H&&J<Ta;++F)D=y.charCodeAt(F),128>D?m[J>>2]|=D<<j[3&J++]:2048>D?(m[J>>2]|=(192|D>>6)<<j[3&J++],m[J>>2]|=(128|63&D)<<j[3&J++]):55296>D||57344<=D?(m[J>>2]|=(224|D>>12)<<j[3&J++],m[J>>2]|=(128|63&D>>6)<<j[3&J++],m[J>>2]|=(128|63&D)<<j[3&J++]):(D=65536+((1023&D)<<10|1023&y.charCodeAt(++F)),m[J>>2]|=(240|D>>18)<<j[3&J++],m[J>>2]|=(128|63&D>>12)<<j[3&J++],m[J>>2]|=(128|63&D>>6)<<j[3&J++],m[J>>2]|=(128|63&D)<<j[3&J++]);for(G=J-Ta,F==H&&(m[J>>2]|=A[3&J],++F),C=m[Sa],F>H&&J<Ta&&(m[Sa-1]|=2147483648,E=!0),J=0;J<Sa;++J)o[J]^=m[J];for(I=0;48>I;I+=2)M=o[0]^o[10]^o[20]^o[30]^o[40],N=o[1]^o[11]^o[21]^o[31]^o[41],O=o[2]^o[12]^o[22]^o[32]^o[42],P=o[3]^o[13]^o[23]^o[33]^o[43],Q=o[4]^o[14]^o[24]^o[34]^o[44],R=o[5]^o[15]^o[25]^o[35]^o[45],S=o[6]^o[16]^o[26]^o[36]^o[46],T=o[7]^o[17]^o[27]^o[37]^o[47],U=o[8]^o[18]^o[28]^o[38]^o[48],V=o[9]^o[19]^o[29]^o[39]^o[49],K=U^(O<<1|P>>>31),L=V^(P<<1|O>>>31),o[0]^=K,o[1]^=L,o[10]^=K,o[11]^=L,o[20]^=K,o[21]^=L,o[30]^=K,o[31]^=L,o[40]^=K,o[41]^=L,K=M^(Q<<1|R>>>31),L=N^(R<<1|Q>>>31),o[2]^=K,o[3]^=L,o[12]^=K,o[13]^=L,o[22]^=K,o[23]^=L,o[32]^=K,o[33]^=L,o[42]^=K,o[43]^=L,K=O^(S<<1|T>>>31),L=P^(T<<1|S>>>31),o[4]^=K,o[5]^=L,o[14]^=K,o[15]^=L,o[24]^=K,o[25]^=L,o[34]^=K,o[35]^=L,o[44]^=K,o[45]^=L,K=Q^(U<<1|V>>>31),L=R^(V<<1|U>>>31),o[6]^=K,o[7]^=L,o[16]^=K,o[17]^=L,o[26]^=K,o[27]^=L,o[36]^=K,o[37]^=L,o[46]^=K,o[47]^=L,K=S^(M<<1|N>>>31),L=T^(N<<1|M>>>31),o[8]^=K,o[9]^=L,o[18]^=K,o[19]^=L,o[28]^=K,o[29]^=L,o[38]^=K,o[39]^=L,o[48]^=K,o[49]^=L,W=o[0],X=o[1],Aa=o[11]<<4|o[10]>>>28,Ba=o[10]<<4|o[11]>>>28,ia=o[20]<<3|o[21]>>>29,ja=o[21]<<3|o[20]>>>29,Oa=o[31]<<9|o[30]>>>23,Pa=o[30]<<9|o[31]>>>23,wa=o[40]<<18|o[41]>>>14,xa=o[41]<<18|o[40]>>>14,oa=o[2]<<1|o[3]>>>31,pa=o[3]<<1|o[2]>>>31,Y=o[13]<<12|o[12]>>>20,Z=o[12]<<12|o[13]>>>20,Ca=o[22]<<10|o[23]>>>22,Da=o[23]<<10|o[22]>>>22,ka=o[33]<<13|o[32]>>>19,la=o[32]<<13|o[33]>>>19,Qa=o[42]<<2|o[43]>>>30,Ra=o[43]<<2|o[42]>>>30,Ia=o[5]<<30|o[4]>>>2,Ja=o[4]<<30|o[5]>>>2,qa=o[14]<<6|o[15]>>>26,ra=o[15]<<6|o[14]>>>26,$=o[25]<<11|o[24]>>>21,_=o[24]<<11|o[25]>>>21,Ea=o[34]<<15|o[35]>>>17,Fa=o[35]<<15|o[34]>>>17,ma=o[45]<<29|o[44]>>>3,na=o[44]<<29|o[45]>>>3,ea=o[6]<<28|o[7]>>>4,fa=o[7]<<28|o[6]>>>4,Ka=o[17]<<23|o[16]>>>9,La=o[16]<<23|o[17]>>>9,sa=o[26]<<25|o[27]>>>7,ta=o[27]<<25|o[26]>>>7,aa=o[36]<<21|o[37]>>>11,ba=o[37]<<21|o[36]>>>11,Ga=o[47]<<24|o[46]>>>8,Ha=o[46]<<24|o[47]>>>8,ya=o[8]<<27|o[9]>>>5,za=o[9]<<27|o[8]>>>5,ga=o[18]<<20|o[19]>>>12,ha=o[19]<<20|o[18]>>>12,Ma=o[29]<<7|o[28]>>>25,Na=o[28]<<7|o[29]>>>25,ua=o[38]<<8|o[39]>>>24,va=o[39]<<8|o[38]>>>24,ca=o[48]<<14|o[49]>>>18,da=o[49]<<14|o[48]>>>18,o[0]=W^~Y&$,o[1]=X^~Z&_,o[10]=ea^~ga&ia,o[11]=fa^~ha&ja,o[20]=oa^~qa&sa,o[21]=pa^~ra&ta,o[30]=ya^~Aa&Ca,o[31]=za^~Ba&Da,o[40]=Ia^~Ka&Ma,o[41]=Ja^~La&Na,o[2]=Y^~$&aa,o[3]=Z^~_&ba,o[12]=ga^~ia&ka,o[13]=ha^~ja&la,o[22]=qa^~sa&ua,o[23]=ra^~ta&va,o[32]=Aa^~Ca&Ea,o[33]=Ba^~Da&Fa,o[42]=Ka^~Ma&Oa,o[43]=La^~Na&Pa,o[4]=$^~aa&ca,o[5]=_^~ba&da,o[14]=ia^~ka&ma,o[15]=ja^~la&na,o[24]=sa^~ua&wa,o[25]=ta^~va&xa,o[34]=Ca^~Ea&Ga,o[35]=Da^~Fa&Ha,o[44]=Ma^~Oa&Qa,o[45]=Na^~Pa&Ra,o[6]=aa^~ca&W,o[7]=ba^~da&X,o[16]=ka^~ma&ea,o[17]=la^~na&fa,o[26]=ua^~wa&oa,o[27]=va^~xa&pa,o[36]=Ea^~Ga&ya,o[37]=Fa^~Ha&za,o[46]=Oa^~Qa&Ia,o[47]=Pa^~Ra&Ja,o[8]=ca^~W&Y,o[9]=da^~X&Z,o[18]=ma^~ea&ga,o[19]=na^~fa&ha,o[28]=wa^~oa&qa,o[29]=xa^~pa&ra,o[38]=Ga^~ya&Aa,o[39]=Ha^~za&Ba,o[48]=Qa^~Ia&Ka,o[49]=Ra^~Ja&La,o[0]^=k[I],o[1]^=k[I+1]}while(!E);var Ua='';if(d)W=o[0],X=o[1],Y=o[2],Z=o[3],$=o[4],_=o[5],aa=o[6],ba=o[7],ca=o[8],da=o[9],ea=o[10],fa=o[11],ga=o[12],ha=o[13],ia=o[14],ja=o[15],Ua+=e[15&W>>4]+e[15&W]+e[15&W>>12]+e[15&W>>8]+e[15&W>>20]+e[15&W>>16]+e[15&W>>28]+e[15&W>>24]+e[15&X>>4]+e[15&X]+e[15&X>>12]+e[15&X>>8]+e[15&X>>20]+e[15&X>>16]+e[15&X>>28]+e[15&X>>24]+e[15&Y>>4]+e[15&Y]+e[15&Y>>12]+e[15&Y>>8]+e[15&Y>>20]+e[15&Y>>16]+e[15&Y>>28]+e[15&Y>>24]+e[15&Z>>4]+e[15&Z]+e[15&Z>>12]+e[15&Z>>8]+e[15&Z>>20]+e[15&Z>>16]+e[15&Z>>28]+e[15&Z>>24]+e[15&$>>4]+e[15&$]+e[15&$>>12]+e[15&$>>8]+e[15&$>>20]+e[15&$>>16]+e[15&$>>28]+e[15&$>>24]+e[15&_>>4]+e[15&_]+e[15&_>>12]+e[15&_>>8]+e[15&_>>20]+e[15&_>>16]+e[15&_>>28]+e[15&_>>24]+e[15&aa>>4]+e[15&aa]+e[15&aa>>12]+e[15&aa>>8]+e[15&aa>>20]+e[15&aa>>16]+e[15&aa>>28]+e[15&aa>>24],256<=z&&(Ua+=e[15&ba>>4]+e[15&ba]+e[15&ba>>12]+e[15&ba>>8]+e[15&ba>>20]+e[15&ba>>16]+e[15&ba>>28]+e[15&ba>>24]),384<=z&&(Ua+=e[15&ca>>4]+e[15&ca]+e[15&ca>>12]+e[15&ca>>8]+e[15&ca>>20]+e[15&ca>>16]+e[15&ca>>28]+e[15&ca>>24]+e[15&da>>4]+e[15&da]+e[15&da>>12]+e[15&da>>8]+e[15&da>>20]+e[15&da>>16]+e[15&da>>28]+e[15&da>>24]+e[15&ea>>4]+e[15&ea]+e[15&ea>>12]+e[15&ea>>8]+e[15&ea>>20]+e[15&ea>>16]+e[15&ea>>28]+e[15&ea>>24]+e[15&fa>>4]+e[15&fa]+e[15&fa>>12]+e[15&fa>>8]+e[15&fa>>20]+e[15&fa>>16]+e[15&fa>>28]+e[15&fa>>24]),512==z&&(Ua+=e[15&ga>>4]+e[15&ga]+e[15&ga>>12]+e[15&ga>>8]+e[15&ga>>20]+e[15&ga>>16]+e[15&ga>>28]+e[15&ga>>24]+e[15&ha>>4]+e[15&ha]+e[15&ha>>12]+e[15&ha>>8]+e[15&ha>>20]+e[15&ha>>16]+e[15&ha>>28]+e[15&ha>>24]+e[15&ia>>4]+e[15&ia]+e[15&ia>>12]+e[15&ia>>8]+e[15&ia>>20]+e[15&ia>>16]+e[15&ia>>28]+e[15&ia>>24]+e[15&ja>>4]+e[15&ja]+e[15&ja>>12]+e[15&ja>>8]+e[15&ja>>20]+e[15&ja>>16]+e[15&ja>>28]+e[15&ja>>24]);else for(J=0,I=z/32;J<I;++J)K=o[J],Ua+=e[15&K>>4]+e[15&K]+e[15&K>>12]+e[15&K>>8]+e[15&K>>20]+e[15&K>>16]+e[15&K>>28]+e[15&K>>24];return Ua};!a.JS_SHA3_TEST&&c?module.exports={sha3_512:w,sha3_384:v,sha3_256:u,sha3_224:t,keccak_512:x,keccak_384:r,keccak_256:q,keccak_224:p}:a&&(a.sha3_512=w,a.sha3_384=v,a.sha3_256=u,a.sha3_224=t,a.keccak_512=x,a.keccak_384=r,a.keccak_256=q,a.keccak_224=p)})(void 0);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],48:[function(require,module,exports){
'use strict';module.exports=require('browserify-sha3').SHA3Hash;

},{"browserify-sha3":7}],49:[function(require,module,exports){
(function (process){
'use strict';module.exports=process.version&&0!==process.version.indexOf('v0.')&&(0!==process.version.indexOf('v1.')||0===process.version.indexOf('v1.8.'))?process.nextTick:nextTick;function nextTick(a,b,c,d){if('function'!=typeof a)throw new TypeError('"callback" argument must be a function');var e=arguments.length,f,g;switch(e){case 0:case 1:return process.nextTick(a);case 2:return process.nextTick(function(){a.call(null,b)});case 3:return process.nextTick(function(){a.call(null,b,c)});case 4:return process.nextTick(function(){a.call(null,b,c,d)});default:for(f=Array(e-1),g=0;g<f.length;)f[g++]=arguments[g];return process.nextTick(function(){a.apply(null,f)});}}

}).call(this,require('_process'))
},{"_process":50}],50:[function(require,module,exports){
'use strict';// shim for using process in browser
var process=module.exports={},cachedSetTimeout,cachedClearTimeout;// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.
function defaultSetTimout(){throw new Error('setTimeout has not been defined')}function defaultClearTimeout(){throw new Error('clearTimeout has not been defined')}(function(){try{cachedSetTimeout='function'==typeof setTimeout?setTimeout:defaultSetTimout}catch(a){cachedSetTimeout=defaultSetTimout}try{cachedClearTimeout='function'==typeof clearTimeout?clearTimeout:defaultClearTimeout}catch(a){cachedClearTimeout=defaultClearTimeout}})();function runTimeout(a){if(cachedSetTimeout===setTimeout)//normal enviroments in sane situations
return setTimeout(a,0);// if setTimeout wasn't available but was latter defined
if((cachedSetTimeout===defaultSetTimout||!cachedSetTimeout)&&setTimeout)return cachedSetTimeout=setTimeout,setTimeout(a,0);try{// when when somebody has screwed with setTimeout but no I.E. maddness
return cachedSetTimeout(a,0)}catch(b){try{// When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
return cachedSetTimeout.call(null,a,0)}catch(c){// same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
return cachedSetTimeout.call(this,a,0)}}}function runClearTimeout(a){if(cachedClearTimeout===clearTimeout)//normal enviroments in sane situations
return clearTimeout(a);// if clearTimeout wasn't available but was latter defined
if((cachedClearTimeout===defaultClearTimeout||!cachedClearTimeout)&&clearTimeout)return cachedClearTimeout=clearTimeout,clearTimeout(a);try{// when when somebody has screwed with setTimeout but no I.E. maddness
return cachedClearTimeout(a)}catch(b){try{// When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
return cachedClearTimeout.call(null,a)}catch(c){// same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
// Some versions of I.E. have different rules for clearTimeout vs setTimeout
return cachedClearTimeout.call(this,a)}}}var queue=[],draining=!1,currentQueue,queueIndex=-1;function cleanUpNextTick(){draining&&currentQueue&&(draining=!1,currentQueue.length?queue=currentQueue.concat(queue):queueIndex=-1,queue.length&&drainQueue())}function drainQueue(){if(!draining){var a=runTimeout(cleanUpNextTick);draining=!0;for(var b=queue.length;b;){for(currentQueue=queue,queue=[];++queueIndex<b;)currentQueue&&currentQueue[queueIndex].run();queueIndex=-1,b=queue.length}currentQueue=null,draining=!1,runClearTimeout(a)}}process.nextTick=function(a){var b=Array(arguments.length-1);if(1<arguments.length)for(var c=1;c<arguments.length;c++)b[c-1]=arguments[c];queue.push(new Item(a,b)),1!==queue.length||draining||runTimeout(drainQueue)};// v8 likes predictible objects
function Item(a,b){this.fun=a,this.array=b}Item.prototype.run=function(){this.fun.apply(null,this.array)},process.title='browser',process.browser=!0,process.env={},process.argv=[],process.version='',process.versions={};function noop(){}process.on=noop,process.addListener=noop,process.once=noop,process.off=noop,process.removeListener=noop,process.removeAllListeners=noop,process.emit=noop,process.binding=function(a){throw new Error('process.binding is not supported')},process.cwd=function(){return'/'},process.chdir=function(a){throw new Error('process.chdir is not supported')},process.umask=function(){return 0};

},{}],51:[function(require,module,exports){
"use strict";module.exports=require("./lib/_stream_duplex.js");

},{"./lib/_stream_duplex.js":52}],52:[function(require,module,exports){
// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.
'use strict';/*<replacement>*/var objectKeys=Object.keys||function(a){var b=[];for(var c in a)b.push(c);return b};/*</replacement>*/module.exports=Duplex;/*<replacement>*/var processNextTick=require('process-nextick-args'),util=require('core-util-is');/*</replacement>*//*<replacement>*/util.inherits=require('inherits');/*</replacement>*/var Readable=require('./_stream_readable'),Writable=require('./_stream_writable');util.inherits(Duplex,Readable);var keys=objectKeys(Writable.prototype);for(var v=0;v<keys.length;v++){var method=keys[v];Duplex.prototype[method]||(Duplex.prototype[method]=Writable.prototype[method])}function Duplex(a){return this instanceof Duplex?void(Readable.call(this,a),Writable.call(this,a),a&&!1===a.readable&&(this.readable=!1),a&&!1===a.writable&&(this.writable=!1),this.allowHalfOpen=!0,a&&!1===a.allowHalfOpen&&(this.allowHalfOpen=!1),this.once('end',onend)):new Duplex(a)}// the no-half-open enforcer
function onend(){this.allowHalfOpen||this._writableState.ended||processNextTick(onEndNT,this)}function onEndNT(a){a.end()}function forEach(a,b){for(var c=0,d=a.length;c<d;c++)b(a[c],c)}

},{"./_stream_readable":54,"./_stream_writable":56,"core-util-is":11,"inherits":44,"process-nextick-args":49}],53:[function(require,module,exports){
// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.
'use strict';module.exports=PassThrough;var Transform=require('./_stream_transform'),util=require('core-util-is');/*<replacement>*/util.inherits=require('inherits'),util.inherits(PassThrough,Transform);function PassThrough(a){return this instanceof PassThrough?void Transform.call(this,a):new PassThrough(a)}PassThrough.prototype._transform=function(a,b,c){c(null,a)};

},{"./_stream_transform":55,"core-util-is":11,"inherits":44}],54:[function(require,module,exports){
(function (process){
'use strict';module.exports=Readable;/*<replacement>*/var processNextTick=require('process-nextick-args'),isArray=require('isarray');/*</replacement>*//*<replacement>*//*</replacement>*/Readable.ReadableState=ReadableState;/*<replacement>*/var EE=require('events').EventEmitter,EElistenerCount=function EElistenerCount(a,b){return a.listeners(b).length},Stream;/*</replacement>*//*<replacement>*/(function(){try{Stream=require('stream')}catch(a){}finally{Stream||(Stream=require('events').EventEmitter)}})();/*</replacement>*/var Buffer=require('buffer').Buffer,bufferShim=require('buffer-shims'),util=require('core-util-is');/*<replacement>*//*</replacement>*//*<replacement>*/util.inherits=require('inherits');/*</replacement>*//*<replacement>*/var debugUtil=require('util'),debug=void 0;debug=debugUtil&&debugUtil.debuglog?debugUtil.debuglog('stream'):function debug(){};/*</replacement>*/var BufferList=require('./internal/streams/BufferList'),StringDecoder;util.inherits(Readable,Stream);function prependListener(a,b,d){return'function'==typeof a.prependListener?a.prependListener(b,d):void(a._events&&a._events[b]?isArray(a._events[b])?a._events[b].unshift(d):a._events[b]=[d,a._events[b]]:a.on(b,d))}var Duplex;function ReadableState(a,b){Duplex=Duplex||require('./_stream_duplex'),a=a||{},this.objectMode=!!a.objectMode,b instanceof Duplex&&(this.objectMode=this.objectMode||!!a.readableObjectMode);// the point at which it stops calling _read() to fill the buffer
// Note: 0 is a valid value, means "don't call _read preemptively ever"
var d=a.highWaterMark,g=this.objectMode?16:16384;this.highWaterMark=d||0===d?d:g,this.highWaterMark=~~this.highWaterMark,this.buffer=new BufferList,this.length=0,this.pipes=null,this.pipesCount=0,this.flowing=null,this.ended=!1,this.endEmitted=!1,this.reading=!1,this.sync=!0,this.needReadable=!1,this.emittedReadable=!1,this.readableListening=!1,this.resumeScheduled=!1,this.defaultEncoding=a.defaultEncoding||'utf8',this.ranOut=!1,this.awaitDrain=0,this.readingMore=!1,this.decoder=null,this.encoding=null,a.encoding&&(!StringDecoder&&(StringDecoder=require('string_decoder/').StringDecoder),this.decoder=new StringDecoder(a.encoding),this.encoding=a.encoding)}var Duplex;function Readable(a){return Duplex=Duplex||require('./_stream_duplex'),this instanceof Readable?void(this._readableState=new ReadableState(a,this),this.readable=!0,a&&'function'==typeof a.read&&(this._read=a.read),Stream.call(this)):new Readable(a)}// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push=function(a,b){var d=this._readableState;return d.objectMode||'string'!=typeof a||(b=b||d.defaultEncoding,b!==d.encoding&&(a=bufferShim.from(a,b),b='')),readableAddChunk(this,d,a,b,!1)},Readable.prototype.unshift=function(a){var b=this._readableState;return readableAddChunk(this,b,a,'',!0)},Readable.prototype.isPaused=function(){return!1===this._readableState.flowing};function readableAddChunk(a,b,d,g,h){var j=chunkInvalid(b,d);if(j)a.emit('error',j);else if(null===d)b.reading=!1,onEofChunk(a,b);else if(!(b.objectMode||d&&0<d.length))h||(b.reading=!1);else if(b.ended&&!h){var k=new Error('stream.push() after EOF');a.emit('error',k)}else if(b.endEmitted&&h){var m=new Error('stream.unshift() after end event');a.emit('error',m)}else{var o;!b.decoder||h||g||(d=b.decoder.write(d),o=!b.objectMode&&0===d.length),h||(b.reading=!1),o||(b.flowing&&0===b.length&&!b.sync?(a.emit('data',d),a.read(0)):(b.length+=b.objectMode?1:d.length,h?b.buffer.unshift(d):b.buffer.push(d),b.needReadable&&emitReadable(a))),maybeReadMore(a,b)}return needMoreData(b)}// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(a){return!a.ended&&(a.needReadable||a.length<a.highWaterMark||0===a.length)}// backwards compatibility.
Readable.prototype.setEncoding=function(a){return StringDecoder||(StringDecoder=require('string_decoder/').StringDecoder),this._readableState.decoder=new StringDecoder(a),this._readableState.encoding=a,this};// Don't raise the hwm > 8MB
var MAX_HWM=8388608;function computeNewHighWaterMark(a){return a>=MAX_HWM?a=MAX_HWM:(a--,a|=a>>>1,a|=a>>>2,a|=a>>>4,a|=a>>>8,a|=a>>>16,a++),a}// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function howMuchToRead(a,b){// Don't have enough
return 0>=a||0===b.length&&b.ended?0:b.objectMode?1:a===a?(a>b.highWaterMark&&(b.highWaterMark=computeNewHighWaterMark(a)),a<=b.length?a:b.ended?b.length:(b.needReadable=!0,0)):b.flowing&&b.length?b.buffer.head.data.length:b.length;// If we're asking for more than the current hwm, then raise the hwm.
}// you can override either this method, or the async _read(n) below.
Readable.prototype.read=function(a){debug('read',a),a=parseInt(a,10);var b=this._readableState,d=a;// if we're doing read(0) to trigger a readable event, but we
// already have a bunch of data in the buffer, then just trigger
// the 'readable' event and move on.
if(0!==a&&(b.emittedReadable=!1),0===a&&b.needReadable&&(b.length>=b.highWaterMark||b.ended))return debug('read: emitReadable',b.length,b.ended),0===b.length&&b.ended?endReadable(this):emitReadable(this),null;// if we've ended, and we're now clear, then finish it up.
if(a=howMuchToRead(a,b),0===a&&b.ended)return 0===b.length&&endReadable(this),null;// All the actual chunk generation logic needs to be
// *below* the call to _read.  The reason is that in certain
// synthetic stream cases, such as passthrough streams, _read
// may be a completely synchronous operation which may change
// the state of the read buffer, providing enough data when
// before there was *not* enough.
//
// So, the steps are:
// 1. Figure out what the state of things will be after we do
// a read from the buffer.
//
// 2. If that resulting state will trigger a _read, then call _read.
// Note that this may be asynchronous, or synchronous.  Yes, it is
// deeply ugly to write APIs this way, but that still doesn't mean
// that the Readable class should behave improperly, as streams are
// designed to be sync/async agnostic.
// Take note if the _read call is sync or async (ie, if the read call
// has returned yet), so that we know whether or not it's safe to emit
// 'readable' etc.
//
// 3. Actually pull the requested chunks out of the buffer and return.
// if we need a readable event, then we need to do some reading.
var g=b.needReadable;debug('need readable',g),(0===b.length||b.length-a<b.highWaterMark)&&(g=!0,debug('length less than watermark',g)),b.ended||b.reading?(g=!1,debug('reading or ended',g)):g&&(debug('do read'),b.reading=!0,b.sync=!0,0===b.length&&(b.needReadable=!0),this._read(b.highWaterMark),b.sync=!1,!b.reading&&(a=howMuchToRead(d,b)));var h;return h=0<a?fromList(a,b):null,null===h?(b.needReadable=!0,a=0):b.length-=a,0===b.length&&(!b.ended&&(b.needReadable=!0),d!==a&&b.ended&&endReadable(this)),null!==h&&this.emit('data',h),h};function chunkInvalid(a,b){var d=null;return Buffer.isBuffer(b)||'string'==typeof b||null===b||void 0===b||a.objectMode||(d=new TypeError('Invalid non-string/buffer chunk')),d}function onEofChunk(a,b){if(!b.ended){if(b.decoder){var d=b.decoder.end();d&&d.length&&(b.buffer.push(d),b.length+=b.objectMode?1:d.length)}b.ended=!0,emitReadable(a)}// emit 'readable' now to make sure it gets picked up.
}// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(a){var b=a._readableState;b.needReadable=!1,b.emittedReadable||(debug('emitReadable',b.flowing),b.emittedReadable=!0,b.sync?processNextTick(emitReadable_,a):emitReadable_(a))}function emitReadable_(a){debug('emit readable'),a.emit('readable'),flow(a)}// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(a,b){b.readingMore||(b.readingMore=!0,processNextTick(maybeReadMore_,a,b))}function maybeReadMore_(a,b){for(var d=b.length;!b.reading&&!b.flowing&&!b.ended&&b.length<b.highWaterMark&&(debug('maybeReadMore read 0'),a.read(0),d!==b.length);)d=b.length;b.readingMore=!1}// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read=function(a){this.emit('error',new Error('not implemented'))},Readable.prototype.pipe=function(a,b){function d(z){debug('onunpipe'),z===r&&h()}function g(){debug('onend'),a.end()}// when the dest drains, it reduces the awaitDrain counter
// on the source.  This would be more elegant with a .once()
// handler in flow(), but adding and removing repeatedly is
// too slow.
function h(){debug('cleanup'),a.removeListener('close',m),a.removeListener('finish',o),a.removeListener('drain',v),a.removeListener('error',k),a.removeListener('unpipe',d),r.removeListener('end',g),r.removeListener('end',h),r.removeListener('data',j),w=!0,s.awaitDrain&&(!a._writableState||a._writableState.needDrain)&&v()}// If the user pushes more data while we're writing to dest then we'll end up
// in ondata again. However, we only want to increase awaitDrain once because
// dest will only emit one 'drain' event for the multiple writes.
// => Introduce a guard on increasing awaitDrain.
function j(z){debug('ondata'),y=!1;var A=a.write(z);!1!==A||y||((1===s.pipesCount&&s.pipes===a||1<s.pipesCount&&-1!==indexOf(s.pipes,a))&&!w&&(debug('false write response, pause',r._readableState.awaitDrain),r._readableState.awaitDrain++,y=!0),r.pause())}// if the dest has an error, then stop piping into it.
// however, don't suppress the throwing behavior for this.
function k(z){debug('onerror',z),q(),a.removeListener('error',k),0===EElistenerCount(a,'error')&&a.emit('error',z)}// Make sure our error handler is attached before userland ones.
// Both close and finish should trigger unpipe, but only once.
function m(){a.removeListener('finish',o),q()}function o(){debug('onfinish'),a.removeListener('close',m),q()}function q(){debug('unpipe'),r.unpipe(a)}// tell the dest that it's being piped to
var r=this,s=this._readableState;switch(s.pipesCount){case 0:s.pipes=a;break;case 1:s.pipes=[s.pipes,a];break;default:s.pipes.push(a);}s.pipesCount+=1,debug('pipe count=%d opts=%j',s.pipesCount,b);var t=(!b||!1!==b.end)&&a!==process.stdout&&a!==process.stderr,u=t?g:h;s.endEmitted?processNextTick(u):r.once('end',u),a.on('unpipe',d);var v=pipeOnDrain(r);a.on('drain',v);var w=!1,y=!1;return r.on('data',j),prependListener(a,'error',k),a.once('close',m),a.once('finish',o),a.emit('pipe',r),s.flowing||(debug('pipe resume'),r.resume()),a};function pipeOnDrain(a){return function(){var b=a._readableState;debug('pipeOnDrain',b.awaitDrain),b.awaitDrain&&b.awaitDrain--,0===b.awaitDrain&&EElistenerCount(a,'data')&&(b.flowing=!0,flow(a))}}Readable.prototype.unpipe=function(a){var b=this._readableState;// if we're not piping anywhere, then do nothing.
if(0===b.pipesCount)return this;// just one destination.  most common case.
if(1===b.pipesCount)// passed in one, but it's not the right one.
return a&&a!==b.pipes?this:(a||(a=b.pipes),b.pipes=null,b.pipesCount=0,b.flowing=!1,a&&a.emit('unpipe',this),this);// slow case. multiple pipe destinations.
if(!a){// remove all.
var d=b.pipes,g=b.pipesCount;b.pipes=null,b.pipesCount=0,b.flowing=!1;for(var h=0;h<g;h++)d[h].emit('unpipe',this);return this}// try to find the right one.
var j=indexOf(b.pipes,a);return-1===j?this:(b.pipes.splice(j,1),b.pipesCount-=1,1===b.pipesCount&&(b.pipes=b.pipes[0]),a.emit('unpipe',this),this)},Readable.prototype.on=function(a,b){var d=Stream.prototype.on.call(this,a,b);if('data'===a)!1!==this._readableState.flowing&&this.resume();else if('readable'===a){var g=this._readableState;g.endEmitted||g.readableListening||(g.readableListening=g.needReadable=!0,g.emittedReadable=!1,g.reading?g.length&&emitReadable(this,g):processNextTick(nReadingNextTick,this))}return d},Readable.prototype.addListener=Readable.prototype.on;function nReadingNextTick(a){debug('readable nexttick read 0'),a.read(0)}// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume=function(){var a=this._readableState;return a.flowing||(debug('resume'),a.flowing=!0,resume(this,a)),this};function resume(a,b){b.resumeScheduled||(b.resumeScheduled=!0,processNextTick(resume_,a,b))}function resume_(a,b){b.reading||(debug('resume read 0'),a.read(0)),b.resumeScheduled=!1,b.awaitDrain=0,a.emit('resume'),flow(a),b.flowing&&!b.reading&&a.read(0)}Readable.prototype.pause=function(){return debug('call pause flowing=%j',this._readableState.flowing),!1!==this._readableState.flowing&&(debug('pause'),this._readableState.flowing=!1,this.emit('pause')),this};function flow(a){var b=a._readableState;for(debug('flow',b.flowing);b.flowing&&null!==a.read(););}// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap=function(a){var b=this._readableState,d=!1,g=this;// proxy all the other methods.
// important when wrapping filters and duplexes.
for(var h in a.on('end',function(){if(debug('wrapped end'),b.decoder&&!b.ended){var j=b.decoder.end();j&&j.length&&g.push(j)}g.push(null)}),a.on('data',function(j){// don't skip over falsy values in objectMode
if((debug('wrapped data'),b.decoder&&(j=b.decoder.write(j)),!(b.objectMode&&(null===j||void 0===j)))&&(b.objectMode||j&&j.length)){var k=g.push(j);k||(d=!0,a.pause())}}),a)void 0===this[h]&&'function'==typeof a[h]&&(this[h]=function(j){return function(){return a[j].apply(a,arguments)}}(h));// proxy certain important events.
return forEach(['error','close','destroy','pause','resume'],function(j){a.on(j,g.emit.bind(g,j))}),g._read=function(j){debug('wrapped _read',j),d&&(d=!1,a.resume())},g},Readable._fromList=fromList;// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromList(a,b){// nothing buffered
if(0===b.length)return null;var d;return b.objectMode?d=b.buffer.shift():!a||a>=b.length?(d=b.decoder?b.buffer.join(''):1===b.buffer.length?b.buffer.head.data:b.buffer.concat(b.length),b.buffer.clear()):d=fromListPartial(a,b.buffer,b.decoder),d}// Extracts only enough buffered data to satisfy the amount requested.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromListPartial(a,b,d){var g;return a<b.head.data.length?(g=b.head.data.slice(0,a),b.head.data=b.head.data.slice(a)):a===b.head.data.length?g=b.shift():g=d?copyFromBufferString(a,b):copyFromBuffer(a,b),g}// Copies a specified amount of characters from the list of buffered data
// chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBufferString(a,b){var d=b.head,g=1,h=d.data;for(a-=h.length;d=d.next;){var j=d.data,k=a>j.length?j.length:a;if(h+=k===j.length?j:j.slice(0,a),a-=k,0===a){k===j.length?(++g,b.head=d.next?d.next:b.tail=null):(b.head=d,d.data=j.slice(k));break}++g}return b.length-=g,h}// Copies a specified amount of bytes from the list of buffered data chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBuffer(a,b){var d=bufferShim.allocUnsafe(a),g=b.head,h=1;for(g.data.copy(d),a-=g.data.length;g=g.next;){var j=g.data,k=a>j.length?j.length:a;if(j.copy(d,d.length-a,0,k),a-=k,0===a){k===j.length?(++h,b.head=g.next?g.next:b.tail=null):(b.head=g,g.data=j.slice(k));break}++h}return b.length-=h,d}function endReadable(a){var b=a._readableState;// If we get here before consuming all the bytes, then that is a
// bug in node.  Should never happen.
if(0<b.length)throw new Error('"endReadable()" called on non-empty stream');b.endEmitted||(b.ended=!0,processNextTick(endReadableNT,b,a))}function endReadableNT(a,b){a.endEmitted||0!==a.length||(a.endEmitted=!0,b.readable=!1,b.emit('end'))}function forEach(a,b){for(var d=0,g=a.length;d<g;d++)b(a[d],d)}function indexOf(a,b){for(var d=0,g=a.length;d<g;d++)if(a[d]===b)return d;return-1}

}).call(this,require('_process'))
},{"./_stream_duplex":52,"./internal/streams/BufferList":57,"_process":50,"buffer":9,"buffer-shims":8,"core-util-is":11,"events":36,"inherits":44,"isarray":46,"process-nextick-args":49,"stream":78,"string_decoder/":79,"util":6}],55:[function(require,module,exports){
// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.
'use strict';module.exports=Transform;var Duplex=require('./_stream_duplex'),util=require('core-util-is');/*<replacement>*/util.inherits=require('inherits'),util.inherits(Transform,Duplex);function TransformState(a){this.afterTransform=function(b,c){return afterTransform(a,b,c)},this.needTransform=!1,this.transforming=!1,this.writecb=null,this.writechunk=null,this.writeencoding=null}function afterTransform(a,b,c){var d=a._transformState;d.transforming=!1;var e=d.writecb;if(!e)return a.emit('error',new Error('no writecb in Transform class'));d.writechunk=null,d.writecb=null,null!==c&&c!==void 0&&a.push(c),e(b);var f=a._readableState;f.reading=!1,(f.needReadable||f.length<f.highWaterMark)&&a._read(f.highWaterMark)}function Transform(a){if(!(this instanceof Transform))return new Transform(a);Duplex.call(this,a),this._transformState=new TransformState(this);// when the writable side finishes, then flush out anything remaining.
var b=this;// start out asking for a readable event once data is transformed.
this._readableState.needReadable=!0,this._readableState.sync=!1,a&&('function'==typeof a.transform&&(this._transform=a.transform),'function'==typeof a.flush&&(this._flush=a.flush)),this.once('prefinish',function(){'function'==typeof this._flush?this._flush(function(c){done(b,c)}):done(b)})}Transform.prototype.push=function(a,b){return this._transformState.needTransform=!1,Duplex.prototype.push.call(this,a,b)},Transform.prototype._transform=function(a,b,c){throw new Error('Not implemented')},Transform.prototype._write=function(a,b,c){var d=this._transformState;if(d.writecb=c,d.writechunk=a,d.writeencoding=b,!d.transforming){var e=this._readableState;(d.needTransform||e.needReadable||e.length<e.highWaterMark)&&this._read(e.highWaterMark)}},Transform.prototype._read=function(a){var b=this._transformState;null!==b.writechunk&&b.writecb&&!b.transforming?(b.transforming=!0,this._transform(b.writechunk,b.writeencoding,b.afterTransform)):b.needTransform=!0};function done(a,b){if(b)return a.emit('error',b);// if there's nothing in the write buffer, then that means
// that nothing more will ever be provided
var c=a._writableState,d=a._transformState;if(c.length)throw new Error('Calling transform done when ws.length != 0');if(d.transforming)throw new Error('Calling transform done when still transforming');return a.push(null)}

},{"./_stream_duplex":52,"core-util-is":11,"inherits":44}],56:[function(require,module,exports){
(function (process){
// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.
'use strict';module.exports=Writable;/*<replacement>*/var processNextTick=require('process-nextick-args'),asyncWrite=!process.browser&&-1<['v0.10','v0.9.'].indexOf(process.version.slice(0,5))?setImmediate:processNextTick;/*</replacement>*//*<replacement>*//*</replacement>*/Writable.WritableState=WritableState;/*<replacement>*/var util=require('core-util-is');util.inherits=require('inherits');/*</replacement>*//*<replacement>*/var internalUtil={deprecate:require('util-deprecate')},Stream;/*</replacement>*//*<replacement>*/(function(){try{Stream=require('stream')}catch(a){}finally{Stream||(Stream=require('events').EventEmitter)}})();/*</replacement>*/var Buffer=require('buffer').Buffer,bufferShim=require('buffer-shims');/*<replacement>*//*</replacement>*/util.inherits(Writable,Stream);function nop(){}function WriteReq(a,b,c){this.chunk=a,this.encoding=b,this.callback=c,this.next=null}var Duplex;function WritableState(a,b){Duplex=Duplex||require('./_stream_duplex'),a=a||{},this.objectMode=!!a.objectMode,b instanceof Duplex&&(this.objectMode=this.objectMode||!!a.writableObjectMode);// the point at which write() starts returning false
// Note: 0 is a valid value, means that we always return false if
// the entire buffer is not flushed immediately on write()
var c=a.highWaterMark,d=this.objectMode?16:16384;this.highWaterMark=c||0===c?c:d,this.highWaterMark=~~this.highWaterMark,this.needDrain=!1,this.ending=!1,this.ended=!1,this.finished=!1;// should we decode strings into buffers before passing to _write?
// this is here so that some node-core streams can optimize string
// handling at a lower level.
var e=!1===a.decodeStrings;this.decodeStrings=!e,this.defaultEncoding=a.defaultEncoding||'utf8',this.length=0,this.writing=!1,this.corked=0,this.sync=!0,this.bufferProcessing=!1,this.onwrite=function(f){onwrite(b,f)},this.writecb=null,this.writelen=0,this.bufferedRequest=null,this.lastBufferedRequest=null,this.pendingcb=0,this.prefinished=!1,this.errorEmitted=!1,this.bufferedRequestCount=0,this.corkedRequestsFree=new CorkedRequest(this)}WritableState.prototype.getBuffer=function(){for(var b=this.bufferedRequest,c=[];b;)c.push(b),b=b.next;return c},function(){try{Object.defineProperty(WritableState.prototype,'buffer',{get:internalUtil.deprecate(function(){return this.getBuffer()},'_writableState.buffer is deprecated. Use _writableState.getBuffer instead.')})}catch(a){}}();var Duplex;function Writable(a){// Writable ctor is applied to Duplexes, though they're not
// instanceof Writable, they're instanceof Readable.
return Duplex=Duplex||require('./_stream_duplex'),this instanceof Writable||this instanceof Duplex?void(this._writableState=new WritableState(a,this),this.writable=!0,a&&('function'==typeof a.write&&(this._write=a.write),'function'==typeof a.writev&&(this._writev=a.writev)),Stream.call(this)):new Writable(a)}// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe=function(){this.emit('error',new Error('Cannot pipe, not readable'))};function writeAfterEnd(a,b){var c=new Error('write after end');// TODO: defer error events consistently everywhere, not just the cb
a.emit('error',c),processNextTick(b,c)}// If we get something that is not a buffer, string, null, or undefined,
// and we're not in objectMode, then that's an error.
// Otherwise stream chunks are all considered to be of length=1, and the
// watermarks determine how many objects to keep in the buffer, rather than
// how many bytes or characters.
function validChunk(a,b,c,d){var e=!0,f=!1;// Always throw error if a null is written
// if we are not in object mode then throw
// if it is not a buffer, string, or undefined.
return null===c?f=new TypeError('May not write null values to stream'):!Buffer.isBuffer(c)&&'string'!=typeof c&&void 0!==c&&!b.objectMode&&(f=new TypeError('Invalid non-string/buffer chunk')),f&&(a.emit('error',f),processNextTick(d,f),e=!1),e}Writable.prototype.write=function(a,b,c){var d=this._writableState,e=!1;return'function'==typeof b&&(c=b,b=null),Buffer.isBuffer(a)?b='buffer':!b&&(b=d.defaultEncoding),'function'!=typeof c&&(c=nop),d.ended?writeAfterEnd(this,c):validChunk(this,d,a,c)&&(d.pendingcb++,e=writeOrBuffer(this,d,a,b,c)),e},Writable.prototype.cork=function(){var a=this._writableState;a.corked++},Writable.prototype.uncork=function(){var a=this._writableState;a.corked&&(a.corked--,!a.writing&&!a.corked&&!a.finished&&!a.bufferProcessing&&a.bufferedRequest&&clearBuffer(this,a))},Writable.prototype.setDefaultEncoding=function(b){if('string'==typeof b&&(b=b.toLowerCase()),!(-1<['hex','utf8','utf-8','ascii','binary','base64','ucs2','ucs-2','utf16le','utf-16le','raw'].indexOf((b+'').toLowerCase())))throw new TypeError('Unknown encoding: '+b);return this._writableState.defaultEncoding=b,this};function decodeChunk(a,b,c){return a.objectMode||!1===a.decodeStrings||'string'!=typeof b||(b=bufferShim.from(b,c)),b}// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(a,b,c,d,e){c=decodeChunk(b,c,d),Buffer.isBuffer(c)&&(d='buffer');var f=b.objectMode?1:c.length;b.length+=f;var g=b.length<b.highWaterMark;// we must ensure that previous needDrain will not be reset to false.
if(g||(b.needDrain=!0),b.writing||b.corked){var h=b.lastBufferedRequest;b.lastBufferedRequest=new WriteReq(c,d,e),h?h.next=b.lastBufferedRequest:b.bufferedRequest=b.lastBufferedRequest,b.bufferedRequestCount+=1}else doWrite(a,b,!1,f,c,d,e);return g}function doWrite(a,b,c,d,e,f,g){b.writelen=d,b.writecb=g,b.writing=!0,b.sync=!0,c?a._writev(e,b.onwrite):a._write(e,f,b.onwrite),b.sync=!1}function onwriteError(a,b,c,d,e){--b.pendingcb,c?processNextTick(e,d):e(d),a._writableState.errorEmitted=!0,a.emit('error',d)}function onwriteStateUpdate(a){a.writing=!1,a.writecb=null,a.length-=a.writelen,a.writelen=0}function onwrite(a,b){var c=a._writableState,d=c.sync,e=c.writecb;if(onwriteStateUpdate(c),b)onwriteError(a,c,d,b,e);else{// Check if we're actually ready to finish, but don't emit yet
var f=needFinish(c);f||c.corked||c.bufferProcessing||!c.bufferedRequest||clearBuffer(a,c),d?asyncWrite(afterWrite,a,c,f,e):afterWrite(a,c,f,e)}}function afterWrite(a,b,c,d){c||onwriteDrain(a,b),b.pendingcb--,d(),finishMaybe(a,b)}// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(a,b){0===b.length&&b.needDrain&&(b.needDrain=!1,a.emit('drain'))}// if there's something in the buffer waiting, then process it
function clearBuffer(a,b){b.bufferProcessing=!0;var c=b.bufferedRequest;if(a._writev&&c&&c.next){// Fast case, write everything using _writev()
var d=b.bufferedRequestCount,e=Array(d),f=b.corkedRequestsFree;f.entry=c;for(var g=0;c;)e[g]=c,c=c.next,g+=1;doWrite(a,b,!0,b.length,e,'',f.finish),b.pendingcb++,b.lastBufferedRequest=null,f.next?(b.corkedRequestsFree=f.next,f.next=null):b.corkedRequestsFree=new CorkedRequest(b)}else{// Slow case, write chunks one-by-one
for(;c;){var h=c.chunk,i=c.encoding,j=c.callback,k=b.objectMode?1:h.length;// if we didn't call the onwrite immediately, then
// it means that we need to wait until it does.
// also, that means that the chunk and cb are currently
// being processed, so move the buffer counter past them.
if(doWrite(a,b,!1,k,h,i,j),c=c.next,b.writing)break}null===c&&(b.lastBufferedRequest=null)}b.bufferedRequestCount=0,b.bufferedRequest=c,b.bufferProcessing=!1}Writable.prototype._write=function(a,b,c){c(new Error('not implemented'))},Writable.prototype._writev=null,Writable.prototype.end=function(a,b,c){var d=this._writableState;'function'==typeof a?(c=a,a=null,b=null):'function'==typeof b&&(c=b,b=null),null!==a&&a!==void 0&&this.write(a,b),d.corked&&(d.corked=1,this.uncork()),d.ending||d.finished||endWritable(this,d,c)};function needFinish(a){return a.ending&&0===a.length&&null===a.bufferedRequest&&!a.finished&&!a.writing}function prefinish(a,b){b.prefinished||(b.prefinished=!0,a.emit('prefinish'))}function finishMaybe(a,b){var c=needFinish(b);return c&&(0===b.pendingcb?(prefinish(a,b),b.finished=!0,a.emit('finish')):prefinish(a,b)),c}function endWritable(a,b,c){b.ending=!0,finishMaybe(a,b),c&&(b.finished?processNextTick(c):a.once('finish',c)),b.ended=!0,a.writable=!1}// It seems a linked list but it is not
// there will be only 2 of these for each stream
function CorkedRequest(a){var b=this;this.next=null,this.entry=null,this.finish=function(c){var d=b.entry;for(b.entry=null;d;){var e=d.callback;a.pendingcb--,e(c),d=d.next}a.corkedRequestsFree?a.corkedRequestsFree.next=b:a.corkedRequestsFree=b}}

}).call(this,require('_process'))
},{"./_stream_duplex":52,"_process":50,"buffer":9,"buffer-shims":8,"core-util-is":11,"events":36,"inherits":44,"process-nextick-args":49,"stream":78,"util-deprecate":80}],57:[function(require,module,exports){
'use strict';var Buffer=require('buffer').Buffer,bufferShim=require('buffer-shims');/*<replacement>*//*</replacement>*/module.exports=BufferList;function BufferList(){this.head=null,this.tail=null,this.length=0}BufferList.prototype.push=function(a){var b={data:a,next:null};0<this.length?this.tail.next=b:this.head=b,this.tail=b,++this.length},BufferList.prototype.unshift=function(a){var b={data:a,next:this.head};0===this.length&&(this.tail=b),this.head=b,++this.length},BufferList.prototype.shift=function(){if(0!==this.length){var a=this.head.data;return this.head=1===this.length?this.tail=null:this.head.next,--this.length,a}},BufferList.prototype.clear=function(){this.head=this.tail=null,this.length=0},BufferList.prototype.join=function(a){if(0===this.length)return'';for(var b=this.head,c=''+b.data;b=b.next;)c+=a+b.data;return c},BufferList.prototype.concat=function(a){if(0===this.length)return bufferShim.alloc(0);if(1===this.length)return this.head.data;for(var b=bufferShim.allocUnsafe(a>>>0),c=this.head,d=0;c;)c.data.copy(b,d),d+=c.data.length,c=c.next;return b};

},{"buffer":9,"buffer-shims":8}],58:[function(require,module,exports){
"use strict";module.exports=require("./lib/_stream_passthrough.js");

},{"./lib/_stream_passthrough.js":53}],59:[function(require,module,exports){
(function (process){
'use strict';var Stream=function(){try{return require('stream');// hack to fix a circular dependency issue when used with browserify
}catch(a){}}();exports=module.exports=require('./lib/_stream_readable.js'),exports.Stream=Stream||exports,exports.Readable=exports,exports.Writable=require('./lib/_stream_writable.js'),exports.Duplex=require('./lib/_stream_duplex.js'),exports.Transform=require('./lib/_stream_transform.js'),exports.PassThrough=require('./lib/_stream_passthrough.js'),!process.browser&&'disable'===process.env.READABLE_STREAM&&Stream&&(module.exports=Stream);

}).call(this,require('_process'))
},{"./lib/_stream_duplex.js":52,"./lib/_stream_passthrough.js":53,"./lib/_stream_readable.js":54,"./lib/_stream_transform.js":55,"./lib/_stream_writable.js":56,"_process":50,"stream":78}],60:[function(require,module,exports){
"use strict";module.exports=require("./lib/_stream_transform.js");

},{"./lib/_stream_transform.js":55}],61:[function(require,module,exports){
"use strict";module.exports=require("./lib/_stream_writable.js");

},{"./lib/_stream_writable.js":56}],62:[function(require,module,exports){
(function (Buffer){
'use strict';/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*//** @preserve
(c) 2012 by Cédric Mesnil. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/// constants table
var zl=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8,3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2,4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13],zr=[5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12,6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2,15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14,12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11],sl=[11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8,7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12,11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12,9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6],sr=[8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6,9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11,9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8,8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11],hl=[0,1518500249,1859775393,2400959708,2840853838],hr=[1352829926,1548603684,1836072691,2053994217,0];function bytesToWords(a){var c=[];for(var d=0,e=0;d<a.length;d++,e+=8)c[e>>>5]|=a[d]<<24-e%32;return c}function wordsToBytes(a){var c=[];for(var d=0;d<32*a.length;d+=8)c.push(255&a[d>>>5]>>>24-d%32);return c}function processBlock(a,c,d){// swap endian
for(var e=0;16>e;e++){var f=d+e,g=c[f];// Swap
c[f]=16711935&(g<<8|g>>>24)|4278255360&(g<<24|g>>>8)}// Working variables
var h,j,k,l,o,p,q,r,s,u;p=h=a[0],q=j=a[1],r=k=a[2],s=l=a[3],u=o=a[4];// computation
var v;for(e=0;80>e;e+=1)v=0|h+c[d+zl[e]],v+=16>e?f1(j,k,l)+hl[0]:32>e?f2(j,k,l)+hl[1]:48>e?f3(j,k,l)+hl[2]:64>e?f4(j,k,l)+hl[3]:f5(j,k,l)+hl[4],v=0|v,v=rotl(v,sl[e]),v=0|v+o,h=o,o=l,l=rotl(k,10),k=j,j=v,v=0|p+c[d+zr[e]],v+=16>e?f5(q,r,s)+hr[0]:32>e?f4(q,r,s)+hr[1]:48>e?f3(q,r,s)+hr[2]:64>e?f2(q,r,s)+hr[3]:f1(q,r,s)+hr[4],v=0|v,v=rotl(v,sr[e]),v=0|v+u,p=u,u=s,s=rotl(r,10),r=q,q=v;// intermediate hash value
v=0|a[1]+k+s,a[1]=0|a[2]+l+u,a[2]=0|a[3]+o+p,a[3]=0|a[4]+h+q,a[4]=0|a[0]+j+r,a[0]=v}function f1(a,c,d){return a^c^d}function f2(a,c,d){return a&c|~a&d}function f3(a,c,d){return(a|~c)^d}function f4(a,c,d){return a&d|c&~d}function f5(a,c,d){return a^(c|~d)}function rotl(a,c){return a<<c|a>>>32-c}function ripemd160(a){var c=[1732584193,4023233417,2562383102,271733878,3285377520];'string'==typeof a&&(a=new Buffer(a,'utf8'));var d=bytesToWords(a),e=8*a.length,f=8*a.length;// Add padding
d[e>>>5]|=128<<24-e%32,d[(e+64>>>9<<4)+14]=16711935&(f<<8|f>>>24)|4278255360&(f<<24|f>>>8);for(var g=0;g<d.length;g+=16)processBlock(c,d,g);// swap endian
for(g=0;5>g;g++){// shortcut
var h=c[g];// Swap
c[g]=16711935&(h<<8|h>>>24)|4278255360&(h<<24|h>>>8)}var j=wordsToBytes(c);return new Buffer(j)}module.exports=ripemd160;

}).call(this,require("buffer").Buffer)
},{"buffer":9}],63:[function(require,module,exports){
(function (Buffer){
'use strict';var assert=require('assert');/**
 * RLP Encoding based on: https://github.com/ethereum/wiki/wiki/%5BEnglish%5D-RLP
 * This function takes in a data, convert it to buffer if not, and a length for recursion
 *
 * @param {Buffer,String,Integer,Array} data - will be converted to buffer
 * @returns {Buffer} - returns buffer of encoded data
 **/exports.encode=function(b){if(b instanceof Array){var c=[];for(var e=0;e<b.length;e++)c.push(exports.encode(b[e]));var f=Buffer.concat(c);return Buffer.concat([encodeLength(f.length,192),f])}return(b=toBuffer(b),1===b.length&&128>b[0])?b:Buffer.concat([encodeLength(b.length,128),b])};function safeParseInt(b,c){if('00'===b.slice(0,2))throw new Error('invalid RLP: extra zeros');return parseInt(b,c)}function encodeLength(b,c){if(56>b)return new Buffer([b+c]);var e=intToHex(b),f=e.length/2,g=intToHex(c+55+f);return new Buffer(g+e,'hex')}/**
 * RLP Decoding based on: {@link https://github.com/ethereum/wiki/wiki/%5BEnglish%5D-RLP|RLP}
 * @param {Buffer,String,Integer,Array} data - will be converted to buffer
 * @returns {Array} - returns decode Array of Buffers containg the original message
 **/exports.decode=function(b,c){if(!b||0===b.length)return new Buffer([]);b=toBuffer(b);var e=_decode(b);return c?e:(assert.equal(e.remainder.length,0,'invalid remainder'),e.data)},exports.getLength=function(b){if(!b||0===b.length)return new Buffer([]);b=toBuffer(b);var c=b[0];if(127>=c)return b.length;if(183>=c)return c-127;if(191>=c)return c-182;if(247>=c)// a list between  0-55 bytes long
return c-191;// a list  over 55 bytes long
var e=c-246,f=safeParseInt(b.slice(1,e).toString('hex'),16);return e+f};function _decode(b){var c,e,f,g,h,j=[],k=b[0];if(127>=k)// a single byte whose value is in the [0x00, 0x7f] range, that byte is its own RLP encoding.
return{data:b.slice(0,1),remainder:b.slice(1)};if(183>=k){if(c=k-127,f=128===k?new Buffer([]):b.slice(1,c),2===c&&128>f[0])throw new Error('invalid rlp encoding: byte must be less 0x80');return{data:f,remainder:b.slice(c)}}if(191>=k){if(e=k-182,c=safeParseInt(b.slice(1,e).toString('hex'),16),f=b.slice(e,c+e),f.length<c)throw new Error('invalid RLP');return{data:f,remainder:b.slice(c+e)}}if(247>=k){for(c=k-191,g=b.slice(1,c);g.length;)h=_decode(g),j.push(h.data),g=h.remainder;return{data:j,remainder:b.slice(c)}}e=k-246,c=safeParseInt(b.slice(1,e).toString('hex'),16);var l=e+c;if(l>b.length)throw new Error('invalid rlp: total length is larger than the data');if(g=b.slice(e,l),0===g.length)throw new Error('invalid rlp, List has a invalid length');for(;g.length;)h=_decode(g),j.push(h.data),g=h.remainder;return{data:j,remainder:b.slice(l)}}function isHexPrefixed(b){return'0x'===b.slice(0,2)}// Removes 0x from a given String
function stripHexPrefix(b){return'string'==typeof b?isHexPrefixed(b)?b.slice(2):b:b}function intToHex(b){var c=b.toString(16);return c.length%2&&(c='0'+c),c}function padToEven(b){return b.length%2&&(b='0'+b),b}function intToBuffer(b){var c=intToHex(b);return new Buffer(c,'hex')}function toBuffer(b){if(!Buffer.isBuffer(b))if('string'==typeof b)b=isHexPrefixed(b)?new Buffer(padToEven(stripHexPrefix(b)),'hex'):new Buffer(b);else if('number'==typeof b)b=b?intToBuffer(b):new Buffer([]);else if(null===b||void 0===b)b=new Buffer([]);else if(b.toArray)b=new Buffer(b.toArray());else throw new Error('invalid type');return b}

}).call(this,require("buffer").Buffer)
},{"assert":1,"buffer":9}],64:[function(require,module,exports){
'use strict';module.exports=require('./lib')(require('./lib/elliptic'));

},{"./lib":68,"./lib/elliptic":67}],65:[function(require,module,exports){
(function (Buffer){
'use strict';var toString=Object.prototype.toString;// TypeError
exports.isArray=function(a,b){if(!Array.isArray(a))throw TypeError(b)},exports.isBoolean=function(a,b){if('[object Boolean]'!==toString.call(a))throw TypeError(b)},exports.isBuffer=function(a,b){if(!Buffer.isBuffer(a))throw TypeError(b)},exports.isFunction=function(a,b){if('[object Function]'!==toString.call(a))throw TypeError(b)},exports.isNumber=function(a,b){if('[object Number]'!==toString.call(a))throw TypeError(b)},exports.isObject=function(a,b){if('[object Object]'!==toString.call(a))throw TypeError(b)},exports.isBufferLength=function(a,b,c){if(a.length!==b)throw RangeError(c)},exports.isBufferLength2=function(a,b,c,d){if(a.length!==b&&a.length!==c)throw RangeError(d)},exports.isLengthGTZero=function(a,b){if(0===a.length)throw RangeError(b)},exports.isNumberInInterval=function(a,b,c,d){if(a<=b||a>=c)throw RangeError(d)};

}).call(this,{"isBuffer":require("../../is-buffer/index.js")})
},{"../../is-buffer/index.js":45}],66:[function(require,module,exports){
(function (Buffer){
'use strict';var bip66=require('bip66'),EC_PRIVKEY_EXPORT_DER_COMPRESSED=new Buffer([48,129,211,2,1,1,4,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,160,129,133,48,129,130,2,1,1,48,44,6,7,42,134,72,206,61,1,1,2,33,0,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,254,255,255,252,47,48,6,4,1,0,4,1,7,4,33,2,121,190,102,126,249,220,187,172,85,160,98,149,206,135,11,7,2,155,252,219,45,206,40,217,89,242,129,91,22,248,23,152,2,33,0,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,254,186,174,220,230,175,72,160,59,191,210,94,140,208,54,65,65,2,1,1,161,36,3,34,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),EC_PRIVKEY_EXPORT_DER_UNCOMPRESSED=new Buffer([48,130,1,19,2,1,1,4,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,160,129,165,48,129,162,2,1,1,48,44,6,7,42,134,72,206,61,1,1,2,33,0,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,254,255,255,252,47,48,6,4,1,0,4,1,7,4,65,4,121,190,102,126,249,220,187,172,85,160,98,149,206,135,11,7,2,155,252,219,45,206,40,217,89,242,129,91,22,248,23,152,72,58,218,119,38,163,196,101,93,164,251,252,14,17,8,168,253,23,180,72,166,133,84,25,156,71,208,143,251,16,212,184,2,33,0,255,255,255,255,255,255,255,255,255,255,255,255,255,255,255,254,186,174,220,230,175,72,160,59,191,210,94,140,208,54,65,65,2,1,1,161,68,3,66,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),ZERO_BUFFER_32=new Buffer([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);exports.privateKeyExport=function(a,b,c){var d=new Buffer(c?EC_PRIVKEY_EXPORT_DER_COMPRESSED:EC_PRIVKEY_EXPORT_DER_UNCOMPRESSED);return a.copy(d,c?8:9),b.copy(d,c?181:214),d},exports.privateKeyImport=function(a){var b=a.length,c=0;// sequence header
// sequence length
if(!(b<c+1||48!==a[c])&&(c+=1,!(b<c+1)&&128&a[c])){var d=127&a[c];if(c+=1,!(1>d||2<d)&&!(b<c+d)){var e=a[c+d-1]|(1<d?a[c+d-2]<<8:0);if(c+=d,!(b<c+e))// sequence element 0: version number (=1)
return b<c+3||2!==a[c]||1!==a[c+1]||1!==a[c+2]?void 0:(c+=3,b<c+2||4!==a[c]||32<a[c+1]||b<c+2+a[c+1]?void 0:a.slice(c+2,c+2+a[c+1]));// sequence element 1: octet string, up to 32 bytes
}}// sequence length constructor
},exports.signatureExport=function(a){var b=Buffer.concat([new Buffer([0]),a.r]);for(var c=33,d=0;1<c&&0===b[d]&&!(128&b[d+1]);--c,++d);var e=Buffer.concat([new Buffer([0]),a.s]);for(var f=33,g=0;1<f&&0===e[g]&&!(128&e[g+1]);--f,++g);return bip66.encode(b.slice(d),e.slice(g))},exports.signatureImport=function(a){var b=new Buffer(ZERO_BUFFER_32),c=new Buffer(ZERO_BUFFER_32);try{var d=bip66.decode(a);if(33===d.r.length&&0===d.r[0]&&(d.r=d.r.slice(1)),32<d.r.length)throw new Error('R length is too long');if(33===d.s.length&&0===d.s[0]&&(d.s=d.s.slice(1)),32<d.s.length)throw new Error('S length is too long')}catch(e){return}return d.r.copy(b,32-d.r.length),d.s.copy(c,32-d.s.length),{r:b,s:c}},exports.signatureImportLax=function(a){var b=new Buffer(ZERO_BUFFER_32),c=new Buffer(ZERO_BUFFER_32),d=a.length,e=0;// sequence tag byte
// length for r
// length for s
// ignore leading zeros in s
// copy s value
if(48===a[e++]){// sequence length byte
var f=a[e++];if(128&f&&(e+=f-128,e>d))return;// sequence tag byte for r
// sequence tag byte for s
// ignore leading zeros in r
// copy r value
if(2===a[e++]){var g=a[e++];if(128&g){if(f=g-128,e+f>d)return;for(;0<f&&0===a[e];e+=1,f-=1);for(g=0;0<f;e+=1,f-=1)g=(g<<8)+a[e]}if(!(g>d-e)){var h=e;if(e+=g,2===a[e++]){var i=a[e++];if(128&i){if(f=i-128,e+f>d)return;for(;0<f&&0===a[e];e+=1,f-=1);for(i=0;0<f;e+=1,f-=1)i=(i<<8)+a[e]}if(!(i>d-e)){var j=e;for(e+=i;0<g&&0===a[h];g-=1,h+=1);if(!(32<g)){var k=a.slice(h,h+g);for(k.copy(b,32-k.length);0<i&&0===a[j];i-=1,j+=1);if(!(32<i)){var l=a.slice(j,j+i);return l.copy(c,32-l.length),{r:b,s:c}}}}}}}}};

}).call(this,require("buffer").Buffer)
},{"bip66":3,"buffer":9}],67:[function(require,module,exports){
(function (Buffer){
'use strict';var createHash=require('create-hash'),BN=require('bn.js'),EC=require('elliptic').ec,messages=require('../messages.json'),ec=new EC('secp256k1'),ecparams=ec.curve;function loadCompressedPublicKey(a,b){var c=new BN(b);// overflow
if(0<=c.cmp(ecparams.p))return null;c=c.toRed(ecparams.red);// compute corresponding Y
var e=c.redSqr().redIMul(c).redIAdd(ecparams.b).redSqrt();return 3===a!==e.isOdd()&&(e=e.redNeg()),ec.keyPair({pub:{x:c,y:e}})}function loadUncompressedPublicKey(a,b,c){var e=new BN(b),f=new BN(c);// overflow
if(0<=e.cmp(ecparams.p)||0<=f.cmp(ecparams.p))return null;// is odd flag
if(e=e.toRed(ecparams.red),f=f.toRed(ecparams.red),(6===a||7===a)&&f.isOdd()!==(7===a))return null;// x*x*x + b = y*y
var g=e.redSqr().redIMul(e);return f.redSqr().redISub(g.redIAdd(ecparams.b)).isZero()?ec.keyPair({pub:{x:e,y:f}}):null}function loadPublicKey(a){var b=a[0];return 2===b||3===b?33===a.length?loadCompressedPublicKey(b,a.slice(1,33)):null:4===b||6===b||7===b?65===a.length?loadUncompressedPublicKey(b,a.slice(1,33),a.slice(33,65)):null:null}exports.privateKeyVerify=function(a){var b=new BN(a);return 0>b.cmp(ecparams.n)&&!b.isZero()},exports.privateKeyExport=function(a,b){var c=new BN(a);if(0<=c.cmp(ecparams.n)||c.isZero())throw new Error(messages.EC_PRIVATE_KEY_EXPORT_DER_FAIL);return new Buffer(ec.keyFromPrivate(a).getPublic(b,!0))},exports.privateKeyTweakAdd=function(a,b){var c=new BN(b);if(0<=c.cmp(ecparams.n))throw new Error(messages.EC_PRIVATE_KEY_TWEAK_ADD_FAIL);if(c.iadd(new BN(a)),0<=c.cmp(ecparams.n)&&c.isub(ecparams.n),c.isZero())throw new Error(messages.EC_PRIVATE_KEY_TWEAK_ADD_FAIL);return c.toArrayLike(Buffer,'be',32)},exports.privateKeyTweakMul=function(a,b){var c=new BN(b);if(0<=c.cmp(ecparams.n)||c.isZero())throw new Error(messages.EC_PRIVATE_KEY_TWEAK_MUL_FAIL);return c.imul(new BN(a)),c.cmp(ecparams.n)&&(c=c.umod(ecparams.n)),c.toArrayLike(Buffer,'be',32)},exports.publicKeyCreate=function(a,b){var c=new BN(a);if(0<=c.cmp(ecparams.n)||c.isZero())throw new Error(messages.EC_PUBLIC_KEY_CREATE_FAIL);return new Buffer(ec.keyFromPrivate(a).getPublic(b,!0))},exports.publicKeyConvert=function(a,b){var c=loadPublicKey(a);if(null===c)throw new Error(messages.EC_PUBLIC_KEY_PARSE_FAIL);return new Buffer(c.getPublic(b,!0))},exports.publicKeyVerify=function(a){return null!==loadPublicKey(a)},exports.publicKeyTweakAdd=function(a,b,c){var e=loadPublicKey(a);if(null===e)throw new Error(messages.EC_PUBLIC_KEY_PARSE_FAIL);if(b=new BN(b),0<=b.cmp(ecparams.n))throw new Error(messages.EC_PUBLIC_KEY_TWEAK_ADD_FAIL);return new Buffer(ecparams.g.mul(b).add(e.pub).encode(!0,c))},exports.publicKeyTweakMul=function(a,b,c){var e=loadPublicKey(a);if(null===e)throw new Error(messages.EC_PUBLIC_KEY_PARSE_FAIL);if(b=new BN(b),0<=b.cmp(ecparams.n)||b.isZero())throw new Error(messages.EC_PUBLIC_KEY_TWEAK_MUL_FAIL);return new Buffer(e.pub.mul(b).encode(!0,c))},exports.publicKeyCombine=function(a,b){var c=Array(a.length);for(var e=0;e<a.length;++e)if(c[e]=loadPublicKey(a[e]),null===c[e])throw new Error(messages.EC_PUBLIC_KEY_PARSE_FAIL);var f=c[0].pub;for(var g=1;g<c.length;++g)f=f.add(c[g].pub);if(f.isInfinity())throw new Error(messages.EC_PUBLIC_KEY_COMBINE_FAIL);return new Buffer(f.encode(!0,b))},exports.signatureNormalize=function(a){var b=new BN(a.slice(0,32)),c=new BN(a.slice(32,64));if(0<=b.cmp(ecparams.n)||0<=c.cmp(ecparams.n))throw new Error(messages.ECDSA_SIGNATURE_PARSE_FAIL);var e=new Buffer(a);return 1===c.cmp(ec.nh)&&ecparams.n.sub(c).toArrayLike(Buffer,'be',32).copy(e,32),e},exports.signatureExport=function(a){var b=a.slice(0,32),c=a.slice(32,64);if(0<=new BN(b).cmp(ecparams.n)||0<=new BN(c).cmp(ecparams.n))throw new Error(messages.ECDSA_SIGNATURE_PARSE_FAIL);return{r:b,s:c}},exports.signatureImport=function(a){var b=new BN(a.r);0<=b.cmp(ecparams.n)&&(b=new BN(0));var c=new BN(a.s);return 0<=c.cmp(ecparams.n)&&(c=new BN(0)),Buffer.concat([b.toArrayLike(Buffer,'be',32),c.toArrayLike(Buffer,'be',32)])},exports.sign=function(a,b,c,e){if('function'==typeof c){var f=c;c=function c(k){var l=f(a,b,null,e,k);if(!Buffer.isBuffer(l)||32!==l.length)throw new Error(messages.ECDSA_SIGN_FAIL);return new BN(l)}}var g=new BN(b);if(0<=g.cmp(ecparams.n)||g.isZero())throw new Error(messages.ECDSA_SIGN_FAIL);var h=ec.sign(a,b,{canonical:!0,k:c,pers:e});return{signature:Buffer.concat([h.r.toArrayLike(Buffer,'be',32),h.s.toArrayLike(Buffer,'be',32)]),recovery:h.recoveryParam}},exports.verify=function(a,b,c){var e={r:b.slice(0,32),s:b.slice(32,64)},f=new BN(e.r),g=new BN(e.s);if(0<=f.cmp(ecparams.n)||0<=g.cmp(ecparams.n))throw new Error(messages.ECDSA_SIGNATURE_PARSE_FAIL);if(1===g.cmp(ec.nh)||f.isZero()||g.isZero())return!1;var h=loadPublicKey(c);if(null===h)throw new Error(messages.EC_PUBLIC_KEY_PARSE_FAIL);return ec.verify(a,e,{x:h.pub.x,y:h.pub.y})},exports.recover=function(a,b,c,e){var f={r:b.slice(0,32),s:b.slice(32,64)},g=new BN(f.r),h=new BN(f.s);if(0<=g.cmp(ecparams.n)||0<=h.cmp(ecparams.n))throw new Error(messages.ECDSA_SIGNATURE_PARSE_FAIL);try{if(g.isZero()||h.isZero())throw new Error;var k=ec.recoverPubKey(a,f,c);return new Buffer(k.encode(!0,e))}catch(l){throw new Error(messages.ECDSA_RECOVER_FAIL)}},exports.ecdh=function(a,b){var c=exports.ecdhUnsafe(a,b,!0);return createHash('sha256').update(c).digest()},exports.ecdhUnsafe=function(a,b,c){var e=loadPublicKey(a);if(null===e)throw new Error(messages.EC_PUBLIC_KEY_PARSE_FAIL);var f=new BN(b);if(0<=f.cmp(ecparams.n)||f.isZero())throw new Error(messages.ECDH_FAIL);return new Buffer(e.pub.mul(f).encode(!0,c))};

}).call(this,require("buffer").Buffer)
},{"../messages.json":69,"bn.js":4,"buffer":9,"create-hash":12,"elliptic":15}],68:[function(require,module,exports){
'use strict';var assert=require('./assert'),der=require('./der'),messages=require('./messages.json');function initCompressedValue(a,b){return void 0===a?b:(assert.isBoolean(a,messages.COMPRESSED_TYPE_INVALID),a)}module.exports=function(a){return{privateKeyVerify:function privateKeyVerify(b){return assert.isBuffer(b,messages.EC_PRIVATE_KEY_TYPE_INVALID),32===b.length&&a.privateKeyVerify(b)},privateKeyExport:function privateKeyExport(b,c){assert.isBuffer(b,messages.EC_PRIVATE_KEY_TYPE_INVALID),assert.isBufferLength(b,32,messages.EC_PRIVATE_KEY_LENGTH_INVALID),c=initCompressedValue(c,!0);var d=a.privateKeyExport(b,c);return der.privateKeyExport(b,d,c)},privateKeyImport:function privateKeyImport(b){if(assert.isBuffer(b,messages.EC_PRIVATE_KEY_TYPE_INVALID),b=der.privateKeyImport(b),b&&32===b.length&&a.privateKeyVerify(b))return b;throw new Error(messages.EC_PRIVATE_KEY_IMPORT_DER_FAIL)},privateKeyTweakAdd:function privateKeyTweakAdd(b,c){return assert.isBuffer(b,messages.EC_PRIVATE_KEY_TYPE_INVALID),assert.isBufferLength(b,32,messages.EC_PRIVATE_KEY_LENGTH_INVALID),assert.isBuffer(c,messages.TWEAK_TYPE_INVALID),assert.isBufferLength(c,32,messages.TWEAK_LENGTH_INVALID),a.privateKeyTweakAdd(b,c)},privateKeyTweakMul:function privateKeyTweakMul(b,c){return assert.isBuffer(b,messages.EC_PRIVATE_KEY_TYPE_INVALID),assert.isBufferLength(b,32,messages.EC_PRIVATE_KEY_LENGTH_INVALID),assert.isBuffer(c,messages.TWEAK_TYPE_INVALID),assert.isBufferLength(c,32,messages.TWEAK_LENGTH_INVALID),a.privateKeyTweakMul(b,c)},publicKeyCreate:function publicKeyCreate(b,c){return assert.isBuffer(b,messages.EC_PRIVATE_KEY_TYPE_INVALID),assert.isBufferLength(b,32,messages.EC_PRIVATE_KEY_LENGTH_INVALID),c=initCompressedValue(c,!0),a.publicKeyCreate(b,c)},publicKeyConvert:function publicKeyConvert(b,c){return assert.isBuffer(b,messages.EC_PUBLIC_KEY_TYPE_INVALID),assert.isBufferLength2(b,33,65,messages.EC_PUBLIC_KEY_LENGTH_INVALID),c=initCompressedValue(c,!0),a.publicKeyConvert(b,c)},publicKeyVerify:function publicKeyVerify(b){return assert.isBuffer(b,messages.EC_PUBLIC_KEY_TYPE_INVALID),a.publicKeyVerify(b)},publicKeyTweakAdd:function publicKeyTweakAdd(b,c,d){return assert.isBuffer(b,messages.EC_PUBLIC_KEY_TYPE_INVALID),assert.isBufferLength2(b,33,65,messages.EC_PUBLIC_KEY_LENGTH_INVALID),assert.isBuffer(c,messages.TWEAK_TYPE_INVALID),assert.isBufferLength(c,32,messages.TWEAK_LENGTH_INVALID),d=initCompressedValue(d,!0),a.publicKeyTweakAdd(b,c,d)},publicKeyTweakMul:function publicKeyTweakMul(b,c,d){return assert.isBuffer(b,messages.EC_PUBLIC_KEY_TYPE_INVALID),assert.isBufferLength2(b,33,65,messages.EC_PUBLIC_KEY_LENGTH_INVALID),assert.isBuffer(c,messages.TWEAK_TYPE_INVALID),assert.isBufferLength(c,32,messages.TWEAK_LENGTH_INVALID),d=initCompressedValue(d,!0),a.publicKeyTweakMul(b,c,d)},publicKeyCombine:function publicKeyCombine(b,c){assert.isArray(b,messages.EC_PUBLIC_KEYS_TYPE_INVALID),assert.isLengthGTZero(b,messages.EC_PUBLIC_KEYS_LENGTH_INVALID);for(var d=0;d<b.length;++d)assert.isBuffer(b[d],messages.EC_PUBLIC_KEY_TYPE_INVALID),assert.isBufferLength2(b[d],33,65,messages.EC_PUBLIC_KEY_LENGTH_INVALID);return c=initCompressedValue(c,!0),a.publicKeyCombine(b,c)},signatureNormalize:function signatureNormalize(b){return assert.isBuffer(b,messages.ECDSA_SIGNATURE_TYPE_INVALID),assert.isBufferLength(b,64,messages.ECDSA_SIGNATURE_LENGTH_INVALID),a.signatureNormalize(b)},signatureExport:function signatureExport(b){assert.isBuffer(b,messages.ECDSA_SIGNATURE_TYPE_INVALID),assert.isBufferLength(b,64,messages.ECDSA_SIGNATURE_LENGTH_INVALID);var c=a.signatureExport(b);return der.signatureExport(c)},signatureImport:function signatureImport(b){assert.isBuffer(b,messages.ECDSA_SIGNATURE_TYPE_INVALID),assert.isLengthGTZero(b,messages.ECDSA_SIGNATURE_LENGTH_INVALID);var c=der.signatureImport(b);if(c)return a.signatureImport(c);throw new Error(messages.ECDSA_SIGNATURE_PARSE_DER_FAIL)},signatureImportLax:function signatureImportLax(b){assert.isBuffer(b,messages.ECDSA_SIGNATURE_TYPE_INVALID),assert.isLengthGTZero(b,messages.ECDSA_SIGNATURE_LENGTH_INVALID);var c=der.signatureImportLax(b);if(c)return a.signatureImport(c);throw new Error(messages.ECDSA_SIGNATURE_PARSE_DER_FAIL)},sign:function sign(b,c,d){assert.isBuffer(b,messages.MSG32_TYPE_INVALID),assert.isBufferLength(b,32,messages.MSG32_LENGTH_INVALID),assert.isBuffer(c,messages.EC_PRIVATE_KEY_TYPE_INVALID),assert.isBufferLength(c,32,messages.EC_PRIVATE_KEY_LENGTH_INVALID);var e=null,f=null;return void 0!==d&&(assert.isObject(d,messages.OPTIONS_TYPE_INVALID),void 0!==d.data&&(assert.isBuffer(d.data,messages.OPTIONS_DATA_TYPE_INVALID),assert.isBufferLength(d.data,32,messages.OPTIONS_DATA_LENGTH_INVALID),e=d.data),void 0!==d.noncefn&&(assert.isFunction(d.noncefn,messages.OPTIONS_NONCEFN_TYPE_INVALID),f=d.noncefn)),a.sign(b,c,f,e)},verify:function verify(b,c,d){return assert.isBuffer(b,messages.MSG32_TYPE_INVALID),assert.isBufferLength(b,32,messages.MSG32_LENGTH_INVALID),assert.isBuffer(c,messages.ECDSA_SIGNATURE_TYPE_INVALID),assert.isBufferLength(c,64,messages.ECDSA_SIGNATURE_LENGTH_INVALID),assert.isBuffer(d,messages.EC_PUBLIC_KEY_TYPE_INVALID),assert.isBufferLength2(d,33,65,messages.EC_PUBLIC_KEY_LENGTH_INVALID),a.verify(b,c,d)},recover:function recover(b,c,d,e){return assert.isBuffer(b,messages.MSG32_TYPE_INVALID),assert.isBufferLength(b,32,messages.MSG32_LENGTH_INVALID),assert.isBuffer(c,messages.ECDSA_SIGNATURE_TYPE_INVALID),assert.isBufferLength(c,64,messages.ECDSA_SIGNATURE_LENGTH_INVALID),assert.isNumber(d,messages.RECOVERY_ID_TYPE_INVALID),assert.isNumberInInterval(d,-1,4,messages.RECOVERY_ID_VALUE_INVALID),e=initCompressedValue(e,!0),a.recover(b,c,d,e)},ecdh:function ecdh(b,c){return assert.isBuffer(b,messages.EC_PUBLIC_KEY_TYPE_INVALID),assert.isBufferLength2(b,33,65,messages.EC_PUBLIC_KEY_LENGTH_INVALID),assert.isBuffer(c,messages.EC_PRIVATE_KEY_TYPE_INVALID),assert.isBufferLength(c,32,messages.EC_PRIVATE_KEY_LENGTH_INVALID),a.ecdh(b,c)},ecdhUnsafe:function ecdhUnsafe(b,c,d){return assert.isBuffer(b,messages.EC_PUBLIC_KEY_TYPE_INVALID),assert.isBufferLength2(b,33,65,messages.EC_PUBLIC_KEY_LENGTH_INVALID),assert.isBuffer(c,messages.EC_PRIVATE_KEY_TYPE_INVALID),assert.isBufferLength(c,32,messages.EC_PRIVATE_KEY_LENGTH_INVALID),d=initCompressedValue(d,!0),a.ecdhUnsafe(b,c,d)}}};

},{"./assert":65,"./der":66,"./messages.json":69}],69:[function(require,module,exports){
module.exports={
  "COMPRESSED_TYPE_INVALID": "compressed should be a boolean",
  "EC_PRIVATE_KEY_TYPE_INVALID": "private key should be a Buffer",
  "EC_PRIVATE_KEY_LENGTH_INVALID": "private key length is invalid",
  "EC_PRIVATE_KEY_TWEAK_ADD_FAIL": "tweak out of range or resulting private key is invalid",
  "EC_PRIVATE_KEY_TWEAK_MUL_FAIL": "tweak out of range",
  "EC_PRIVATE_KEY_EXPORT_DER_FAIL": "couldn't export to DER format",
  "EC_PRIVATE_KEY_IMPORT_DER_FAIL": "couldn't import from DER format",
  "EC_PUBLIC_KEYS_TYPE_INVALID": "public keys should be an Array",
  "EC_PUBLIC_KEYS_LENGTH_INVALID": "public keys Array should have at least 1 element",
  "EC_PUBLIC_KEY_TYPE_INVALID": "public key should be a Buffer",
  "EC_PUBLIC_KEY_LENGTH_INVALID": "public key length is invalid",
  "EC_PUBLIC_KEY_PARSE_FAIL": "the public key could not be parsed or is invalid",
  "EC_PUBLIC_KEY_CREATE_FAIL": "private was invalid, try again",
  "EC_PUBLIC_KEY_TWEAK_ADD_FAIL": "tweak out of range or resulting public key is invalid",
  "EC_PUBLIC_KEY_TWEAK_MUL_FAIL": "tweak out of range",
  "EC_PUBLIC_KEY_COMBINE_FAIL": "the sum of the public keys is not valid",
  "ECDH_FAIL": "scalar was invalid (zero or overflow)",
  "ECDSA_SIGNATURE_TYPE_INVALID": "signature should be a Buffer",
  "ECDSA_SIGNATURE_LENGTH_INVALID": "signature length is invalid",
  "ECDSA_SIGNATURE_PARSE_FAIL": "couldn't parse signature",
  "ECDSA_SIGNATURE_PARSE_DER_FAIL": "couldn't parse DER signature",
  "ECDSA_SIGNATURE_SERIALIZE_DER_FAIL": "couldn't serialize signature to DER format",
  "ECDSA_SIGN_FAIL": "nonce generation function failed or private key is invalid",
  "ECDSA_RECOVER_FAIL": "couldn't recover public key from signature",
  "MSG32_TYPE_INVALID": "message should be a Buffer",
  "MSG32_LENGTH_INVALID": "message length is invalid",
  "OPTIONS_TYPE_INVALID": "options should be an Object",
  "OPTIONS_DATA_TYPE_INVALID": "options.data should be a Buffer",
  "OPTIONS_DATA_LENGTH_INVALID": "options.data length is invalid",
  "OPTIONS_NONCEFN_TYPE_INVALID": "options.noncefn should be a Function",
  "RECOVERY_ID_TYPE_INVALID": "recovery should be a Number",
  "RECOVERY_ID_VALUE_INVALID": "recovery should have value between -1 and 4",
  "TWEAK_TYPE_INVALID": "tweak should be a Buffer",
  "TWEAK_LENGTH_INVALID": "tweak length is invalid"
}

},{}],70:[function(require,module,exports){
(function (Buffer){
'use strict';// prototype class for hash functions
function Hash(a,b){this._block=new Buffer(a),this._finalSize=b,this._blockSize=a,this._len=0,this._s=0}Hash.prototype.update=function(a,b){'string'==typeof a&&(b=b||'utf8',a=new Buffer(a,b));for(var c=this._len+=a.length,d=this._s||0,e=0,g=this._block;d<c;){var h=Math.min(a.length,e+this._blockSize-d%this._blockSize),j=h-e;for(var k=0;k<j;k++)g[d%this._blockSize+k]=a[k+e];d+=j,e+=j,0==d%this._blockSize&&this._update(g)}return this._s=d,this},Hash.prototype.digest=function(a){// Suppose the length of the message M, in bits, is l
var b=8*this._len;// Append the bit 1 to the end of the message
this._block[this._len%this._blockSize]=128,this._block.fill(0,this._len%this._blockSize+1),b%(8*this._blockSize)>=8*this._finalSize&&(this._update(this._block),this._block.fill(0)),this._block.writeInt32BE(b,this._blockSize-4);var c=this._update(this._block)||this._hash();return a?c.toString(a):c},Hash.prototype._update=function(){throw new Error('_update must be implemented by subclass')},module.exports=Hash;

}).call(this,require("buffer").Buffer)
},{"buffer":9}],71:[function(require,module,exports){
'use strict';var _exports=module.exports=function(b){b=b.toLowerCase();var c=_exports[b];if(!c)throw new Error(b+' is not supported (we accept pull requests)');return new c};_exports.sha=require('./sha'),_exports.sha1=require('./sha1'),_exports.sha224=require('./sha224'),_exports.sha256=require('./sha256'),_exports.sha384=require('./sha384'),_exports.sha512=require('./sha512');

},{"./sha":72,"./sha1":73,"./sha224":74,"./sha256":75,"./sha384":76,"./sha512":77}],72:[function(require,module,exports){
(function (Buffer){
'use strict';/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-0, as defined
 * in FIPS PUB 180-1
 * This source code is derived from sha1.js of the same repository.
 * The difference between SHA-0 and SHA-1 is just a bitwise rotate left
 * operation was added.
 */var inherits=require('inherits'),Hash=require('./hash'),K=[1518500249,1859775393,-1894007588,-899497514],W=Array(80);function Sha(){this.init(),this._w=W,Hash.call(this,64,56)}inherits(Sha,Hash),Sha.prototype.init=function(){return this._a=1732584193,this._b=4023233417,this._c=2562383102,this._d=271733878,this._e=3285377520,this};function rotl5(f){return f<<5|f>>>27}function rotl30(f){return f<<30|f>>>2}function ft(f,g,h,k){return 0===f?g&h|~g&k:2===f?g&h|g&k|h&k:g^h^k}Sha.prototype._update=function(f){var g=this._w,h=0|this._a,k=0|this._b,l=0|this._c,m=0|this._d,n=0|this._e;for(var o=0;16>o;++o)g[o]=f.readInt32BE(4*o);for(;80>o;++o)g[o]=g[o-3]^g[o-8]^g[o-14]^g[o-16];for(var p=0;80>p;++p){var q=~~(p/20),r=0|rotl5(h)+ft(q,k,l,m)+n+g[p]+K[q];n=m,m=l,l=rotl30(k),k=h,h=r}this._a=0|h+this._a,this._b=0|k+this._b,this._c=0|l+this._c,this._d=0|m+this._d,this._e=0|n+this._e},Sha.prototype._hash=function(){var f=new Buffer(20);return f.writeInt32BE(0|this._a,0),f.writeInt32BE(0|this._b,4),f.writeInt32BE(0|this._c,8),f.writeInt32BE(0|this._d,12),f.writeInt32BE(0|this._e,16),f},module.exports=Sha;

}).call(this,require("buffer").Buffer)
},{"./hash":70,"buffer":9,"inherits":44}],73:[function(require,module,exports){
(function (Buffer){
'use strict';/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */var inherits=require('inherits'),Hash=require('./hash'),K=[1518500249,1859775393,-1894007588,-899497514],W=Array(80);function Sha1(){this.init(),this._w=W,Hash.call(this,64,56)}inherits(Sha1,Hash),Sha1.prototype.init=function(){return this._a=1732584193,this._b=4023233417,this._c=2562383102,this._d=271733878,this._e=3285377520,this};function rotl1(f){return f<<1|f>>>31}function rotl5(f){return f<<5|f>>>27}function rotl30(f){return f<<30|f>>>2}function ft(f,g,h,k){return 0===f?g&h|~g&k:2===f?g&h|g&k|h&k:g^h^k}Sha1.prototype._update=function(f){var g=this._w,h=0|this._a,k=0|this._b,l=0|this._c,m=0|this._d,n=0|this._e;for(var o=0;16>o;++o)g[o]=f.readInt32BE(4*o);for(;80>o;++o)g[o]=rotl1(g[o-3]^g[o-8]^g[o-14]^g[o-16]);for(var p=0;80>p;++p){var q=~~(p/20),r=0|rotl5(h)+ft(q,k,l,m)+n+g[p]+K[q];n=m,m=l,l=rotl30(k),k=h,h=r}this._a=0|h+this._a,this._b=0|k+this._b,this._c=0|l+this._c,this._d=0|m+this._d,this._e=0|n+this._e},Sha1.prototype._hash=function(){var f=new Buffer(20);return f.writeInt32BE(0|this._a,0),f.writeInt32BE(0|this._b,4),f.writeInt32BE(0|this._c,8),f.writeInt32BE(0|this._d,12),f.writeInt32BE(0|this._e,16),f},module.exports=Sha1;

}).call(this,require("buffer").Buffer)
},{"./hash":70,"buffer":9,"inherits":44}],74:[function(require,module,exports){
(function (Buffer){
'use strict';/**
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
 * in FIPS 180-2
 * Version 2.2-beta Copyright Angel Marin, Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 *
 */var inherits=require('inherits'),Sha256=require('./sha256'),Hash=require('./hash'),W=Array(64);function Sha224(){this.init(),this._w=W,Hash.call(this,64,56)}inherits(Sha224,Sha256),Sha224.prototype.init=function(){return this._a=3238371032,this._b=914150663,this._c=812702999,this._d=4144912697,this._e=4290775857,this._f=1750603025,this._g=1694076839,this._h=3204075428,this},Sha224.prototype._hash=function(){var a=new Buffer(28);return a.writeInt32BE(this._a,0),a.writeInt32BE(this._b,4),a.writeInt32BE(this._c,8),a.writeInt32BE(this._d,12),a.writeInt32BE(this._e,16),a.writeInt32BE(this._f,20),a.writeInt32BE(this._g,24),a},module.exports=Sha224;

}).call(this,require("buffer").Buffer)
},{"./hash":70,"./sha256":75,"buffer":9,"inherits":44}],75:[function(require,module,exports){
(function (Buffer){
'use strict';/**
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
 * in FIPS 180-2
 * Version 2.2-beta Copyright Angel Marin, Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 *
 */var inherits=require('inherits'),Hash=require('./hash'),K=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298],W=Array(64);function Sha256(){this.init(),this._w=W,Hash.call(this,64,56)}inherits(Sha256,Hash),Sha256.prototype.init=function(){return this._a=1779033703,this._b=3144134277,this._c=1013904242,this._d=2773480762,this._e=1359893119,this._f=2600822924,this._g=528734635,this._h=1541459225,this};function ch(k,l,m){return m^k&(l^m)}function maj(k,l,m){return k&l|m&(k|l)}function sigma0(k){return(k>>>2|k<<30)^(k>>>13|k<<19)^(k>>>22|k<<10)}function sigma1(k){return(k>>>6|k<<26)^(k>>>11|k<<21)^(k>>>25|k<<7)}function gamma0(k){return(k>>>7|k<<25)^(k>>>18|k<<14)^k>>>3}function gamma1(k){return(k>>>17|k<<15)^(k>>>19|k<<13)^k>>>10}Sha256.prototype._update=function(k){var l=this._w,m=0|this._a,n=0|this._b,o=0|this._c,p=0|this._d,q=0|this._e,r=0|this._f,s=0|this._g,t=0|this._h;for(var u=0;16>u;++u)l[u]=k.readInt32BE(4*u);for(;64>u;++u)l[u]=0|gamma1(l[u-2])+l[u-7]+gamma0(l[u-15])+l[u-16];for(var v=0;64>v;++v){var w=0|t+sigma1(q)+ch(q,r,s)+K[v]+l[v],A=0|sigma0(m)+maj(m,n,o);t=s,s=r,r=q,q=0|p+w,p=o,o=n,n=m,m=0|w+A}this._a=0|m+this._a,this._b=0|n+this._b,this._c=0|o+this._c,this._d=0|p+this._d,this._e=0|q+this._e,this._f=0|r+this._f,this._g=0|s+this._g,this._h=0|t+this._h},Sha256.prototype._hash=function(){var k=new Buffer(32);return k.writeInt32BE(this._a,0),k.writeInt32BE(this._b,4),k.writeInt32BE(this._c,8),k.writeInt32BE(this._d,12),k.writeInt32BE(this._e,16),k.writeInt32BE(this._f,20),k.writeInt32BE(this._g,24),k.writeInt32BE(this._h,28),k},module.exports=Sha256;

}).call(this,require("buffer").Buffer)
},{"./hash":70,"buffer":9,"inherits":44}],76:[function(require,module,exports){
(function (Buffer){
'use strict';var inherits=require('inherits'),SHA512=require('./sha512'),Hash=require('./hash'),W=Array(160);function Sha384(){this.init(),this._w=W,Hash.call(this,128,112)}inherits(Sha384,SHA512),Sha384.prototype.init=function(){return this._ah=3418070365,this._bh=1654270250,this._ch=2438529370,this._dh=355462360,this._eh=1731405415,this._fh=2394180231,this._gh=3675008525,this._hh=1203062813,this._al=3238371032,this._bl=914150663,this._cl=812702999,this._dl=4144912697,this._el=4290775857,this._fl=1750603025,this._gl=1694076839,this._hl=3204075428,this},Sha384.prototype._hash=function(){function a(c,d,e){b.writeInt32BE(c,e),b.writeInt32BE(d,e+4)}var b=new Buffer(48);return a(this._ah,this._al,0),a(this._bh,this._bl,8),a(this._ch,this._cl,16),a(this._dh,this._dl,24),a(this._eh,this._el,32),a(this._fh,this._fl,40),b},module.exports=Sha384;

}).call(this,require("buffer").Buffer)
},{"./hash":70,"./sha512":77,"buffer":9,"inherits":44}],77:[function(require,module,exports){
(function (Buffer){
'use strict';var inherits=require('inherits'),Hash=require('./hash'),K=[1116352408,3609767458,1899447441,602891725,3049323471,3964484399,3921009573,2173295548,961987163,4081628472,1508970993,3053834265,2453635748,2937671579,2870763221,3664609560,3624381080,2734883394,310598401,1164996542,607225278,1323610764,1426881987,3590304994,1925078388,4068182383,2162078206,991336113,2614888103,633803317,3248222580,3479774868,3835390401,2666613458,4022224774,944711139,264347078,2341262773,604807628,2007800933,770255983,1495990901,1249150122,1856431235,1555081692,3175218132,1996064986,2198950837,2554220882,3999719339,2821834349,766784016,2952996808,2566594879,3210313671,3203337956,3336571891,1034457026,3584528711,2466948901,113926993,3758326383,338241895,168717936,666307205,1188179964,773529912,1546045734,1294757372,1522805485,1396182291,2643833823,1695183700,2343527390,1986661051,1014477480,2177026350,1206759142,2456956037,344077627,2730485921,1290863460,2820302411,3158454273,3259730800,3505952657,3345764771,106217008,3516065817,3606008344,3600352804,1432725776,4094571909,1467031594,275423344,851169720,430227734,3100823752,506948616,1363258195,659060556,3750685593,883997877,3785050280,958139571,3318307427,1322822218,3812723403,1537002063,2003034995,1747873779,3602036899,1955562222,1575990012,2024104815,1125592928,2227730452,2716904306,2361852424,442776044,2428436474,593698344,2756734187,3733110249,3204031479,2999351573,3329325298,3815920427,3391569614,3928383900,3515267271,566280711,3940187606,3454069534,4118630271,4000239992,116418474,1914138554,174292421,2731055270,289380356,3203993006,460393269,320620315,685471733,587496836,852142971,1086792851,1017036298,365543100,1126000580,2618297676,1288033470,3409855158,1501505948,4234509866,1607167915,987167468,1816402316,1246189591],W=Array(160);function Sha512(){this.init(),this._w=W,Hash.call(this,128,112)}inherits(Sha512,Hash),Sha512.prototype.init=function(){return this._ah=1779033703,this._bh=3144134277,this._ch=1013904242,this._dh=2773480762,this._eh=1359893119,this._fh=2600822924,this._gh=528734635,this._hh=1541459225,this._al=4089235720,this._bl=2227873595,this._cl=4271175723,this._dl=1595750129,this._el=2917565137,this._fl=725511199,this._gl=4215389547,this._hl=327033209,this};function Ch(c,d,e){return e^c&(d^e)}function maj(c,d,e){return c&d|e&(c|d)}function sigma0(c,d){return(c>>>28|d<<4)^(d>>>2|c<<30)^(d>>>7|c<<25)}function sigma1(c,d){return(c>>>14|d<<18)^(c>>>18|d<<14)^(d>>>9|c<<23)}function Gamma0(c,d){return(c>>>1|d<<31)^(c>>>8|d<<24)^c>>>7}function Gamma0l(c,d){return(c>>>1|d<<31)^(c>>>8|d<<24)^(c>>>7|d<<25)}function Gamma1(c,d){return(c>>>19|d<<13)^(d>>>29|c<<3)^c>>>6}function Gamma1l(c,d){return(c>>>19|d<<13)^(d>>>29|c<<3)^(c>>>6|d<<26)}function getCarry(c,d){return c>>>0<d>>>0?1:0}Sha512.prototype._update=function(c){var d=this._w,e=0|this._ah,f=0|this._bh,g=0|this._ch,k=0|this._dh,m=0|this._eh,n=0|this._fh,o=0|this._gh,p=0|this._hh,q=0|this._al,r=0|this._bl,s=0|this._cl,t=0|this._dl,u=0|this._el,v=0|this._fl,w=0|this._gl,A=0|this._hl;for(var B=0;32>B;B+=2)d[B]=c.readInt32BE(4*B),d[B+1]=c.readInt32BE(4*B+4);for(;160>B;B+=2){var C=d[B-30],D=d[B-30+1],E=Gamma0(C,D),F=Gamma0l(D,C);C=d[B-4],D=d[B-4+1];var G=Gamma1(C,D),I=Gamma1l(D,C),J=d[B-14],L=d[B-14+1],N=d[B-32],O=d[B-32+1],P=0|F+L,Q=0|E+J+getCarry(P,F);// W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16]
P=0|P+I,Q=0|Q+G+getCarry(P,I),P=0|P+O,Q=0|Q+N+getCarry(P,O),d[B]=Q,d[B+1]=P}for(var R=0;160>R;R+=2){Q=d[R],P=d[R+1];var S=maj(e,f,g),T=maj(q,r,s),U=sigma0(e,q),V=sigma0(q,e),X=sigma1(m,u),Y=sigma1(u,m),Z=K[R],$=K[R+1],_=Ch(m,n,o),aa=Ch(u,v,w),ba=0|A+Y,ca=0|p+X+getCarry(ba,A);// t1 = h + sigma1 + ch + K[j] + W[j]
ba=0|ba+aa,ca=0|ca+_+getCarry(ba,aa),ba=0|ba+$,ca=0|ca+Z+getCarry(ba,$),ba=0|ba+P,ca=0|ca+Q+getCarry(ba,P);// t2 = sigma0 + maj
var da=0|V+T,ea=0|U+S+getCarry(da,V);p=o,A=w,o=n,w=v,n=m,v=u,u=0|t+ba,m=0|k+ca+getCarry(u,t),k=g,t=s,g=f,s=r,f=e,r=q,q=0|ba+da,e=0|ca+ea+getCarry(q,ba)}this._al=0|this._al+q,this._bl=0|this._bl+r,this._cl=0|this._cl+s,this._dl=0|this._dl+t,this._el=0|this._el+u,this._fl=0|this._fl+v,this._gl=0|this._gl+w,this._hl=0|this._hl+A,this._ah=0|this._ah+e+getCarry(this._al,q),this._bh=0|this._bh+f+getCarry(this._bl,r),this._ch=0|this._ch+g+getCarry(this._cl,s),this._dh=0|this._dh+k+getCarry(this._dl,t),this._eh=0|this._eh+m+getCarry(this._el,u),this._fh=0|this._fh+n+getCarry(this._fl,v),this._gh=0|this._gh+o+getCarry(this._gl,w),this._hh=0|this._hh+p+getCarry(this._hl,A)},Sha512.prototype._hash=function(){function c(e,f,g){d.writeInt32BE(e,g),d.writeInt32BE(f,g+4)}var d=new Buffer(64);return c(this._ah,this._al,0),c(this._bh,this._bl,8),c(this._ch,this._cl,16),c(this._dh,this._dl,24),c(this._eh,this._el,32),c(this._fh,this._fl,40),c(this._gh,this._gl,48),c(this._hh,this._hl,56),d},module.exports=Sha512;

}).call(this,require("buffer").Buffer)
},{"./hash":70,"buffer":9,"inherits":44}],78:[function(require,module,exports){
'use strict';module.exports=Stream;var EE=require('events').EventEmitter,inherits=require('inherits');inherits(Stream,EE),Stream.Readable=require('readable-stream/readable.js'),Stream.Writable=require('readable-stream/writable.js'),Stream.Duplex=require('readable-stream/duplex.js'),Stream.Transform=require('readable-stream/transform.js'),Stream.PassThrough=require('readable-stream/passthrough.js'),Stream.Stream=Stream;// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.
function Stream(){EE.call(this)}Stream.prototype.pipe=function(a,b){function c(k){a.writable&&!1===a.write(k)&&i.pause&&i.pause()}function d(){i.readable&&i.resume&&i.resume()}function e(){j||(j=!0,a.end())}function f(){j||(j=!0,'function'==typeof a.destroy&&a.destroy())}// don't leave dangling pipes when there are errors.
function g(k){if(h(),0===EE.listenerCount(this,'error'))throw k;// Unhandled stream error in pipe.
}// remove all the event listeners that were added.
function h(){i.removeListener('data',c),a.removeListener('drain',d),i.removeListener('end',e),i.removeListener('close',f),i.removeListener('error',g),a.removeListener('error',g),i.removeListener('end',h),i.removeListener('close',h),a.removeListener('close',h)}var i=this;i.on('data',c),a.on('drain',d),a._isStdio||b&&!1===b.end||(i.on('end',e),i.on('close',f));var j=!1;// Allow for unix-like usage: A.pipe(B).pipe(C)
return i.on('error',g),a.on('error',g),i.on('end',h),i.on('close',h),a.on('close',h),a.emit('pipe',i),a};

},{"events":36,"inherits":44,"readable-stream/duplex.js":51,"readable-stream/passthrough.js":58,"readable-stream/readable.js":59,"readable-stream/transform.js":60,"readable-stream/writable.js":61}],79:[function(require,module,exports){
'use strict';// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
var Buffer=require('buffer').Buffer,isBufferEncoding=Buffer.isEncoding||function(a){switch(a&&a.toLowerCase()){case'hex':case'utf8':case'utf-8':case'ascii':case'binary':case'base64':case'ucs2':case'ucs-2':case'utf16le':case'utf-16le':case'raw':return!0;default:return!1;}};function assertEncoding(a){if(a&&!isBufferEncoding(a))throw new Error('Unknown encoding: '+a)}// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters. CESU-8 is handled as part of the UTF-8 encoding.
//
// @TODO Handling all encodings inside a single object makes it very difficult
// to reason about this code, so it should be split up in the future.
// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
// points as used by CESU-8.
var StringDecoder=exports.StringDecoder=function(a){switch(this.encoding=(a||'utf8').toLowerCase().replace(/[-_]/,''),assertEncoding(a),this.encoding){case'utf8':this.surrogateSize=3;break;case'ucs2':case'utf16le':this.surrogateSize=2,this.detectIncompleteChar=utf16DetectIncompleteChar;break;case'base64':this.surrogateSize=3,this.detectIncompleteChar=base64DetectIncompleteChar;break;default:return void(this.write=passThroughWrite);}// Enough space to store all bytes of a single character. UTF-8 needs 4
// bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
this.charBuffer=new Buffer(6),this.charReceived=0,this.charLength=0};// write decodes the given buffer and returns it as JS string that is
// guaranteed to not contain any partial multi-byte characters. Any partial
// character found at the end of the buffer is buffered up, and will be
// returned when calling write again with the remaining bytes.
//
// Note: Converting a Buffer containing an orphan surrogate to a String
// currently works, but converting a String to a Buffer (via `new Buffer`, or
// Buffer#write) will replace incomplete surrogates with the unicode
// replacement character. See https://codereview.chromium.org/121173009/ .
StringDecoder.prototype.write=function(a){// if our last write ended with an incomplete multibyte character
for(var b='';this.charLength;){// determine how many remaining bytes this buffer has to offer for this char
var d=a.length>=this.charLength-this.charReceived?this.charLength-this.charReceived:a.length;// add the new bytes to the char buffer
if(a.copy(this.charBuffer,this.charReceived,0,d),this.charReceived+=d,this.charReceived<this.charLength)// still not enough chars in this buffer? wait for more ...
return'';// remove bytes belonging to the current character from the buffer
a=a.slice(d,a.length),b=this.charBuffer.slice(0,this.charLength).toString(this.encoding);// CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
var e=b.charCodeAt(b.length-1);if(55296<=e&&56319>=e){this.charLength+=this.surrogateSize,b='';continue}// if there are no more bytes in this buffer, just emit our char
if(this.charReceived=this.charLength=0,0===a.length)return b;break}// determine and set charLength / charReceived
this.detectIncompleteChar(a);var f=a.length;this.charLength&&(a.copy(this.charBuffer,0,a.length-this.charReceived,f),f-=this.charReceived),b+=a.toString(this.encoding,0,f);var f=b.length-1,e=b.charCodeAt(f);// CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
if(55296<=e&&56319>=e){var g=this.surrogateSize;return this.charLength+=g,this.charReceived+=g,this.charBuffer.copy(this.charBuffer,g,0,g),a.copy(this.charBuffer,0,0,g),b.substring(0,f)}// or just emit the charStr
return b},StringDecoder.prototype.detectIncompleteChar=function(a){// Figure out if one of the last i bytes of our buffer announces an
// incomplete char.
for(// determine how many bytes we have to check at the end of this buffer
var b=3<=a.length?3:a.length;0<b;b--){var d=a[a.length-b];// See http://en.wikipedia.org/wiki/UTF-8#Description
// 110XXXXX
if(1==b&&6==d>>5){this.charLength=2;break}// 1110XXXX
if(2>=b&&14==d>>4){this.charLength=3;break}// 11110XXX
if(3>=b&&30==d>>3){this.charLength=4;break}}this.charReceived=b},StringDecoder.prototype.end=function(a){var b='';if(a&&a.length&&(b=this.write(a)),this.charReceived){var d=this.charReceived,e=this.charBuffer,f=this.encoding;b+=e.slice(0,d).toString(f)}return b};function passThroughWrite(a){return a.toString(this.encoding)}function utf16DetectIncompleteChar(a){this.charReceived=a.length%2,this.charLength=this.charReceived?2:0}function base64DetectIncompleteChar(a){this.charReceived=a.length%3,this.charLength=this.charReceived?3:0}

},{"buffer":9}],80:[function(require,module,exports){
(function (global){
'use strict';module.exports=deprecate;/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */function deprecate(a,b){if(config('noDeprecation'))return a;var c=!1;return function(){if(!c){if(config('throwDeprecation'))throw new Error(b);else config('traceDeprecation')?console.trace(b):console.warn(b);c=!0}return a.apply(this,arguments)}}/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */function config(a){// accessing global.localStorage can trigger a DOMException in sandboxed iframes
try{if(!global.localStorage)return!1}catch(c){return!1}var b=global.localStorage[a];return null!=b&&'true'===(b+'').toLowerCase()}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],81:[function(require,module,exports){
arguments[4][44][0].apply(exports,arguments)
},{"dup":44}],82:[function(require,module,exports){
'use strict';var _typeof='function'==typeof Symbol&&'symbol'==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&'function'==typeof Symbol&&obj.constructor===Symbol?'symbol':typeof obj};module.exports=function(b){return b&&'object'==('undefined'==typeof b?'undefined':_typeof(b))&&'function'==typeof b.copy&&'function'==typeof b.fill&&'function'==typeof b.readUInt8};

},{}],83:[function(require,module,exports){
(function (process,global){
'use strict';var _typeof='function'==typeof Symbol&&'symbol'==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&'function'==typeof Symbol&&obj.constructor===Symbol?'symbol':typeof obj},formatRegExp=/%[sdj%]/g;// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
exports.format=function(a){if(!isString(a)){var b=[];for(var c=0;c<arguments.length;c++)b.push(inspect(arguments[c]));return b.join(' ')}var c=1,g=arguments,h=g.length,j=(a+'').replace(formatRegExp,function(m){if('%%'===m)return'%';if(c>=h)return m;switch(m){case'%s':return g[c++]+'';case'%d':return+g[c++];case'%j':try{return JSON.stringify(g[c++])}catch(p){return'[Circular]'}default:return m;}});for(var k=g[c];c<h;k=g[++c])j+=isNull(k)||!isObject(k)?' '+k:' '+inspect(k);return j},exports.deprecate=function(a,b){// Allow for deprecating things in the process of starting up.
if(isUndefined(global.process))return function(){return exports.deprecate(a,b).apply(this,arguments)};if(!0===process.noDeprecation)return a;var c=!1;return function(){if(!c){if(process.throwDeprecation)throw new Error(b);else process.traceDeprecation?console.trace(b):console.error(b);c=!0}return a.apply(this,arguments)}};var debugs={},debugEnviron;exports.debuglog=function(a){if(isUndefined(debugEnviron)&&(debugEnviron=process.env.NODE_DEBUG||''),a=a.toUpperCase(),!debugs[a])if(new RegExp('\\b'+a+'\\b','i').test(debugEnviron)){var b=process.pid;debugs[a]=function(){var c=exports.format.apply(exports,arguments);console.error('%s %d: %s',a,b,c)}}else debugs[a]=function(){};return debugs[a]};/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 *//* legacy: obj, showHidden, depth, colors*/function inspect(a,b){// default options
var c={seen:[],stylize:stylizeNoColor};// legacy...
return 3<=arguments.length&&(c.depth=arguments[2]),4<=arguments.length&&(c.colors=arguments[3]),isBoolean(b)?c.showHidden=b:b&&exports._extend(c,b),isUndefined(c.showHidden)&&(c.showHidden=!1),isUndefined(c.depth)&&(c.depth=2),isUndefined(c.colors)&&(c.colors=!1),isUndefined(c.customInspect)&&(c.customInspect=!0),c.colors&&(c.stylize=stylizeWithColor),formatValue(c,a,c.depth)}exports.inspect=inspect,inspect.colors={bold:[1,22],italic:[3,23],underline:[4,24],inverse:[7,27],white:[37,39],grey:[90,39],black:[30,39],blue:[34,39],cyan:[36,39],green:[32,39],magenta:[35,39],red:[31,39],yellow:[33,39]},inspect.styles={special:'cyan',number:'yellow',boolean:'yellow',undefined:'grey','null':'bold',string:'green',date:'magenta',// "name": intentionally not styling
regexp:'red'};function stylizeWithColor(a,b){var c=inspect.styles[b];return c?'\u001b['+inspect.colors[c][0]+'m'+a+'\u001b['+inspect.colors[c][1]+'m':a}function stylizeNoColor(a,b){return a}function arrayToHash(a){var b={};return a.forEach(function(c,g){b[c]=!0}),b}function formatValue(a,b,c){// Provide a hook for user-specified inspect functions.
// Check that value is an object with an inspect function on it
if(a.customInspect&&b&&isFunction(b.inspect)&&// Filter out the util module, it's inspect function is special
b.inspect!==exports.inspect&&// Also filter out any prototype objects using the circular check.
!(b.constructor&&b.constructor.prototype===b)){var g=b.inspect(c,a);return isString(g)||(g=formatValue(a,g,c)),g}// Primitive types cannot have properties
var h=formatPrimitive(a,b);if(h)return h;// Look up the keys of the object.
var j=Object.keys(b),k=arrayToHash(j);// IE doesn't make error fields non-enumerable
// http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
if(a.showHidden&&(j=Object.getOwnPropertyNames(b)),isError(b)&&(0<=j.indexOf('message')||0<=j.indexOf('description')))return formatError(b);// Some type of object without properties can be shortcutted.
if(0===j.length){if(isFunction(b)){var m=b.name?': '+b.name:'';return a.stylize('[Function'+m+']','special')}if(isRegExp(b))return a.stylize(RegExp.prototype.toString.call(b),'regexp');if(isDate(b))return a.stylize(Date.prototype.toString.call(b),'date');if(isError(b))return formatError(b)}var p='',q=!1,r=['{','}'];// Make Array say that they are Array
// Make functions say that they are functions
if(isArray(b)&&(q=!0,r=['[',']']),isFunction(b)){var s=b.name?': '+b.name:'';p=' [Function'+s+']'}// Make RegExps say that they are RegExps
if(isRegExp(b)&&(p=' '+RegExp.prototype.toString.call(b)),isDate(b)&&(p=' '+Date.prototype.toUTCString.call(b)),isError(b)&&(p=' '+formatError(b)),0===j.length&&(!q||0==b.length))return r[0]+p+r[1];if(0>c)return isRegExp(b)?a.stylize(RegExp.prototype.toString.call(b),'regexp'):a.stylize('[Object]','special');a.seen.push(b);var t;return t=q?formatArray(a,b,c,k,j):j.map(function(u){return formatProperty(a,b,c,k,u,q)}),a.seen.pop(),reduceToSingleString(t,p,r)}function formatPrimitive(a,b){if(isUndefined(b))return a.stylize('undefined','undefined');if(isString(b)){var c='\''+JSON.stringify(b).replace(/^"|"$/g,'').replace(/'/g,'\\\'').replace(/\\"/g,'"')+'\'';return a.stylize(c,'string')}// For some reason typeof null is "object", so special case here.
return isNumber(b)?a.stylize(''+b,'number'):isBoolean(b)?a.stylize(''+b,'boolean'):isNull(b)?a.stylize('null','null'):void 0}function formatError(a){return'['+Error.prototype.toString.call(a)+']'}function formatArray(a,b,c,g,h){var j=[];for(var k=0,m=b.length;k<m;++k)hasOwnProperty(b,k+'')?j.push(formatProperty(a,b,c,g,k+'',!0)):j.push('');return h.forEach(function(p){p.match(/^\d+$/)||j.push(formatProperty(a,b,c,g,p,!0))}),j}function formatProperty(a,b,c,g,h,j){var k,m,p;if(p=Object.getOwnPropertyDescriptor(b,h)||{value:b[h]},p.get?p.set?m=a.stylize('[Getter/Setter]','special'):m=a.stylize('[Getter]','special'):p.set&&(m=a.stylize('[Setter]','special')),hasOwnProperty(g,h)||(k='['+h+']'),m||(0>a.seen.indexOf(p.value)?(m=isNull(c)?formatValue(a,p.value,null):formatValue(a,p.value,c-1),-1<m.indexOf('\n')&&(j?m=m.split('\n').map(function(q){return'  '+q}).join('\n').substr(2):m='\n'+m.split('\n').map(function(q){return'   '+q}).join('\n'))):m=a.stylize('[Circular]','special')),isUndefined(k)){if(j&&h.match(/^\d+$/))return m;k=JSON.stringify(''+h),k.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)?(k=k.substr(1,k.length-2),k=a.stylize(k,'name')):(k=k.replace(/'/g,'\\\'').replace(/\\"/g,'"').replace(/(^"|"$)/g,'\''),k=a.stylize(k,'string'))}return k+': '+m}function reduceToSingleString(a,b,c){var g=0,h=a.reduce(function(j,k){return g++,0<=k.indexOf('\n')&&g++,j+k.replace(/\u001b\[\d\d?m/g,'').length+1},0);return 60<h?c[0]+(''===b?'':b+'\n ')+' '+a.join(',\n  ')+' '+c[1]:c[0]+b+' '+a.join(', ')+' '+c[1]}// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(a){return Array.isArray(a)}exports.isArray=isArray;function isBoolean(a){return'boolean'==typeof a}exports.isBoolean=isBoolean;function isNull(a){return null===a}exports.isNull=isNull;function isNullOrUndefined(a){return null==a}exports.isNullOrUndefined=isNullOrUndefined;function isNumber(a){return'number'==typeof a}exports.isNumber=isNumber;function isString(a){return'string'==typeof a}exports.isString=isString;function isSymbol(a){return'symbol'==('undefined'==typeof a?'undefined':_typeof(a))}exports.isSymbol=isSymbol;function isUndefined(a){return void 0===a}exports.isUndefined=isUndefined;function isRegExp(a){return isObject(a)&&'[object RegExp]'===objectToString(a)}exports.isRegExp=isRegExp;function isObject(a){return'object'==('undefined'==typeof a?'undefined':_typeof(a))&&null!==a}exports.isObject=isObject;function isDate(a){return isObject(a)&&'[object Date]'===objectToString(a)}exports.isDate=isDate;function isError(a){return isObject(a)&&('[object Error]'===objectToString(a)||a instanceof Error)}exports.isError=isError;function isFunction(a){return'function'==typeof a}exports.isFunction=isFunction;function isPrimitive(a){return null===a||'boolean'==typeof a||'number'==typeof a||'string'==typeof a||'symbol'==('undefined'==typeof a?'undefined':_typeof(a))||// ES6 symbol
'undefined'==typeof a}exports.isPrimitive=isPrimitive,exports.isBuffer=require('./support/isBuffer');function objectToString(a){return Object.prototype.toString.call(a)}function pad(a){return 10>a?'0'+a.toString(10):a.toString(10)}var months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];// 26 Feb 16:19:34
function timestamp(){var a=new Date,b=[pad(a.getHours()),pad(a.getMinutes()),pad(a.getSeconds())].join(':');return[a.getDate(),months[a.getMonth()],b].join(' ')}// log is just a thin wrapper to console.log that prepends a timestamp
exports.log=function(){console.log('%s - %s',timestamp(),exports.format.apply(exports,arguments))},exports.inherits=require('inherits'),exports._extend=function(a,b){// Don't do anything if add isn't an object
if(!b||!isObject(b))return a;for(var c=Object.keys(b),g=c.length;g--;)a[c[g]]=b[c[g]];return a};function hasOwnProperty(a,b){return Object.prototype.hasOwnProperty.call(a,b)}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":82,"_process":50,"inherits":81}],84:[function(require,module,exports){
'use strict';module.exports={Buffer:require('buffer'),BN:require('ethereumjs-util').BN,RLP:require('ethereumjs-util').rlp,Tx:require('ethereumjs-tx'),Util:require('ethereumjs-util')};

},{"buffer":9,"ethereumjs-tx":34,"ethereumjs-util":35}]},{},[84])(84)
});