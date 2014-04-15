var CompanyProxy = CompanyProxy || (function () {

	var _r = new Object();
	
	_r.getList = function(kvPairs, options, onDone){
		ServerStorage.load('company', kvPairs, options, function(list){
			if(list && list.success){
				onDone(list.data);
			}else{
				onDone([]);
			}
		});
	};

	_r.getOne = function(id, onDoneGetRow){
		ServerStorage.load('company', {'id' : id}, {}, function(result){
			if(result && result.success && result.data.length > 0){
				onDoneGetRow(result.data[0]);
			}else{
				onDoneGetRow();
			}
		});
	};

	_r.save = function(kvPairs, onDone){
		ServerStorage.save('company', kvPairs, onDone);
	};

	return _r;
})();

