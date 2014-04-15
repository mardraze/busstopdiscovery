var ViewTools = ViewTools || (function () {

	var _r = new Object();
	
	_r.userFriendlyTime = function(weekSeconds){
		var date = new Date();
		var mondaysMidnight = new Date();
		//mondaysMidnight.setDate(date.getDate() - date.getDay());//Sunday is first day of week
		mondaysMidnight.setHours(0);
		mondaysMidnight.setMinutes(0);
		mondaysMidnight.setSeconds(0);
		mondaysMidnight.setMilliseconds(0);
		mondaysMidnight.setTime(mondaysMidnight.getTime() + (weekSeconds * 1000));
		var timeOffset = ((mondaysMidnight.getTime() - date.getTime()) * 1);
		if(timeOffset < APP.friendlyTimeSeconds){
			var minutes = parseInt((timeOffset/1000)/60);
			if(minutes > 0){
				var ending = __(' minut');
				if(minutes == 1){
					ending = __(' minutę');
				}else if(minutes < 5){
					ending = __(' minuty');
				}
				return __('Za ')+parseInt((timeOffset/1000)/60)+ending;
			}else{
				return '-';
			}
		}
		return mondaysMidnight.toString();
	};
	
	_r.busStopRowDetails = function(busStopVO, lineList, arriveList){
		var html = '<table><tr><td>'+busStopVO.name+'</td></tr>';

		for(var i=0; i<arriveList.length; i++){
			html += '<tr><td>'+lineList[arriveList[i].line_id].name+' '+ViewTools.userFriendlyTime(arriveList[i].time)+'</td></tr>';
		}
		html += '<tr><td></td></tr></table>';
		
		return html;
	};
	
	_r.busStopRowList = function(rows, prefix){
		if(prefix){
			prefix += '_';
		}else{
			prefix = '';
		}
		html = '';
		for(var key in rows){
			var row = rows[key];
			html += '<div class="cell lp"><input type="checkbox" id="'+prefix+'item_'+row.id+'" name="list_'+row.id+'" value="'+row.id+'"/></div>\
					<div class="cell"><label for="'+prefix+'item_'+row.id+'">'+row.name+'</label></div>\
					<div class="cell"><label for="'+prefix+'item_'+row.id+'">'+(row.user ? row.user : '')+'</label></div>\
					<div class="clear"></div>';
		}
		return html;
	};
	return _r;
})();

