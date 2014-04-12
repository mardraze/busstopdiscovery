<?php

class ZtmGrabber{
	public function parseUrl($url){
		$page = file_get_contents($url);
		$sipPosition = strpos('id="SIP"', $page);
		
		return array(
			'daily' => getDaily($page, $sipPosition),
			'saturday' => getSaturday($page, $sipPosition),
			'sunday' => getSunday($page, $sipPosition),
		);
	}

	
	
	private function getDaily($page, $sipPosition){
		$ret = array();
		
		$start = strpos('<div class="departures-set">', $page, $sipPosition);
		$end = strpos('<div class="departures-set">', $page, $start+1);
		$xml = simplexml_load_string(str_replace('<br>', '', substr($page, $start, $end-$start)));
		var_dump($xml); exit;//TODO
		return $ret;
	}
	
	private function getSaturday($page, $sipPosition){
		$ret = array();
		return $ret;
	}
	
	private function getSunday($page, $sipPosition){
		$ret = array();
		return $ret;
	}
	
	
}