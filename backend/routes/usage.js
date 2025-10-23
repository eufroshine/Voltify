const express = require('express');
const router = express.Router();
const DailyUsage = require('../models/DailyUsage');
const Appliance = require('../models/Appliance');
const Settings = require('../models/Settings');
const { fuzzyInference, generateSuggestions } = require('../controllers/fuzzyLogic');

// GET: Ambil semua usage history
router.get('/', async (req, res) => {
  try {
    const { startDate, endDate, limit = 30 } = req.query;
    
    let query = {};
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const usageHistory = await DailyUsage.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit));
    
    res.json({
      success: true,
      data: usageHistory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching usage history',
      error: error.message
    });
  }
});

// POST: Calculate dan simpan usage hari ini
router.post('/calculate', async (req, res) => {
  try {
    const { date, applianceIds } = req.body;
    
    // Ambil settings (harga per kWh)
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({ pricePerKwh: 1445 });
    }
    
    // Ambil data appliances
    const appliances = await Appliance.find({ _id: { $in: applianceIds } });
    
    if (appliances.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No appliances selected'
      });
    }
    
    // Hitung total kWh dan cost
    let totalKwh = 0;
    const applianceUsage = appliances.map(appliance => {
      const kwhUsed = (appliance.wattage * appliance.hoursPerDay) / 1000;
      const cost = kwhUsed * settings.pricePerKwh;
      totalKwh += kwhUsed;
      
      return {
        applianceId: appliance._id,
        name: appliance.name,
        kwhUsed: parseFloat(kwhUsed.toFixed(3)),
        cost: parseFloat(cost.toFixed(2))
      };
    });
    
    const totalCost = totalKwh * settings.pricePerKwh;
    
    // Fuzzy Logic Analysis
    const fuzzyResult = fuzzyInference(totalKwh);
    const suggestions = generateSuggestions(fuzzyResult, totalKwh, applianceUsage);
    
    // Cek apakah sudah ada data untuk tanggal ini
    const existingUsage = await DailyUsage.findOne({
      date: new Date(date || Date.now()).setHours(0, 0, 0, 0)
    });
    
    if (existingUsage) {
      // Update existing
      existingUsage.totalKwh = parseFloat(totalKwh.toFixed(3));
      existingUsage.totalCost = parseFloat(totalCost.toFixed(2));
      existingUsage.pricePerKwh = settings.pricePerKwh;
      existingUsage.appliances = applianceUsage;
      existingUsage.fuzzyCategory = fuzzyResult.category;
      existingUsage.fuzzyScore = fuzzyResult.score;
      existingUsage.suggestions = suggestions;
      
      await existingUsage.save();
      
      return res.json({
        success: true,
        message: 'Usage updated successfully',
        data: existingUsage,
        fuzzyAnalysis: fuzzyResult
      });
    }
    
    // Create new
    const dailyUsage = new DailyUsage({
      date: date || Date.now(),
      totalKwh: parseFloat(totalKwh.toFixed(3)),
      totalCost: parseFloat(totalCost.toFixed(2)),
      pricePerKwh: settings.pricePerKwh,
      appliances: applianceUsage,
      fuzzyCategory: fuzzyResult.category,
      fuzzyScore: fuzzyResult.score,
      suggestions
    });
    
    await dailyUsage.save();
    
    res.status(201).json({
      success: true,
      message: 'Usage calculated and saved',
      data: dailyUsage,
      fuzzyAnalysis: fuzzyResult
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error calculating usage',
      error: error.message
    });
  }
});

// GET: Summary statistik
router.get('/summary', async (req, res) => {
  try {
    const { days = 30 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));
    
    const usageData = await DailyUsage.find({
      date: { $gte: startDate }
    }).sort({ date: 1 });
    
    if (usageData.length === 0) {
      return res.json({
        success: true,
        data: {
          totalKwh: 0,
          totalCost: 0,
          averageDaily: 0,
          estimatedMonthly: 0,
          categoryBreakdown: { Hemat: 0, Normal: 0, Boros: 0 }
        }
      });
    }
    
    const totalKwh = usageData.reduce((sum, day) => sum + day.totalKwh, 0);
    const totalCost = usageData.reduce((sum, day) => sum + day.totalCost, 0);
    const averageDaily = totalKwh / usageData.length;
    const estimatedMonthly = averageDaily * 30;
    const estimatedMonthlyCost = estimatedMonthly * usageData[0].pricePerKwh;
    
    // Category breakdown
    const categoryBreakdown = {
      Hemat: usageData.filter(d => d.fuzzyCategory === 'Hemat').length,
      Normal: usageData.filter(d => d.fuzzyCategory === 'Normal').length,
      Boros: usageData.filter(d => d.fuzzyCategory === 'Boros').length
    };
    
    res.json({
      success: true,
      data: {
        totalKwh: parseFloat(totalKwh.toFixed(2)),
        totalCost: parseFloat(totalCost.toFixed(2)),
        averageDaily: parseFloat(averageDaily.toFixed(2)),
        estimatedMonthly: parseFloat(estimatedMonthly.toFixed(2)),
        estimatedMonthlyCost: parseFloat(estimatedMonthlyCost.toFixed(2)),
        categoryBreakdown,
        daysTracked: usageData.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching summary',
      error: error.message
    });
  }
});

// DELETE: Hapus satu usage by ID
router.delete('/:id', async (req, res) => {
    try {
      const usage = await DailyUsage.findByIdAndDelete(req.params.id);
      
      if (!usage) {
        return res.status(404).json({
          success: false,
          message: 'Usage data not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Usage data deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error deleting usage data',
        error: error.message
      });
    }
  });
  
  // DELETE: Hapus semua history
  router.delete('/', async (req, res) => {
    try {
      const result = await DailyUsage.deleteMany({});
      
      res.json({
        success: true,
        message: `${result.deletedCount} usage records deleted successfully`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error clearing usage history',
        error: error.message
      });
    }
  });
  
  module.exports = router;

module.exports = router;