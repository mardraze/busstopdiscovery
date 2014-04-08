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

