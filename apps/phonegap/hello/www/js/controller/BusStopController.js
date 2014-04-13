var BusStopController = BusStopController || (function () {

	var _r = new Object();
	
	_r.searchNearest = function(onDone){
		var where = {
			regionId: RegionController.currentRegion,
			in_circle : {
				lat : 54.369546,
				lon : 18.607197,
				distance : 0.01,
			}
		}
		BusStopProxy.getList(where, {limit_start: 0, limit_count: 10}, function(data){
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

