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
* @class ArriveVO
* @constructor
*/
var ArriveVO = function() {


	//Super constructor - optional
	//.apply(this,argumentsArray);
}

/**
* 
* @property {int} id
*/
ArriveVO.prototype.id = NaN;
/**
* 
* @property {int} busStopId
*/
ArriveVO.prototype.busStopId = NaN;
/**
* 
* @property {int} lineId
*/
ArriveVO.prototype.lineId = NaN;
/**
* 
* @property {int} time
*/
ArriveVO.prototype.time = NaN;
/**
* 
* @property {String} note
*/
ArriveVO.prototype.note = null;
window.ArriveVO = ArriveVO;
}());

