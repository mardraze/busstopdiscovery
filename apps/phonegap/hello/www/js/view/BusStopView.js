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
		return ViewTools.busStopRowDetails(busStopVO, lineList, arriveList);
	};
	_r.emptyList = function(){
		BusStopView.hide();
		UserListEmptyView.show();
	};
	
	/**
	* 
	* @method getNearest
	*/
	_r.getNearest = function(){
		UserListController.loadList(function(list){
			if(list.length == 0){
				_r.emptyList();
			}else{
				$(_r.div).html(_r._toHtml(ArriveController.getCurrentArrives(list[0])));
			}
		});
		
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
	
	_r.hide = function(){
		$(this.div).hide();
	};
	
	_r.show = function(){
		this.getNearest();
	};
	
	return _r;
})();

