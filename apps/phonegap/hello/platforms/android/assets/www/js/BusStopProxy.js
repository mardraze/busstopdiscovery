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
* @class BusStopProxy
* @static
*/
var BusStopProxy = BusStopProxy || (function () {

	var _r = new Object();//Extend function
	
	//LOCAL EVENTS
	_r.USER_LIST_LOADED = 'USER_LIST_LOADED';
	
	/**
	* 
	* @method getList
	* @param {int} userId 
	* @param {String : null} searchQuery 
	* @param {Boolean : false} fromServer 
	* @return {Object}
	*/
	_r.getList = function(userId, searchQuery, fromServer){
		return _r.cache[userId];
	};
	
	_r.loadList = function(userId, searchQuery, fromServer){
		console.log('BusStopProxy.loadList');
		if(undefined === _r.cache[userId]){
			LocalStorage.load('BusStop', {'user_id' : userId}, function(list){
				console.log('loadList => LocalStorage.load('+userId+')');
				console.log(list);
				_r.cache[userId] = list ? list : [];
				$(document).trigger(BusStopProxy.USER_LIST_LOADED, [userId]);
			});
		}else{
			console.log('BusStopProxy loadList('+userId+')');
			$(document).trigger(BusStopProxy.USER_LIST_LOADED, [userId]);
		}
	};
	
	

	
	/**
	* 
	* @method saveList
	* @param {BusStopVO[0..*]} list 
	* @param {Boolean : false} toServer 
	*/
	_r.saveList = function(list, toServer){
		
		//Stub code - to be removed
		alert("the function 'saveList' has been called  " + " with the following parameters:" + " list:" + list)
		
		//Stub code - to be removed
		alert("the function 'saveList' has been called  " + " with the following parameters:" + " list:" + list + " toServer:" + toServer)
		
	};
	/**
	* 
	* @method getOne
	* @param {int} id 
	* @return {Object}
	*/
	_r.getOne = function(id){
		
		//Stub code - to be removed
		alert("the function 'getOne' has been called  " + " with the following parameters:" + " id:" + id)
		
		return new Object();
	};
	/**
	* 
	* @method save
	* @param {Object} busStop 
	* @param {Boolean : false} toServer 
	*/
	_r.save = function(busStop, toServer){
		
		//Stub code - to be removed
		alert("the function 'save' has been called  " + " with the following parameters:" + " busStop:" + busStop)
		
		//Stub code - to be removed
		alert("the function 'save' has been called  " + " with the following parameters:" + " busStop:" + busStop + " toServer:" + toServer)
		
	};
		
	_r.cache = [];
	
	return _r;
})();

