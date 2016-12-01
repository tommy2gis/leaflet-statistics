 var currentitem = 'peoplenum';
 var mymap = L.map('mapid', {
     crs: L.CRS.CustomLevel,
     zoomControl: false
 }).setView([31.83, 118.8], 11);
 new L.TileLayer.TDT.Vector().addTo(mymap);
 new L.TileLayer.TDT.VectorAnno().addTo(mymap);
 var heatdangandata = [];
 var tangniaodata = [];
 var gaoxueyadata = [];
 var laoniandata = [];
 var tangniaodata2 = [];
 var gaoxueyadata2 = [];
 var laoniandata2 = [];
 var hexdata = [];
 var shequnamedata = [];
 for (var i = 0; i < shequdata.features.length; i++) {
     var item = shequdata.features[i].properties;
     if (i < 40) {
         shequnamedata.push(item.COMMUNAME);
         tangniaodata2.push(item.tangniaobin)
         gaoxueyadata2.push(item.gaoyabin)
         laoniandata2.push(item.oldpeop)
     }
     heatdangandata.push([item.lat, item.long, item.dangan])
     tangniaodata.push([item.lat, item.long, item.tangniaobin])
     gaoxueyadata.push([item.lat, item.long, item.gaoyabin])
     laoniandata.push([item.lat, item.long, item.oldpeop])
         /* hexdata.push({
              properties: item,
              type: "Feature",
              geometry: {
                  coordinates: [item.long, item.lat],
                  type: "Point"
              }
          })*/
 };
 var heat = L.heatLayer(heatdangandata, {
     radius: 25
 });
 // Options for the hexbin layer
 var options = {
     radius: 20, // Size of the hexagons/bins
     opacity: 0.8, // Opacity of the hexagonal layer
     duration: 1000, // millisecond duration of d3 transitions (see note below)
     lng: function(d) {
         return d[1];
     }, // longitude accessor
     lat: function(d) {
         return d[0];
     }, // latitude accessor
     value: function(d) {
         return d[0].o[2];
     }, // value accessor - derives the bin value
     valueFloor: 100,
     valueCeil: 3000, // override the color scale domain high value
     colorRange: ["#00FF00", "#FFA500"], // default color range for the heat map (see note below)
     onmouseover: function(d, node, layer) {},
     onmouseout: function(d, node, layer) {},
     onclick: function(d, node, layer) {}
 };
 // Create the hexbin layer and add it to the map
 var hexLayer = L.hexbinLayer(options);
 // Optionally, access the d3 color scale directly
 // Can also set scale via hexLayer.colorScale(d3.scale.linear()...)
 hexLayer.colorScale().range(['white', '#E87C25']);
 hexLayer.data(tangniaodata);
 /*var geoData = {
     type: "FeatureCollection",
     features: hexdata
 };
 var cscale = d3.scale.linear().domain([1000, 10000]).range(["#00FF00", "#FFA500"]);
 var hexLayer = L.hexbinLayer(geoData, {
     style: hexbinStyle
 }).addTo(mymap);

 function hexbinStyle(hexagons) {
     hexagons.attr("stroke", "black").attr("fill", function(d) {
         var values = d.map(function(elem) {
             return elem[2].dangan;
         })
         var avg = d3.mean(d, function(d) {
             return +d[2].dangan;
         })
         return cscale(avg);
     });
 }*/
 // control that shows state info on hover
 var info = L.control();
 info.onAdd = function(map) {
     this._div = L.DomUtil.create('div', 'info');
     this.update();
     return this._div;
 };
 info.update = function(props) {
     switch (currentitem) {
         case 'peoplenum':
             this._div.innerHTML = '<h4>人口总量</h4>' + (props ? '<b>' + props.NAME + '</b><br />' + props.peopnum + ' (万人)' : '');
             break;
         case 'xljun':
             this._div.innerHTML = '<h4>在乡老复员人数</h4>' + (props ? '<b>' + props.NAME + '</b><br />' + props.xljun + ' (人)' : '');
             break;
         case 'zcjun':
             this._div.innerHTML = '<h4>在职残疾人数</h4>' + (props ? '<b>' + props.NAME + '</b><br />' + props.zcjun + ' (人)' : '');
             break;
         case 'xcjun':
             this._div.innerHTML = '<h4>在乡残疾人数</h4>' + (props ? '<b>' + props.NAME + '</b><br />' + props.xcjun + ' (人)' : '');
             break;
     }
 };
 info.addTo(mymap);

 function getColor(d) {
     return d > 14 ? '#800026' : d > 12 ? '#BD0026' : d > 10 ? '#E31A1C' : d > 8 ? '#FC4E2A' : d > 6 ? '#FD8D3C' : d > 4 ? '#FEB24C' : d > 2 ? '#FED976' : '#FFEDA0';
 }

 function getxljunColor(d) {
     return d > 28 ? '#800026' : d > 24 ? '#BD0026' : d > 20 ? '#E31A1C' : d > 16 ? '#FC4E2A' : d > 12 ? '#FD8D3C' : d > 8 ? '#FEB24C' : d > 4 ? '#FED976' : '#FFEDA0';
 }

 function getzcjunColor(d) {
     return d > 14 ? '#800026' : d > 12 ? '#BD0026' : d > 10 ? '#E31A1C' : d > 8 ? '#FC4E2A' : d > 6 ? '#FD8D3C' : d > 4 ? '#FEB24C' : d > 2 ? '#FED976' : '#FFEDA0';
 }

 function getxcjunColor(d) {
     return d > 35 ? '#800026' : d > 30 ? '#BD0026' : d > 25 ? '#E31A1C' : d > 20 ? '#FC4E2A' : d > 15 ? '#FD8D3C' : d > 10 ? '#FEB24C' : d > 5 ? '#FED976' : '#FFEDA0';
 }
 var xljunlegend = L.control({
     position: 'bottomright'
 });
 xljunlegend.onAdd = function(map) {
     var div = L.DomUtil.create('div', 'info legend'),
         grades = [0, 4, 8, 12, 16, 20, 24, 28],
         labels = [],
         from, to;
     for (var i = 0; i < grades.length; i++) {
         from = grades[i];
         to = grades[i + 1];
         labels.push('<i style="background:' + getxljunColor(from + 1) + '"></i> ' + from + (to ? '&ndash;' + to : '+'));
     }
     div.innerHTML = labels.join('<br>');
     return div;
 };
 var zcjunlegend = L.control({
     position: 'bottomright'
 });
 zcjunlegend.onAdd = function(map) {
     var div = L.DomUtil.create('div', 'info legend'),
         grades = [0, 2, 4, 6, 8, 10, 12, 14],
         labels = [],
         from, to;
     for (var i = 0; i < grades.length; i++) {
         from = grades[i];
         to = grades[i + 1];
         labels.push('<i style="background:' + getzcjunColor(from + 1) + '"></i> ' + from + (to ? '&ndash;' + to : '+'));
     }
     div.innerHTML = labels.join('<br>');
     return div;
 };
 var xcjunlegend = L.control({
     position: 'bottomright'
 });
 xcjunlegend.onAdd = function(map) {
     var div = L.DomUtil.create('div', 'info legend'),
         grades = [0, 5, 10, 15, 20, 25, 30, 35],
         labels = [],
         from, to;
     for (var i = 0; i < grades.length; i++) {
         from = grades[i];
         to = grades[i + 1];
         labels.push('<i style="background:' + getxcjunColor(from + 1) + '"></i> ' + from + (to ? '&ndash;' + to : '+'));
     }
     div.innerHTML = labels.join('<br>');
     return div;
 };

 function style(feature) {
     return {
         weight: 1,
         opacity: 1,
         color: 'white',
         dashArray: '3',
         fillOpacity: 0.7,
         fillColor: getColor(feature.properties.peopnum)
     };
 }

 function highlightFeature(e) {
     var layer = e.target;
     /*layer.setStyle({
         weight: 2,
         color: '#666',
         dashArray: '',
         fillOpacity: 0.7
     });
     if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
         layer.bringToFront();
     }*/
     info.update(layer.feature.properties);
 }
 var geojson;

 function resetHighlight(e) {
     // geojson.resetStyle(e.target);
     info.update();
 }

 function zoomToFeature(e) {
     mymap.fitBounds(e.target.getBounds());
 }

 function onEachFeature(feature, layer) {
     layer.on({
         mouseover: highlightFeature,
         mouseout: resetHighlight,
         click: zoomToFeature
     });
 }
 geojson = L.geoJson(jiedaodata, {
     style: style,
     onEachFeature: onEachFeature
 });
 geojson.addTo(mymap);
 var legend = L.control({
     position: 'bottomright'
 });
 legend.onAdd = function(map) {
     var div = L.DomUtil.create('div', 'info legend'),
         grades = [0, 2, 4, 6, 8, 10, 12, 14],
         labels = [],
         from, to;
     for (var i = 0; i < grades.length; i++) {
         from = grades[i];
         to = grades[i + 1];
         labels.push('<i style="background:' + getColor(from + 1) + '"></i> ' + from + (to ? '&ndash;' + to : '+'));
     }
     div.innerHTML = labels.join('<br>');
     return div;
 };
 legend.addTo(mymap);
 var currentlegend = legend;
 var myChart = echarts.init(document.getElementById('zftxtu'));
 // 指定图表的配置项和数据
 option = {
     tooltip: {
         trigger: 'axis',
         axisPointer: {
             type: 'shadow'
         }
     },
     legend: {
         data: ['农村低保户数', '城镇低保户数', '农村低保人数', '城镇低保人数'],
         textStyle: {
             color: '#fff',
             fontSize: 14
         },
         selectedMode: 'single'
     },
     grid: {
         left: '3%',
         right: '4%',
         bottom: '5%',
         containLabel: true
     },
     xAxis: {
         type: 'value',
         boundaryGap: [0, 0.01],
         axisLine: {
             lineStyle: {
                 color: '#aaa'
             }
         },
         axisLabel: {
             rotate: 60,
             show: true,
             textStyle: {
                 color: '#fff'
             }
         }
     },
     yAxis: {
         type: 'category',
         data: ['东山街道', '秣陵街道', '汤山街道', '淳化街道', '禄口街道', '江宁街道', '谷里街道', '湖熟街道', '横溪街道', '麒麟街道'],
         axisLine: {
             lineStyle: {
                 color: '#aaa'
             }
         },
         axisLabel: {
             show: true,
             textStyle: {
                 color: '#fff'
             }
         }
     },
     series: [{
         name: '农村低保户数',
         type: 'bar',
         data: [220, 468, 1013, 1345, 925, 1160, 539, 1291, 1916, 353]
     }, {
         name: '城镇低保户数',
         type: 'bar',
         data: [238, 445, 65, 195, 176, 87, 13, 49, 86, 30]
     }, {
         name: '农村低保人数',
         type: 'bar',
         data: [367, 755, 1660, 1979, 1467, 2070, 820, 1667, 3258, 508]
     }, {
         name: '城镇低保人数',
         type: 'bar',
         data: [367, 755, 1660, 1979, 1467, 2070, 820, 1667, 3258, 508]
     }]
 };
 // 使用刚指定的配置项和数据显示图表。
 myChart.setOption(option);
 var junrenChart = echarts.init(document.getElementById('junren'));
 var dataBJ = [
     [7, 22, 26, 19, 4, 18, 23, 20, 31, 9]
 ];
 var dataGZ = [
     [12, 5, 5, 2, 7, 7, 4, 5, 3, 1]
 ];
 var dataSH = [
     [34, 16, 25, 7, 33, 39, 33, 51, 28, 13]
 ];
 var lineStyle = {
     normal: {
         width: 1,
         opacity: 0.5
     }
 };
 junrenoption = {
     legend: {
         bottom: 5,
         data: ['在乡老复员', '在职残疾', '在乡残疾'],
         itemGap: 20,
         textStyle: {
             color: '#fff',
             fontSize: 14
         },
         selectedMode: 'single'
     },
     tooltip: {},
     // visualMap: {
     //     show: true,
     //     min: 0,
     //     max: 20,
     //     dimension: 6,
     //     inRange: {
     //         colorLightness: [0.5, 0.8]
     //     }
     // },
     radar: {
         indicator: [{
             name: '东山街道',
             max: 60
         }, {
             name: '秣陵街道',
             max: 60
         }, {
             name: '汤山街道',
             max: 60
         }, {
             name: '淳化街道',
             max: 60
         }, {
             name: '禄口街道',
             max: 60
         }, {
             name: '江宁街道',
             max: 60
         }, {
             name: '谷里街道',
             max: 60
         }, {
             name: '湖熟街道',
             max: 60
         }, {
             name: '横溪街道',
             max: 60
         }, {
             name: '麒麟街道',
             max: 60
         }],
         center: ['50%', '40%'],
         radius: 80,
         shape: 'circle',
         splitNumber: 5,
         name: {
             textStyle: {
                 color: 'rgb(238, 197, 102)'
             }
         },
         splitLine: {
             lineStyle: {
                 color: ['rgba(238, 197, 102, 0.1)', 'rgba(238, 197, 102, 0.2)', 'rgba(238, 197, 102, 0.4)', 'rgba(238, 197, 102, 0.6)', 'rgba(238, 197, 102, 0.8)', 'rgba(238, 197, 102, 1)'].reverse()
             }
         },
         splitArea: {
             show: false
         },
         axisLine: {
             lineStyle: {
                 color: 'rgba(238, 197, 102, 0.5)'
             }
         }
     },
     series: [{
         name: '在乡老复员',
         type: 'radar',
         lineStyle: lineStyle,
         data: dataBJ,
         symbol: 'none',
         itemStyle: {
             normal: {
                 color: '#F9713C'
             }
         },
         areaStyle: {
             normal: {
                 opacity: 0.1
             }
         }
     }, {
         name: '在职残疾',
         type: 'radar',
         lineStyle: lineStyle,
         data: dataSH,
         symbol: 'none',
         itemStyle: {
             normal: {
                 color: '#B3E4A1'
             }
         },
         areaStyle: {
             normal: {
                 opacity: 0.05
             }
         }
     }, {
         name: '在乡残疾',
         type: 'radar',
         lineStyle: lineStyle,
         data: dataGZ,
         symbol: 'none',
         itemStyle: {
             normal: {
                 color: 'rgb(238, 197, 102)'
             }
         },
         areaStyle: {
             normal: {
                 opacity: 0.05
             }
         }
     }]
 };
 junrenChart.setOption(junrenoption);
 junrenChart.on("legendselectchanged", function(param) {
     var selected = param.name;
     var junstyle;
     switch (selected) {
         case '在乡老复员':
             currentitem = 'xljun';
             currentlegend.remove();
             xljunlegend.addTo(mymap);
             currentlegend = xljunlegend;
             junstyle = function(feature) {
                 return {
                     weight: 1,
                     opacity: 1,
                     color: 'white',
                     dashArray: '3',
                     fillOpacity: 0.7,
                     fillColor: getxljunColor(feature.properties.xljun)
                 };
             }
             break;
         case '在职残疾':
             currentitem = 'zcjun';
             currentlegend.remove();
             zcjunlegend.addTo(mymap);
             currentlegend = zcjunlegend;
             junstyle = function(feature) {
                 return {
                     weight: 1,
                     opacity: 1,
                     color: 'white',
                     dashArray: '3',
                     fillOpacity: 0.7,
                     fillColor: getzcjunColor(feature.properties.zcjun)
                 };
             }
             break;
         case '在乡残疾':
             currentitem = 'xcjun';
             currentlegend.remove();
             xcjunlegend.addTo(mymap);
             currentlegend = xcjunlegend;
             junstyle = function(feature) {
                 return {
                     weight: 1,
                     opacity: 1,
                     color: 'white',
                     dashArray: '3',
                     fillOpacity: 0.7,
                     fillColor: getxcjunColor(feature.properties.xcjun)
                 };
             }
             break;
     }
     geojson.setStyle(junstyle);
 });
 $(".panel li p").click(function(e) {
     switch (this.id) {
         case 'allpeop':
             if ($(".allapolygon").is(":hidden")) {
                 currentitem = 'peoplenum';
                 currentlegend.remove();
                 legend.addTo(mymap);
                 currentlegend = legend;
                 $(".allapolygon").show();
                 mymap.addLayer(geojson);
                 geojson.setStyle(style);
             } else {
                 $(".allapolygon").hide();
                 mymap.removeLayer(geojson);
             }
             break;
         case 'dibao':
             if ($(".apiechart").is(":hidden")) {
                 $(".apiechart").show();
                 addchart();
             } else {
                 $(".apiechart").hide();
                 dibaolayer.clearLayers();
             }
             break;
         case 'jun':
             if ($(".junapolygon").is(":hidden")) {
                 $(".junapolygon").show();
                 currentitem = 'xljun';
                 currentlegend.remove();
                 xljunlegend.addTo(mymap);
                 currentlegend = xljunlegend;
                 var junstyle = function(feature) {
                     return {
                         weight: 1,
                         opacity: 1,
                         color: 'white',
                         dashArray: '3',
                         fillOpacity: 0.7,
                         fillColor: getxljunColor(feature.properties.xljun)
                     };
                 }
                 mymap.addLayer(geojson);
                 geojson.setStyle(junstyle);
             } else {
                 $(".junapolygon").hide();
                 mymap.removeLayer(geojson);
             }
             break;
     }
 });
 $(".rightpanel li p").click(function(e) {
     if ($(".rightpanel a").is(":hidden")) {
         $(".rightpanel a").show();
         hexLayer.addTo(mymap);
     } else {
         $(".rightpanel a").hide();
         mymap.removeLayer(hexLayer);
     }
 });
 var dibaolayer = L.featureGroup().addTo(mymap);;

 function addchart() {
     for (var i = 0; i < jiedaodata.features.length; i++) {
         var val = jiedaodata.features[i].properties;
         var pictures = L.marker([val.lat, val.lng], {
             icon: L.divIcon({
                 className: 'leaflet-echart-icon',
                 iconSize: [100, 100],
                 html: '<div id="marker' + val.GEOCODE + '" style="width: 100px; height: 100px; position: relative; background-color: transparent;">asd</div>'
             })
         }).addTo(dibaolayer);
         // 基于准备好的dom，初始化echarts实例
         var myChart = echarts.init(document.getElementById('marker' + val.GEOCODE));
         // 指定图表的配置项和数据
         option = {
             tooltip: {
                 trigger: 'item',
                 formatter: "{b}: {c}"
             },
             series: [{
                 type: 'pie',
                 radius: ['10', '40'],
                 avoidLabelOverlap: false,
                 label: {
                     normal: {
                         show: false,
                         position: 'center'
                     },
                     emphasis: {
                         show: true,
                         textStyle: {
                             fontSize: '18',
                             fontWeight: 'bold'
                         }
                     }
                 },
                 labelLine: {
                     normal: {
                         show: false
                     }
                 },
                 data: [{
                     value: val.countrype,
                     name: '农村低保人数'
                 }, {
                     value: val.countryhu,
                     name: '农村低保户数'
                 }, {
                     value: val.townhu,
                     name: '城镇低保户数'
                 }, {
                     value: val.townpe,
                     name: '城镇低保人数'
                 }]
             }]
         };
         // 使用刚指定的配置项和数据显示图表。
         myChart.setOption(option);
     };
 }
 var danganChart = echarts.init(document.getElementById('jiandang'));
 // 指定图表的配置项和数据
 danganoption = {
     tooltip: {
         trigger: 'axis',
         axisPointer: {
             type: 'shadow'
         }
     },
     legend: {
         data: ['糖尿病建档数', '高血压建档数', '老年人建档数'],
         textStyle: {
             color: '#fff',
             fontSize: 14
         },
         selectedMode: 'single'
     },
     grid: {
         left: '3%',
         right: '4%',
         bottom: '5%',
         containLabel: true
     },
     xAxis: {
         type: 'value',
         boundaryGap: [0, 0.01],
         axisLine: {
             lineStyle: {
                 color: '#aaa'
             }
         },
         axisLabel: {
             rotate: 60,
             show: true,
             textStyle: {
                 color: '#fff'
             }
         }
     },
     yAxis: {
         type: 'category',
         data: shequnamedata,
         axisLine: {
             lineStyle: {
                 color: '#aaa'
             }
         },
         axisLabel: {
             show: true,
             textStyle: {
                 color: '#fff'
             }
         }
     },
     series: [{
         name: '糖尿病建档数',
         type: 'bar',
         itemStyle: {
             normal: {
                 color: '#E87C25'
             }
         },
         data: tangniaodata2
     }, {
         name: '高血压建档数',
         type: 'bar',
         itemStyle: {
             normal: {
                 color: '#C1232B'
             }
         },
         data: gaoxueyadata2
     }, {
         name: '老年人建档数',
         type: 'bar',
         itemStyle: {
             normal: {
                 color: '#B5C334'
             }
         },
         data: laoniandata2
     }]
 };
 // 使用刚指定的配置项和数据显示图表。
 danganChart.setOption(danganoption);
 danganChart.on("legendselectchanged", function(param) {
     var selected = param.name;
     switch (selected) {
         case '糖尿病建档数':
             hexLayer.options.valueFloor = 100;
             hexLayer.options.valueCeil = 3000;
             hexLayer.colorScale().range(['white', '#E87C25']);
             hexLayer.data(tangniaodata);
             break;
         case '高血压建档数':
             hexLayer.options.valueFloor = 1000;
             hexLayer.options.valueCeil = 8000;
             hexLayer.colorScale().range(['white', '#C1232B']);
             hexLayer.data(gaoxueyadata);
             break;
         case '老年人建档数':
             hexLayer.options.valueFloor = 1000;
             hexLayer.options.valueCeil = 8000;
             hexLayer.colorScale().range(['white', '#B5C334']);
             hexLayer.data(laoniandata);
             break;
     }
 });