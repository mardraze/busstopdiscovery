<?php

$config = array(
	'DB' => array(
		'host' => '127.0.0.1',
		'user' => 'root',
		'pass' => '',
		'db_name' => 'inzynierka',
	),
	'POSTGRES_DB' => array(
		'host' => '127.0.0.1',
		'user' => 'marchello',
		'pass' => 'marchello',
		'db_name' => 'inzynierka',
	),
	'TABLES' => array('busstop'),
	'DB_TYPE' => 'postgresql',//'mysql', 'postgresql',
	'POSTGRES_AVAILABLE_FUNC' => array('ST_X', 'ST_Y', 'ST_Distance',),
);
$config['escape'] = ($config['DB_TYPE'] == 'mysql') ? '`' : '"';

define('BASE_URL', 'http://localhost/projekty/inzynierka/busstopdiscovery/apps/serverStorage');
define('BASE_DIR', dirname(__FILE__));
