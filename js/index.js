 var currentitem = 'peoplenum';
 var mymap = L.map('mapid', {
     crs: L.CRS.CustomLevel,
     zoomControl: false
 }).setView([31.83, 118.8], 11);
 new L.TileLayer.TDT.Vector().addTo(mymap);
 new L.TileLayer.TDT.VectorAnno().addTo(mymap);
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
 }).addTo(mymap);
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
         data: ['2011年', '2012年'],
         textStyle: {
             color: '#fff',
             fontSize: 14
         },
     },
     grid: {
         left: '3%',
         right: '4%',
         bottom: '3%',
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
             show: true,
             textStyle: {
                 color: '#fff'
             }
         }
     },
     yAxis: {
         type: 'category',
         data: ['巴西', '印尼', '美国', '印度', '中国', '世界人口(万)'],
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
         name: '2011年',
         type: 'bar',
         data: [18203, 23489, 29034, 104970, 131744, 630230]
     }, {
         name: '2012年',
         type: 'bar',
         data: [19325, 23438, 31000, 121594, 134141, 681807]
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
             junstyle = function(feature) {
                 return {
                     weight: 1,
                     opacity: 1,
                     color: 'white',
                     dashArray: '3',
                     fillOpacity: 0.7,
                     fillColor: getColor(feature.properties.xljun)
                 };
             }
             break;
         case '在职残疾':
             currentitem = 'zcjun';
             junstyle = function(feature) {
                 return {
                     weight: 1,
                     opacity: 1,
                     color: 'white',
                     dashArray: '3',
                     fillOpacity: 0.7,
                     fillColor: getColor(feature.properties.zcjun)
                 };
             }
         case '在乡残疾':
             currentitem = 'xcjun';
             junstyle = function(feature) {
                 return {
                     weight: 1,
                     opacity: 1,
                     color: 'white',
                     dashArray: '3',
                     fillOpacity: 0.7,
                     fillColor: getColor(feature.properties.xcjun)
                 };
             }
             break;
     }
     geojson.setStyle(junstyle);
 });