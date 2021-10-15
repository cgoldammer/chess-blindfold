#! /bin/bash

# Only keep running if there are no errors
set -e

# Installing packages
npm install

# Downloading the stockfish binary. 
wget -O lib/stockfish.js "https://github.com/exoticorn/stockfish-js/releases/download/sf_5_js/stockfish.js"

# Running tests
npm run test

# Building the library if the tests succeed
npm run build

