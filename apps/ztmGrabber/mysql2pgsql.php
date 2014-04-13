<?php
die('disabled');

$link = mysql_connect('127.0.0.1', 'root', '');
mysql_select_db('inzynierka');
set_time_limit(0);
$pg_link = pg_connect("host=127.0.0.1 port=5432 dbname=inzynierka user=marchello password=marchello") or die('conn');

$tables = array(
	'busstop'
);

foreach($tables as $table){
	pg_query('TRUNCATE "'.$table.'";');
	$query = "SELECT * FROM `".$table."`";
	$result = mysql_query($query);
	while($row = mysql_fetch_assoc($result)){
		unset($row['point']);
		$fields = array_keys($row);
		$point_value = '';
		if($row['position']){
			list($lat, $lon) = explode(';', $row['position']);
			$point_value = ", ST_SetSRID(ST_MakePoint($lat, $lon),4326)";
			$fields[] = 'latlon';
		}
		
		$query = 'INSERT INTO "'.$table.'" ("'.implode('", "', $fields).'") VALUES (\''.implode('\', \'', $row).'\''.$point_value.')';
		pg_query($query) or die($query);
		
	}
}






