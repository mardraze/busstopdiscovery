var UserBusStopProxy = UserBusStopProxy || (function () {

	var _r = new Object();//Extend function
	
	_r.getList = function(onDone){
		LocalStorage.connection().load('BusStop', {}, onDone);
	};

	_r.getOne = function(id, onDone){
		LocalStorage.connection().load('BusStop', {id:id}, function(list){
			if(list.length > 0){
				onDone();
			}else{
				onDone(list[0]);
			}
		});
	};

	_r.save = function(kvPairs, onDone){
		LocalStorage.connection().save('BusStop', kvPairs, onDone);
	};
		
	return _r;
})();

