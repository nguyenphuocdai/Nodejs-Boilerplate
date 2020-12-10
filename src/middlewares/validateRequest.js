const functionHelper = require('../utils/functionHelper');

function validateRequest(req, res, next) {
  if(req.body.requestID == undefined || req.body.requestID == ""){
    req.body.requestID = functionHelper.randomUUID();
  }
  req.body.requestDateTime = new Date();
  functionHelper.log(req, res);
  next();
}
module.exports = validateRequest;
