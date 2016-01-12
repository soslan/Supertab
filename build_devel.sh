#!/bin/bash

DIST_DIR=dist/
DIST_IMG=$DIST_DIR/img/

rm -rf $DIST_DIR/*
mkdir -p $DIST_IMG

cd dist/
ln -sf ../src/manifest.json ../src/newtab.html ../src/supertab.css ../src/supertab.js ../src/background.js .
cd ../

function build_icons {
convert -resize 19x19 -background none src/icons/$1.svg $DIST_IMG/$1_19x19.png
convert -resize 38x38 -background none src/icons/$1.svg $DIST_IMG/$1_38x38.png
}
mkdir -p src/icons
build_icons push
build_icons remove
build_icons radio_enabled
build_icons radio_disabled

convert -resize 19x19 -background none src/icons/icon.svg $DIST_IMG/icon_16x16.png
convert -resize 38x38 -background none src/icons/icon.svg $DIST_IMG/icon_32x32.png
convert -resize 19x19 -background none src/icons/icon.svg $DIST_IMG/icon_48x48.png
convert -resize 38x38 -background none src/icons/icon.svg $DIST_IMG/icon_128x128.png

while true; do
  change=$(inotifywait -e modify src/icons/)
  file=${change#src/icons/ * }
  if [ ${file: -4} == ".svg" ]; then build_icons ${file:0:-4}; fi
done
