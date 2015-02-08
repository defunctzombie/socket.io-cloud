var mongoose = require('mongoose');

// application for a user
// name must be globally unique, lowercase, and subdomain acceptable

var schema = mongoose.Schema({
  id: { type: String, lowercase: true, trim: true, required: true },
  user_id: { type: String, required: true },
  api_key: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
}, { versionKey: false, id: false });

schema.index({ id: 1 });
schema.index({ user_id: 1 });
schema.index({ api_key: 1 });

module.exports = mongoose.model('apps', schema);
