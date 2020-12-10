const uuid = require('uuid');
const constants = require('./constants');
const logger = require('../config/logger');

function randomUUID() {
  return uuid.v1();
}

function getDate(date, pattern = constants.PATTERN_ENUM.DATE) {
  if (date instanceof Date == false) {
    return date;
  }
  var result = '';

  var yyyy = date.getFullYear();
  var mm = date.getMonth() + 1;
  var dd = date.getDate();
  var hh = date.getHours();
  var minute = date.getMinutes();
  var ss = date.getSeconds();

  switch (pattern) {
    case constants.PATTERN_ENUM.DATE:
      result = [yyyy, (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('');
      break;
    case constants.PATTERN_ENUM.DATE_TIME:
      result = yyyy + pad2(mm) + pad2(dd) + pad2(hh) + pad2(minute) + pad2(ss);
      break;
    default:
      break;
  }

  return result;
}

function pad2(n) {
  return (n < 10 ? '0' : '') + n;
}

function log(req, res) {
  logRequest(req);
  logResponse(req, res);
}

function logRequest(req) {
  logger.log('info', {
    RequestID: req.body.requestID,
    Headers: req.headers,
    URL: req.url,
    Method: req.method,
    RequestData: req.body,
  });
}

function logResponse(req, res) {
  var oldWrite = res.write,
    oldEnd = res.end;

  var chunks = [];

  res.write = function (chunk) {
    chunks.push(chunk);

    return oldWrite.apply(res, arguments);
  };

  res.end = function (chunk) {
    if (chunk) chunks.push(chunk);

    var body = Buffer.concat(chunks).toString('utf8');
    logger.log('info', { RequestID: req.body.requestID, URL: res.req.originalUrl, ResponseData: JSON.parse(body) });
    oldEnd.apply(res, arguments);
  };
  return chunks;
}

module.exports = {
  randomUUID: randomUUID,
  getDate: getDate,
  log: log,
};
