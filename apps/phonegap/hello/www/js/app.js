

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
