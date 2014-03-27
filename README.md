busstopdiscovery
================

<h2>Importer</h2>
<h3>Usage: /apps/importer/osm2mysql.sh</h3>
<pre>
osm2mysql file.osm region_name
</pre>
<br/>

Database connection config is in <b>/apps/importer/insert.php

<br/>

Mysql table schema
<pre>
CREATE TABLE `positions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `osm_id` varchar(32) NOT NULL,
  `name` varchar(63) NOT NULL,
  `version` varchar(32) DEFAULT NULL,
  `timestamp` varchar(32) DEFAULT NULL,
  `uid` varchar(32) DEFAULT NULL,
  `user` varchar(32) DEFAULT NULL,
  `changeset` varchar(32) DEFAULT NULL,
  `lat` varchar(32) DEFAULT NULL,
  `lon` varchar(32) DEFAULT NULL,
  `type` int(11) NOT NULL DEFAULT '0',
  `region` varchar(32) NOT NULL,
  PRIMARY KEY (`id`)
);
</pre>
