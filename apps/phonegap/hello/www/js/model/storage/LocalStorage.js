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
