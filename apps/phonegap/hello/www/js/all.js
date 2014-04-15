

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
			ServerStorage.init(APP.server_storage_url, function(){
				UpdatePositionController.run();
				BusStopView.show();
			});
		});
		_r._setupStorage();
	};
	
	_r._setupStorage = function(){
		var tables = {
			'BusStop' : ['user_id', 'lon', 'lat', 'name'],
		};
		if(undefined != localStorage || true){
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
			LocalStorage.initAjax('http://localhost/projekty/localStorage');
		}
		
		
		
		
	};

	return _r;
})();
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

		return list2;
	};

	return _r;
})();

var BusStopController = BusStopController || (function () {

	var _r = new Object();
	
	_r.searchNearest = function(onDone){
		var where = {
			regionId: RegionController.currentRegion,
			in_circle : {
				func  : 'in_circle',
				lat : 54.369546,
				lon : 18.607197,
				distance : 0.01,
			}, 
		}

		var additionalParams = {
			limit_start: 0, 
			limit_count: 10, 
			fields : [
				{ 'field' : 'latlon', 'func' : 'ST_X', 'alias' : 'x'},
				{ 'field' : 'latlon', 'func' : 'ST_Y', 'alias' : 'y'},
				{
					'field' : ['latlon', where.in_circle.lat, where.in_circle.lon], 
					'func' : 'ST_Distance', 
					'alias' : 'distance',
				},
				{ 'field' : '*'},
			],
			order_by : 'distance',
			
		};
		
		BusStopProxy.getList(where, additionalParams, function(list){
			onDone(list);
		});
	};
	
	return _r;
})();

var LineController = LineController || (function () {

	var _r = new Object();
	
	_r.cache = {};
	
	_r.getListFromCurrentRegion = function(onDone){
		var currentRegion = RegionController.currentRegion;
		
		if(LineController.cache[currentRegion]){
			onDone(LineController.cache[currentRegion]);
		}else{
			CompanyProxy.getList({region_id: currentRegion}, {}, function(companyList){
				var ids = [];
				for(var i=0; i<companyList.length; i++){
					ids.push(companyList[i].id);
				}
				LineProxy.getListByCompanyIds(ids, {}, function(){
					var lines2 = {};
					for(var i=0; i<lines.length; i++){
						lines2[lines[i].id] = lines[i];
					}
					LineController.cache[currentRegion] = lines2;
					onDone(LineController.cache[currentRegion]);
				});
			});
		}
	};

	return _r;
})();

var RegionController = RegionController || (function () {

	var _r = new Object();

	_r.currentRegion = 1;
	_r.perPage = 10;
	
	_r.searchNearest = function(onDone){
		BusStopProxy.getList({regionId: RegionController.currentRegion}, function(list){
			onDone(list);
		});
	};
	
	$(document).ready(function(){
		RegionController.currentRegion = '1';//TODO 
	});
	
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
	_r.watching = false;
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
	
	_r.getSortedList = function(){
		return _r.list;
	};
	
	_r._onUserListLoaded = function(e, userId){
		if(userId == APP.userId){
			_r.list = BusStopProxy.getList(APP.userId);
			if(!_r.watching){
				_r.watching = true;
				var geo_options = {
				  enableHighAccuracy: true, 
				  maximumAge        : 30000, 
				  timeout           : 27000
				};
				navigator.geolocation.watchPosition(_r._onPositionUpdateSuccess, _r._onPositionUpdateError, geo_options);
			}
		}
	};
	_r.run = function(){
		$(document).on(BusStopProxy.USER_LIST_LOADED, _r._onUserListLoaded);
	};
	
	
	return _r;
})();

var UserListController = UserListController || (function () {

	var _r = new Object();
	_r.addToList = function(id){
		UserBusStopProxy.getOne(id, function(row){
			if(!row){
				BusStopProxy.getOne(id, function(origRow){
					origRow.orig_id = origRow.id;
					origRow.user_id = APP.userId;
					origRow.id = undefined; //auto increment
					origRow.arriveList = [];
					ArriveProxy.getList({busstop_id : origRow.orig_id}, {fields : ['id', 'line_id', 'time', 'type']}, function(list){
						origRow.arriveList = list;
						UserBusStopProxy.save(origRow);
					});
				});
			}
		});
	};
	
	_r.loadList = function(onDone){
		UserBusStopProxy.getList(function(list){
			onDone(list ? list : []);
		});
	};

	return _r;
})();

var ArriveProxy = ArriveProxy || (function () {

	var _r = new Object();
	
	_r.getList = function(kvPairs, options, onDone){
		ServerStorage.load('arrive', kvPairs, options, function(list){
			if(list && list.success){
				onDone(list.data);
			}else{
				onDone([]);
			}
		});
	};

	_r.getOne = function(id, onDoneGetRow){
		ServerStorage.load('arrive', {'id' : id}, {}, function(result){
			if(result && result.success && result.data.length > 0){
				onDoneGetRow(result.data[0]);
			}else{
				onDoneGetRow();
			}
		});
	};

	_r.save = function(kvPairs, onDone){
		ServerStorage.save('arrive', kvPairs, onDone);
	};

	return _r;
})();

var BusStopProxy = BusStopProxy || (function () {

	var _r = new Object();
	
	_r.getList = function(kvPairs, options, onDone){
		ServerStorage.load('busstop', kvPairs, options, function(list){
			if(list.success){
				onDone(list.data);
			}else{
				onDone([]);
			}
		});
	};

	_r.getOne = function(id, onDoneGetRow){
		ServerStorage.load('busstop', {'id' : id}, {}, function(result){
			if(result && result.success && result.data.length > 0){
				onDoneGetRow(result.data[0]);
			}else{
				onDoneGetRow();
			}
		});
	};

	_r.save = function(kvPairs, onDone){
		ServerStorage.save('busstop', kvPairs, onDone);
	};

	return _r;
})();

var CompanyProxy = CompanyProxy || (function () {

	var _r = new Object();
	
	_r.getList = function(kvPairs, options, onDone){
		ServerStorage.load('company', kvPairs, options, function(list){
			if(list && list.success){
				onDone(list.data);
			}else{
				onDone([]);
			}
		});
	};

	_r.getOne = function(id, onDoneGetRow){
		ServerStorage.load('company', {'id' : id}, {}, function(result){
			if(result && result.success && result.data.length > 0){
				onDoneGetRow(result.data[0]);
			}else{
				onDoneGetRow();
			}
		});
	};

	_r.save = function(kvPairs, onDone){
		ServerStorage.save('company', kvPairs, onDone);
	};

	return _r;
})();

var LineProxy = LineProxy || (function () {

	var _r = new Object();
	
	_r.getList = function(kvPairs, options, onDone){
		ServerStorage.load('line', kvPairs, options, function(list){
			if(list && list.success){
				onDone(list.data);
			}else{
				onDone([]);
			}
		});
	};
	
	_r.getListByCompanyIds = function(ids, options, onDone){
		var where = {
			'id' : {
				func : 'in',
				values : ids,
			},
		};
	
		ServerStorage.load('line', where, options, function(list){
			if(list && list.success){
				onDone(list.data);
			}else{
				onDone([]);
			}
		});
	};

	_r.getOne = function(id, onDoneGetRow){
		ServerStorage.load('line', {'id' : id}, {}, function(result){
			if(result && result.success && result.data.length > 0){
				onDoneGetRow(result.data[0]);
			}else{
				onDoneGetRow();
			}
		});
	};

	_r.save = function(kvPairs, onDone){
		ServerStorage.save('line', kvPairs, onDone);
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

var LocalStorage = LocalStorage || (function () {

	var _r = new Object();
	
	//DISPATCH EVENTS
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
var ServerStorage = ServerStorage || (function () {

	var _r = new Object();
	
	//DISPATCH EVENTS
	_r.QUERY_ERROR = 'SERVER_STORAGE_QUERY_ERROR';

	//PUBLIC

	_r.init = function(url, onDone){
		if(!url){
			console.log('ServerStorage: url is not defined');
		}
		ServerStorage.url = url;
		onDone();
	};

	_r.insert = function(table, kvPairs, callback){
		this._query({type: 'insert', table: table, kvPairs: kvPairs}, callback);
	};

	_r.load = function(table, kvPairs, options, callback){
		var params = {type: 'load', table: table, kvPairs: kvPairs};
		
		for(var key in options){
			params[key] = options[key];
		}
		console.log(params);
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
var UserBusStopProxy = UserBusStopProxy || (function () {

	var _r = new Object();//Extend function
	
	_r.getList = function(onDone){
		LocalStorage.connection().load('BusStop', {}, onDone);
	};

	_r.getOne = function(id, onDone){
		LocalStorage.connection().load('BusStop', {id:id}, function(list){
			if(list.length > 0){
				onDone();
			}else{
				onDone(list[0]);
			}
		});
	};

	_r.save = function(kvPairs, onDone){
		LocalStorage.connection().save('BusStop', kvPairs, onDone);
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
		
	};
	/**
	* 
	* @method getList
	* @param {String} searchQuery 
	*/
	_r.getList = function(searchQuery){
		
	};
	/**
	* 
	* @method getOne
	* @param {int} id 
	*/
	_r.getOne = function(id){
		
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

//translate
var __ = function(translateKey){ 
	return translateKey;
};
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
	
	_r._toHtml = function(busStopVO, onDone){
		var arriveList = ArriveController.getCurrentArrives(busStopVO);
		LineController.getListFromCurrentRegion(function(lineSet){
			onDone(ViewTools.busStopRowDetails(busStopVO, lineSet, arriveList));
		});
	};
	
	_r.emptyList = function(){
		BusStopView.hide();
		UserListEmptyView.show();
	};
	
	/**
	* 
	* @method getNearest
	*/
	_r.getNearest = function(){
		UserListController.loadList(function(list){
			if(list.length == 0){
				_r.emptyList();
			}else{
				_r._toHtml(list[0], function(html){
					$(_r.div).html(html);
				});
			}
		});
		
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
	
	_r.hide = function(){
		$(this.div).hide();
	};
	
	_r.show = function(){
		this.getNearest();
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

var UserListEmptyView = UserListEmptyView || (function () {

	var _r = new Object();
	_r.div = '#UserListEmptyView';
	_r.div_form = '#UserListEmptyView_form';
	_r.div_submit = '#UserListEmptyView_submit';
	_r.div_items = '#UserListEmptyView_items';
	_r.div_loading = '#UserListEmptyView_loading';
	
	_r.show = function(){
		$(_r.div_items).html('');
		$(_r.div_items).hide();
		$(_r.div_loading).show();
		BusStopController.searchNearest(function(rows){
			$(_r.div_items).html(ViewTools.busStopRowList(rows, 'UserListEmptyView'));
			$(_r.div_items).show();
			$(_r.div_loading).hide();
		});
		$(_r.div).show();
	};
	

	$(document).ready(function(){
		$(_r.div_submit).click(function(e){
			$(_r.div_form).serializeArray().map(function(input){
				UserListController.addToList(input.value);
			}); 
			return false;
		});
	});
	
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

