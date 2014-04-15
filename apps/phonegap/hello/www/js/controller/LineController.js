var LineController = LineController || (function () {

	var _r = new Object();
	
	_r.cache = {};
	
	_r.getListFromCurrentRegion = function(onDone){
		var currentRegion = RegionController.currentRegion;
		if(LineController.cache[currentRegion]){
			onDone(LineController.cache[currentRegion]);
		}else{
			LineProxy.getList(function(list){
				LineController.cache[currentRegion] = list;
				onDone(LineController.cache[currentRegion]); 
			});
		}
	};

	return _r;
})();

