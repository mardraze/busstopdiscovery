#!/bin/sh
cd js
ALL_FILE='all.js'
rm -rf $ALL_FILE

FILES=`find -type f`
touch $ALL_FILE

for file in $FILES
do
       cat "$file" >> $ALL_FILE
done

