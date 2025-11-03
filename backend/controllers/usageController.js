const Appliance = require('../models/Appliance');
const DailyUsage = require('../models/DailyUsage');
const { fuzzyInference, generateSuggestions } = require('./fuzzyLogic');

// Controller utama untuk menghitung fuzzy logic
exports.calculateUsage = async (req, res) => {
  try {
    const { applianceIds } = req.body;

    if (!applianceIds || applianceIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Daftar appliance kosong!'
      });
    }

    // Ambil data appliance dari MongoDB
    const appliances = await Appliance.find({ _id: { $in: applianceIds } });
    if (!appliances.length) {
      return res.status(404).json({
        success: false,
        message: 'Appliance tidak ditemukan'
      });
    }

    // Hitung total kWh
    const totalKwh = appliances.reduce(
      (sum, a) => sum + (a.power / 1000) * (a.usageHours || 1),
      0
    );

    // Jalankan fuzzy logic
    const fuzzyResult = fuzzyInference(totalKwh);
    const suggestions = generateSuggestions(fuzzyResult, totalKwh, appliances);

    // Simpan hasilnya ke koleksi DailyUsage
    const usage = new DailyUsage({
      date: new Date(),
      totalKwh,
      fuzzyCategory: fuzzyResult.category,
      fuzzyScore: fuzzyResult.score
    });
    await usage.save();

    res.json({
      success: true,
      message: 'Analisis fuzzy berhasil',
      data: {
        totalKwh,
        fuzzyResult,
        suggestions,
        appliances
      }
    });
  } catch (err) {
    console.error('❌ Error fuzzy analysis:', err);
    res.status(500).json({
      success: false,
      message: 'Gagal menghitung fuzzy',
      error: err.message
    });
  }
};
