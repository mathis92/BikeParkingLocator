/**
 * Created by martinhudec on 09/11/2016.
 */

var db_connector = require('./dbConnector.js');

function getBikeParkings(req, res, next) {
    console.log("Getting all getBikeParkings");
    console.log(req.query.currentLocation);
    currentLocation = req.query.currentLocation;
    range = req.query.range;
    db_connector.db_instance.any("select point.osm_id as parking_identifier, point.name as parking_name, st_asgeojson(ST_Transform(point.way,4326)) as parking_coordinates" +
        " from planet_osm_point as point" +
        " join (select st_transform as way from st_transform(ST_SetSRID(st_makepoint(" + currentLocation.longitude + " ," + currentLocation.latitude + "),4326),900913)) as current_location on st_dwithin(point.way,current_location.way," + range + ")" +
        " where point.amenity = 'bicycle_parking'")
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Query successfully processed'
                });
        })
        .catch(function (err) {
            console.error(err)
            return next(err);
        });
}

function getCycloWays(req, res, next) {
    console.log("Getting all getBikeParkings");
    console.log(req.query.currentLocation);
    currentLocation = req.query.currentLocation;
    range = req.query.range;
    db_connector.db_instance.any("select line.osm_id as line_identifier, line.name as line_name, st_asgeojson(st_transform(line.way,4326)) as line_coordinates" +
        " from planet_osm_line as line" +
        " join (select st_transform as way from st_transform(ST_SetSRID(st_makepoint(" + currentLocation.longitude + " ," + currentLocation.latitude + "),4326),900913)) as current_location on st_dwithin(line.way,current_location.way," + range + ")" +
        " where (line.bicycle = 'yes' or (line.bicycle is null and line.highway in ('track','path','footway','pedestrian','cycleway')))")
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Query successfully processed'
                });
        })
        .catch(function (err) {
            console.error(err)
            return next(err);
        });
}


// 1. najblizsie parkoviska pre bicykle k postam a cyklocesty k nim aspon 3 ak nieje parkovisko pre bicykle tak iba prislusna ccyklocesta
// cykloobchody

// 2. parkoviska ku uzatvorenym cyklotrasam na slovensku

// 3. moznosti ako prejst uzemie po cyklotrase


function getBikeCycloWays2(req, res, next) {
    console.log("Getting all getBikeAccessibleRestaurants");
    console.log(req.query.currentLocation);
    currentLocation = req.query.currentLocation;
    range = req.query.range;
    db_connector.db_instance.any("select  line.osm_id as identifier, line.name, st_asgeojson(ST_Transform(line.way,4326)) as coordinates from planet_osm_line as line " +
        "join planet_osm_polygon as polygon on st_contains(polygon.way, line.way) " +
        " join (select st_transform as way from st_transform(ST_SetSRID(st_makepoint(" + currentLocation.longitude + " ," + currentLocation.latitude + "),4326),900913)) as current_location on st_dwithin(line.way,current_location.way," + range + ")" +
        "where (line.bicycle = 'yes' " +
        "or (line.bicycle is null and line.highway in ('track','path','footway','pedestrian','cycleway'))) " +
        "and polygon.name = 'Bratislavský kraj' ")
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Query successfully processed'
                });
        })
        .catch(function (err) {
            console.error(err);
            return next(err);
        });
}

function getBikeAccessibleRestaurants(req, res, next) {
    console.log("Getting all getBikeAccessibleRestaurants");
    console.log(req.query.currentLocation);
    currentLocation = req.query.currentLocation;
    range = req.query.range;
    db_connector.db_instance.any("select  line.osm_id as identifier_line," +
        " line.name as name_line," +
        " line.highway as line_type," +
        " st_asgeojson(ST_Transform(line.way,4326)) as coordinates_line," +
        " st_asgeojson(ST_Transform(parkings.way,4326)) as coordinates_parking," +
        " parkings.name as name_parking," +
        " parkings.osm_id as identifier_parking," +
        " restaurants.osm_id as identifier_restaurant," +
        " restaurants.name as name_restaurant," +
        " st_asgeojson(ST_Transform(restaurants.way,4326)) as coordinates_restaurant" +
        " from planet_osm_line as line" +
        " join planet_osm_polygon as region on st_contains(region.way, line.way)" +
        " join (select st_transform as way from st_transform(ST_SetSRID(st_makepoint(" + currentLocation.longitude + " ," + currentLocation.latitude + "),4326),900913)) as current_location on st_dwithin(line.way,current_location.way," + range + ")" +
        " join (select * from planet_osm_point" +
        " where amenity = 'bicycle_parking') as parkings on st_dwithin(parkings.way,line.way,50)" +
        " join (select * from planet_osm_point" +
        " where amenity = 'restaurant') as restaurants on st_dwithin(restaurants.way,parkings.way,50)" +
        " where (line.bicycle = 'yes' or (line.bicycle is null and line.highway in ('track','path','footway','pedestrian','cycleway'))) and region.name = 'Bratislavský kraj' ")
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Query successfully processed'
                });
        })
        .catch(function (err) {
            console.error(err);
            return next(err);
        });
}


function getTouristSights(req, res, next) {
    console.log("Getting all Bike accessible touris sights");
    console.log(req.query.currentLocation);
    currentLocation = req.query.currentLocation;
    range = req.query.range;
    db_connector.db_instance.any("select " +
        " tour.tourism_name, " +
        " tour.tourism_type, " +
        " tour.tourism_identifier, " +
        " st_asgeojson(st_transform(tour.tourism_way,4326)) as tourism_coordinates," +
        " row_number() OVER () as line_identifier, " +
        " st_asgeojson(st_transform(st_union(tour.line_way),4326)) as line_coordinates, " +
        " string_agg(DISTINCT tour.line_type,',') as line_types from (" +
        " select tourism.name as tourism_name," +
        " tourism.way as tourism_way," +
        " tourism.osm_id as tourism_identifier," +
        " case when tourism.tourism is null then" +
        " tourism.historic" +
        " else" +
        " tourism.tourism" +
        " end as tourism_type," +
        " line.way as line_way," +
        " case when line.highway is null then" +
        " 'cycleway'" +
        " else" +
        " line.highway" +
        " end as line_type" +
        " from planet_osm_point as tourism" +
        " join (select st_transform as way from st_transform(ST_SetSRID(st_makepoint(" + currentLocation.longitude + " ," + currentLocation.latitude + "),4326),900913)) as current_location on st_dwithin(tourism.way,current_location.way," + range + ")" +
        " join planet_osm_line as line on st_dwithin(line.way,tourism.way,100)" +
        " where (tourism.historic is not null or tourism.tourism in ('information','zoo','museum','Observation tower','gallery','attraction','viewpoint')) and tourism.name is not null" +
        " and (line.bicycle = 'yes' or (line.bicycle is null and line.highway in ('track','path','footway','pedestrian','cycleway')))" +
        " ) as tour group by tour.tourism_name,tour.tourism_type,tour.tourism_way, tour.tourism_identifier")
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Query successfully processed'
                });
        })
        .catch(function (err) {
            console.error(err);
            return next(err);
        });
}

function getRecreationAreas(req, res, next) {
    console.log("Getting all recreation areas");
    console.log(req.query.currentLocation);
    currentLocation = req.query.currentLocation;
    range = req.query.range;
    db_connector.db_instance.any("select park.park_name," +
        " park.park_identifier," +
        " st_asgeojson(st_transform(park.park_way,4326)) as park_coordinates," +
        " st_asgeojson(st_transform(st_union(park.line_way),4326)) as line_coordinates," +
        " row_number() OVER () as line_identifier" +
        " from (select park.name as park_name, park.osm_id as park_identifier, park.way as park_way, line.name as line_name, line.osm_id as line_identifier, line.way as line_way" +
        " from planet_osm_polygon park" +
        " join (select st_transform as way from st_transform(ST_SetSRID(st_makepoint(" + currentLocation.longitude + " ," + currentLocation.latitude + "),4326),900913)) as current_location on st_dwithin(park.way,current_location.way," + range + ")" +
        " join planet_osm_line line on st_intersects(park.way,line.way) or st_contains(park.way,line.way) or st_crosses(park.way,line.way) or st_touches(park.way,line.way)" +
        " where ( park.leisure = 'park' or park.leisure = 'national_park' or (park.leisure='nature_reserve' and park.boundary='national_park')) and (line.bicycle = 'yes' or (line.bicycle is null and line.highway in ('track','path','footway','pedestrian','cycleway')))" +
        " ) as park group by park.park_name, park.park_identifier, park.park_way")
        .then(function (data) {
            res.status(200)
                .json({
                    status: 'success',
                    data: data,
                    message: 'Query successfully processed'
                });
        })
        .catch(function (err) {
            console.error(err);
            return next(err);
        });
}

function checkCityExists(req, res, next) {
    console.log("Checking city existence");
    cityName = req.query.cityName;
    db_connector.db_instance.any("select polygon.name as city_name, st_asgeojson(st_transform(polygon.way, 4326)) as city_coordinates, st_asgeojson(st_transform(ST_Centroid(polygon.way),4326)) as city_center, polygon.osm_id as city_identifier  from planet_osm_polygon polygon " +
        " where polygon.boundary = 'administrative' and ( polygon.admin_level = '9') and  unaccent(lower(polygon.name)) like unaccent(lower('%" + cityName + "%'))")
            .then(function (data) {
                res.status(200)
                    .json({
                        status: 'success',
                        data: data,
                        message: 'Query successfully processed'
                    });
            })
            .catch(function (err) {
                console.error(err);
                return next(err);
            });
}

module.exports = {
    getBikeParkings: getBikeParkings,
    getRestaurants: getBikeAccessibleRestaurants,
    getTouristSights: getTouristSights,
    getRecreationAreas: getRecreationAreas,
    getCycloWays: getCycloWays,
    checkCityExists: checkCityExists
};