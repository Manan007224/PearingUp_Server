const winston = require('winston');

const errWrap = (fn) => (...args) => fn(...args).catch(args[2]);

const end = (res, obj) => {
    return res.end(JSON.stringify(obj));
}

const reqLog = (req) => {
    if(req.headers) 
        winston.info(req.headers);
    if(req.body)
        winston.info(req.body);
    if(req.params)
        winston.info(req.params);
    if(req.query)
        winston.info(req.query);
}

module.exports.errWrap = errWrap;
module.exports.reqLog = reqLog;
module.exports.end = end;