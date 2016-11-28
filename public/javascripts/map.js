/**
 * Created by martinhudec on 09/11/2016.
 */



mapboxgl.accessToken = 'pk.eyJ1IjoibWF0aGlzOTIiLCJhIjoiY2l2YTlnbDNnMDAydzJ6cHA4bjh3MXVleCJ9.3hIJgGudWK9dp-zHH8M7tg';

var options = {
    container: 'map', // container id
    style: 'mapbox://styles/mapbox/streets-v9', //stylesheet location
    center: [17.1077, 48.1486], // starting position
    zoom: 15 // starting zoom
};

var map = new mapboxgl.Map(options);

var currentPosition = null;
var checkCurrentPosition = 1;


if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
} else {
    console.log("Geolocation is not supported by this browser.");
}
var currentLocationMarker = null;


var id, geoOptions;
var i = 0.02;

if (checkCurrentPosition) {

}

function success(pos) {
    if (checkCurrentPosition == 1) {
        currentPosition = pos;
        assignMarker()
    }
}
function error(err) {
    console.warn('ERROR(' + err.code + '): ' + err.message);
}


geoOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};


    id = navigator.geolocation.watchPosition(success, error, geoOptions);

function setCurrentPosition(coords) {
    console.log(coords);
    checkCurrentPosition = 0;
    currentPosition = coords;
    //var elem = document.getElementById("markerBike");
    //elem.parentNode.removeChild(elem);
    recenterMapSearch()
}

function recenterMapSearch(){
    console.log("Flying to " + currentPosition.coords.longitude, currentPosition.coords.latitude);
    map.flyTo({center: [currentPosition.coords.longitude, currentPosition.coords.latitude], zoom: 20});
    assignMarker();
}

function recenterMap() {
    removeAllMarkers();
    $('#currentPosition').addClass('active');
    checkCurrentPosition = 1;
    console.log("Flying to " + currentPosition.coords.longitude, currentPosition.coords.latitude);
    map.flyTo({center: [currentPosition.coords.longitude, currentPosition.coords.latitude], zoom: 20});
    assignMarker();
}

function assignMarker() {
    console.log("assigning marker");
    var currentLocation = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {
                    "iconSize": [40, 40]
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        currentPosition.coords.longitude,
                        currentPosition.coords.latitude

                    ]
                }
            }
        ]
    };
    if (currentLocationMarker === null) {

        var el = document.createElement('div');
        el.id = 'markerBike';
        el.className = 'markerBike';
        el.style.width = currentLocation.features[0].properties.iconSize[0] + 'px';
        el.style.height = currentLocation.features[0].properties.iconSize[1] + 'px';
        el.addEventListener('click', function () {

            $('#myModal').modal('show');
            $(".modal-body #latitude").text(currentPosition.coords.latitude);
            $(".modal-body #longitude").text(currentPosition.coords.longitude);
        });

        currentLocationMarker = new mapboxgl.Marker(el, {offset: [-currentLocation.features[0].properties.iconSize[0] / 2, -currentLocation.features[0].properties.iconSize[1] / 2]})
            .setLngLat(currentLocation.features[0].geometry.coordinates)
            .addTo(map);
    } else {
        currentLocationMarker.setLngLat(currentLocation.features[0].geometry.coordinates)
    }
}


function showPosition(position) {
    currentPosition = position;
    recenterMap();
}