var Tests = Tests || (function () { 

	var _r = new Object();
	
	_r.NO_RESULT = 0;
	_r.RESULT_SUCCESS = 1;
	_r.RESULT_FAILURE = 2;
	
	_r.div = '#test_result';
	
	_r.APP_CONFIG = {
		'userId' : 'asdasdasd',
		'server_storage_url' : 'http://localhost/projekty/inzynierka/busstopdiscovery/apps/serverStorage',
	};
	
	_r.CONFIG = {
		TEST_TABLE : 'BusStop',
		TEST_TABLE_NUM_ROWS : 100,
	};
	
	_r.start = function(config){
		if(!document.cookie){
			document.cookie = JSON.stringify({
				'APP_start_exists' : Tests.NO_RESULT,
				'APP_start_localstorage' : Tests.NO_RESULT,
				'APP_start_serverstorage' : Tests.NO_RESULT,
				'LocalStorage_save_success' : Tests.NO_RESULT,
				'LocalStorage_load_success' : Tests.NO_RESULT,
				'LocalStorage_remove_success' : Tests.NO_RESULT,
				'LocalStorage_handle_error_event' : Tests.NO_RESULT,
				'LocalStorage_handle_error_callback' : Tests.NO_RESULT,
			});
		}
		var tests = JSON.parse(document.cookie);
		for(var key in tests){
			if(tests[key] == Tests.NO_RESULT){
				var onTestDone = function(result, error){
					tests[key] = result;
					document.cookie = JSON.stringify(tests);
					Tests.makeHtmlResult(key, tests[key], error);
					if(result != Tests.RESULT_FAILURE){
						setTimeout(function(){
							window.location.reload();
						}, 2000);
					}
				};
				Tests[key](onTestDone);
				return;
			}else{
				_r.makeHtmlResult(key, tests[key]);
			}
		}
		$(Tests.div).append('<div>END TESTING</div>');
		document.cookie = '';
	};

	

	_r.APP_start_exists = function(onTestDone){
		Tests.runTest(onTestDone, function(getResult){
			getResult(APP.start == undefined ? Tests.RESULT_FAILURE : Tests.RESULT_SUCCESS);
		});
	};

	
	_r.APP_start_localstorage = function(onTestDone){
		Tests.runTest(onTestDone, function(getResult){ Tests.setup_app(function(){
			getResult(Tests.RESULT_SUCCESS);
		})});
	};

	
	_r.APP_start_serverstorage = function(onTestDone){
		Tests.runTest(onTestDone, function(getResult){ Tests.setup_app(function(){
			ServerStorage.init(APP.server_storage_url, function(){
				getResult(Tests.RESULT_SUCCESS);
			});
		})});
	};
	
	_r.LocalStorage_save_success = function(onTestDone){
		localStorage.clear();
		Tests.runTest(onTestDone, function(getResult){ Tests.setup_app(function(){
			LocalStorage.connection().save(Tests.CONFIG.TEST_TABLE, {'test_field1' : 1, 'test_field2' : {}, 'test_field3' : [], 'test_field4' : [{}], 'test_field5' : '[{}]', }, function(id){
				LocalStorage.connection().save(Tests.CONFIG.TEST_TABLE, {'test_field1' : 1, 'test_field2' : {}, 'test_field3' : [], 'test_field4' : [{}], 'test_field5' : '[{}]', }, function(id){
					getResult(id == 1 ? Tests.RESULT_SUCCESS : Tests.RESULT_FAILURE);
				});
			});
		})});
	};
	
	_r.LocalStorage_load_success = function(onTestDone){
		localStorage.clear();
		Tests.runTest(onTestDone, function(getResult){ Tests.setup_app(function(){Tests.setupLocalStorage(function(){
			LocalStorage.connection().load(Tests.CONFIG.TEST_TABLE, {}, function(result){
				getResult(result.length == Tests.CONFIG.TEST_TABLE_NUM_ROWS
					? Tests.RESULT_SUCCESS : Tests.RESULT_FAILURE);
			});
		})})});
	};
	
	_r.LocalStorage_remove_success = function(onTestDone){
		localStorage.clear();
		Tests.runTest(onTestDone, function(getResult){ Tests.setup_app(function(){Tests.setupLocalStorage(function(){
			LocalStorage.connection().remove(Tests.CONFIG.TEST_TABLE, {id:34}, function(){
				LocalStorage.connection().load(Tests.CONFIG.TEST_TABLE, {id:34}, function(result){
					getResult(result.length == 0
						? Tests.RESULT_SUCCESS : Tests.RESULT_FAILURE);
				});
			});

		})})});
	};
	
	_r.LocalStorage_handle_error_event = function(onTestDone){
		localStorage.clear();
		Tests.runTest(onTestDone, function(getResult){ Tests.setup_app(function(){Tests.setupLocalStorage(function(){
			localStorage.clear();
			var done = false;
			$(document).on(LocalStorage.QUERY_ERROR, function(err){
				setTimeout(function(){
					if(!done){
						getResult(err ? Tests.RESULT_SUCCESS : Tests.RESULT_FAILURE);
					}
				}, 500);
			});
			LocalStorage.connection().load(Tests.CONFIG.TEST_TABLE, {id:34}, function(result){
				done = true;
				getResult(Tests.RESULT_FAILURE);
			});
		})})});
	};

	_r.LocalStorage_handle_error_callback = function(onTestDone){
		localStorage.clear();
		Tests.runTest(onTestDone, function(getResult){ Tests.setup_app(function(){Tests.setupLocalStorage(function(){
			localStorage.clear();
			var load_done = false;
			
			LocalStorage.connection().load(Tests.CONFIG.TEST_TABLE, {id:34}, function(result){
				
				load_done = true;
				getResult(Tests.RESULT_FAILURE);
			}, function(err){
				setTimeout(function(){
					
					if(!load_done){
						getResult(err ? Tests.RESULT_SUCCESS : Tests.RESULT_FAILURE);
					}
				}, 500);
			});
		})})});
	};
	
	///////////////// PRIVATE /////////////////
	
	_r.setupLocalStorage = function(ready){
		var counter = 0;
		var numRows = Tests.CONFIG.TEST_TABLE_NUM_ROWS;
		var saveFunc = function(){
			if(counter++ < numRows){
				LocalStorage.connection().save(Tests.CONFIG.TEST_TABLE, {'test_field1' : 1, 'test_field2' : {}, 'test_field3' : [], 'test_field4' : [{}], 'test_field5' : '[{}]', }, saveFunc);
			}else{
				ready();
			}
		};
		saveFunc();
	};
	
	_r.makeHtmlResult = function(key, result, error){
		var resultStr = [
			'NO_RESULT', 'SUCCESS', 'FAILURE'
		];
		
		var resultClass = ['no_result', 'success', 'failure'];
	
		$(Tests.div).append('<div class="'+resultClass[result]+'">Tests::'+key+'() '+resultStr[result]+' '+(error ? error : '')+'</div>');
	};
	
	_r.runTest = function(onTestDone, test){
		var done = false;
		try{
			test(function(result){
				done = true;
				onTestDone(result);
			});
		}catch(e){
			console.log('EXCEPTION');
			console.log(e);
			onTestDone(Tests.RESULT_FAILURE);
		}
		
		setTimeout(function(){
			if(!done){
				console.log('TIMEOUT');
				onTestDone(Tests.RESULT_FAILURE);
			}
		}, 5000); //TIMEOUT 5 seconds
		
	};
	
	_r.setup_app = function(ready){
		$(document).on(LocalStorage.INITIALIZED, function(){
			ready();
		});
		UpdatePositionController.run = function(){};
		BusStopView.show = function(){};
		APP.start(Tests.APP_CONFIG);
	};
	
	return _r;
})();