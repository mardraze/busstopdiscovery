var ArriveController = ArriveController || (function () {

	var _r = new Object();

	_r.getCurrentArrives = function(busStopVO){
		var list = busStopVO.arriveList;

		var midnight = new Date();
		midnight.setHours(0);
		midnight.setMinutes(0);
		midnight.setSeconds(0);
		midnight.setMilliseconds(0);
		var date = new Date();
		var time = parseInt((date.getTime() - midnight.getTime()) / 1000);
		var list2 = [];
		var type = '1';
		for(var i=0; i<list.length; i++){
			if(time < parseInt(list[i].time) && list[i].type == type){
				list2.push(list[i]);
				if(list2.length >= 10){
					break;
				}
			}
		}
		
		list2.sort(function(a, b){
			return parseInt(a.time) - parseInt(b.time);
		});

		busStopVO.arriveList = list2;
		return busStopVO;
	};

	return _r;
})();

