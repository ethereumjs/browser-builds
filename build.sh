#!/bin/bash

TARGETS="vm tx icap wallet wallet-hd wallet-thirdparty all"

for TARGET in $TARGETS; do
  echo Building $TARGET
  browserify --s EthJS src/$TARGET.js -g [ babelify --presets [ es2015 react ] ] > ./dist/ethereumjs-$TARGET.js
  browserify --s EthJS src/$TARGET.js -g [ babelify --presets [ es2015 react babili] ] > ./dist/ethereumjs-$TARGET-min.js
done
