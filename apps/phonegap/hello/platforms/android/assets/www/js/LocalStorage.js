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
	_r.INITIALIZED = 'LOCAL_STORAGE_QUERY_ERROR';
	
	//CONST
	_r.MODE_SQLITE = 'LOCAL_STORAGE_MODE_SQLITE';
	_r.MODE_AJAX = 'LOCAL_STORAGE_MODE_AJAX';
	
	//PUBLIC
	_r.initSQLite = function(db, createTables){
		_r._mode = _r.MODE_SQLITE;
		_r._connection = new SQLiteLocalStorage();
		_r._connection.init(db, createTables);
	};

	_r.initAjax = function(url){
		_r._mode = _r.MODE_AJAX;
		_r._connection = new AjaxLocalStorage();
		_r._connection.init(url);
	};

	_r.connection = function(){
		return _r._connection;
	},
	
	return _r;
})();
