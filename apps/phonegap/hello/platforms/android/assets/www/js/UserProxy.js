/**
*@namespace 
*/


/**
* 
* 
* @author Marten Olgaard
* @created 4/4/2014
* @copyright Adnuvo
* @todo 
* @class UserProxy
* @static
*/
var UserProxy = UserProxy || (function () {

	var _r = new Object();//Extend function
		
	/**
	* 
	* @method save
	* @param {Object} user 
	*/
	_r.save = function(user){
		
		//Stub code - to be removed
		alert("the function 'save' has been called  " + " with the following parameters:" + " user:" + user)
		
	};
	/**
	* 
	* @method getList
	* @param {String} searchQuery 
	*/
	_r.getList = function(searchQuery){
		
		//Stub code - to be removed
		alert("the function 'getList' has been called  " + " with the following parameters:" + " searchQuery:" + searchQuery)
		
	};
	/**
	* 
	* @method getOne
	* @param {int} id 
	*/
	_r.getOne = function(id){
		
		//Stub code - to be removed
		alert("the function 'getOne' has been called  " + " with the following parameters:" + " id:" + id)
		
	};
		
	return _r;
})();

