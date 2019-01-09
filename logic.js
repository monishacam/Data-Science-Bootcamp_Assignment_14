var earthquakeurl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(earthquakeurl, function(data){
    createFeatures(data.features);
});

function createFeatures(earthquakedata){
    function onEachFeature(feature, layer){
        layer.bindPopup("<h3>" + feature.properties.place + "<br> Magnitude: " + feature.properties.mag +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

    var earthquakes = L.geoJSON(earthquakedata, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
            return new L.circle(latlng,
              {radius: getRadius(feature.properties.mag),
                fillColor: getColor(feature.properties.mag),
                fillOpacity: .7,
                stroke: true,
                color: "black",
                weight: .5
            })
          }
    });

    createMap(earthquakes);
}

function createMap(earthquakes){

    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
      });
    
    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
      });
    
    var satellitemap =  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
      });
    
    var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap,
        "Satellite Map": satellitemap
    };

    var overlayMaps = {
        Earthquakes: earthquakes,
    };

    var myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 3,
        layers: [streetmap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
              grades = [0, 1, 2, 3, 4, 5],
              labels = [];

  // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
  };

  legend.addTo(myMap);
}

function getColor(d) {
  return d > 5 ? '#F30' :
  d > 4  ? '#F60' :
  d > 3  ? '#F90' :
  d > 2  ? '#FC0' :
  d > 1   ? '#FF0' :
            '#9F3';
}

function getRadius(value){
  return value*40000

}