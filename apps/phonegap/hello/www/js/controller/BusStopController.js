var BusStopController = BusStopController || (function () {

	var _r = new Object();
	
	_r.searchNearest = function(onDone){
		
		BusStopProxy.getList({region: RegionController.currentRegion}, {limit_start: 0, limit_count: 10}, function(data){
			if(data && data.success && data.count){
				var list = data.data;
				console.log(list);
				onDone(list);
			}else{
				onDone({});
			}
		});
	};
	
	$(document).ready(function(){
		
	});
	
	return _r;
})();

