const express = require('express');
const router = express.Router();
const MySQL = require('promise-mysql');
const MySQLConfig = require('../config/mysql');
let connection;


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/value', (req, res) => {
    MySQL.createConnection(MySQLConfig)
        .then(function (conn) {
            connection = conn;
            return connection.query('select sensorName, sensingValue, S.inputTime from sensing S, ' +
                '(select sensorId, max(inputTime) inputTime from sensing group by sensorId) P, sensor SS' +
                ' where S.sensorId = P.sensorId and S.inputTime = P.inputTime and SS.sensorId = S.sensorId;');
        }).then((result) => {
        let string = '[사용자 : 최선호]\n님의 현재 상태입니다.\n';
        for (let i of result) {
            string = string + i.sensorName + ' : ' + i.sensingValue + '\n';
        }
        res.send((string.trim()));
    });
});

module.exports = router;
