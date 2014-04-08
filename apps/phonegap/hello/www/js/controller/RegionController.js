var RegionController = RegionController || (function () {

	var _r = new Object();

	_r.currentRegion = 'gdansk';
	_r.perPage = 10;
	
	_r.searchNearest = function(onDone){
		BusStopProxy.getList({region: RegionController.currentRegion}, function(list){
			onDone(list);
		});
	};
	
	$(document).ready(function(){
		RegionController.currentRegion = 'gdansk';//TODO 
	});
	
	return _r;
})();

