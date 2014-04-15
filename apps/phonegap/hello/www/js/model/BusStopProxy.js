var BusStopProxy = BusStopProxy || (function () {

	var _r = new Object();
	
	_r.getList = function(kvPairs, options, onDone){
		ServerStorage.load('busstop', kvPairs, options, function(list){
			if(list.success){
				onDone(list.data);
			}else{
				onDone([]);
			}
		});
	};

	_r.getOne = function(id, onDoneGetRow){
		ServerStorage.load('busstop', {'id' : id}, {}, function(result){
			if(result && result.success && result.data.length > 0){
				onDoneGetRow(result.data[0]);
			}else{
				onDoneGetRow();
			}
		});
	};

	_r.save = function(kvPairs, onDone){
		ServerStorage.save('busstop', kvPairs, onDone);
	};

	return _r;
})();

