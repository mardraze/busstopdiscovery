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
* @class BusStopListView
* @static
*/
var BusStopListView = BusStopListView || (function () {

	var _r = new Object();//Extend function
	/**
	* 
	* @property {String} searchQuery
	*/
	_r.searchQuery = null;
	/**
	* 
	* @property {int} userId
	*/
	_r.userId = null;
	/**
	* 
	* @property {int} regionId
	*/
	_r.regionId = null;
	/**
	* 
	* @property {BusStopVO} result
	*/
	_r.result = null;
	/**
	* 
	* @property {int} selectedIds
	* @private
	*/
	var selectedIds = null;
		
	/**
	* 
	* @method addSelectedToList
	*/
	_r.addSelectedToList = function(){
		
	};
	/**
	* 
	* @method deleteSelected
	*/
	_r.deleteSelected = function(){
		
	};
	/**
	* 
	* @method edit
	* @param {int} busStopOrigId 
	*/
	_r.edit = function(busStopOrigId){
		
		//Stub code - to be removed
		alert("the function 'edit' has been called  " + " with the following parameters:" + " busStopOrigId:" + busStopOrigId)
		
	};
	/**
	* 
	* @method search
	* @param {String} query 
	*/
	_r.search = function(query){
		
		//Stub code - to be removed
		alert("the function 'search' has been called  " + " with the following parameters:" + " query:" + query)
		
	};
		
	return _r;
})();

