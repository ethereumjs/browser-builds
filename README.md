# ethereumjs browser builds

This repository contains browser builds of certain ethereumjs libraries.  They are built using browserify with a known set of working dependencies.

## Usage

In your web application, include only one of the builds form the `dist` directory. All exports will be available under the global `EthJS`.

## Build

Run `build.sh` to generate a new set up builds. Change `package.json` to require different versions of the libraries.

