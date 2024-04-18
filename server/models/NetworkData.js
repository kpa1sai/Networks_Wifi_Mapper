const mongoose = require('mongoose');

const NetworkDataSchema = new mongoose.Schema({
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true }
  },
  speed: {
    type: Number, // Assuming speed is in Mbps
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

NetworkDataSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('networkData', NetworkDataSchema);
