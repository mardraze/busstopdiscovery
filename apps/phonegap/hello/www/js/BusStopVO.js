/**
*@namespace 
*/
(function () {

/**
* 
* 
* @author Marten ?gaard
* @created 3/4/2014
* @copyright Adnuvo
* @todo 
* @class BusStopVO
* @constructor
*/
var BusStopVO = function() {


	//Super constructor - optional
	//.apply(this,argumentsArray);
}

/**
* 
* @property {String} id
*/
BusStopVO.prototype.id = null;
/**
* 
* @property {int} userId
*/
BusStopVO.prototype.userId = NaN;
/**
* 
* @property {int} origBusStopId
*/
BusStopVO.prototype.origBusStopId = NaN;
/**
* 
* @property {int} rate
*/
BusStopVO.prototype.rate = NaN;
/**
* 
* @property {int} usersCount
*/
BusStopVO.prototype.usersCount = NaN;
/**
* 
* @property {String} name
*/
BusStopVO.prototype.name = null;
/**
* 
* @property {String} searchDump
*/
BusStopVO.prototype.searchDump = null;
window.BusStopVO = BusStopVO;
}());

