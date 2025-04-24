#!/bin/bash

VER=$(awk -F'"' '/"version": ".+"/{ print $4; exit; }' package.json)
NAME=$(awk -F'"' '/"name": ".+"/{ print $4; exit; }' package.json)
#COMMIT=$(git rev-parse --short=6 HEAD)

FILE="${NAME}-${VER}.zip"

# rm $FILE

cp public/*.svg dist/assets
rm *.zip
cp -r dist/ BumbleBee/
zip -r $FILE BumbleBee/
rm -rf BumbleBee/

echo -e "\n-----------------\n"
echo "CREATED: ${FILE}"
