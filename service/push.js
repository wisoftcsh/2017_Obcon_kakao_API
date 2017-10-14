/**
 * Created by csh9196 on 2017-09-03.
 */
const MySQL = require('promise-mysql');
const MySQLConfig = require('../config/mysql');
const request = require('request');

let connection;

exports.webpush = async () => {
    const result = await search();
    for (let i of result) {
        push(i);
    }
};

const search = () => {
    return new Promise(resolve => {
        let token = [];
        MySQL.createConnection(MySQLConfig)
            .then((conn) => {
                connection = conn;
                return connection.query('select * from token');
            }).then((result) => {
            for (let i of result) {
                if (i.token !== null)
                    token.push(i.token);
            }
            connection.end();
            return resolve(token);
        });
    });
};

exports.check = async () => {
    const checkEmergency = await emergency();
    return checkStddev(checkEmergency);
};

let over = 0;
let under = 0;
const emergency = () => {
    return new Promise(resolve => {
        MySQL.createConnection(MySQLConfig)
            .then((conn) => {
                connection = conn;
                return connection.query('select stddev(sensingValue) stddev from sensing where inputtime + 0 > current_timestamp() - 10 AND sensorId=3;')
            })
            .then((result) => {
                for (let i of result) {
                    if (i.stddev === null) {
                        resolve(0);
                    }
                    resolve(i.stddev);
                }
                connection.end();
            });
    });
};

function checkStddev(stddev) {
    if (stddev > 130) {
        over++;
    } else if (stddev < 50 && over > 4) {
        under++;
    }
    if (under > 4 && over > 0 && over < 10) {
        over = 0;
        under = 0;
        return pulse();
    } else if (under > over) {
        over = 0;
        under = 0;
    }
    return false;
}

function pulse() {
    return new Promise(resolve => {
        MySQL.createConnection(MySQLConfig)
            .then((conn) => {
                connection = conn;
                return connection.query('select * from sensing where sensorId = 7 ORDER BY inputtime desc limit 1')
            })
            .then((result) => {
                console.log(result);
                for (let i of result) {
                    if (i.sensingValue === null) {
                        resolve(false);
                    } else if (i.sensingValue > 200 || i.sensingValue < 100) {
                        resolve(true);
                    }
                }
                connection.end();
                resolve(false);
            });
    });
}

const push = (token) => {
    request.post({
        headers: {
            'Authorization': 'key=(your key)',
            'Content-Type': 'application/json'
        },
        url: 'https://fcm.googleapis.com/fcm/send',
        body: '{"to":"' + token + '", "priority":"high","data":{"status": "최선호님의 상태가 매우 위급합니다. 119에 신고해주세요!!!!!"}}'
    }, function (error, response, body) {
        console.log(body);
    });
};