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
	if(createTables){
		for(var table in createTables){
			if(undefined == localStorage[table]){
				localStorage.setItem(table, 
				{
					__autoincrement:0, 
					insert: function(row){
						if(undefined == row.id){
							row.id = this.__autoincrement++; 
						}else if(this.__autoincrement < row.id){
							this.__autoincrement = row.id*1;
						}
						this[row.id] = row;  
						return row.id;
					}
				});
			}
		}
	}
	$(document).trigger(LocalStorage.INITIALIZED);
	
};

WebLocalStorage.prototype.insert = function(table, kvPairs, onDoneGetId){
	this._transaction(table, function(data){
		onDoneGetId(localStorage[table].insert(kvPairs));
	});
};

WebLocalStorage.prototype.load = function(table, kvPairs, onDoneGetResult){
	this._transaction(table, function(data){
		if(undefined == kvPairs.id){
			var result = [];
			for(var id in data){
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
			onDoneGetResult(result);
		}else{
			onDoneGetResult([data[kvPairs.id]]);
		}
	});
};

WebLocalStorage.prototype.remove = function(table, kvPairs, onDone){
	this._transaction(table, function(data){
		if(undefined == kvPairs.id){
			this.load(table, kvPairs, function(row){
				data[row.id] = undefined;
				localStorage[table] = data;
				onDone();
			});
		}else{
			data[kvPairs.id] = undefined;
			localStorage[table] = data;
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
	if(!this._busy){
		this._busy = true;
		if(undefined == localStorage[table]){
			this._queryError({code : LocalStorage.ERROR_UNKNOWN_TABLE, message : 'LocalStorage.ERROR_UNKNOWN_TABLE'});
		}else{
			onDoneGetTableData(localStorage[table]);
		}
		this._busy = false;
	}
};

window.WebLocalStorage = WebLocalStorage;
}());

