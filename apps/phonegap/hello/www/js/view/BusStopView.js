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
* @class BusStopView
* @static
*/
var BusStopView = BusStopView || (function () {

	var _r = new Object();
	_r.div = '#BusStopView';

	/**
	* 
	* @property {BusStopVO} busStop
	*/
	_r.busStop = null;
		
	/**
	* 
	* @method rateInc
	*/
	_r.rateInc = function(){
		
	};
	/**
	* 
	* @method rateDec
	*/
	_r.rateDec = function(){
		
	};
	/**
	* 
	* @method canRate
	*/
	_r.canRate = function(){
		
	};
	/**
	* 
	* @method next
	*/
	_r.next = function(){
		
	};
	/**
	* 
	* @method prev
	*/
	_r.prev = function(){
		
	};
	
	_r._toHtml = function(busStopVO){
		var html = '_r._toHtml';
		
		return html;
	};
	_r.emptyList = function(){
		$(BusStopView.div).hide();
		$(UserListEmptyView.div).show();
	};
	
	/**
	* 
	* @method getNearest
	*/
	_r.getNearest = function(){
		console.log('okoko');
		if(_r.list.length == 0){
			_r.emptyList();
		}else{
			$(_r.div).html(_r._toHtml(_r.list[0]));
		}
	};
	/**
	* 
	* @method showMap
	*/
	_r.showMap = function(){
		
	};
	/**
	* 
	* @method searchUsers
	*/
	_r.searchUsers = function(){
		
	};
	/**
	* 
	* @method searchBusStops
	*/
	_r.searchBusStops = function(){
		
	};
	/**
	* 
	* @method myProfile
	*/
	_r.myProfile = function(){
		
	};
	
	_r._onUserListLoaded = function(){
		_r.getNearest();
	};
	
	_r.list = [];
	//LISTA USERA JEST ZAŁADOWANA
	$(document).on(BusStopProxy.USER_LIST_LOADED, _r._onUserListLoaded);
	return _r;
})();

