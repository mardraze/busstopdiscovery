var UserListController = UserListController || (function () {

	var _r = new Object();
	_r.addToList = function(id, onDone){
		UserBusStopProxy.getOne(id, function(row){
			if(!row){
				BusStopProxy.getOne(id, function(origRow){
					origRow.orig_id = origRow.id;
					origRow.user_id = APP.userId;
					origRow.id = undefined; //auto increment
					origRow.arriveList = [];
					ArriveProxy.getList({busstop_id : origRow.orig_id}, {fields : ['id', 'line_id', 'time', 'type']}, function(list){
						origRow.arriveList = list;
						UserBusStopProxy.save(origRow);
						if(onDone){
							onDone(origRow);
						}
					});
				});
			}
		});
	};
	
	_r.loadList = function(onDone){
		UserBusStopProxy.getList(function(list){
			onDone(list ? list : []);
		});
	};

	return _r;
})();

