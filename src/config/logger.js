const winston = require('winston');
const config = require('./config');

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    enumerateErrorFormat(),
    config.env === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.printf(({ level, message }) => `${level}: ${message}`)
  ),
  transports: [
    new winston.transports.File({
      level:            'info',
      filename:         './logs/all-logs.log',
      handleExceptions: true,
      json:             true,
      maxsize:          5242880, //5MB
      maxFiles:         5,
      colorize:         false
    }), 
    new winston.transports.Console({ 
      level:            'debug', 
      handleExceptions: true, 
      json:             false, 
      colorize:         true 
    }) 
  ],
  exitOnError: false, // do not exit on handled exceptions
});

logger.stream = {
  write: function(message, encoding) {
    logger.error(message);
  },
}


module.exports = logger;
