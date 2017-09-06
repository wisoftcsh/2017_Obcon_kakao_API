/**
 * Created by csh9196 on 2017-09-03.
 */
const MySQL = require('promise-mysql');
const MySQLConfig = require('../config/mysql');
let connection;
exports.webpush = () => {

};

const push = () => {
    MySQL.createConnection(MySQLConfig)
        .then(function (conn) {
            connection = conn;
            return connection.query('select * from token');
        }).then((result) => {
        console.log(result);
        // for (let i of result) {
        //
        // }
    });
}