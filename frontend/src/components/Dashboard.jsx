import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Zap, Calendar } from 'lucide-react';
import { usageAPI } from '../services/api';

const Dashboard = ({ refresh }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, [refresh]);

  const fetchSummary = async () => {
    try {
      const response = await usageAPI.getSummary(7);
      if (response.data.success) {
        setSummary(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching summary:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card text-center" style={{ padding: '48px 24px' }}>
        <div className="spinner" style={{ margin: '0 auto' }}></div>
        <p style={{ marginTop: '16px' }}>Memuat dashboard...</p>
      </div>
    );
  }

  if (!summary || summary.daysTracked === 0) {
    return (
      <div className="card text-center" style={{ padding: '48px 24px' }}>
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background:
              'linear-gradient(135deg, rgba(107, 138, 153, 0.1) 0%, rgba(107, 138, 153, 0.05) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}
        >
          <Zap size={40} color="#6b8a99" />
        </div>
        <h3 style={{ marginBottom: '8px' }}>Belum Ada Data</h3>
        <p style={{ color: '#6b7a88', maxWidth: '400px', margin: '0 auto' }}>
          Belum ada data penggunaan. Hitung penggunaan harian Anda untuk melihat statistik!
        </p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Penggunaan',
      value: `${summary.totalKwh || 0}`,
      unit: 'kWh',
      subtitle: '7 hari terakhir',
      icon: Zap,
      gradient: 'linear-gradient(135deg, #6b8a99 0%, #567180 100%)',
      iconBg: 'rgba(107, 138, 153, 0.1)',
    },
    {
      title: 'Total Biaya',
      value: `${(summary.totalCost || 0).toLocaleString('id-ID')}`,
      unit: 'Rp',
      subtitle: '7 hari terakhir',
      icon: DollarSign,
      gradient: 'linear-gradient(135deg, #5fb894 0%, #4a9d7a 100%)',
      iconBg: 'rgba(95, 184, 148, 0.1)',
    },
    {
      title: 'Rata-rata Harian',
      value: `${summary.averageDaily || 0}`,
      unit: 'kWh',
      subtitle: 'Per hari',
      icon: TrendingUp,
      gradient: 'linear-gradient(135deg, #f0a96b 0%, #e0935a 100%)',
      iconBg: 'rgba(240, 169, 107, 0.1)',
    },
    {
      title: 'Estimasi Bulanan',
      value: `${summary.estimatedMonthly || 0}`,
      unit: 'kWh',
      subtitle: `Rp ${(summary.estimatedMonthlyCost || 0).toLocaleString('id-ID')}`,
      icon: Calendar,
      gradient: 'linear-gradient(135deg, #93a5b1 0%, #7a8d99 100%)',
      iconBg: 'rgba(147, 165, 177, 0.1)',
    },
  ];

  const categories = [
    {
      name: 'Hemat',
      count: summary.categoryBreakdown?.Hemat || 0,
      color: '#5fb894',
      bgColor: 'rgba(95, 184, 148, 0.1)',
      emoji: '✨',
    },
    {
      name: 'Normal',
      count: summary.categoryBreakdown?.Normal || 0,
      color: '#f0a96b',
      bgColor: 'rgba(240, 169, 107, 0.1)',
      emoji: '⚡',
    },
    {
      name: 'Boros',
      count: summary.categoryBreakdown?.Boros || 0,
      color: '#e07a7a',
      bgColor: 'rgba(224, 122, 122, 0.1)',
      emoji: '🔥',
    },
  ];

  return (
    <div>
      {/* Header Card */}
      <div className="dashboard-header-card">
        <h2 className="dashboard-title">Dashboard Statistik</h2>
        <p className="dashboard-subtitle">Pantau penggunaan listrik Anda</p>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-2" style={{ marginBottom: '24px' }}>
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card-item">
            <div className="stat-card-icon-wrapper">
              <div className="stat-card-icon" style={{ background: stat.iconBg }}>
                <stat.icon
                  size={26}
                  style={{
                    color: stat.gradient.match(/#[0-9a-f]{6}/i)[0],
                  }}
                />
              </div>
            </div>

            <p className="stat-card-label">{stat.title}</p>

            <div className="stat-card-value-wrapper">
              {stat.unit === 'Rp' && (
                <span
                  className="stat-card-currency"
                  style={{
                    background: stat.gradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Rp
                </span>
              )}
              <h3
                className="stat-card-value"
                style={{
                  background: stat.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {stat.value}
              </h3>
              {stat.unit !== 'Rp' && (
                <span className="stat-card-unit">{stat.unit}</span>
              )}
            </div>

            <p className="stat-card-subtitle">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Category Breakdown */}
      <div className="card">
        <div className="category-header">
          <h3 className="card-title">Kategori Penggunaan</h3>
          <span className="category-badge">{summary.daysTracked} hari</span>
        </div>

        <div className="grid grid-3">
          {categories.map((category, index) => (
            <div
              key={index}
              className="category-card"
              style={{ background: category.bgColor }}
            >
              <div className="category-emoji">{category.emoji}</div>
              <div className="category-count" style={{ color: category.color }}>
                {category.count}
              </div>
              <p className="category-name" style={{ color: category.color }}>
                {category.name}
              </p>
              <p className="category-label">Hari</p>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="category-progress-wrapper">
          <p className="category-progress-label">Distribusi Penggunaan</p>
          <div className="category-progress-bar">
            {categories.map((cat, i) => (
              <div
                key={i}
                className="category-progress-segment"
                style={{
                  width: `${(cat.count / summary.daysTracked) * 100}%`,
                  background: cat.color,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
