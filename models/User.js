var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var uuid = require('uuid');

var schema = mongoose.Schema({
  id: { type: String, unique: true },
  email: { type: String, lowercase: true, trim: true, required: true, unique: true },
  password_hash: { type: String },
  created_at: { type: Date, default: Date.now }
}, { versionKey: false, id: false });

schema.methods.verify_password = function(password, cb) {
  var self = this;
  bcrypt.compare(password, self.password_hash, cb);
};

schema.index({ id: 1 });
schema.index({ email: 1 });

var User = mongoose.model('users', schema);

// create a new user with given email and password
// hashes the password
User.create = function(details, cb) {
  var new_user = User({
    id: uuid(),
    email: details.email
  });

  bcrypt.hash(details.password, 10, function(err, hash) {
    if (err) {
      return cb(err);
    }

    new_user.password_hash = hash;
    new_user.save(cb);
  });
};

// load a user and check that password patches
User.load_and_check = function(email, password, cb) {
};

module.exports = User;
