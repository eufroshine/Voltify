// Fuzzy Logic untuk klasifikasi penggunaan listrik

// Membership functions
const membershipFunctions = {
    // Input: kWh per hari
    low: (kwh) => {
      if (kwh <= 3) return 1;
      if (kwh >= 7) return 0;
      return (7 - kwh) / 4;
    },
    
    medium: (kwh) => {
      if (kwh <= 5 || kwh >= 15) return 0;
      if (kwh >= 8 && kwh <= 12) return 1;
      if (kwh < 8) return (kwh - 5) / 3;
      return (15 - kwh) / 3;
    },
    
    high: (kwh) => {
      if (kwh <= 10) return 0;
      if (kwh >= 15) return 1;
      return (kwh - 10) / 5;
    }
  };
  
  // Fuzzy inference
  const fuzzyInference = (totalKwh) => {
    const low = membershipFunctions.low(totalKwh);
    const medium = membershipFunctions.medium(totalKwh);
    const high = membershipFunctions.high(totalKwh);
    
    // Fuzzy rules
    const hemat = low;
    const normal = medium;
    const boros = high;
    
    // Defuzzification (weighted average)
    const score = (hemat * 20 + normal * 50 + boros * 85) / (hemat + normal + boros);
    
    let category;
    if (score < 35) category = 'Hemat';
    else if (score < 65) category = 'Normal';
    else category = 'Boros';
    
    return {
      category,
      score: Math.round(score),
      membership: { hemat, normal, boros }
    };
  };
  
  // Generate suggestions based on fuzzy result
  const generateSuggestions = (fuzzyResult, totalKwh, appliances) => {
    const suggestions = [];
    
    if (fuzzyResult.category === 'Boros') {
      suggestions.push('⚠️ Penggunaan listrik Anda tergolong BOROS');
      suggestions.push('💡 Matikan peralatan elektronik yang tidak digunakan');
      suggestions.push('🌡️ Atur suhu AC pada 24-26°C untuk efisiensi maksimal');
      
      // Find top consumers
      const sorted = appliances.sort((a, b) => b.kwhUsed - a.kwhUsed);
      if (sorted.length > 0) {
        suggestions.push(`⚡ Alat paling boros: ${sorted[0].name} (${sorted[0].kwhUsed.toFixed(2)} kWh)`);
      }
    } else if (fuzzyResult.category === 'Normal') {
      suggestions.push('✅ Penggunaan listrik Anda dalam batas NORMAL');
      suggestions.push('💚 Pertahankan kebiasaan baik ini');
      suggestions.push('📊 Pantau terus penggunaan untuk mencegah pemborosan');
    } else {
      suggestions.push('🌟 Excellent! Penggunaan listrik Anda sangat HEMAT');
      suggestions.push('🏆 Anda adalah contoh pengguna listrik yang bijak');
      suggestions.push('♻️ Teruskan kebiasaan hemat energi ini');
    }
    
    // General tips
    if (totalKwh > 5) {
      suggestions.push('💡 Tips: Ganti lampu dengan LED untuk penghematan 75%');
    }
    
    return suggestions;
  };
  
  module.exports = {
    fuzzyInference,
    generateSuggestions
  };