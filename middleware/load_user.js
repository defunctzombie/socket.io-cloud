var Unauthorized = require('httperrors').Unauthorized;

var User = require('iocloud-models/User');

module.exports = function(req, res, next) {
  if (!req.session.user_id) {
    return next(Unauthorized());
  }

  var user_id = req.session.user_id;
  User.findOne({ id: user_id }, req.error(function(user) {
    if (!user) {
      return next(Unauthorized('Invalid user for session'));
    }

    req.current_user = user;
    next();
  }));
};
