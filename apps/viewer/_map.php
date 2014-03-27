    <h1 id="title">MousePosition Control</h1>
    <div id="tags">
      coordinate
    </div>
    <p id="shortdesc">
      Use the MousePosition Control to display the coordinates of the cursor
      inside or outside the map div.
    </p> 
	<div>
		<input type="text" id="wkt" value=""/>
		<input type="button" onclick="loadFromWKT(document.getElementById('wkt').value, true)" value="load from WKT" /> 
		<input type="button" onclick="document.getElementById('wkt').value = g_wkt_str" value="generate WKT" />
	</div>
	<div>
		<form method="post" action="">
			<input type="text" style="width: 300px;" id="query" name="query" value="<?php echo @$_REQUEST['query'];?>"/>
			<input type="submit" value="Query"/>
		</form>
	</div>	
    <div id="map" class="smallmap"></div>
    <div id="coords" style="height: 1.5em;"></div>
	<div id="lonLats"></div>
	<?php if($wktStr):?>
		<script type="text/javascript">
			g_wkt_str = '<?php echo $wktStr?>';
			document.getElementById('wkt').value = g_wkt_str;
		</script>
	<?php endif;?>