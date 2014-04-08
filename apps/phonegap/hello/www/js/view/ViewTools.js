var ViewTools = ViewTools || (function () {

	var _r = new Object();
	
	_r.busStopRowDetails = function(row, prefix){
		return 'okokok';
	};
	
	_r.busStopRowList = function(rows, prefix){
		if(prefix){
			prefix += '_';
		}else{
			prefix = '';
		}
		for(var key in rows){
			var row = rows[key];
			return '<div class="cell lp"><input type="checkbox" id="'+prefix+'item_'+row.id+'" name="list_'+row.id+'" value="'+row.id+'"/></div>\
					<div class="cell"><label for="'+prefix+'item_'+row.id+'">'+row.name+'</label></div>\
					<div class="cell"><label for="'+prefix+'item_'+row.id+'">'+row.user+'</label></div>\
					<div class="clear"></div>';			
		}
	};
	return _r;
})();

