var ViewManager = ViewManager || (function () {

	var _r = new Object();
	
	_r.views = ['BusStopListView', 'BusStopView', 'MapView', 'UserListEmptyView', 'UserListView', 'UserView'];
	
	_r.initialView = 'BusStopView';
	
	_r.currentView = '';
	
	_r.showView = function(className){
		if(ViewManager.views.indexOf(className) != -1){
			if(window[ViewManager.currentView]){
				window[ViewManager.currentView].hide();
			}
			ViewManager.currentView = className;
			window[className].show();
		}
	};
	
	_r.init = function(mainDiv){
		var views = ViewManager.views;
		var html = '';
		for(var i=0; i<views.length; i++){
			html += '<div id="'+views[i]+'" class="view"></div>';
		}
		$(mainDiv).html(html);
		ViewManager.addListeners();
		ViewManager.showView(ViewManager.initialView);
	};
	
	_r.addListeners = function(){
		$(document).on(BusStopView.EMPTY_VIEW, function(){
			ViewManager.showView('UserListEmptyView');
		});

	};
	
	
	return _r;
})();

