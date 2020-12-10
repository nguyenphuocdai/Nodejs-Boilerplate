// const winston = require('winston');
// const config = require('./config');

// const enumerateErrorFormat = winston.format((info) => {
//   if (info instanceof Error) {
//     Object.assign(info, { message: info.stack });
//   }
//   return info;
// });

// const logger = winston.createLogger({
//   level: config.env === 'development' ? 'debug' : 'info',
//   // format: winston.format.combine(
//   //   enumerateErrorFormat(),
//   //   config.env === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
//   //   winston.format.splat(),
//   //   winston.format.printf(({ level, message }) => `${level}: ${message}`)
//   // ),
//   format: winston.format.combine(
//     winston.format.splat(),
//     winston.format.timestamp({
//       format: 'YYYY-MM-DD HH:mm:ss',
//     }),
//     winston.format.simple()
//   ),
//   transports: [
//     new winston.transports.File({
//       level: 'info',
//       filename: './logs/all-logs.log',
//       handleExceptions: true,
//       json: true,
//       maxsize: 5242880, //5MB
//       maxFiles: 5,
//       colorize: false,
//     }),
//     new winston.transports.Console({
//       level: 'debug',
//       handleExceptions: true,
//       json: false,
//       colorize: true,
//     }),
//   ],
//   exitOnError: false, // do not exit on handled exceptions
// });

// module.exports = logger;

const winston = require('winston');
const { format, level, prettyPrint } = require('winston');

const timezoned = () => {
  return new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Ho_Chi_Minh',
  });
};

require('winston-daily-rotate-file');

var transport = new winston.transports.DailyRotateFile({
  filename: 'logs/%DATE%/info.log',
  datePattern: 'YYYYMMDD',
  maxSize: '2m',
  prepend: true,
  maxFiles: '14d',
  format: format.combine(format.timestamp({ format: timezoned }), format.prettyPrint()),
});

transport.on('rotate', function (oldFilename, newFilename) {
  // do something fun
});

var logger = winston.createLogger({
  transports: [transport],
});

module.exports = logger;
