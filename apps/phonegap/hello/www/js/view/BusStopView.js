var BusStopView = BusStopView || (function () {

	var _r = new Object();//extends
	_r.div = 'BusStopView';
	_r.div_left = _r.div+'_left';
	_r.div_right = _r.div+'_right';
	
	_r.EMPTY_VIEW = 'BusStopView_EMPTY_VIEW';
	
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
	
	_r.getNearest = function(){

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
		$('#'+BusStopView.div).hide();
	};
	
	_r.show = function(busStop){
		if(busStop){
			BusStopView.showBusStop(busStop);
		}else{
			UserListController.loadList(function(list){
				if(list.length == 0){
					$(document).trigger(BusStopView.EMPTY_VIEW);
				}else{
					BusStopView.showBusStop(list[0]);
				}
			});
		}
		$('#'+BusStopView.div_left).click(BusStopView.leftClick);
		$('#'+BusStopView.div_right).click(BusStopView.rightClick);
	};

	_r.leftClick = function(){
		
	};
	_r.rightClick = function(){
		
	};
	
	_r.leftButton = function(){
		var ret = '<input type="button" id="'+BusStopView.div_left+'" value="<"/>';
		return ret;
	};

	_r.rightButton = function(){
		var ret = '<input type="button" id="'+BusStopView.div_right+'" value=">"/>';
		return ret;
	};
	
	_r.showBusStop = function(busStop){
		BusStopView.busStop = busStop;
		var arriveList = ArriveController.getCurrentArrives(busStop);
		LineController.getListFromCurrentRegion(function(lineSet){
			var html = 
				BusStopView.leftButton()
				+ BusStopView.rightButton()
				+ ViewTools.busStopRowDetails(busStop, lineSet, arriveList)
			;
			$('#'+BusStopView.div).html(html);
			$('#'+BusStopView.div).show();
		});
	};
	
	return _r;
})();

