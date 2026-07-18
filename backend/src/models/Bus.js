const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
  busId: { type: String, required: true, unique: true }, // e.g. "BUS101"
  routeName: { type: String, required: true },
  area: { type: String, required: true },                // e.g. "Adyar"
  stops: [{ type: String }],                              // ordered list of stop names
  currentStop: { type: String, default: '' },
  currentStopIndex: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
  updatedVia: { type: String, enum: ['app', 'sms'], default: 'app' }
});

module.exports = mongoose.model('Bus', busSchema);