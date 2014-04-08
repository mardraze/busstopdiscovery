#!/bin/sh
cd js
ALL_JS='all.js'
rm -rf $ALL_JS

FILES=`find -type f`
touch $ALL_JS

for file in $FILES
do
       cat "$file" >> $ALL_JS
done

