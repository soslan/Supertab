#!/bin/bash

DIST_DIR=dist/
DIST_IMG=$DIST_DIR/img/

rm -rf $DIST_DIR/*
mkdir -p $DIST_IMG

cd src/
cp manifest.json newtab.html supertab.css supertab.js background.js ../$DIST_DIR
cd ../

function build_icons {
convert -resize 19x19 -background none src/icons/$1.svg $DIST_IMG/$1_19x19.png
convert -resize 38x38 -background none src/icons/$1.svg $DIST_IMG/$1_38x38.png
}

build_icons push
build_icons remove
build_icons radio_enabled
build_icons radio_disabled

convert -resize 16x16 -background none src/icons/icon.svg $DIST_IMG/icon_16x16.png
convert -resize 32x32 -background none src/icons/icon.svg $DIST_IMG/icon_32x32.png
convert -resize 48x48 -background none src/icons/icon.svg $DIST_IMG/icon_48x48.png
convert -resize 128x128 -background none src/icons/icon.svg $DIST_IMG/icon_128x128.png
