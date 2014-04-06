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
* @class SQLiteLocalStorage
* @constructor
*/
var SQLiteLocalStorage = function() {
}


//PUBLIC
SQLiteLocalStorage.prototype.init = function(db, createTables){
	this.db = db;
	//PRIVATE
	this._kvPairsToSqlData = function(kvPairs){
		var keys = Object.keys(kvPairs);
		var values = [];
		for (var k in kvPairs) {
		  if (kvPairs.hasOwnProperty(k)) {
			values.push(kvPairs[k]);
		  }
		}
		return {keys : keys, values : values};
	};
	
	this._queryError = function(err){
		console.log("Error processing SQL: ");
		console.log(err);
		$(document).trigger(LocalStorage.QUERY_ERROR, [err]);
	};
	
	if(createTables){
		this.db.transaction(function(tx){
			for(var tableName in createTables){
				var fields = createTables[tableName];
				tx.executeSql('CREATE TABLE IF NOT EXISTS '+tableName+' ('+fields+')');
			}
			$(document).trigger(LocalStorage.INITIALIZED);
		}, this._queryError);		
	}else{
		$(document).trigger(LocalStorage.INITIALIZED);
	}
};

SQLiteLocalStorage.prototype.insert = function(table, kvPairs, callback){
	if(this.db){
		var sqlData = this._kvPairsToSqlData(kvPairs);
		var quesMarks = [];
		for(var i=0; i<sqlData.keys.length; i++){
			quesMarks.push('?');
		}
		
		this.db.transaction(function (tx) {tx.executeSql(
			'INSERT INTO '+table+'('+sqlData.keys.join(',')+') VALUES ('+quesMarks.join(',')+')'
		, sqlData.values), this._queryError});
	}
};

SQLiteLocalStorage.prototype.load = function(table, kvPairs, callback){
	if(this.db){
		var sqlData = this._kvPairsToSqlData(kvPairs);
		this.db.transaction(function(tx){
			tx.executeSql('SELECT * FROM '+table+(sqlData.keys.length == 0 ? '' : (' WHERE '+sqlData.keys.join(' = ?, ')+' = ?')), sqlData.values, callback, this._queryError);
		}, this._queryError);
	}else{
		callback(); //LocalStorage IS DISABLED
	}
	
};

SQLiteLocalStorage.prototype.remove = function(table, kvPairs, callback){
	var sqlData = this._kvPairsToSqlData(kvPairs);
	this.db.transaction(function(tx){
		tx.executeSql('DELETE FROM '+table(sqlData.keys.length == 0 ? '' : (' WHERE '+sqlData.keys.join(' = ?, ')+' = ?')), sqlData.values, callback, this._queryError);
	}, this._queryError);
};


window.SQLiteLocalStorage = SQLiteLocalStorage;
}());

