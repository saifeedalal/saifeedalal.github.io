// creating empty layergroup for later adding to map
var earthquakeLayer = new L.layerGroup();
var tecPlateLayer = new L.layerGroup() ;

// Adding Satellite tile layer

var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  maxZoom: 18,
  id: "mapbox.satellite",
  accessToken: API_KEY
});

// Adding light tile layer
var lightMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});

// Adding dark tile layer
var darkMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
});

// Adding comic tile layer
var comicMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  maxZoom: 18,
  id: "mapbox.comic",
  accessToken: API_KEY
});

// Adding outdoor tile layer
var outdoorMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  maxZoom: 18,
  id: "mapbox.outdoors",
  accessToken: API_KEY
});

// creating  map with earthquake and plates layers
let myMap =  L.map("map", {
    center: [40.809730, -110],
    zoom: 5,
    layers: [earthquakeLayer, tecPlateLayer]
});

//Adding all tiles to the map

satelliteMap = satelliteMap.addTo(myMap);
darkMap = darkMap.addTo(myMap);
lightMap = lightMap.addTo(myMap);
comicMap = comicMap.addTo(myMap);
outdoorMap = outdoorMap.addTo(myMap);

// Create an overlay object
var overlayMaps = {
    "Earthquakes": earthquakeLayer,
    "Fault Lines": tecPlateLayer
};
// create basemap object
var baseMaps = {
    "Light": lightMap,
    "Dark": darkMap,
    "Satellite": satelliteMap,
    "Outdoor": outdoorMap,
    "Comic":comicMap

};

//add base and overlay layers
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(myMap);

// set color scale based on earthquake magnitude
var setCircleColor = function(mag) {
    switch(true) {
        case(mag>0 && mag<=1): return "#ffffff";
        break;
        case(mag>1 && mag<=2): return "#fed999";
        break;
        case(mag>2 && mag<=3): return "#feb24c";
        break;
        case(mag>3 && mag<=4): return "#fd8d3c";
        break;
        case(mag>4 && mag<=5): return "#f03b20";
        break;
        case(mag>5): return "#bd0026"
    }
};


var earthquakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var tecplatesUrl = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// fetch data for the plates layer
d3.json(tecplatesUrl, function(tecPlatesData){
    var features = tecPlatesData.features;
    // console.log(features)
    L.geoJson(tecPlatesData)
        .addTo(tecPlateLayer);
  });


// fetch data for the earthquake layer
d3.json(earthquakeUrl, function(data){
  createMap(data);
});

function createMap(data) {
     L.geoJson(data, {
        onEachFeature: function (feature, layer) {
            layer.bindPopup("<h3><u>Place:</u> "+feature.properties.place+"</h3><hr><h4><u>DateTime:</u> "+new Date(feature.properties.time)+"</h4><hr><h4>"+
                            "<u>Magnitude:</u> "+feature.properties.mag+"</h4>")
        },
        pointToLayer: function (feature, latlng) {
            return new L.circleMarker(latlng, {
                radius: feature.properties.mag*5,
                fillColor: setCircleColor(feature.properties.mag),
                color: "black",
                weight: .4,
                opacity: .75,
                fillOpacity: 0.7
            })
        }
    }).addTo(earthquakeLayer);

    // setting up legend
    var legend = L.control({position: "bottomright"});
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var limits = [1,2,3,4,5,5.1];
        var colors = limits.map(d=>setCircleColor(d));
        console.log(limits)
        console.log(colors)
        // Add legend text (min and max)
        var legendInfo = "<h1>Earthquake Magnitude</h1>"+
            "<div class=\"label\">" +
            "<div class=\"min\">"+"<" + limits[0].toFixed(1)+ "</div>" +
            "<div class=\"max\">"+">"+limits[limits.length-2].toFixed(1) +"</div>"+
            "</div>"
      
        div.innerHTML = legendInfo;
        // set up legend color bar
        labels=[];
        limits.forEach(function(limit, index) {
            labels.push("<li style=\"background-color: " + colors[index] + "\"></li>"); 
        })
        div.innerHTML += "<ul>"+ labels.join("") + "</ul>";
        return div;
    };
    legend.addTo(myMap);
};