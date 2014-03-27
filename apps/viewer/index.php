<?php 
	define('BASE_URL', 'http://localhost/projekty/inzynierka/busstopdiscovery/apps/viewer');

	include_once(dirname(__FILE__).'/_data.php');
?>
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"/>
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <title>MousePosition Control</title>
    <link rel="stylesheet" href="<?php echo BASE_URL?>/theme/default/style.css" type="text/css">
    <link rel="stylesheet" href="style.css" type="text/css">
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
    <script src="<?php echo BASE_URL?>/lib/OpenLayers.js" type="text/javascript"></script>
    <script type="text/javascript" src="<?php echo BASE_URL?>/map.js"></script>
	<link rel="stylesheet" type="text/css" href="<?php echo BASE_URL?>/lib/bootstrap-duallistbox/dist/bootstrap-duallistbox.css"/>
	<link rel="stylesheet" type="text/css" href="<?php echo BASE_URL?>/lib/bootstrap-duallistbox/src/bootstrap-duallistbox.css"/>
	<script src="<?php echo BASE_URL?>/lib/bootstrap-duallistbox/src/jquery.bootstrap-duallistbox.js"></script>
  </head>
  <body onload="init();">
	<?php include(dirname(__FILE__).'/_map.php');?>
	<?php include(dirname(__FILE__).'/_dualList.php');?>
  </body>
</html>
