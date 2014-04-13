<?php
include_once(dirname(__FILE__).'/config.php');

if($config['DB_TYPE'] == 'mysql'){
	mysql_connect($config['DB']['host'], $config['DB']['user'], $config['DB']['pass']);
	mysql_select_db($config['DB']['db_name']);
	function _query($query){
		$result = mysql_query($query) or die($query);
		return $result;
	}
	function _fetch_assoc($row){
		return mysql_fetch_assoc($row);
	}

}else{
	pg_connect("host=".$config['POSTGRES_DB']['host']." port=5432 dbname=".$config['POSTGRES_DB']['db_name']." user=".$config['POSTGRES_DB']['user']." password=".$config['POSTGRES_DB']['pass']."") or die('conn');
	function _query($query){
		$result = pg_query($query) or die($query);
		return $result;
	}
	function _fetch_assoc($row){
		return pg_fetch_assoc($row);
	}

}



function q($str){
	return @preg_replace('/\W/', '', @substr($str, 0, 100));
}




$type = q(@$_REQUEST['type']);
if($type){
	$file = dirname(__FILE__).'/action/'.$type.'.php';
	if(file_exists($file)){
		include($file);
		exit;
	}
}

echo json_encode(array('success' => 0, 'error'=> 'Unknown type param', 'file' => __FILE__, 'line' => __LINE__));
