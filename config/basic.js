const winston = require('winston');

const errWrap = (fn) => (...args) => fn(...args).catch(args[2]);

const end = (res, message) => {
    res.status(200).json({message: message});
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

const assert_catch = (type, check1, check2, message, res, st) => {
    if(type === 'notStrictEqual'){
        if(check1 === check2) res.status(st).json({message: message});
    }
    if(type === 'notDeepStrictEqual'){
        if(check1 !== check2) res.status(st).json({message: message});
    }
}

module.exports.errWrap = errWrap;
module.exports.reqLog = reqLog;
module.exports.end = end;
module.exports.assert_catch = assert_catch;