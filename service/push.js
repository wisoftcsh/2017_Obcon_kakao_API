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
        token.push(i.token);
      }
      connection.end();
      return resolve(token);
    });
  });
};

exports.check = async () => {
  const checkEmergency = await emergency();
  return parseInt(checkEmergency) > 140;

};

const emergency = () => {
  return new Promise(resolve => {
    MySQL.createConnection(MySQLConfig)
      .then((conn) => {
        connection = conn;
        return connection.query('select * from sensing where sensorId = 7 ORDER BY inputtime desc limit 1')
      })
      .then((result) => {
        for (let i of result) {
          resolve(i.sensingValue);
        }
      });
  });
};

const push = (token) => {
  request.post({
    headers: {
      'Authorization': 'key=insert server key',
      'Content-Type': 'application/json'
    },
    url: 'https://fcm.googleapis.com/fcm/send',
    body: '{"to":"' + token + '", "priority":"high","data":{"status": "최선호님의 상태가 매우 위급합니다. 119에 신고해주세요!!!!!"}}'
  }, function (error, response, body) {
    console.log(body);
  });
};