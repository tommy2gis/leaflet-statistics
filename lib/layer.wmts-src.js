

//http://t1.tianditu.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&TILEMATRIX=8&TILEROW=44&TILECOL=211&FORMAT=tiles
//http://t1.tianditu.cn/vec_c/wmts?service=WMTS&request=GetTile&version=1.0.0&layer=&style=&tilematrixSet=&format=image%2Fjpeg&height=256&width=256&TILEMATRIX=8&TILEROW=44&TILECOL=211
L.TileLayer.WMTS = L.TileLayer.extend({
    defaultWmtsParams: {
        service: 'WMTS',
        request: 'GetTile',
        version: '1.0.0',
        layer: '',
        style: 'default',
        tileMatrixSet: 'c',
        TILEMATRIXSET: 'c',
        format: 'tiles'
    },
    layerType:'WMTSLayer',
    initialize: function (url, options) { // (String, Object)
        this._url = url instanceof Array ? url : [url];
        var wmtsParams = L.extend({}, this.defaultWmtsParams),
        tileSize = options.tileSize || this.options.tileSize;
        if (options.detectRetina && L.Browser.retina) {
            wmtsParams.width = wmtsParams.height = tileSize * 2;
        } else {
            wmtsParams.width = wmtsParams.height = tileSize;
        }
        for (var i in options) {
            // all keys that are not TileLayer options go to WMTS params
            if (!this.options.hasOwnProperty(i) && i!="matrixIds") {
                wmtsParams[i] = options[i];
            }
        }
        this.wmtsParams = wmtsParams;
        L.setOptions(this, options);
    },

    onAdd: function (map) {
        L.TileLayer.prototype.onAdd.call(this, map);
    },

    getTileUrl: function (tilePoint) {
        var url = this._url[(tilePoint.x + tilePoint.y) % this._url.length];
        return url + L.Util.getParamString(this.wmtsParams, url) +
            "&tilematrix=" + tilePoint.z +
            "&tilerow=" + tilePoint.y + 
            "&tilecol=" + tilePoint.x;
    },

    setParams: function (params, noRedraw) {
        L.extend(this.wmtsParams, params);
        if (!noRedraw) {
            this.redraw();
        }
        return this;
    }
});

L.tileLayer.wmts = function (url, options) {
    return new L.TileLayer.WMTS(url, options);
};

L.TileLayer.TDT = L.TileLayer.WMTS.extend({
    urlArray: [],

    tdtOptions: {},

    initialize: function (url, options) { // (String, Object)
        this._url = this.urlArray;
        options = this.tdtOptions;

        var wmtsParams = L.extend({}, this.defaultWmtsParams),
        tileSize = options.tileSize || this.options.tileSize;
        if (options.detectRetina && L.Browser.retina) {
            wmtsParams.width = wmtsParams.height = tileSize * 2;
        } else {
            wmtsParams.width = wmtsParams.height = tileSize;
        }
        for (var i in options) {
            // all keys that are not TileLayer options go to WMTS params
            if (!this.options.hasOwnProperty(i) && i != "matrixIds") {
                wmtsParams[i] = options[i];
            }
        }
        this.wmtsParams = wmtsParams;
        L.setOptions(this, options);
    }
});

L.TileLayer.TDT.Vector = L.TileLayer.TDT.extend({
    urlArray: ["http://t0.tianditu.com/vec_c/wmts",
        "http://t1.tianditu.com/vec_c/wmts",
        "http://t2.tianditu.com/vec_c/wmts",
        "http://t3.tianditu.com/vec_c/wmts"],

    tdtOptions: {
        layer: 'vec',
        style: 'default',
        format: 'tiles',
        tilematrixSet: 'c',
        attribution: '天地图'
    }
});

L.TileLayer.TDT.VectorAnno = L.TileLayer.TDT.extend({
    urlArray: ["http://t0.tianditu.com/cva_c/wmts", 
        "http://t1.tianditu.com/cva_c/wmts", 
        "http://t2.tianditu.com/cva_c/wmts",
        "http://t3.tianditu.com/cva_c/wmts"],

    tdtOptions: {
        layer: 'cva',
        style: 'default',
        format: 'tiles',
        tilematrixSet: 'c',
        attribution: '天地图'
    }
});

L.TileLayer.TDT.Raster = L.TileLayer.TDT.extend({
    urlArray: ["http://t0.tianditu.com/img_c/wmts",
        "http://t1.tianditu.com/img_c/wmts",
        "http://t2.tianditu.com/img_c/wmts",
        "http://t3.tianditu.com/img_c/wmts"],

    tdtOptions: {
        layer: 'img',
        style: 'default',
        format: 'tiles',
        tilematrixSet: 'c',
        attribution: '天地图'
    }
});

L.TileLayer.TDT.RasterAnno = L.TileLayer.TDT.extend({
    urlArray: ["http://t0.tianditu.com/cia_c/wmts",
        "http://t1.tianditu.com/cia_c/wmts",
        "http://t2.tianditu.com/cia_c/wmts",
        "http://t3.tianditu.com/cia_c/wmts"],

    tdtOptions: {
        layer: 'cia',
        style: 'default',
        format: 'tiles',
        tilematrixSet: 'c',
        attribution: '天地图'
    }
});
L.CRS.CustomLevel = L.extend({}, L.CRS, {
    projection: L.Projection.SphericalMercator,

    transformation: (function () {
        var scale = 0.5 / (Math.PI * L.Projection.SphericalMercator.R);
        return new L.Transformation(scale, 0.5, -scale, 0.5);
    }()),
    code: 'EPSG:0',
    levelDefine: [
                        { "level": 0, "resolution": 1.40782880508533, "scale": 591658710.9 },
                        { "level": 1, "resolution": 0.70312500000011879, "scale": 295497593.05879998 },
                        { "level": 2, "resolution": 0.3515625000000594, "scale": 147748796.52939999 },
                        { "level": 3, "resolution": 0.1757812500000297, "scale": 73874398.264699996 },
                        { "level": 4, "resolution": 0.087890625000014849, "scale": 36937199.132349998 },
                        { "level": 5, "resolution": 0.043945312500007425, "scale": 18468599.566174999 },
                        { "level": 6, "resolution": 0.021972656250003712, "scale": 9234299.7830874994 },
                        { "level": 7, "resolution": 0.010986328125001856, "scale": 4617149.8915437497 },
                        { "level": 8, "resolution": 0.0054931640625009281, "scale": 2308574.9457718749 },
                        { "level": 9, "resolution": 0.002746582031250464, "scale": 1154287.4728859374 },
                        { "level": 10, "resolution": 0.001373291015625232, "scale": 577143.73644296871 },
                        { "level": 11, "resolution": 0.00068664550781261601, "scale": 288571.86822148436 },
                        { "level": 12, "resolution": 0.000343322753906308, "scale": 144285.934110742183 },
                        { "level": 13, "resolution": 0.000171661376953154, "scale": 72142.967055371089 },
                        { "level": 14, "resolution": 8.5830688476577001e-005, "scale": 36071.483527685545 },
                        { "level": 15, "resolution": 4.2915344238288501e-005, "scale": 18035.741763842772 },
                        { "level": 16, "resolution": 2.145767211914425e-005, "scale": 9017.8708819213862 },
                        { "level": 17, "resolution": 1.0728836059572125e-005, "scale": 4508.9354409606931 },
                        { "level": 18, "resolution": 5.3644180297860626e-006, "scale": 2254.4677204803465 },
                        { "level": 19, "resolution": 2.6822090148930313e-006, "scale": 1127.2338602401733 },
                        { "level": 20, "resolution": 1.3411045074465156e-006, "scale": 563.61693012008664 }
                    ],
    origin: new L.LatLng(90, -180),

    latLngToPoint: function (latlng, zoom) { // (LatLng, Number) -> Point
        var levelDefine = this.levelDefine;
        var origin = this.origin;

        for (var i = 0; i < levelDefine.length; i++) {
            if (levelDefine[i].level == zoom) {
                var y = (origin.lat - latlng.lat) / levelDefine[i].resolution;
                var x = (latlng.lng - origin.lng) / levelDefine[i].resolution;

                return new L.Point(Math.floor(x), Math.floor(y));
            }
        }

        return;
    },

    pointToLatLng: function (point, zoom) { // (Point, Number[, Boolean]) -> LatLng
        var levelDefine = this.levelDefine;
        var origin = this.origin;

        for (var i = 0; i < levelDefine.length; i++) {
            if (levelDefine[i].level == zoom) {
                var lat = origin.lat - point.y * levelDefine[i].resolution;
                var lng = point.x * levelDefine[i].resolution + origin.lng;

                return new L.LatLng(lat, lng);
            }
        }

        return;
    },

    project: function (latlng) {
        //return latlng;
        return new L.Point(latlng.lng, latlng.lat);
    },

    scale: function (zoom) {
        var levelDefine = this.levelDefine;
        var origin = this.origin;
        var s;
        var maxOriginValue = Math.max(Math.abs(origin.lat), Math.abs(origin.lng));

        for (var i = 0; i < levelDefine.length; i++) {
            if (levelDefine[i].level == zoom) {
                s = maxOriginValue * 2 / levelDefine[i].resolution;
                break;
            }
        }

        return s;
    },

    _scaleByOrigin: function (zoom, originValue) {
        var s;
        var levelDefine = this.levelDefine;

        for (var i = 0; i < levelDefine.length; i++) {
            if (levelDefine[i].level == zoom) {
                s = Math.abs(originValue) * 2 / levelDefine[i].resolution;
            }
        }

        return s;
    },

    getSize: function (zoom) {
        var origin = this.origin;
        var latScale = this._scaleByOrigin(zoom, origin.lat);
        var lngScale = this._scaleByOrigin(zoom, origin.lng);

        return L.point(lngScale, latScale);
    }
});


/*
 * L.TileLayer.Grayscale is a regular tilelayer with grayscale makeover.
 */

L.TileLayer.Grayscale = L.TileLayer.extend({
    options: {
        enableCanvas: true,
        quotaRed: 3,
        quotaGreen: 4,
        quotaBlue: 1,
        quotaDividerTune: 0,
        quotaDivider: function() {
            return this.quotaRed + this.quotaGreen + this.quotaBlue + this.quotaDividerTune;
        }
    },

    initialize: function (url, options) {
        var canvasEl = document.createElement('canvas');
        if( !(canvasEl.getContext && canvasEl.getContext('2d')) ) {
            options.enableCanvas = false;
        }

        L.TileLayer.prototype.initialize.call(this, url, options);
    },

    _loadTile: function (tile, tilePoint) {
        tile.setAttribute('crossorigin', 'anonymous');
        L.TileLayer.prototype._loadTile.call(this, tile, tilePoint);
    },

    _tileOnLoad: function () {
        if (this._layer.options.enableCanvas && !this.canvasContext) {
            var canvas = document.createElement("canvas");
            canvas.width = canvas.height = this._layer.options.tileSize;
            this.canvasContext = canvas.getContext("2d");
        }
        var ctx = this.canvasContext;

        if (ctx) {
            this.onload  = null; // to prevent an infinite loop
            ctx.drawImage(this, 0, 0);
            var imgd = ctx.getImageData(0, 0, this._layer.options.tileSize, this._layer.options.tileSize);
            var pix = imgd.data;
            for (var i = 0, n = pix.length; i < n; i += 4) {
                pix[i] = pix[i + 1] = pix[i + 2] = (this._layer.options.quotaRed * pix[i] + this._layer.options.quotaGreen * pix[i + 1] + this._layer.options.quotaBlue * pix[i + 2]) / this._layer.options.quotaDivider();
            }
            ctx.putImageData(imgd, 0, 0);
            this.removeAttribute("crossorigin");
            this.src = ctx.canvas.toDataURL();
        }

        L.TileLayer.prototype._tileOnLoad.call(this);
    }
});

L.tileLayer.grayscale = function (url, options) {
    return new L.TileLayer.Grayscale(url, options);
};




