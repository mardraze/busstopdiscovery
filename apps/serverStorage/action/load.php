<?php
$success = 0;
$error = '';
$table = q(@$_REQUEST['table']);
$kvPairs = @$_REQUEST['kvPairs'];
$limit_start = @$_REQUEST['limit_start'] * 1;
$limit_count = @$_REQUEST['limit_count'] * 1;

$data = array();
$count = 0;
if(in_array($table, $config['TABLES'])){
	
	$query = 'SELECT * FROM '.$config['escape'].$table.$config['escape'];
	if($kvPairs){
		$set = array();
		if($kvPairs['in_circle']){
			$set []= 'st_point_inside_circle(latlon, '.($kvPairs['in_circle']['lat'] * 1).', '.($kvPairs['in_circle']['lon'] * 1).', '.($kvPairs['in_circle']['distance'] * 1).')';
			unset($kvPairs['in_circle']);
		}
		
		foreach($kvPairs as $k => $v){
			$set []= $config['escape'].q($k).$config['escape']."='".q($v)."'";
		}
		$query .= ' WHERE '.implode(' AND ', $set);
	}
	if($limit_count){
		$query .= ' LIMIT '.($limit_start ? ($limit_start.',') : '').$limit_count;
	}
	$result = _query($query);
	while($row = _fetch_assoc($result)){
		$data[] = $row;
		$count++;
	}
	$success = 1;
}else{
	$error = 'Wrong table';
}

$response = array('success' => $success);
if($success){
	$response['count'] = $count;
	$response['data'] = $data;
}else{
	$response['error'] = $error;
	$response['file'] = __FILE__;
}
echo json_encode($response);