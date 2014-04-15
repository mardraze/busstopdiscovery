var LineProxy = LineProxy || (function () {

	var _r = new Object();
	
	_r.getList = function(kvPairs, options, onDone){
		ServerStorage.load('line', kvPairs, options, function(list){
			if(list && list.success){
				onDone(list.data);
			}else{
				onDone([]);
			}
		});
	};

	_r.getOne = function(id, onDoneGetRow){
		ServerStorage.load('line', {'id' : id}, {}, function(result){
			if(result && result.success && result.data.length > 0){
				onDoneGetRow(result.data[0]);
			}else{
				onDoneGetRow();
			}
		});
	};

	_r.save = function(kvPairs, onDone){
		ServerStorage.save('line', kvPairs, onDone);
	};

	return _r;
})();

