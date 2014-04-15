var LineController = LineController || (function () {

	var _r = new Object();
	
	_r.lineSetCache = {};
	
	_r.getListFromCurrentRegion = function(onDone){
		var currentRegion = RegionController.currentRegion;
		
		if(LineController.lineSetCache[currentRegion]){
			onDone(LineController.lineSetCache[currentRegion]);
		}else{
			CompanyProxy.getList({region_id: currentRegion}, {}, function(companyList){
				var ids = [];
				for(var i=0; i<companyList.length; i++){
					ids.push(companyList[i].id);
				}
				LineProxy.getListByCompanyIds(ids, {}, function(list){
					var lineSet = {};
					for(var i=0; i<list.length; i++){
						lineSet[list[i].id] = list[i];
					}
					LineController.lineSetCache[currentRegion] = lineSet;
					onDone(LineController.lineSetCache[currentRegion]);
				});
			});
		}
	};

	return _r;
})();

