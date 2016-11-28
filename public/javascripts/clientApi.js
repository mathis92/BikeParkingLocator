/**
 * Created by martinhudec on 09/11/2016.
 */


function callServerApi(call_name, params, callback) {
    $.get("api/" + call_name, params, function (data) {
        if (callback !== null) {
            callback(data);
        }
    }, 'json');
}
var range = 2000;

var displayed = [false, false, false, false, false];

displayed.push({'bicycleParkingMarker': false});

function getBikeParkings() {

    if (displayed[0] == true) {
        console.log('Removing markers');
        $('#bikeParkingsButton').removeClass('active');
        removeMarkersByName('bicycleParkingMarker');
        displayed[0] = false;
    } else {
        callServerApi('bikeParkings',
            {
                'currentLocation': {
                    'latitude': currentPosition.coords.latitude,
                    'longitude': currentPosition.coords.longitude
                }, 'range': range
            },
            function (data) {
                if (data.data.length < 1) {
                    $('#notInRange').modal('toggle');
                    $(".modal-body #textNotInRange").text("There are no bike parkings in this area, try increasing range");
                    $(".modal-header #titleNotInRange").text("Bike parkings");
                } else {
                    assignMarkersFromGeojson(buildGeoJsonData(data.data, 'parking_name', 'parking_coordinates', 'parking_identifier'), 'bicycleParkingMarker');
                    $('#bikeParkingsButton').addClass('active');

                    displayed[0] = true;
                }

            });
    }
}


function getCycloWays() {

    if (displayed[1] == true) {
        try {
            map.removeSource('cycloways');
            map.removeLayer('cycloways');
        } catch (e) {

        }
        $('#cycloWaysButton').removeClass('active');
        displayed[1] = false;
    } else {
        callServerApi('cycloways',
            {
                'currentLocation': {
                    'latitude': currentPosition.coords.latitude,
                    'longitude': currentPosition.coords.longitude
                }, 'range': range
            }, function (data) {
                if (data.data.length < 1) {

                    $('#notInRange').modal('toggle');
                    $(".modal-body #textNotInRange").text("There are no cycleways in this area, try increasing range");
                    $(".modal-header #titleNotInRange").text("Cycleways");
                } else {
                    assignLinesFromGeojson(buildGeoJsonData(data.data, 'line_name', 'line_coordinates', 'line_identifier'), 'cycloways', '#C0C0C0', 4);
                    $('#cycloWaysButton').addClass('active');

                    displayed[1] = true;
                }
            });
    }
}

function getBikeAccessibleRestaurants() {

    if (displayed[2] == true) {
        try {
            map.removeSource('cyclowaysRestaurants');
            map.removeLayer('cyclowaysRestaurants');
        } catch (e) {

        }
        removeMarkersByName('restaurantMarker');
        $('#restaurantsButton').removeClass('active');
        displayed[2] = false;
    } else {
        callServerApi('restaurants',
            {
                'currentLocation': {
                    'latitude': currentPosition.coords.latitude,
                    'longitude': currentPosition.coords.longitude
                }, 'range': range
            }, function (data) {
                if (data.data.length < 1) {
                    $('#notInRange').modal('toggle');
                    $(".modal-body #textNotInRange").text("There are no bike accessible restaurants in this area, try increasing range");
                    $(".modal-header #titleNotInRange").text("Restaurants");

                } else {
                    assignLinesFromGeojson(buildGeoJsonData(data.data, 'name_line', 'coordinates_line', 'identifier_line'), 'cyclowaysRestaurants', '#b92c28', 6);
                    assignMarkersFromGeojson(buildGeoJsonData(data.data, 'name_parking', 'coordinates_parking', 'identifier_parking'), "bicycleParkingMarker");
                    assignMarkersFromGeojson(buildGeoJsonData(data.data, 'name_restaurant', 'coordinates_restaurant', 'identifier_retaurant'), "restaurantMarker");
                    $('#restaurantsButton').addClass('active');

                    displayed[2] = true;
                }
            });
    }

}

function getTouristSights() {

    if (displayed[3] == true) {
        try {
            map.removeSource('cyclowaysSights');
            map.removeLayer('cyclowaysSights');
        } catch (e) {

        }
        removeMarkersByName('historicMarker');
        $('#sightsButton').removeClass('active');
        displayed[3] = false;
    } else {
        callServerApi('touristSights',
            {
                'currentLocation': {
                    'latitude': currentPosition.coords.latitude,
                    'longitude': currentPosition.coords.longitude
                }, 'range': range
            }, function (data) {
                if (data.data.length < 1) {
                    $('#notInRange').modal('toggle');
                    $(".modal-body #textNotInRange").text("There are no bike accessible Tourist sights in this area, try increasing range");
                    $(".modal-header #titleNotInRange").text("Tourist sights");
                } else {
                    assignLinesFromGeojson(buildGeoJsonData(data.data, 'line_types', 'line_coordinates', 'line_identifier'), 'cyclowaysSights', 'chocolate', 6);
                    assignMarkersFromGeojson(buildGeoJsonData(data.data, 'tourism_name', 'tourism_coordinates', 'tourism_identifier'), 'historicMarker');
                    $('#sightsButton').addClass('active');

                    displayed[3] = true;
                }
            });
    }
}

function getRecreationAreas() {

    if (displayed[4] == true) {
        try {
            map.removeSource('cyclowaysParks');
            map.removeLayer('cyclowaysParks');
            map.removeSource('parks');
            map.removeLayer('parks');
        } catch (e) {

        }
        $('#parksButton').removeClass('active');
        displayed[4] = false;
    } else {
        callServerApi('recreationAreas',
            {
                'currentLocation': {
                    'latitude': currentPosition.coords.latitude,
                    'longitude': currentPosition.coords.longitude
                }, 'range': range
            }, function (data) {
                if (data.data.length < 1) {
                    $('#notInRange').modal('toggle');
                    $(".modal-body #textNotInRange").text("There are no bike accessible reacreation areas in this area, try increasing range");
                    $(".modal-header #titleNotInRange").text("Recreation areas");
                } else {
                    assignPolygonFromGeojson(buildGeoJsonData(data.data, 'park_name', 'park_coordinates', 'park_identifier'), 'parks', 'green', 0.4);
                    assignLinesFromGeojson(buildGeoJsonData(data.data, 'line_name', 'line_coordinates', 'line_identifier'), 'cyclowaysParks', 'green', 6);
                    $('#parksButton').addClass('active');
                    //assignMarkersFromGeojson(buildGeoJsonData(data.data,'tourism_name','tourism_coordinates','tourism_identifier'));
                    displayed[4] = true;
                }
            });
    }
}

function displayCity() {
    var text = $('#inputCityForm').find("#inputCity").val();
    removeAllMarkers();
    if (displayed[5] == true) {
        try {
            map.removeSource('city');
            map.removeLayer('city');
        } catch (e) {

        }
        displayed[5] = false;

    }
    callServerApi('checkCityExists',
        {
            'cityName': text
        },
        function (data) {
            if (data.data.length < 1) {
                $('#cityNotExists').modal('toggle');
                $(".modal-body #town").text(text);
            } else {
                assignPolygonFromGeojson(buildGeoJsonData(data.data, 'city_name', 'city_coordinates', 'city_identifier'), 'city', '#FF963E', 0.1);
                $('#currentPosition').removeClass('active');
                console.log(data);
                console.log(JSON.parse(data.data[0].city_center));
                console.log(data.data[1]);
                setCurrentPosition({
                    coords: {
                        latitude: JSON.parse(data.data[0].city_center).coordinates[1],
                        longitude: JSON.parse(data.data[0].city_center).coordinates[0]

                    }, timestamp: Date.now()
                });
                displayed[5] = true;
            }
        });
    console.log(text);

}


function buildGeoJsonData(data, title, coordinates, identifier) {
    var features = [];
    for (var i = 0; i < data.length; i++) {
        var element = {
            type: data[i].type,
            properties: {
                title: data[i][title],
                id: data[i][identifier]
            },
            geometry: JSON.parse(data[i][coordinates])
        };
        features.push(element);
    }
    geojson = {
        "type": "FeatureCollection",
        "features": features
    };

    return geojson

}

function setRange(rangeToShow) {
    range = rangeToShow;
    var rangeElement = document.getElementById('currentRange');
    switch (rangeToShow) {
        case 2000:
            rangeElement.innerHTML = 'Current range 2 km';
            break;
        case 5000:
            rangeElement.innerHTML = 'Current range 5 km';
            break;
        case 10000:
            rangeElement.innerHTML = 'Current range 10 km';
            break;
    }

    removeAllMarkers()
}

function removeAllMarkers() {
    console.log("removing all markers");
    for (var i in currentlyShownMarkers) {
        for (var j in currentlyShownMarkers[i]) {
            for (var k in currentlyShownMarkers[i][j]) {
                var elem = document.getElementById(currentlyShownMarkers[i][j][k].properties.id);
                if (elem != null) {
                    elem.parentNode.removeChild(elem);
                }
            }
        }
    }
    try {
        map.removeSource('cyclowaysSights');
        map.removeLayer('cyclowaysSights');
    } catch (e) {

    }
    try {
        map.removeSource('city');
        map.removeLayer('city');
    } catch (e) {

    }
    try {
        map.removeSource('cyclowaysParks');
        map.removeLayer('cyclowaysParks');
    } catch (e) {

    }
    try {
        map.removeSource('parks');
        map.removeLayer('parks');
    } catch (e) {

    }
    try {
        map.removeSource('cyclowaysRestaurants');
        map.removeLayer('cyclowaysRestaurants');
    } catch (e) {

    }
    try {
        map.removeSource('cycloways');
        map.removeLayer('cycloways');
    } catch (e) {

    }

    $('#bikeParkingsButton').removeClass('active');
    $('#cycloWaysButton').removeClass('active');
    $('#restaurantsButton').removeClass('active');
    $('#sightsButton').removeClass('active');
    $('#parksButton').removeClass('active');
}

function removeMarkersByName(name) {
    var markerIndex = checkExistingMarkers(name);
    console.log(currentlyShownMarkers[markerIndex][name]);
    for (var i = 0; i < (currentlyShownMarkers[markerIndex][name]).length; i++) {
        var elem = document.getElementById(currentlyShownMarkers[markerIndex][name][i].properties.id);
        console.log(elem);
        if (elem != null) {
            elem.parentNode.removeChild(elem);
        }
    }
}

var currentlyShownMarkers = [];

function checkExistingMarkers(className) {
    for (var i in currentlyShownMarkers) {
        if (currentlyShownMarkers[i][className]) {
            return i;
        }
    }
    return null;
}


function assignMarkersFromGeojson(geojson, className) {
    var markers = [];
    geojson.features.forEach(function (marker) {
        // create a DOM element for the marker

        markers.push(marker);
        var el = document.createElement('div');
        el.className = className;
        el.id = marker.properties.id;
        el.style.width = 60 + 'px';
        el.style.height = 60 + 'px';

        el.addEventListener('click', function () {
            //window.alert(marker.properties.title);
            $('#marker').modal('toggle');
            if (className == "historicMarker") {
                $(".modal-header #title").text("Tourists sight");
            } else if (className == "restaurantMarker") {
                $(".modal-header #title").text("Restaurant");
            } else if (className == 'bicycleParkingMarker') {
                $(".modal-header #title").text("Bicycle parking");
            }


            if (marker.properties.title != null) {
                $(".modal-body #name").text(marker.properties.title);
            } else {
                $(".modal-body #name").text("Unknown");
            }
            console.log(marker);
            $(".modal-body #latitudeMarker").text(marker.geometry.coordinates[0]);
            $(".modal-body #longitudeMarker").text(marker.geometry.coordinates[1]);

        });


        // add marker to map
        new mapboxgl.Marker(el, {offset: [-30, -30]})
            .setLngLat(marker.geometry.coordinates)
            .addTo(map);
    });

    var obj = {};
    obj[className] = markers;

    var markerIndex = checkExistingMarkers(className);
    if (markerIndex == null) {
        currentlyShownMarkers.push(obj);
    } else {
        currentlyShownMarkers[markerIndex] = obj
    }
    console.log(currentlyShownMarkers);
}

var currentlyShownLines = [];

function assignLinesFromGeojson(geojson, sourceName, color, lineWidth) {

    map.addSource(sourceName, {
        "type": "geojson",
        "data": geojson
    });

    map.addLayer({
        "id": sourceName,
        "type": "line",
        "source": sourceName,
        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "paint": {
            "line-color": color,
            "line-width": lineWidth
        }
    });
}

var currentlyShownPolygons = [];

function assignPolygonFromGeojson(geojson, sourceName, color, opacity) {
    map.addSource(sourceName, {
        'type': 'geojson',
        'data': geojson
    });
    map.addLayer({
        'id': sourceName,
        'type': 'fill',
        'source': sourceName,
        'layout': {},
        'paint': {
            'fill-color': color,
            'fill-opacity': opacity
        }
    });
}


