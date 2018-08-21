require([
    'esri/map',
    'esri/layers/GraphicsLayer',
    "esri/toolbars/edit",
    'esri/graphic',
    'esri/symbols/SimpleMarkerSymbol',
    'esri/Color',
    'esri/geometry/Point',
    'esri/geometry/webMercatorUtils',
], function(Map, GraphicsLayer, Edit, Graphic, SimpleMarkerSymbol, Color, Point, webMercatorUtils) {

    class Generator {

        static newValue(min, max) {
            return (Math.random() * (max - min + 1)) + min;
        }

    }

    class Item {

        static create(x, y) {
            return {
                x: x,
                y: y
            };
        }

        static rand() {
            return Item.create(Generator.newValue(38.43, 40), Generator.newValue(37.7, 38.5));
        }
    }

    class Collection {

        constructor() {
            this.max = 10;
            this.items = [];
            this._fill();
        }

        add(item){
            this.items.push(item);
        }

        _fill() {
            for (let i = 0; i < this.max; i++) {
                this.add(Item.rand());
            }
        }

        getAll() {
            return this.items;
        }

    }

    class Editor {

        constructor(map) {
            this.map = map;
            this.tool = new Edit(this.map);
            this.onGraphicMoveExternal = null;
            this.setListeners();
        }

        activate(graphic) {
            this.tool.activate(Edit.MOVE, graphic);
        }

        deactivate(){
            this.tool.deactivate();
        }

        setListeners() {
            this.tool.on('graphic-move', this.onGraphicMove.bind(this));
        }

        onGraphicMove(event) {
            this.onGraphicMoveExternal(this.calcMove(event));
        }

        calcMove(event) {
            let start =  this.map.toScreen(new Point(event.graphic.geometry.x, event.graphic.geometry.y));
            start.x += ('dx' in event.transform &&  event.transform.dx || 0);
            start.y += ('dy' in event.transform &&  event.transform.dy || 0);
            let mapPoint = this.map.toMap(start);
            start = webMercatorUtils.xyToLngLat(mapPoint.x, mapPoint.y, true);
            return {x: start[0], y: start[1]};
        }

    }

    class Utils {

        static Graphic(item) {
            let point = new Point(item.x, item.y);
            return new Graphic(point, Utils.SimpleMarkerSymbol);
        }

        static get SimpleMarkerSymbol() {
            let sms = new SimpleMarkerSymbol();
            sms.setSize(30);
            sms.setStyle(SimpleMarkerSymbol.STYLE_CIRCLE);
            sms.setColor(new Color([255, 0, 0, 0.5]));
            return sms;
        }

    }

    class Label {

        constructor(name) {
            this.name = name;
            this.content = this.template;
            this.toBody();
        }

        get template() {
            let d = document.createElement('div');
            d.innerText = this.name;
            d.style.display = 'inline';
            return d;
        }

        toBody() {
            document.getElementById('labels').appendChild(this.content);
        }

        set(name) {
            this.content.innerText = name;
        }

    }

    class View {

        constructor(container) {
            this.canClick = true;
            this.points = new Collection();
            this.map = new Map(container, {
                basemap: 'osm',
                zoom: 6,
                center: new Point(38.89705765104101, 38.192247779303024)
            });
            this.Editor = new Editor(this.map);
            this.layer = new GraphicsLayer();
            this.map.addLayer(this.layer);
            this.coordinates = new Label('Coordinates: ');
            this.values = new Label('x, y');
            this.setListeners();
        }

        add(graphic) {
            this.layer.add(graphic);
        }

        fill() {
            this.points.getAll().map(Utils.Graphic.bind(this)).forEach(this.add.bind(this));
        }

        setListeners() {
            this.map.on('load', this.onMapLoad.bind(this));
            this.map.on('click', this.onMapClick.bind(this));
            this.layer.on('click', this.onLayerClick.bind(this));
            this.Editor.onGraphicMoveExternal = this.onEditorGraphicMove.bind(this);
        }

        onLayerClick(event) {
            this.canClick = false;
            this.Editor.activate(event.graphic);
        }

        onEditorGraphicMove(mapPoint) {
            console.log(mapPoint);
            this.values.set(mapPoint.x + ', ' + mapPoint.y);
        }

        onMapLoad(){
            this.fill();
        }

        onMapClick() {
            if (this.canClick) {
                this.Editor.deactivate();
            }
            else {
                this.canClick = true;
            }
        }

    }

    let view = new View('map');

});