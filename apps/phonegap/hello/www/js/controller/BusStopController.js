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

		var additionalParams = {
			limit_start: 0, 
			limit_count: 10, 
			fields : [
				{ 'field' : 'latlon', 'func' : 'ST_X', 'alias' : 'x'},
				{ 'field' : 'latlon', 'func' : 'ST_Y', 'alias' : 'y'},
				{
					'field' : ['latlon', where.in_circle.lat, where.in_circle.lon], 
					'func' : 'ST_Distance', 
					'alias' : 'distance',
				},
				{ 'field' : '*'},
			],
			order_by : 'distance',
			
		};
		
		BusStopProxy.getList(where, additionalParams, function(data){
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

