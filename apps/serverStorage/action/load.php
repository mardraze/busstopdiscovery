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

function sql_func_ST_XY($v){
	return $v['func'].'('._esc(q($v['field'])).') as "'.q(@$v['alias']).'"';
}

function sql_func_ST_X($v){
	return sql_func_ST_XY($v);
}

function sql_func_ST_Y($v){
	return sql_func_ST_XY($v);
}

function sql_func_ST_Distance($v){
	$params = $v['field'];
	return ' round(CAST(ST_Distance_Sphere(ST_Centroid('._esc(q($params[0])).'), ST_GeomFromText(\'POINT('.(@$params[1] * 1.0).' '.(@$params[2] * 1.0).')\',4326)) As numeric),2) as "'.q(@$v['alias']).'" ';
}

function sql_func_in_circle($field, $params){
	return ' st_point_inside_circle('._esc(q($field)).', '.($params['lat'] * 1).', '.($params['lon'] * 1).', '.($params['distance'] * 1).') ';
}

function sql_func_in($field, $params){
	return ' '._esc(q($field)).' IN (\''.implode("', '", $params['values']).'\') ';
}


$data = array();
$count = 0;
if(in_array($table, $config['TABLES'])){
	$fieldStr = '*';
	if($fields){
		foreach($fields as $k => $v){
			if(@$v['field']){
				if(@$v['alias'] && in_array(@$v['func'], $config['POSTGRES_AVAILABLE_FUNC'])){
					$func = 'sql_func_'.$v['func'];
					$fields[$k] = (function_exists($func) ? $func($v) : null);
				}elseif(@$v['field'] == '*'){
					$fields[$k] = '*';
				}else{
					$fields[$k] = _esc(q($v));
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
		foreach($kvPairs as $k => $v){
			if(is_array($v) && array_key_exists('func', $v)){
				$func = 'sql_func_'.$v['func'];
				if(function_exists($func)){
					$set []= $func($k, $v);
				}else{
					die('function '.$func.' not exists');
				}
			}else{
				$set []= _esc(q($k))."='".q($v)."'";
			}
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