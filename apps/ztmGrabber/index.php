<?php
require_once(dirname(__FILE__).'/ZtmGrabber.php');

$grabber = new ZtmGrabber();
$lineUrls = @$grabber->getLineUrls('http://www.ztm.gda.pl/rozklady');

$result = array();
set_time_limit(0);
foreach($lineUrls as $k => $v){
	$busStopLineUrls = @$grabber->getBusStopLineUrls($v['url']);
	$lineResult = array();
	foreach($busStopLineUrls as $k1 => $line){
		$arrives = array();
		foreach($line['urls'] as $busStop){
			$arrives[] = @$grabber->getArrivesFromBusStopLineUrl($busStop['url']);
		}
		file_put_contents('D:/temp/result_'.$k.'_'.$k1.'.php', var_export(array(
			'line' => $line,
			'arrives' => $arrives,
		), true));
	}
}



