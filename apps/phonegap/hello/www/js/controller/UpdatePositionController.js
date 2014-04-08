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
* @class UpdatePositionController
* @static
*/
var UpdatePositionController = UpdatePositionController || (function () {

	var _r = new Object();//Extend function
	_r.USER_LIST_POSITION_CHANGED = 'USER_LIST_POSITION_CHANGED';
	/**
	* 
	* @property {int} frequency
	*/
	_r.frequency = 10000;
	
	_r._isNearer = function(current, next, lon, lat){
		var currentDX = Math.abs(current.lon - lon);
		var currentDY = Math.abs(current.lat - lat);
		var nextDX = Math.abs(next.lon - lon);
		var nextDY = Math.abs(next.lat - lat);
		return (currentDX * currentDX + currentDY * currentDY < nextDX * nextDX + nextDY * nextDY);
	};
	
	_r._onPositionUpdateSuccess = function(position){
		var lat = position.coords.latitude;
		var lon = position.coords.longitude;
		console.log(lon);
		console.log(lat);
		var sortFunct = function(a, b){
			_r._isNearer(a, b, lon, lat)
		};
		_r.list.sort(sortFunct)
	
		_r.lon = lon;
		_r.lat = lat;
		
		$(document).trigger(UpdatePositionController.USER_LIST_POSITION_CHANGED);
		
	};

	_r._onPositionUpdateError = function(){
		console.log('_onPositionUpdateError');
	};
	
	_r.update = function(){
		console.log('_r.update');
		//navigator.geolocation.getCurrentPosition(_r._onPositionUpdateSuccess, _r._onPositionUpdateError);
	};
	
	_r.getSortedList = function(){
		return _r.list;
	};
	
	_r._onUserListLoaded = function(e, userId){
		console.log('_r._onUserListLoaded');
		console.log(userId == APP.userId);
		console.log(APP.userId);
		console.log(userId);
		if(userId == APP.userId){
			_r.list = BusStopProxy.getList(APP.userId);
			_r.update();
		}
	};
	_r.running = false;
	_r.run = function(){
		if(!_r.running){
			$(document).on(BusStopProxy.USER_LIST_LOADED, _r._onUserListLoaded);
			_r.running = true;
			var repeat = function(){
				_r.update();
				setTimeout(repeat, _r.frequency);
			};
			setTimeout(repeat, _r.frequency);
		}
	};
	
	
	return _r;
})();

