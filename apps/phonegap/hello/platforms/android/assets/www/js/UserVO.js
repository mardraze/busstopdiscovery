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
* @class UserVO
* @constructor
*/
var UserVO = function() {


	//Super constructor - optional
	//.apply(this,argumentsArray);
}

/**
* 
* @property {int} id
*/
UserVO.prototype.id = NaN;
/**
* 
* @property {String} name
*/
UserVO.prototype.name = null;
/**
* 
* @property {String} surname
*/
UserVO.prototype.surname = null;
/**
* 
* @property {String} email
*/
UserVO.prototype.email = null;
/**
* 
* @property {Position} currentPosition
*/
UserVO.prototype.currentPosition = null;
/**
* 
* @property {String} searchDump
*/
UserVO.prototype.searchDump = null;
window.UserVO = UserVO;
}());

