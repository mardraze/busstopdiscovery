<?php

class ZtmGrabber{

	public $base_url;
	
	public function getLineUrls($url){
		$this->base_url = $url;
		$DOM = new DOMDocument;
		$DOM->loadHTML(file_get_contents($url));
		$list = $DOM->getElementById('list')->getElementsByTagName('a');
		$lineUrls = array();
		foreach($list as $k => $v){
			$line = $this->xml_to_array($v);
			$href = $line["@attributes"]["href"];
			if(strpos($href, 'linia') === 0){
				$lineUrls[] = array('url' => $href);
			}
		}
		return $lineUrls;
	}

	public function getBusStopLineUrls($url){
		$ret = array(
			array('direction' => 0, 'urls' => array()),
			array('direction' => 1, 'urls' => array()),
		);
		$DOM = new DOMDocument;
		$DOM->loadHTML(file_get_contents($this->base_url.'/'.$url));
		$tables = $DOM->getElementById('departures')->getElementsByTagName('table');
		$direction = 0;
		foreach($tables as $k => $v){
			$isClassRoute = false;
			$isAlignCenter = false;
			foreach($v->attributes as $k1 => $v1){
				if($k1 == 'class' && $v1->value == 'route'){
					$isClassRoute = true;
				}
				if($k1 == 'align' && $v1->value == 'center'){
					$isAlignCenter = true;
				}
			}
			if($isClassRoute && !$isAlignCenter){
				$route = $this->xml_to_array($v);
				$urls = array();
				foreach($route["tr"] as $k => $v){
					if(@$v['td']["a"]["@attributes"]["href"]){
						$urls[] = array(
							'name' => $v['td']["a"]["_text_value"],
							'url' => $v['td']["a"]["@attributes"]["href"],
						);
					}elseif($k > 0 && $v['td']["b"]["_text_value"]){
						$urls[] = array(
							'name' => $v['td']["b"]["_text_value"],
						);					
					}
				}
				

				$ret[$direction++] = array(
					'target' => $route["tr"][0]["td"]["b"]["_text_value"],
					'urls' => $urls,
				);
			}
		}
		return $ret;
	}

	public function getArrivesFromBusStopLineUrl($url){
		$DOM = new DOMDocument;
		$DOM->loadHTML(file_get_contents($this->base_url.'/'.$url));
		$items = $this->getElementsByClassName($DOM, 'departures-set');
		return array(
			'daily' => $this->parseDepartures($this->xml_to_array($items[0])),
			'saturday' => $this->parseDepartures($this->xml_to_array($items[1])),
			'sunday' => $this->parseDepartures($this->xml_to_array($items[2])),
			'codes' => $this->parseCodes($this->xml_to_array($DOM->getElementById('descriptions'))),
		);
	}

	//////////// PRIVATE ///////////

	private function parseCodes($description_div){
		return array($description_div['div']['div']['_text_value'] => trim(preg_replace('/[^a-zA-Z\s]/', '', $description_div['div']['_text_value'])));
	}
	
	private function parseDepartures($departures_set_div){
		$ret = array();
		foreach($departures_set_div['div'] as $k => $v){
			if($v["@attributes"]['class'] == 'h'){
				$hour = $v['_text_value'];
				$minutes = null;
			}else if($v["@attributes"]['class'] == 'm'){
				$minutes = $v['a']['_text_value'];
				$code = @$v['a']["span"]['_text_value'];
			}else{
				$hour = null;
				$minutes = null;
			}
			if($hour !== null && $minutes !== null){
				$ret[] = array('hour' => $hour, 'minutes' => $minutes, 'code' => $code);
			}
		}
		return $ret;
	}

	private function xml_to_array($root) {
		$result = array();
		if($root){
			if ($root->hasAttributes()) {
				$attrs = $root->attributes;
				foreach ($attrs as $attr) {
					$result['@attributes'][$attr->name] = $attr->value;
				}
			}

			if ($root->hasChildNodes()) {
				$children = $root->childNodes;
				$groups = array();
				foreach ($children as $child) {
					if ($child->nodeType == XML_TEXT_NODE) {
						$result['_text_value'] = $child->nodeValue;
					}
					if (!isset($result[$child->nodeName])) {
						$result[$child->nodeName] = $this->xml_to_array($child);
					} else {
						if (!isset($groups[$child->nodeName])) {
							$result[$child->nodeName] = array($result[$child->nodeName]);
							$groups[$child->nodeName] = 1;
						}
						$result[$child->nodeName][] = $this->xml_to_array($child);
					}
				}
			}
		}
		return $result;
	}
	
	private function getElementsByClassName(DOMDocument $DOMDocument, $ClassName)
	{
		$Elements = $DOMDocument -> getElementsByTagName("*");
		$Matched = array();

		foreach($Elements as $node)
		{
			if( ! $node -> hasAttributes())
				continue;

			$classAttribute = $node -> attributes -> getNamedItem('class');

			if( ! $classAttribute)
				continue;

			$classes = explode(' ', $classAttribute -> nodeValue);

			if(in_array($ClassName, $classes))
				$Matched[] = $node;
		}

		return $Matched;
	}
	
	
}