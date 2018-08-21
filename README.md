# arcgis_js_api_graphic_on_move
"graphic-move" handler give such important paramerts as graphic and trasform. 
From graphic we need to take geometry coordinatess, convert to screen coordinates via map.toScreen(), 
add to this coordinates differences from transform parametr (to x - transform.dx e.t.),
convert result to map coordinates (via map.toMap()), convert to latitude/longitude using webMercatorUtils.xyToLngLat() 
and receive result in array (like [x, y])
