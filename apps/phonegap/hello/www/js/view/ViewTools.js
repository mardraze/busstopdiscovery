var ViewTools = ViewTools || (function () {

	var _r = new Object();
	
	_r.userFriendlyTime = function(secondsFromMidnight){
		var date = new Date();
		var nextDate = new Date();
		nextDate.setHours(0);
		nextDate.setMinutes(0);
		nextDate.setSeconds(0);
		nextDate.setMilliseconds(0);
		nextDate.setTime(nextDate.getTime() + (secondsFromMidnight * 1000));
		var timeOffset = ((nextDate.getTime() - date.getTime()) * 1);
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
		return nextDate.getHours()+':'+nextDate.getMinutes();
	};
	
	_r.busStopRowDetails = function(busStopVO, lineSet, arriveList){
		var html = '<table><tr><td>'+busStopVO.name+'</td></tr>';
		for(var i=0; i<arriveList.length; i++){
			html += '<tr><td>'
			+(lineSet[arriveList[i].line_id] ? lineSet[arriveList[i].line_id].name : '')
			+' '+ViewTools.userFriendlyTime(arriveList[i].time)+'</td></tr>';
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

