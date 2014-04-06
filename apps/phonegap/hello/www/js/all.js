

//Facade
var APP = APP || (function () { 

	var _r = new Object();
	
	/**
	* 
	* @method start
	*/
	_r.start = function(config){
		if(config){
			for(var key in config){
				this[key] = config[key];
			}
		}
		$(document).on(LocalStorage.INITIALIZED, function(){
			BusStopProxy.loadList(APP.userId);
			UpdatePositionController.run();
		});
		_r._setupLocalStorage();
	};
	
	_r._setupLocalStorage = function(){
		var tables = {
			'BusStop' : ['user_id', 'lon', 'lat', 'name'],
		};
		if(undefined != localStorage){
			console.log('APP::_setupLocalStorage => WebLocalStorage');
			//HTML5 LocalStorage
			LocalStorage.initWeb(tables);
		}else if(undefined != window.openDatabase){
			console.log('SQLite');
			//SQLite storage
			var DATABASE_SIZE = 1000000;
			var DATABASE_NAME = "test";
			var DATABASE_DESCRIPTION = "Test DB";
			var DATABASE_VERSION = "1.0";
			LocalStorage.initSQLite(
				window.openDatabase(DATABASE_NAME, DATABASE_VERSION, DATABASE_DESCRIPTION, DATABASE_SIZE), 
				tables
			);
		}else{
			console.log('Ajax Storage');
			//Ajax storage
			LocalStorage.initAjax('http://localhost/projekty/storage');
		}
	};

	return _r;
})();
/**
*@namespace 
*/


/**
* 
* 
* @author Marten Olgaard
* @created 4/4/2014
* @copyright Adnuvo
* @todo 
* @class UpdatePositionController
* @static
*/
var UpdatePositionController = UpdatePositionController || (function () {

	var _r = new Object();//Extend function
	_r.USER_LIST_POSITION_CHANGED = 'USER_LIST_POSITION_CHANGED';
	/**
	* 
	* @property {int} frequency
	*/
	_r.frequency = 10000;
	
	_r._isNearer = function(current, next, lon, lat){
		var currentDX = Math.abs(current.lon - lon);
		var currentDY = Math.abs(current.lat - lat);
		var nextDX = Math.abs(next.lon - lon);
		var nextDY = Math.abs(next.lat - lat);
		return (currentDX * currentDX + currentDY * currentDY < nextDX * nextDX + nextDY * nextDY);
	};
	
	_r._onPositionUpdateSuccess = function(position){
		var lat = position.coords.latitude;
		var lon = position.coords.longitude;
		console.log(lon);
		console.log(lat);
		var sortFunct = function(a, b){
			_r._isNearer(a, b, lon, lat)
		};
		_r.list.sort(sortFunct)
	
		_r.lon = lon;
		_r.lat = lat;
		
		$(document).trigger(UpdatePositionController.USER_LIST_POSITION_CHANGED);
		
	};

	_r._onPositionUpdateError = function(){
		console.log('_onPositionUpdateError');
	};
	
	_r.update = function(){
		console.log('_r.update');
		//navigator.geolocation.getCurrentPosition(_r._onPositionUpdateSuccess, _r._onPositionUpdateError);
	};
	
	_r.getSortedList = function(){
		return _r.list;
	};
	
	_r._onUserListLoaded = function(e, userId){
		console.log('_r._onUserListLoaded');
		console.log(userId == APP.userId);
		console.log(APP.userId);
		console.log(userId);
		if(userId == APP.userId){
			_r.list = BusStopProxy.getList(APP.userId);
			_r.update();
		}
	};
	_r.running = false;
	_r.run = function(){
		if(!_r.running){
			$(document).on(BusStopProxy.USER_LIST_LOADED, _r._onUserListLoaded);
			_r.running = true;
			var repeat = function(){
				_r.update();
				setTimeout(repeat, _r.frequency);
			};
			setTimeout(repeat, _r.frequency);
		}
	};
	
	
	return _r;
})();

/**
*@namespace 
*/


/**
* 
* 
* @author Marten Olgaard
* @created 4/4/2014
* @copyright Adnuvo
* @todo 
* @class BusStopProxy
* @static
*/
var BusStopProxy = BusStopProxy || (function () {

	var _r = new Object();//Extend function
	
	//LOCAL EVENTS
	_r.USER_LIST_LOADED = 'USER_LIST_LOADED';
	
	/**
	* 
	* @method getList
	* @param {int} userId 
	* @param {String : null} searchQuery 
	* @param {Boolean : false} fromServer 
	* @return {Object}
	*/
	_r.getList = function(userId, searchQuery, fromServer){
		return _r.cache[userId];
	};
	
	_r.loadList = function(userId, searchQuery, fromServer){
		console.log('BusStopProxy.loadList');
		if(undefined === _r.cache[userId]){
			LocalStorage.connection().load('BusStop', {'user_id' : userId}, function(list){
				console.log('loadList => LocalStorage.load('+userId+')');
				console.log(list);
				_r.cache[userId] = list ? list : [];
				$(document).trigger(BusStopProxy.USER_LIST_LOADED, [userId]);
			});
		}else{
			console.log('BusStopProxy loadList('+userId+')');
			$(document).trigger(BusStopProxy.USER_LIST_LOADED, [userId]);
		}
	};

	/**
	* 
	* @method saveList
	* @param {BusStopVO[0..*]} list 
	* @param {Boolean : false} toServer 
	*/
	_r.saveList = function(list, toServer){
		
		//Stub code - to be removed
		alert("the function 'saveList' has been called  " + " with the following parameters:" + " list:" + list)
		
		//Stub code - to be removed
		alert("the function 'saveList' has been called  " + " with the following parameters:" + " list:" + list + " toServer:" + toServer)
		
	};
	/**
	* 
	* @method getOne
	* @param {int} id 
	* @return {Object}
	*/
	_r.getOne = function(id){
		
		//Stub code - to be removed
		alert("the function 'getOne' has been called  " + " with the following parameters:" + " id:" + id)
		
		return new Object();
	};
	/**
	* 
	* @method save
	* @param {Object} busStop 
	* @param {Boolean : false} toServer 
	*/
	_r.save = function(busStop, toServer){
		
		//Stub code - to be removed
		alert("the function 'save' has been called  " + " with the following parameters:" + " busStop:" + busStop)
		
		//Stub code - to be removed
		alert("the function 'save' has been called  " + " with the following parameters:" + " busStop:" + busStop + " toServer:" + toServer)
		
	};
		
	_r.cache = [];
	
	return _r;
})();

/**
*@namespace 
*/


/**
* 
* 
* @author Marten Olgaard
* @created 4/4/2014
* @copyright Adnuvo
* @todo 
* @class RegionProxy
* @static
*/
var RegionProxy = RegionProxy || (function () {

	var _r = new Object();//Extend function
		
	/**
	* 
	* @method getList
	* @param {int} parentId 
	* @return {Object}
	*/
	_r.getList = function(parentId){
		
		//Stub code - to be removed
		alert("the function 'getList' has been called  " + " with the following parameters:" + " parentId:" + parentId)
		
		return new Object();
	};
	/**
	* 
	* @method save
	* @param {Object} region 
	*/
	_r.save = function(region){
		
		//Stub code - to be removed
		alert("the function 'save' has been called  " + " with the following parameters:" + " region:" + region)
		
	};
	/**
	* 
	* @method getOne
	* @param {int} id 
	* @return {Object}
	*/
	_r.getOne = function(id){
		
		//Stub code - to be removed
		alert("the function 'getOne' has been called  " + " with the following parameters:" + " id:" + id)
		
		return new Object();
	};
		
	return _r;
})();

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
* @class AjaxLocalStorage
* @constructor
*/
var AjaxLocalStorage = function() {
}

//PUBLIC
AjaxLocalStorage.prototype.init = function(url){
	this._url = url;

	//PRIVATE
	this._query = function(data, success){
		$.ajax({
			type: "POST",
			url: this._url,
			data: data,
			success: success,
			error: function(err){
				console.log('LocalStorage.QUERY_ERROR');
				console.log(err);
				$(document).trigger(LocalStorage.QUERY_ERROR, [err]);
				success(); //ERROR
			},
			dataType: 'json'
		});
	};
	$(document).trigger(LocalStorage.INITIALIZED);
};

AjaxLocalStorage.prototype.insert = function(table, kvPairs, callback){
	this._query({type: 'insert', table: table, kvPairs: kvPairs}, callback);
};

AjaxLocalStorage.prototype.load = function(table, kvPairs, callback){
	this._query({type: 'load', table: table, kvPairs: kvPairs}, callback);
};

AjaxLocalStorage.prototype.remove = function(table, kvPairs, callback){
	this._query({type: 'remove', table: table, kvPairs: kvPairs}, callback);
};


window.AjaxLocalStorage = AjaxLocalStorage;
}());

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
	this._db = db;
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
		this._db.transaction(function(tx){
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
	var sqlData = this._kvPairsToSqlData(kvPairs);
	var quesMarks = [];
	for(var i=0; i<sqlData.keys.length; i++){
		quesMarks.push('?');
	}
	
	this._db.transaction(function (tx) {tx.executeSql(
		'INSERT INTO '+table+'('+sqlData.keys.join(',')+') VALUES ('+quesMarks.join(',')+')'
	, sqlData.values), this._queryError});
};

SQLiteLocalStorage.prototype.load = function(table, kvPairs, callback){
	var sqlData = this._kvPairsToSqlData(kvPairs);
	this._db.transaction(function(tx){
		tx.executeSql('SELECT * FROM '+table+(sqlData.keys.length == 0 ? '' : (' WHERE '+sqlData.keys.join(' = ?, ')+' = ?')), sqlData.values, callback, this._queryError);
	}, this._queryError);
	
};

SQLiteLocalStorage.prototype.remove = function(table, kvPairs, callback){
	var sqlData = this._kvPairsToSqlData(kvPairs);
	this._db.transaction(function(tx){
		tx.executeSql('DELETE FROM '+table(sqlData.keys.length == 0 ? '' : (' WHERE '+sqlData.keys.join(' = ?, ')+' = ?')), sqlData.values, callback, this._queryError);
	}, this._queryError);
};


window.SQLiteLocalStorage = SQLiteLocalStorage;
}());

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

/**
*@namespace 
*/


/**
* 
* 
* @author Marten Olgaard
* @created 4/4/2014
* @copyright Adnuvo
* @todo 
* @class BusStopProxy
* @static
*/
var LocalStorage = LocalStorage || (function () {

	var _r = new Object();
	
	//DISPATCH EVENTS
	_r.LOADED = 'LOCAL_STORAGE_LOADED';
	_r.QUERY_ERROR = 'LOCAL_STORAGE_QUERY_ERROR';
	_r.INITIALIZED = 'LOCAL_STORAGE_INITIALIZED';
	
	//CONST
	_r.MODE_SQLITE = 'LOCAL_STORAGE_MODE_SQLITE';
	_r.MODE_AJAX = 'LOCAL_STORAGE_MODE_AJAX';
	_r.MODE_WEB = 'LOCAL_STORAGE_MODE_WEB';
	
	//PUBLIC
	_r.initWeb = function(createTables){
		this._mode = LocalStorage.MODE_WEB;
		this._connection = new WebLocalStorage();
		this._connection.init(createTables);
	};
	
	_r.initSQLite = function(db, createTables){
		this._mode = LocalStorage.MODE_SQLITE;
		this._connection = new SQLiteLocalStorage();
		this._connection.init(db, createTables);
	};

	_r.initAjax = function(url){
		this._mode = LocalStorage.MODE_AJAX;
		this._connection = new AjaxLocalStorage();
		this._connection.init(url);
	};

	_r.connection = function(){
		return this._connection;
	};
	
	return _r;
})();
/**
*@namespace 
*/


/**
* 
* 
* @author Marten Olgaard
* @created 4/4/2014
* @copyright Adnuvo
* @todo 
* @class UserProxy
* @static
*/
var UserProxy = UserProxy || (function () {

	var _r = new Object();//Extend function
		
	/**
	* 
	* @method save
	* @param {Object} user 
	*/
	_r.save = function(user){
		
		//Stub code - to be removed
		alert("the function 'save' has been called  " + " with the following parameters:" + " user:" + user)
		
	};
	/**
	* 
	* @method getList
	* @param {String} searchQuery 
	*/
	_r.getList = function(searchQuery){
		
		//Stub code - to be removed
		alert("the function 'getList' has been called  " + " with the following parameters:" + " searchQuery:" + searchQuery)
		
	};
	/**
	* 
	* @method getOne
	* @param {int} id 
	*/
	_r.getOne = function(id){
		
		//Stub code - to be removed
		alert("the function 'getOne' has been called  " + " with the following parameters:" + " id:" + id)
		
	};
		
	return _r;
})();

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
* @class ArriveVO
* @constructor
*/
var ArriveVO = function() {


	//Super constructor - optional
	//.apply(this,argumentsArray);
}

/**
* 
* @property {int} id
*/
ArriveVO.prototype.id = NaN;
/**
* 
* @property {int} busStopId
*/
ArriveVO.prototype.busStopId = NaN;
/**
* 
* @property {int} lineId
*/
ArriveVO.prototype.lineId = NaN;
/**
* 
* @property {int} time
*/
ArriveVO.prototype.time = NaN;
/**
* 
* @property {String} note
*/
ArriveVO.prototype.note = null;
window.ArriveVO = ArriveVO;
}());

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
* @class BusStopVO
* @constructor
*/
var BusStopVO = function() {


	//Super constructor - optional
	//.apply(this,argumentsArray);
}

/**
* 
* @property {String} id
*/
BusStopVO.prototype.id = null;
/**
* 
* @property {int} userId
*/
BusStopVO.prototype.userId = NaN;
/**
* 
* @property {int} origBusStopId
*/
BusStopVO.prototype.origBusStopId = NaN;
/**
* 
* @property {int} rate
*/
BusStopVO.prototype.rate = NaN;
/**
* 
* @property {int} usersCount
*/
BusStopVO.prototype.usersCount = NaN;
/**
* 
* @property {String} name
*/
BusStopVO.prototype.name = null;
/**
* 
* @property {String} searchDump
*/
BusStopVO.prototype.searchDump = null;
window.BusStopVO = BusStopVO;
}());

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
* @class CompanyVO
* @constructor
*/
var CompanyVO = function() {


	//Super constructor - optional
	//.apply(this,argumentsArray);
}

/**
* 
* @property {int} id
*/
CompanyVO.prototype.id = NaN;
/**
* 
* @property {int} regionId
*/
CompanyVO.prototype.regionId = NaN;
/**
* 
* @property {String} name
*/
CompanyVO.prototype.name = null;
window.CompanyVO = CompanyVO;
}());

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
* @class LineVO
* @constructor
*/
var LineVO = function() {


	//Super constructor - optional
	//.apply(this,argumentsArray);
}

/**
* 
* @property {int} id
*/
LineVO.prototype.id = NaN;
/**
* 
* @property {int} companyId
*/
LineVO.prototype.companyId = NaN;
/**
* 
* @property {String} name
*/
LineVO.prototype.name = null;
window.LineVO = LineVO;
}());

/**
*@namespace 
*/


/**
* 
* 
* @author Marten Olgaard
* @created 4/4/2014
* @copyright Adnuvo
* @todo 
* @class RateVO
* @static
*/
var RateVO = RateVO || (function () {

	var _r = new Object();//Extend function
	/**
	* 
	* @property {int} id
	*/
	_r.id = null;
	/**
	* 
	* @property {int} userId
	*/
	_r.userId = null;
	/**
	* 
	* @property {int} busStopId
	*/
	_r.busStopId = null;
	/**
	* 
	* @property {int} value
	*/
	_r.value = null;
		
		
	return _r;
})();

/**
*@namespace 
*/


/**
* 
* 
* @author Marten Olgaard
* @created 4/4/2014
* @copyright Adnuvo
* @todo 
* @class RegionVO
* @static
*/
var RegionVO = RegionVO || (function () {

	var _r = new Object();//Extend function
	/**
	* 
	* @property {int} id
	*/
	_r.id = null;
	/**
	* 
	* @property {int} parentRegionId
	*/
	_r.parentRegionId = null;
	/**
	* 
	* @property {String} name
	*/
	_r.name = null;
	/**
	* 
	* @property {Bounds} bounds
	*/
	_r.bounds = null;
	/**
	* 
	* @property {int} level
	*/
	_r.level = null;
	/**
	* 
	* @property {Boolean} isLeaf
	*/
	_r.isLeaf = null;
		
		
	return _r;
})();

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
* @class UserVO
* @constructor
*/
var UserVO = function() {


	//Super constructor - optional
	//.apply(this,argumentsArray);
}

/**
* 
* @property {int} id
*/
UserVO.prototype.id = NaN;
/**
* 
* @property {String} name
*/
UserVO.prototype.name = null;
/**
* 
* @property {String} surname
*/
UserVO.prototype.surname = null;
/**
* 
* @property {String} email
*/
UserVO.prototype.email = null;
/**
* 
* @property {Position} currentPosition
*/
UserVO.prototype.currentPosition = null;
/**
* 
* @property {String} searchDump
*/
UserVO.prototype.searchDump = null;
window.UserVO = UserVO;
}());

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
* @class Bounds
* @constructor
*/
var Bounds = function() {


	//Super constructor - optional
	//.apply(this,argumentsArray);
}

/**
* 
* @property {double} x1
*/
Bounds.prototype.x1 = null;
/**
* 
* @property {double} y1
*/
Bounds.prototype.y1 = null;
/**
* 
* @property {double} x2
*/
Bounds.prototype.x2 = null;
/**
* 
* @property {double} y2
*/
Bounds.prototype.y2 = null;
window.Bounds = Bounds;
}());

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
* @class Position
* @constructor
*/
var Position = function() {


	//Super constructor - optional
	//.apply(this,argumentsArray);
}

/**
* 
* @property {double} lon
*/
Position.prototype.lon = null;
/**
* 
* @property {double} lat
*/
Position.prototype.lat = null;
window.Position = Position;
}());

/**
*@namespace 
*/


/**
* 
* 
* @author Marten Olgaard
* @created 4/4/2014
* @copyright Adnuvo
* @todo 
* @class BusStopListView
* @static
*/
var BusStopListView = BusStopListView || (function () {

	var _r = new Object();//Extend function
	/**
	* 
	* @property {String} searchQuery
	*/
	_r.searchQuery = null;
	/**
	* 
	* @property {int} userId
	*/
	_r.userId = null;
	/**
	* 
	* @property {int} regionId
	*/
	_r.regionId = null;
	/**
	* 
	* @property {BusStopVO} result
	*/
	_r.result = null;
	/**
	* 
	* @property {int} selectedIds
	* @private
	*/
	var selectedIds = null;
		
	/**
	* 
	* @method addSelectedToList
	*/
	_r.addSelectedToList = function(){
		
	};
	/**
	* 
	* @method deleteSelected
	*/
	_r.deleteSelected = function(){
		
	};
	/**
	* 
	* @method edit
	* @param {int} busStopOrigId 
	*/
	_r.edit = function(busStopOrigId){
		
		//Stub code - to be removed
		alert("the function 'edit' has been called  " + " with the following parameters:" + " busStopOrigId:" + busStopOrigId)
		
	};
	/**
	* 
	* @method search
	* @param {String} query 
	*/
	_r.search = function(query){
		
		//Stub code - to be removed
		alert("the function 'search' has been called  " + " with the following parameters:" + " query:" + query)
		
	};
		
	return _r;
})();

/**
*@namespace 
*/


/**
* 
* 
* @author Marten Olgaard
* @created 4/4/2014
* @copyright Adnuvo
* @todo 
* @class BusStopView
* @static
*/
var BusStopView = BusStopView || (function () {

	var _r = new Object();
	_r.div = '#BusStopView';

	/**
	* 
	* @property {BusStopVO} busStop
	*/
	_r.busStop = null;
		
	/**
	* 
	* @method rateInc
	*/
	_r.rateInc = function(){
		
	};
	/**
	* 
	* @method rateDec
	*/
	_r.rateDec = function(){
		
	};
	/**
	* 
	* @method canRate
	*/
	_r.canRate = function(){
		
	};
	/**
	* 
	* @method next
	*/
	_r.next = function(){
		
	};
	/**
	* 
	* @method prev
	*/
	_r.prev = function(){
		
	};
	
	_r._toHtml = function(busStopVO){
		var html = '_r._toHtml';
		
		return html;
	};
	_r.emptyList = function(){
		$(BusStopView.div).hide();
		$(UserListEmptyView.div).show();
	};
	
	/**
	* 
	* @method getNearest
	*/
	_r.getNearest = function(){
		console.log('okoko');
		if(_r.list.length == 0){
			_r.emptyList();
		}else{
			$(_r.div).html(_r._toHtml(_r.list[0]));
		}
	};
	/**
	* 
	* @method showMap
	*/
	_r.showMap = function(){
		
	};
	/**
	* 
	* @method searchUsers
	*/
	_r.searchUsers = function(){
		
	};
	/**
	* 
	* @method searchBusStops
	*/
	_r.searchBusStops = function(){
		
	};
	/**
	* 
	* @method myProfile
	*/
	_r.myProfile = function(){
		
	};
	
	_r._onUserListLoaded = function(){
		_r.getNearest();
	};
	
	_r.list = [];
	//LISTA USERA JEST ZAŁADOWANA
	$(document).on(BusStopProxy.USER_LIST_LOADED, _r._onUserListLoaded);
	return _r;
})();

/**
*@namespace 
*/


/**
* 
* 
* @author Marten Olgaard
* @created 4/4/2014
* @copyright Adnuvo
* @todo 
* @class MapView
* @static
*/
var MapView = MapView || (function () {

	var _r = new Object();//Extend function
	/**
	* 
	* @property {RegionVO} region
	*/
	_r.region = null;
	/**
	* 
	* @property {UserVO} user
	*/
	_r.user = null;
		
		
	return _r;
})();

/**
*@namespace 
*/


/**
* 
* 
* @author Marten Olgaard
* @created 4/4/2014
* @copyright Adnuvo
* @todo 
* @class UserListEmptyView
* @static
*/
var UserListEmptyView = UserListEmptyView || (function () {

	var _r = new Object();
	_r.div = '#UserListEmptyView';
	
		
	return _r;
})();

/**
*@namespace 
*/


/**
* 
* 
* @author Marten Olgaard
* @created 4/4/2014
* @copyright Adnuvo
* @todo 
* @class UserListView
* @static
*/
var UserListView = UserListView || (function () {

	var _r = new Object();//Extend function
	/**
	* 
	* @property {String} searchQuery
	*/
	_r.searchQuery = null;
	/**
	* 
	* @property {UserVO} result
	*/
	_r.result = null;
		
	/**
	* 
	* @method details
	* @param {int} userId 
	*/
	_r.details = function(userId){
		
		//Stub code - to be removed
		alert("the function 'details' has been called  " + " with the following parameters:" + " userId:" + userId)
		
	};
		
	return _r;
})();

/**
*@namespace 
*/


/**
* 
* 
* @author Marten Olgaard
* @created 4/4/2014
* @copyright Adnuvo
* @todo 
* @class UserView
* @static
*/
var UserView = UserView || (function () {

	var _r = new Object();//Extend function
	/**
	* 
	* @property {UserVO} user
	*/
	_r.user = null;
		
	/**
	* 
	* @method update
	*/
	_r.update = function(){
		
	};
	/**
	* 
	* @method saveListToServer
	*/
	_r.saveListToServer = function(){
		
	};
	/**
	* 
	* @method loadListFromServer
	*/
	_r.loadListFromServer = function(){
		
	};
		
	return _r;
})();

