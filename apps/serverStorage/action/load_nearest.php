<?php
$success = 0;
$error = '';
$table = q(@$_REQUEST['table']);
$kvPairs = @$_REQUEST['kvPairs'];
$limit_start = @$_REQUEST['limit_start'] * 1;
$limit_count = @$_REQUEST['limit_count'] * 1;
$lat = @$_REQUEST['lat'] * 1;
$lon = @$_REQUEST['lon'] * 1;
$distance = @$_REQUEST['distance'] * 1;

$data = array();
$count = 0;

$query = 'SELECT * FROM busstop WHERE st_point_inside_circle(latlon, '.$lat.', '.$lon.', '.$distance.')';

if($limit_count){
	$query .= ' LIMIT '.($limit_start ? ($limit_start.',') : '').$limit_count;
}


$result = _query($query);//_query($query);

while($row = _fetch_assoc($result)){
	$data[] = $row;
	$count++;
}
$success = 1;

$response = array('success' => $success);
if($success){
	$response['count'] = $count;
	$response['data'] = $data;
}else{
	$response['error'] = $error;
	$response['file'] = __FILE__;
}
echo json_encode($response);
