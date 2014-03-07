busstopdiscovery
================

1. Importer
Usage:
osm2mysql file.osm region_name

Database connection config is in /apps/importer/insert.php file. 

Mysql table schema

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
