
//create our map to display on load
let myMap = L.map('map', {
    center: [0.00,90.00],
    zoom: 3,
});

//create the tile layer for map background, adding to map
let otherMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
}).addTo(myMap);

//define link to geojson data
let link = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
 
////////////////////////////////////////////////////////////////////////////////////////////////////////

//define function for colour selection based on earthquake depth
function depthColour(reading) {
    if (reading >= -10 && reading < 10) return '#DAF7A6';
    else if (reading >= 10 && reading < 30) return '#FFC300';
    else if (reading >= 30 && reading < 50) return '#FF5733';
    else if (reading >= 50 && reading < 70) return '#C70039';
    else if (reading >= 70 && reading < 90) return '#900C3F';
    else return '#581845';    
};

////////////////////////////////////////////////////////////////////////////////////////////////////////

//create legend
let legend = L.control({
    position: 'bottomright'
});

//define the legend innerHTML for each colour range
legend.onAdd = function() {
    let div = L.DomUtil.create('div', 'legend');
    div.innerHTML += "<i style='background: #DAF7A6'></i><span></span>-10 to 10</span><br>";
    div.innerHTML += "<i style='background: #FFC300'></i><span></span>10 to 30</span><br>";
    div.innerHTML += "<i style='background: #FF5733'></i><span></span>30 to 50</span><br>";
    div.innerHTML += "<i style='background: #C70039'></i><span></span>50 to 70</span><br>";
    div.innerHTML += "<i style='background: #900C3F'></i><span></span>-70 to 90</span><br>";
    div.innerHTML += "<i style='background: #581845'></i><span></span>> 90</span><br>";
        return div;
};

//add the legend info to the map
legend.addTo(myMap);


////////////////////////////////////////////////////////////////////////////////////////////////////////

//perform a call to retreive a json response and then utilise the response to gather information
d3.json(link).then(function(response) {
    //check for correct response
    console.log(response)
    //to iterate through the required section of json data
    features = response.features;
    //check that we have the correct section
    console.log(features)
   
    //Loop through the features
    for (let i = 0; i < features.length; i++) {
        //create objects to hold the information require
        let location = features[i].geometry;
        let magnitude = features[i].properties.mag;
        let depth = location.coordinates[2];
        //check correct information has been collected
        console.log(magnitude)
        console.log(depth)
        //create a circle marker for the collected coordinates
        marker = L.circleMarker([location.coordinates[1], location.coordinates[0]])
                //add popups to the markers to show information when clicked
                .bindPopup(`<h3>Place: ${features[i].properties.place}</h3><h4>Magnitude: ${magnitude}</h4><h4>Depth: ${depth}°</h4>`)
        //style the marker based on the earthquaktes depth and magnitude
        marker.setStyle({
            color: depthColour(depth),
            fillOpacity: 1,
            //adjust magnitude to show greater variation in size
            radius: magnitude*3,
            weight: 0.5
        }).addTo(myMap);
    }

 
});

////////////////////////////////////////////////////////////////////////////////////////////////////////