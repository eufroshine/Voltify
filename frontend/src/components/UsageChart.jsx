import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { usageAPI } from '../services/api';

const UsageChart = ({ refresh }) => {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState('line');

  useEffect(() => {
    fetchUsageData();
  }, [refresh]);

  const fetchUsageData = async () => {
    try {
      const response = await usageAPI.getAll({ limit: 30 });
      if (response.data.success) {
        const formattedData = response.data.data
          .reverse()
          .map(item => ({
            date: new Date(item.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
            kWh: item.totalKwh,
            biaya: item.totalCost / 1000, // dalam ribuan
            kategori: item.fuzzyCategory
          }));
        setChartData(formattedData);
      }
    } catch (error) {
      console.error('Error fetching usage data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card text-center">
        <div className="spinner" style={{ margin: '0 auto' }}></div>
        <p style={{ marginTop: '10px' }}>Memuat grafik...</p>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="card text-center">
        <p style={{ color: '#6b7280' }}>Belum ada data untuk ditampilkan dalam grafik</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'white',
          padding: '12px',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <p style={{ fontWeight: '600', marginBottom: '8px' }}>{payload[0].payload.date}</p>
          <p style={{ color: '#3b82f6', fontSize: '14px' }}>
            ⚡ {payload[0].value} kWh
          </p>
          <p style={{ color: '#10b981', fontSize: '14px' }}>
            💰 Rp {(payload[1].value * 1000).toLocaleString('id-ID')}
          </p>
          <p style={{ fontSize: '12px', marginTop: '4px' }}>
            Status: <strong>{payload[0].payload.kategori}</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Grafik Penggunaan Listrik</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className={`btn ${chartType === 'line' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setChartType('line')}
            style={{ padding: '8px 16px' }}
          >
            Line Chart
          </button>
          <button
            className={`btn ${chartType === 'bar' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setChartType('bar')}
            style={{ padding: '8px 16px' }}
          >
            Bar Chart
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={350}>
        {chartType === 'line' ? (
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" style={{ fontSize: '12px' }} />
            <YAxis yAxisId="left" style={{ fontSize: '12px' }} />
            <YAxis yAxisId="right" orientation="right" style={{ fontSize: '12px' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="kWh" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
              name="Penggunaan (kWh)"
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="biaya" 
              stroke="#10b981" 
              strokeWidth={3}
              dot={{ fill: '#10b981', r: 4 }}
              name="Biaya (Ribu Rp)"
            />
          </LineChart>
        ) : (
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" style={{ fontSize: '12px' }} />
            <YAxis style={{ fontSize: '12px' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="kWh" fill="#3b82f6" name="Penggunaan (kWh)" />
          </BarChart>
        )}
      </ResponsiveContainer>

      <div style={{ marginTop: '20px', padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
        <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Legend:</h4>
        <div style={{ display: 'flex', gap: '20px', fontSize: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '16px', height: '16px', background: '#3b82f6', borderRadius: '2px' }}></div>
            <span>Penggunaan kWh</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '16px', height: '16px', background: '#10b981', borderRadius: '2px' }}></div>
            <span>Biaya (Ribuan Rupiah)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageChart;