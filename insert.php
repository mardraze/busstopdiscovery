<?php

$types = array(
	'bus_stop' => 1,
	'tram_stop' => 2,
);

$filename = @$argv[1];

if($filename && file_exists($filename)){

	if(@$types[@$argv[2]]){
		$type = $types[@$argv[2]];
		
		if(@$argv[3]){
			$region = $argv[3];
			mysql_connect("127.0.0.1", 'root');
			mysql_select_db('inzynierka');
			
			$handle = @fopen($filename, "r");
			if ($handle) {
				while (($buffer = fgets($handle, 4096)) !== false) {
					$xml = simplexml_load_string($buffer);
					$attributes = (array)$xml->attributes();
					$attributes = $attributes["@attributes"];
					$attributes['osm_id'] = $attributes['id'];
					unset($attributes['id']);
					$attributes['type'] = $type;
					$attributes['region'] = $region;
					$attributes['name'] = '';
					foreach($xml->tag as $k=>$v){
						$attr = $v->attributes();
						if($attr['k'] == 'name'){
							$attributes['name'] = str_replace('"', '',(string)$attr['v']);
							break;
						}
					}
					
					$query = 'INSERT INTO `positions` (`'.implode('`,`', array_keys($attributes)).'`)VALUES ("'.implode('","', $attributes).'")';
					mysql_query($query) or die($query.' '.mysql_error());
				}
				if (!feof($handle)) {
					echo "Error: unexpected fgets() fail\n";
				}
				fclose($handle);
			}else{
				die('unknown region '.$region.' passed with argv[3]');
			}
		}else{
			
		}
	}else{
		die('wrong argv[2]');
	}
}else{
	die('file '.$filename.' not exists');
}
