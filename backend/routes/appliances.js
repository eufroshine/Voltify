const express = require('express');
const router = express.Router();
const Appliance = require('../models/Appliance');

// GET: Ambil semua appliances
router.get('/', async (req, res) => {
  try {
    const appliances = await Appliance.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: appliances
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching appliances',
      error: error.message
    });
  }
});

// GET: Ambil satu appliance by ID
router.get('/:id', async (req, res) => {
  try {
    const appliance = await Appliance.findById(req.params.id);
    if (!appliance) {
      return res.status(404).json({
        success: false,
        message: 'Appliance not found'
      });
    }
    res.json({
      success: true,
      data: appliance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching appliance',
      error: error.message
    });
  }
});

// POST: Tambah appliance baru
router.post('/', async (req, res) => {
  try {
    const { name, wattage, hoursPerDay, category } = req.body;
    
    const appliance = new Appliance({
      name,
      wattage,
      hoursPerDay,
      category
    });
    
    await appliance.save();
    
    res.status(201).json({
      success: true,
      message: 'Appliance added successfully',
      data: appliance
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error adding appliance',
      error: error.message
    });
  }
});

// PUT: Update appliance
router.put('/:id', async (req, res) => {
  try {
    const appliance = await Appliance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!appliance) {
      return res.status(404).json({
        success: false,
        message: 'Appliance not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Appliance updated successfully',
      data: appliance
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating appliance',
      error: error.message
    });
  }
});

// DELETE: Hapus appliance
router.delete('/:id', async (req, res) => {
  try {
    const appliance = await Appliance.findByIdAndDelete(req.params.id);
    
    if (!appliance) {
      return res.status(404).json({
        success: false,
        message: 'Appliance not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Appliance deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting appliance',
      error: error.message
    });
  }
});

module.exports = router;