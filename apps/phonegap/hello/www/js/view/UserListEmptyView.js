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

