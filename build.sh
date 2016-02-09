#!/bin/bash


VERSION=`python -c 'import json;print(json.load(open("src/manifest.json"))["version"])'`
NAME=Supertab-$VERSION
DIST_DIR=dist/
DEST=$DIST_DIR/$NAME
DIST_IMG=$DEST/img/
rm -rf $DEST/*
mkdir -p $DIST_IMG
mkdir -p $DIST_DIR/promo

cd src/
cp manifest.json newtab.html supertab.css supertab.js background.js ../$DEST
cd ../

function build_icons {
convert -resize 19x19 -background none src/icons/$1.svg $DIST_IMG/$1_19x19.png
convert -resize 38x38 -background none src/icons/$1.svg $DIST_IMG/$1_38x38.png
}

build_icons remove
build_icons radio_enabled
build_icons radio_disabled

convert -resize 16x16 -background none src/icons/icon.svg $DIST_IMG/icon_16x16.png
convert -resize 32x32 -background none src/icons/icon.svg $DIST_IMG/icon_32x32.png
convert -resize 48x48 -background none src/icons/icon.svg $DIST_IMG/icon_48x48.png
convert -resize 128x128 -background none src/icons/icon.svg $DIST_IMG/icon_128x128.png

convert -background none src/images/promo_440x280.svg $DIST_DIR/promo/promo_440x280.png
convert -background none src/images/promo_920x680.svg $DIST_DIR/promo/promo_920x680.png
convert -background none src/images/promo_1400x560.svg $DIST_DIR/promo/promo_1400x560.png

cd dist/
zip -r $NAME.zip $NAME/*
cd ../