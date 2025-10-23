const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  pricePerKwh: {
    type: Number,
    required: true,
    default: 1445 // Tarif listrik default (Rupiah)
  },
  monthlyTarget: {
    type: Number,
    default: 300 // Target kWh per bulan
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Settings', settingsSchema);