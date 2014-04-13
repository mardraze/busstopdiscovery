<?php
$success = 0;
$error = '';
$table = q(@$_REQUEST['table']);
$kvPairs = @$_REQUEST['kvPairs'];
$limit_start = @$_REQUEST['limit_start'] * 1;
$limit_count = @$_REQUEST['limit_count'] * 1;
$order_by = q(@$_REQUEST['order_by']);
$order_direction = @q($_REQUEST['order_direction']);
$fields = @$_REQUEST['fields'];

function postgresql_func_str_ST_XY($v){
	return $v['func'].'('._esc(q($v['field'])).') as "'.q(@$v['alias']).'"';
}

function postgresql_func_str_ST_X($v){
	return postgresql_func_str_ST_XY($v);
}

function postgresql_func_str_ST_Y($v){
	return postgresql_func_str_ST_XY($v);
}

function postgresql_func_str_ST_Distance($v){
	$params = $v['field'];
	return 'ST_Distance('.$params[0].', ST_GeomFromText(\'POINT('.(@$params[1] * 1.0).' '.(@$params[2] * 1.0).')\',4326)) as "'.q(@$v['alias']).'"';
}

$data = array();
$count = 0;
if(in_array($table, $config['TABLES'])){
	$fieldStr = '*';
	if($fields){
		foreach($fields as $k => $v){
			if(@$v['field']){
				if(@$v['alias'] && in_array(@$v['func'], $config['POSTGRES_AVAILABLE_FUNC'])){
					$func = 'postgresql_func_str_'.$v['func'];
					$fields[$k] = (function_exists($func) ? $func($v) : null);
				}elseif($v['field'] == '*'){
					$fields[$k] = '*';
				}else{
					$fields[$k] = _esc(q($v['field']));
				}
			}
			if($fields[$k] === null){
				unset($fields[$k]);
			}
		}
		$fieldStr = implode(',', $fields);
		
	}
	$query = 'SELECT '.$fieldStr.' FROM '._esc($table);
	if($kvPairs){
		$set = array();
		if($kvPairs['in_circle']){
			$set []= 'st_point_inside_circle(latlon, '.($kvPairs['in_circle']['lat'] * 1).', '.($kvPairs['in_circle']['lon'] * 1).', '.($kvPairs['in_circle']['distance'] * 1).')';
			unset($kvPairs['in_circle']);
		}
		
		foreach($kvPairs as $k => $v){
			$set []= _esc(q($k))."='".q($v)."'";
		}
		$query .= ' WHERE '.implode(' AND ', $set);
	}
	if($order_by){
		$query .= ' ORDER BY '._esc($order_by).($order_direction == 'DESC' ? ' DESC ' : ' ASC ');
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