/**
*@namespace 
*/
(function () {

/**
* 
* 
* @author Marten ?gaard
* @created 3/4/2014
* @copyright Adnuvo
* @todo 
* @class WebLocalStorage
* @constructor
*/
var WebLocalStorage = function() {
}


//PUBLIC
WebLocalStorage.prototype.init = function(createTables){
	this._busy = false;
	
	console.log(localStorage);
	if(createTables){
		for(var table in createTables){
			if(undefined == localStorage[table]){
				localStorage.setItem(table, '{"__autoincrement":0}');
			}
		}
	}
	$(document).trigger(LocalStorage.INITIALIZED);
	
};

WebLocalStorage.prototype.save = function(table, kvPairs, onDoneGetId){
	console.log('WebLocalStorage.prototype.save', table, kvPairs);
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
	});
};

WebLocalStorage.prototype.load = function(table, kvPairs, onDoneGetResult){
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
	});
};

WebLocalStorage.prototype.remove = function(table, kvPairs, onDone){
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
	});
};

//PRIVATE
WebLocalStorage.prototype._queryError = function(err){
	console.log("Error processing SQL: ");
	console.log(err);
	$(document).trigger(LocalStorage.QUERY_ERROR, [err]);
};

WebLocalStorage.prototype._transaction = function(table, onDoneGetTableData){
	if(undefined == localStorage[table]){
		this._queryError({code : LocalStorage.ERROR_UNKNOWN_TABLE, message : 'LocalStorage.ERROR_UNKNOWN_TABLE'});
	}else{
		onDoneGetTableData(JSON.parse(localStorage[table]), function(resultObject){
			var res = JSON.stringify(resultObject);
			localStorage[table] = res;
		});
		
	}
};

window.WebLocalStorage = WebLocalStorage;
}());

