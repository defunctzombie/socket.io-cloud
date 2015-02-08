var mongoose = require('mongoose');

var schema = mongoose.Schema({
  id: { type: String, unique: true, required: true },
  user_id: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
}, { versionKey: false, id: false });

schema.index({ id: 1 });
schema.index({ user_id: 1 });

module.exports = mongoose.model('sessions', schema);
