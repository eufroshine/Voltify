const mongoose = require('mongoose');

const applianceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  wattage: {
    type: Number,
    required: true,
    min: 0
  },
  hoursPerDay: {
    type: Number,
    required: true,
    min: 0,
    max: 24
  },
  category: {
    type: String,
    enum: ['Penerangan', 'Pendingin', 'Elektronik', 'Dapur', 'Lainnya'],
    default: 'Lainnya'
  }
}, {
  timestamps: true
});

// Virtual field untuk kalkulasi kWh per hari
applianceSchema.virtual('kwhPerDay').get(function() {
  return (this.wattage * this.hoursPerDay) / 1000;
});

module.exports = mongoose.model('Appliance', applianceSchema);