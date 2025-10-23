import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Zap, Calendar } from 'lucide-react';
import { usageAPI } from '../services/api';

const Dashboard = ({ refresh }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  useEffect(() => {
    fetchSummary();
  }, [refresh, days]);

  const fetchSummary = async () => {
    try {
      const response = await usageAPI.getSummary(days);
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
      <div className="card text-center">
        <div className="spinner" style={{ margin: '0 auto' }}></div>
        <p style={{ marginTop: '10px' }}>Memuat dashboard...</p>
      </div>
    );
  }

  if (!summary || summary.daysTracked === 0) {
    return (
      <div className="card text-center">
        <p style={{ color: '#6b7280' }}>
          Belum ada data penggunaan. Hitung penggunaan harian Anda untuk melihat statistik!
        </p>
      </div>
    );
  }

  // FIX: Pastikan semua nilai ada dengan default 0
  const statCards = [
    {
      title: 'Total Penggunaan',
      value: `${summary.totalKwh || 0} kWh`,
      subtitle: `${days} hari terakhir`,
      icon: Zap,
      color: '#3b82f6',
      bgColor: '#dbeafe'
    },
    {
      title: 'Total Biaya',
      value: `Rp ${(summary.totalCost || 0).toLocaleString('id-ID')}`,
      subtitle: `${days} hari terakhir`,
      icon: DollarSign,
      color: '#10b981',
      bgColor: '#d1fae5'
    },
    {
      title: 'Rata-rata Harian',
      value: `${summary.averageDaily || 0} kWh`,
      subtitle: 'Per hari',
      icon: TrendingUp,
      color: '#f59e0b',
      bgColor: '#fef3c7'
    },
    {
      title: 'Estimasi Bulanan',
      value: `${summary.estimatedMonthly || 0} kWh`,
      subtitle: `Rp ${(summary.estimatedMonthlyCost || 0).toLocaleString('id-ID')}`, // FIX INI
      icon: Calendar,
      color: '#8b5cf6',
      bgColor: '#ede9fe'
    }
  ];

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Dashboard Statistik</h2>
          <select 
            value={days} 
            onChange={(e) => setDays(Number(e.target.value))}
            className="form-select"
            style={{ width: 'auto' }}
          >
            <option value={7}>7 Hari</option>
            <option value={14}>14 Hari</option>
            <option value={30}>30 Hari</option>
          </select>
        </div>

        <div className="grid grid-2">
          {statCards.map((stat, index) => (
            <div 
              key={index}
              style={{
                background: stat.bgColor,
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}
            >
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <stat.icon size={28} color={stat.color} />
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                  {stat.title}
                </p>
                <h3 style={{ fontSize: '24px', fontWeight: '700', color: stat.color, marginBottom: '4px' }}>
                  {stat.value}
                </h3>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>
                  {stat.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="card">
        <h3 className="card-title">Kategori Penggunaan ({summary.daysTracked} hari)</h3>
        <div className="grid grid-3" style={{ marginTop: '20px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: '#d1fae5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              fontSize: '32px',
              fontWeight: '700',
              color: '#065f46'
            }}>
              {summary.categoryBreakdown?.Hemat || 0}
            </div>
            <p style={{ fontWeight: '600', color: '#065f46' }}>Hemat</p>
            <p style={{ fontSize: '12px', color: '#6b7280' }}>Hari</p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              fontSize: '32px',
              fontWeight: '700',
              color: '#92400e'
            }}>
              {summary.categoryBreakdown?.Normal || 0}
            </div>
            <p style={{ fontWeight: '600', color: '#92400e' }}>Normal</p>
            <p style={{ fontSize: '12px', color: '#6b7280' }}>Hari</p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: '#fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              fontSize: '32px',
              fontWeight: '700',
              color: '#991b1b'
            }}>
              {summary.categoryBreakdown?.Boros || 0}
            </div>
            <p style={{ fontWeight: '600', color: '#991b1b' }}>Boros</p>
            <p style={{ fontSize: '12px', color: '#6b7280' }}>Hari</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;