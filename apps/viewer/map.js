
	var APPEND_NEW_TR_WHEN_CREATE_MARKER = false;
	var markers;
	var lonLats;
	var g_selected_marker;
	var DEFAULT_ICON_URL = 'http://www.openlayers.org/dev/img/marker.png';
	var SELECTED_ICON_URL = 'http://www.openlayers.org/dev/img/marker-green.png';
	var size = new OpenLayers.Size(21,25);
	var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
	var g_wkt_str;
	var g_current_vector_feature;
	var map;

	var styleMap = new OpenLayers.StyleMap({
		'default': new OpenLayers.Style({
			strokeColor: "#333333",
			strokeWidth: 1.2,
			strokeOpacity: 1
		})
	});
	
	var vectorlayer = new OpenLayers.Layer.Vector('Vectorlayer simplified', {
		isBaseLayer: false,
		styleMap: styleMap
	});

	var showPosition = function(key){
		if(g_selected_marker){
			g_selected_marker.setUrl(DEFAULT_ICON_URL);
		}
		g_selected_marker = lonLats[key].marker;
		g_selected_marker.setUrl(SELECTED_ICON_URL);
	};
	var deletePosition = function(key){
		markers.removeMarker(lonLats[key].marker);
		delete lonLats[key];
		refreshLonLats();
	};
	
	var changeSort = function(key, sort){
		lonLats[key].sort = sort;
		refreshLonLats();
	};
	
	var refreshLonLats = function(){
		var sortedLonlats = [];
		for(var key in lonLats){
			sortedLonlats.push( { 'key' : key, 'value' : lonLats[key] } );
		}
		sortedLonlats.sort(function(a,b){
			return a.value.sort - b.value.sort; //ASC
		});
		g_wkt_str = "LINESTRING(";
		var html = '<table id="lonlats_table"><tr><td style="width: 100px;">lon</td><td style="width: 100px;">lat</td><td style="width: 50px;">sort</td><td></td><td></td></tr>';
		for(var i=0; i<sortedLonlats.length; i++){
			var marker = sortedLonlats[i].value.marker;
			var sort = sortedLonlats[i].value.sort;
			var key = sortedLonlats[i].key;
			html += '<tr id="position_'+key+'">\
				<td>'+marker.lonlat.lon+'</td>\
				<td>'+marker.lonlat.lat+'</td>\
				<td><input type="text" value="'+sort+'" onchange="changeSort(\''+key+'\', this.value)" /></td>\
				<td><input type="button" onclick="showPosition(\''+key+'\')" value="pokaż"/></td>\
				<td><input type="button" onclick="deletePosition(\''+key+'\')" value="usuń"/></td>\
			</tr>';
			
			g_wkt_str += (i == 0 ? '' : ',') + marker.lonlat.lon+' '+marker.lonlat.lat;
		}
		g_wkt_str += ')';

		html += '</table>';
		document.getElementById('lonLats').innerHTML = html;
		loadFromWKT(g_wkt_str);
	};

	var createMarker = function(lon, lat){
		var icon = new OpenLayers.Icon(DEFAULT_ICON_URL, size, offset);
		var m = new OpenLayers.Marker(new OpenLayers.LonLat(lon, lat),icon);
		markers.addMarker(m);
		var key = nextKey();
		lonLats[key] = {'marker' : m, 'sort' : key};
		return key;
	};
	
	var g_current_key = 0;
	var nextKey = function(){
		return g_current_key++;
	};
	
	var osm_layer;
	
	function init(){
        map = new OpenLayers.Map('map');

        map.addControl(
            new OpenLayers.Control.MousePosition({
                prefix: '',
                separator: ', ',
                numDigits: 6,
                emptyString: 'Mouse is not over map.'
            })
        );
        
        var ol_wms = new OpenLayers.Layer.WMS( "OpenLayers WMS",
                "http://vmap0.tiles.osgeo.org/wms/vmap0",
                {layers: 'basic'} );

        map.addLayers([ol_wms, vectorlayer]);

        if (!map.getCenter()) {
            map.zoomToMaxExtent();
        }
        markers = new OpenLayers.Layer.Markers( "Markers" );
        map.addLayer(markers);
		lonLats = {};
		
        map.events.register("click", map, function(e) {
			
			var lonLat = document.getElementsByClassName('olControlMousePosition')[0].innerHTML;
			var lonLatArr = lonLat.split(', ');
			if(lonLatArr.length == 2){
				var key = createMarker(lonLatArr[0], lonLatArr[1]);
				var marker = lonLats[key].marker;
				var table_elem = document.getElementById('lonlats_table');
				if(table_elem && APPEND_NEW_TR_WHEN_CREATE_MARKER){
					table_elem.innerHTML += '<tr id="position_'+key+'">\
						<td>'+marker.lonlat.lon+'</td>\
						<td>'+marker.lonlat.lat+'</td>\
						<td><input type="text" value="'+key+'" onchange="changeSort(\''+key+'\', this.value)" /></td>\
						<td><input type="button" onclick="showPosition(\''+key+'\')" value="pokaż"/></td>\
						<td><input type="button" onclick="deletePosition(\''+key+'\')" value="usuń"/></td>\
					</tr>';
					
				}else{
				
					refreshLonLats();
				}
			}
			
			console.log(lonLat);
		});
		
        map.events.register("mousemove", map, function(e) {
            var position = this.events.getMousePosition(e);
            OpenLayers.Util.getElement("coords").innerHTML = position;
        });
    }
	
	var clearMarkers = function(){
		markers.clearMarkers();
		lonLats = {};
	};
	
	var loadFromWKT = function(wktStr, withDrawPoints){
		if(g_current_vector_feature){
			vectorlayer.removeFeatures([g_current_vector_feature]);
		}
		var geometry = OpenLayers.Geometry.fromWKT(wktStr);
		
		g_current_vector_feature = new OpenLayers.Feature.Vector(geometry);
		vectorlayer.addFeatures([g_current_vector_feature]);
		if(withDrawPoints){
			var components = geometry.components;
			
			clearMarkers();
			for(var i=0; i<components.length; i++){
				createMarker(components[i].x, components[i].y);
			}
			refreshLonLats();
		}
	};
	