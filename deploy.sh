#!/bin/bash
set -e

echo "Starting deploy"

# Building the library if the tests succeed
npm run build

CURRENTDIR=~/blindfold2
SERVEDIR=~/serve_content/blindfold2

cd $CURRENTDIR
rm -rf $SERVEDIR
mkdir $SERVEDIR
cp -r $CURRENTDIR/serve_content/prod $SERVEDIR
cp -r $CURRENTDIR/serve_content/shared $SERVEDIR
cp -r $CURRENTDIR/serve_content/index_prod.html $SERVEDIR/index.html

echo "Completed deploy"
