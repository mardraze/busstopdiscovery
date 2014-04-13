<?php
die('disabled');
mysql_connect('127.0.0.1', 'root', '');
mysql_select_db('inzynierka');
$query = 'SELECT id, position FROM busstop';
$result = mysql_query($query) or die($query);
while($row = mysql_fetch_row($result)){
	if(@$row[1]){
		list($lat, $lon) = explode(';', $row[1]);
		$query = "UPDATE busstop SET point=GeomFromText('POINT($lat $lon)') WHERE id=".$row[0];
		mysql_query($query) or die($query);
	}
	
}

