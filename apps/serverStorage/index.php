<?php
include_once(dirname(__FILE__).'/config.php');

mysql_connect($config['DB']['host'], $config['DB']['user'], $config['DB']['pass']);
mysql_select_db($config['DB']['db_name']);

function q($str){
	return @preg_replace('/\W/', '', @substr($str, 0, 100));
}

function _query($query){
	$result = mysql_query($query) or die($query);
	return $result;
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
