#!/bin/bash

DIST_DIR=dist/
DIST_IMG=$DIST_DIR/img/

rm -rf $DIST_DIR/*
mkdir -p $DIST_IMG

cd src/
cp manifest.json newtab.html supertab.css supertab.js background.js ../$DIST_DIR
cd ../

function build_icons {
convert -resize 19x19 -background none src/$1.svg $DIST_IMG/$1_19x19.png
convert -resize 38x38 -background none src/$1.svg $DIST_IMG/$1_38x38.png
}

build_icons push
build_icons icon
build_icons remove
build_icons radio_enabled
build_icons radio_disabled
