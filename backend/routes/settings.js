const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings');

// GET: Ambil settings
router.get('/', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    // Jika belum ada settings, create default
    if (!settings) {
      settings = await Settings.create({
        pricePerKwh: 1445,
        monthlyTarget: 300
      });
    }
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching settings',
      error: error.message
    });
  }
});

// PUT: Update settings
router.put('/', async (req, res) => {
  try {
    const { pricePerKwh, monthlyTarget } = req.body;
    
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = new Settings({ pricePerKwh, monthlyTarget });
    } else {
      if (pricePerKwh !== undefined) settings.pricePerKwh = pricePerKwh;
      if (monthlyTarget !== undefined) settings.monthlyTarget = monthlyTarget;
    }
    
    await settings.save();
    
    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: settings
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating settings',
      error: error.message
    });
  }
});

module.exports = router;