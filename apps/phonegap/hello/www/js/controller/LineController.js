var LineController = LineController || (function () {

	var _r = new Object();
	
	_r.cache = {};
	
	_r.getListFromCurrentRegion = function(onDone){
		var currentRegion = RegionController.currentRegion;
		
		if(LineController.cache[currentRegion]){
			onDone(LineController.cache[currentRegion]);
		}else{
			CompanyProxy.getList({region_id: currentRegion}, {}, function(companyList){
				var ids = [];
				for(var i=0; i<companyList.length; i++){
					ids.push(companyList[i].id);
				}
				LineProxy.getListByCompanyIds(ids, {}, function(){
					var lines2 = {};
					for(var i=0; i<lines.length; i++){
						lines2[lines[i].id] = lines[i];
					}
					LineController.cache[currentRegion] = lines2;
					onDone(LineController.cache[currentRegion]);
				});
			});
		}
	};

	return _r;
})();

