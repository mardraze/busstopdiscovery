var ServerStorage = ServerStorage || (function () {

	var _r = new Object();
	
	//DISPATCH EVENTS
	_r.QUERY_ERROR = 'SERVER_STORAGE_QUERY_ERROR';

	//PUBLIC

	_r.init = function(url, onDone){
		ServerStorage.url = url;
		onDone();
	};

	_r.insert = function(table, kvPairs, callback){
		this._query({type: 'insert', table: table, kvPairs: kvPairs}, callback);
	};

	_r.load = function(table, kvPairs, options, callback){
		var params = {type: 'load', table: table, kvPairs: kvPairs};
		if(undefined != options.limit_count){
			params.limit_count = options.limit_count * 1;
		}

		if(undefined != options.limit_start){
			params.limit_start = options.limit_start * 1;
		}
		
		_r._query(params, callback);
	};

	_r.remove = function(table, kvPairs, callback){
		_r._query({type: 'remove', table: table, kvPairs: kvPairs}, callback);
	};
	//PRIVATE
	_r._query = function(data, success){
		$.ajax({
			type: "GET",
			url: ServerStorage.url,
			data: data,
			success: success,
			error: function(err){
				console.log(err);
				$(document).trigger(ServerStorage.QUERY_ERROR, [err]);
				success(); //ERROR
			},
			dataType: "json",
		});
	};
	return _r;
})();
