/**
 * Created by martinhudec on 11/11/2016.
 */


var promise = require('bluebird');

var options = {
    promiseLib: promise
};

var pgp = require('pg-promise')(options);

var connection = {
    host: '192.168.56.103',
    port: 5432,
    database: 'gis',
    user: 'postgres',
    password: 'postgres'
};



module.exports= {
    db_instance: pgp(connection)
}