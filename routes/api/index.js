var body_parser = require('body-parser');
var log = require('bookrc');
var Router = require('express').Router;

var PRODUCTION = process.env.NODE_ENV === 'production';

var router = new Router();

router.use(body_parser.json());

router.use(function(req, res, next) {
  req.error = function(fn) {
    return function(err, arg1, arg2, arg3, arg4) {
      if (err) {
        return next(err);
      }

      return fn(arg1, arg2, arg3, arg4);
    };
  };
  next();
});

router.use('/users', require('./users'));
router.use('/sessions', require('./sessions'));

router.use(function(req, res, next) {
  // TODO requires valid session or app key
  next();
});

router.use('/apps', require('./apps'));

router.use(function(err, req, res, next) {
  var status = err.status || err.statusCode || err.status_code || 500;

  var error_message = err.message;

  if (status >= 500) {
    log.error(err, req);

    if (PRODUCTION) {
      error_message = 'Internal Server Error';
    }
  }

  var msg = {
    message: error_message
  };

  res.status(status).json(msg);
});

module.exports = router;
