

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
		_r._setupLocalStorage(function(){
			BusStopProxy.loadList(APP.userId);
			UpdatePositionController.run();
		});
	};
	
	_r._setupLocalStorage = function(onDone){
		if(undefined == window.openDatabase){
			//TODO: ajax storage
			LocalStorage.initAjax('http://localhost/projekty/storage', function(){
				onDone();
			});
		}else{
			//SQLite storage
			var DATABASE_SIZE = 1000000;
			var DATABASE_NAME = "test";
			var DATABASE_DESCRIPTION = "Test DB";
			var DATABASE_VERSION = "1.0";
			var tables = {
				'test_table_1' : ['field1', 'field2', 'field3'],
				'test_table_2' : ['field1', 'field2', 'field3'],
			};
			LocalStorage.initSQLite(
				window.openDatabase(DATABASE_NAME, DATABASE_VERSION, DATABASE_DESCRIPTION, DATABASE_SIZE), 
				tables,
				function(){
					onDone();
				}
			);
		}		
	};

	return _r;
})();
