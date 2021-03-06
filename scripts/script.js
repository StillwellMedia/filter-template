'use strict';

//var unselectedIcon = L.Icon.Default;
//var selectedIcon = L.Icon.Default;

console.log('loading config');
L.Util.ajax('config.json').then(function(config){
    var map = makeBaseMap(config);

    console.log('loading geojson');
    L.Util.ajax('data.geojson').then(function(data){
        var info = makeInfoBox(config, map);

        var onClick = function(e){
            map.panTo(e.latlng); //zoom to the clicked element
            info.update(e.target.feature.properties); //update infobox
            //e.target.setIcon(selectedIcon);
            console.log(e);
        };
    
        var setupFeature = function(feature, layer) {
            //console.log(feature.properties.address);
            layer.on({ click: onClick });
        };

        L.geoJson(data, {onEachFeature: setupFeature}).addTo(map);
    });
});


var makeInfoBox = function(config, map){
    var info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        //this.update();
        return this._div;
    };

    info.update = function (featureProps) {
        this._div.innerHTML = createPopup(config.properties, featureProps);
    };

    info.addTo(map);

    return info
}

var makeBaseMap = function(config){
    var map = L.map('map');

    if (config.map){
        if (!location.hash) {
            map.setView(config.map.center, config.map.zoom);
        }
        if (config.map.maxZoom){
            map.options.maxZoom = config.map.maxZoom;
        }
        if (config.map.maxBounds){
            map.setMaxBounds(config.map.maxBounds);
        }
    }
    //map.addHash();

    var mq = L.tileLayer('http://tiles.mapc.org/basemap/{z}/{x}/{y}.png', {        
        attribution: 'Tiles Courtesy of <a href="http://mapc.org">MAPC</a> &mdash; Map data &copy; <a href="http://www.mass.gov/mgis/">MassGIS</a>',
        subdomains: '1234'
    }).addTo(map);

    return map;
}




