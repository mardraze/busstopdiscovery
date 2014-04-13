<?php
die('disabled');
chdir('new');
mysql_connect('127.0.0.1', 'root', '');
mysql_select_db('inzynierka');
$files = glob('*');
set_time_limit(0);
foreach($files as $k => $file){
	include($file);
	$matches = array();
	$url = $data['line']['urls'][0]['url'];

	preg_match('/rozklad-([0-9N]+)_(.*)([0-9]).html/', $url, $matches);
	if($url){
		$query = 'INSERT INTO `line` SET company_id=1, `name`="'.$matches[1].'", `target`="'.$data['line']['target'].'", `direction`='.($matches[3] ? $matches[3] : 1);
		mysql_query($query) or die($query);
		$lineId = mysql_insert_id();
		foreach($data['line']['urls'] as $k1 => $busstop){
			$query = 'SELECT id FROM `busstop` WHERE `name`="'.mysql_real_escape_string($busstop['name']).'"';	
			$result = mysql_query($query) or die($query);
			if(mysql_num_rows($result) == 0){
				$query = 'INSERT INTO `busstop` SET `name`="'.mysql_real_escape_string($busstop['name']).'"';	
				$busStopId = mysql_query($query) or die($query);
			}else{
				$row = mysql_fetch_assoc($result);
				$busStopId = $row['id'];
			}
			$arrive = $data['arrives'][$k1];

			foreach($arrive['daily'] as $daily){
				$query = 'INSERT INTO `arrive` SET busstop_id="'.$busStopId.'", line_id="'.$lineId.'", `note`=\''.json_encode($daily).'\', `time`='.(($daily['hour'] * 3600) + ($daily['minutes'] * 60)).', `type` = 1';
				mysql_query($query) or die($query);
			}
			
			foreach($arrive['saturday'] as $saturday){
				$query = 'INSERT INTO `arrive` SET busstop_id="'.$busStopId.'", line_id="'.$lineId.'", `note`=\''.json_encode($daily).'\', `time`='.(($daily['hour'] * 3600) + ($daily['minutes'] * 60)).', `type` = 2';
				mysql_query($query) or die($query);
			}

			foreach($arrive['sunday'] as $sunday){
				$query = 'INSERT INTO `arrive` SET busstop_id="'.$busStopId.'", line_id="'.$lineId.'", `note`=\''.json_encode($daily).'\', `time`='.(($daily['hour'] * 3600) + ($daily['minutes'] * 60)).', `type` = 3';
				mysql_query($query) or die($query);
			}
		}
		
		
	}
	
}

