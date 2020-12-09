const functionHelper = require('../utils/functionHelper');

function validateRequest(req, res, next) {
  if(req.body.RequestID == undefined || req.body.RequestID == ""){
    req.body.RequestID = functionHelper.randomUUID();
  }
  next();
}
module.exports = validateRequest;
