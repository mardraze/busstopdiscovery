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

