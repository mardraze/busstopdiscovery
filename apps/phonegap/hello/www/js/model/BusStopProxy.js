var BusStopProxy = BusStopProxy || (function () {

	var _r = new Object();
	
	_r.getList = function(kvPairs, options, onDone){
		ServerStorage.load('positions', kvPairs, options, function(list){
			onDone(list);
		});
	};

	_r.getOne = function(id, onDoneGetRow){
		ServerStorage.load('positions', {'id' : id}, {}, function(result){
			if(result && result.success && result.data.length > 0){
				onDoneGetRow(result.data[0]);
			}else{
				onDoneGetRow();
			}
		});
	};

	_r.save = function(kvPairs, onDone){
		ServerStorage.save('positions', kvPairs, onDone);
	};

	return _r;
})();

