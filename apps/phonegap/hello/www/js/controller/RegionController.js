var RegionController = RegionController || (function () {

	var _r = new Object();

	_r.currentRegion = 1;
	_r.perPage = 10;
	
	_r.searchNearest = function(onDone){
		BusStopProxy.getList({regionId: RegionController.currentRegion}, function(list){
			onDone(list);
		});
	};
	
	$(document).ready(function(){
		RegionController.currentRegion = '1';//TODO 
	});
	
	return _r;
})();

