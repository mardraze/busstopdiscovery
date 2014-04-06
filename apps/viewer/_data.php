<?php
$wktStr = '';
if(@$_REQUEST['query']){
	mysql_connect('127.0.0.1', 'root');
	mysql_select_db('inzynierka');
	$result = mysql_query($_REQUEST['query']) or die($_REQUEST['query'].' '.mysql_error());
	$wktStr = "LINESTRING(";
	$first = true;
	while ($row = mysql_fetch_assoc($result)){
		$wktStr .= ($first ? '' : ',') . $row['lon'].' '.$row['lat'];
		if($first){
			$first = false;
		}
	}
	$wktStr .= ')';
}


