
(function () {

var WebLocalStorage = function() {
}


//PUBLIC
WebLocalStorage.prototype.init = function(createTables){
	if(createTables){
		for(var table in createTables){
			if(undefined == localStorage[table]){
				localStorage.setItem(table, '{"__autoincrement":0}');
			}
		}
	}
	$(document).trigger(LocalStorage.INITIALIZED);
};

WebLocalStorage.prototype.save = function(table, kvPairs, onDoneGetId, onError){
	this._transaction(table, function(data, onTableDataChanged){
		if(undefined == kvPairs.id){
			kvPairs.id = data.__autoincrement++; 
		}else if(data.__autoincrement < kvPairs.id){
			data.__autoincrement = kvPairs.id*1;
		}
		data[kvPairs.id] = kvPairs;  
		onTableDataChanged(data);
		if(onDoneGetId){
			onDoneGetId(kvPairs.id);
		}
	}, onError);
};

WebLocalStorage.prototype.load = function(table, kvPairs, onDoneGetResult, onError){
	this._transaction(table, function(data){
		if(undefined == kvPairs) {
			kvPairs = {};
		}
		
		if(undefined == kvPairs.id){
			var result = [];
			for(var id in data){
				if(id != '__autoincrement'){
					var push = true;
					for(var k in kvPairs){
						if(undefined == data[id][k] || data[id][k] != kvPairs[k]){
							push = false;
							break;
						}
					}
					if(push){
						result.push(data[id]);
					}
				}
			}
			onDoneGetResult(result);
		}else{
			if(undefined == data[kvPairs.id]){
				onDoneGetResult([]);
			}else{
				onDoneGetResult([data[kvPairs.id]]);
			}
		}
	}, onError);
};

WebLocalStorage.prototype.remove = function(table, kvPairs, onDone, onError){
	this._transaction(table, function(data, onTableDataChanged){
		if(undefined == kvPairs.id){
			this.load(table, kvPairs, function(row){
				data[row.id] = undefined;
				onTableDataChanged(data);
				onDone();
			});
		}else{
			data[kvPairs.id] = undefined;
			onTableDataChanged(data);
			onDone();
		}
	}, onError);
};

//PRIVATE
WebLocalStorage.prototype._queryError = function(err){
	console.log("Error processing SQL: ");
	console.log(err);
	console.log(printStackTrace());
	$(document).trigger(LocalStorage.QUERY_ERROR, [err]);
};

WebLocalStorage.prototype._transaction = function(table, onDoneGetTableData, onError){
	if(undefined == localStorage[table]){
		var err = {code : LocalStorage.ERROR_UNKNOWN_TABLE, message : 'LocalStorage.ERROR_UNKNOWN_TABLE'};
		this._queryError(err);
		if(onError){
			onError(err);
		}
	}else{
		onDoneGetTableData(JSON.parse(localStorage[table]), function(resultObject){
			var res = JSON.stringify(resultObject);
			localStorage[table] = res;
		});
	}
};

window.WebLocalStorage = WebLocalStorage;
}());

