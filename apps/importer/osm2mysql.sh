#!/bin/bash

if [ -e $1 ]
then
	IN_OSM=$1
	OUT_SED="$1.sed"
	OUT_TRAM="$1.tram"
	OUT_BUS="$1.bus"
	REGION=$2
	sed ':a;N;$!ba;s/\n/ /g' $IN_OSM | sed -e 's/<node/\n\0/g' > $OUT_SED
	cat $OUT_SED | grep tram_stop > $OUT_TRAM
	cat $OUT_SED | grep bus_stop  > $OUT_BUS
	php insert.php $OUT_TRAM tram_stop $REGION
	php insert.php $OUT_BUS bus_stop $REGION
	rm $OUT_TRAM
	rm $OUT_BUS
	rm $OUT_SED
	
else
  echo "Podaj kolejno w parametrach plik wejsciowy osm oraz nazwe regionu "
fi


