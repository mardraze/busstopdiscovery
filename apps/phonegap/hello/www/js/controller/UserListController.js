var UserListController = UserListController || (function () {

	var _r = new Object();

	_r.addToList = function(id){
		console.log('UserListController.addToList', id);
		UserBusStopProxy.getOne(id, function(row){
			if(!row){
				BusStopProxy.getOne(id, function(origRow){
					origRow.orig_id = origRow.id;
					origRow.user_id = APP.userId;
					origRow.id = undefined; //auto increment
					UserBusStopProxy.save(origRow);
				});
			}
		});
	};
	
	_r.loadList = function(onDone){
		UserBusStopProxy.getList(function(list){
			onDone([]);
			//onDone(list ? list : []);
		});
	};

	return _r;
})();

