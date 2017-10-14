const express = require('express');
const router = express.Router();
const MySQL = require('promise-mysql');
const MySQLConfig = require('../config/mysql');
let connection;


/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.put('/add', (req, res) => {
    MySQL.createConnection(MySQLConfig)
        .then((conn) => {
            connection = conn;
            connection.query('insert into token(token) values (?)', req.body.token, (err, result) => {
                console.log(err);
                console.log(result);
                connection.end();
                res.end();
            })
        });
});

router.get('/value', (req, res) => {
    MySQL.createConnection(MySQLConfig)
        .then(function (conn) {
            connection = conn;
            return connection.query('select sensorName, round(avg(sensingValue)) sensingValue from sensing S, ' +
                '(select sensorId, max(inputTime) inputTime from sensing group by sensorId and inputTime + 0 > current_timestamp() - 100) P, sensor SS' +
                ' where S.sensorId = P.sensorId and S.inputTime = P.inputTime and SS.sensorId = S.sensorId and S.inputTime + 0 > current_timestamp() - 100 group by sensorName;');
        }).then((result) => {
        let string = '[사용자 : 최선호]\n님의 현재 상태입니다.\n';
        if(result.length === 0) {
            string += '\n현재 사용자는 디바이스를 ' +
                '착용하고 있지 않습니다.\n' +
                '또는 디바이스 전원을 확인해주세요..';
        }
        for (let i of result) {
            string = string + i.sensorName + ' : ' + i.sensingValue + '\n';
        }
        res.send((string.trim()));
    });
});

module.exports = router;
