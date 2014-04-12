<?php
require_once(dirname(__FILE__).'/ZtmGrabber.php');

$grabber = new ZtmGrabber();

var_dump($grabber->parseUrl('http://www.ztm.gda.pl/rozklady/rozklad-006_20131104-20-1.html'));
