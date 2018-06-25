#! /bin/bash
set -e

# Installing packages
npm install

# Downloading the stockfish binary. 
wget -O lib/stockfish.js "https://github.com/exoticorn/stockfish-js/releases/download/sf_5_js/stockfish.js"

# Building the library
npm run build
