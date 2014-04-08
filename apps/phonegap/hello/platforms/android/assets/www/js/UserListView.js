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
* @class UserListView
* @static
*/
var UserListView = UserListView || (function () {

	var _r = new Object();//Extend function
	/**
	* 
	* @property {String} searchQuery
	*/
	_r.searchQuery = null;
	/**
	* 
	* @property {UserVO} result
	*/
	_r.result = null;
		
	/**
	* 
	* @method details
	* @param {int} userId 
	*/
	_r.details = function(userId){
		
		//Stub code - to be removed
		alert("the function 'details' has been called  " + " with the following parameters:" + " userId:" + userId)
		
	};
		
	return _r;
})();

