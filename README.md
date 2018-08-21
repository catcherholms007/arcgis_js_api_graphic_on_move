# Solution for observation changing coordinates while moving in ArcGIS JS API 3.x
#### Live handle changing coordinates on graphic-move (point)
"graphic-move" handler give such important parameters as graphic and transform. 

- From graphic we need to take geometry coordinates, convert to screen coordinates via map.toScreen()
```
let start =  this.map.toScreen(new Point(event.graphic.geometry.x, event.graphic.geometry.y));
```
- Add to this coordinates differences from transform parametr (to x - transform.dx e.t.)
```
start.x += ('dx' in event.transform &&  event.transform.dx || 0);
start.y += ('dy' in event.transform &&  event.transform.dy || 0);
```
- Convert result to map coordinates (via map.toMap()
```
let mapPoint = this.map.toMap(start);
```
- Convert to latitude/longitude using webMercatorUtils.xyToLngLat()
```
start = webMercatorUtils.xyToLngLat(mapPoint.x, mapPoint.y, true);
```
- Receive result in array (like [x, y]) and return object with x and y
```
return {x: start[0], y: start[1]};
```

[JSFiddle](https://jsfiddle.net/catcherholms/9e563hju/)
