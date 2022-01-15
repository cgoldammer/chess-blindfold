#!/bin/bash
set -e

echo "Starting deploy"

# Building the library
npm run test
npm run build

CURRENTDIR=~/code/chess-blindfold
SERVEDIR=~/serve_content/blindfold

cd $CURRENTDIR
rm -rf $SERVEDIR
mkdir $SERVEDIR
cp -r $CURRENTDIR/serve_content/prod $SERVEDIR
cp -r $CURRENTDIR/serve_content/shared $SERVEDIR
cp -r $CURRENTDIR/serve_content/index_prod.html $SERVEDIR/index.html

echo "Completed deploy"
