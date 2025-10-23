const mongoose = require('mongoose');

const dailyUsageSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  totalKwh: {
    type: Number,
    required: true,
    min: 0
  },
  totalCost: {
    type: Number,
    required: true,
    min: 0
  },
  pricePerKwh: {
    type: Number,
    required: true
  },
  appliances: [{
    applianceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appliance'
    },
    name: String,
    kwhUsed: Number,
    cost: Number
  }],
  fuzzyCategory: {
    type: String,
    enum: ['Hemat', 'Normal', 'Boros'],
    required: true
  },
  fuzzyScore: {
    type: Number,
    min: 0,
    max: 100
  },
  suggestions: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('DailyUsage', dailyUsageSchema);