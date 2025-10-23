import React, { useState } from 'react';
import { Calculator, TrendingUp, AlertCircle, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { usageAPI } from '../services/api';

const FuzzyAnalysis = ({ selectedAppliances, onCalculated }) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // BARU

  const handleCalculate = async () => {
    if (selectedAppliances.length === 0) {
      setError('Pilih minimal 1 alat elektronik untuk dihitung');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await usageAPI.calculate({
        applianceIds: selectedAppliances,
        date: new Date(selectedDate).toISOString() // BARU: gunakan tanggal yang dipilih
      });

      if (response.data.success) {
        setResult(response.data);
        onCalculated();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menghitung penggunaan');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Hemat':
        return <CheckCircle size={48} color="#10b981" />;
      case 'Normal':
        return <AlertCircle size={48} color="#f59e0b" />;
      case 'Boros':
        return <XCircle size={48} color="#ef4444" />;
      default:
        return null;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Hemat':
        return { bg: '#d1fae5', color: '#065f46', border: '#10b981' };
      case 'Normal':
        return { bg: '#fef3c7', color: '#92400e', border: '#f59e0b' };
      case 'Boros':
        return { bg: '#fee2e2', color: '#991b1b', border: '#ef4444' };
      default:
        return { bg: '#f3f4f6', color: '#1f2937', border: '#e5e7eb' };
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Analisis Fuzzy Logic</h2>
      </div>

      {/* BARU: Date Picker & Calculate Button */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        marginBottom: '20px',
        alignItems: 'flex-end',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: '1', minWidth: '200px' }}>
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={16} />
            Pilih Tanggal
          </label>
          <input
            type="date"
            className="form-input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]} // Tidak bisa pilih tanggal masa depan
          />
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
            Pilih tanggal untuk menghitung penggunaan listrik
          </p>
        </div>
        
        <button 
          onClick={handleCalculate} 
          className="btn btn-primary"
          disabled={loading || selectedAppliances.length === 0}
          style={{ height: 'fit-content' }}
        >
          {loading ? (
            <>
              <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
              Menghitung...
            </>
          ) : (
            <>
              <Calculator size={18} />
              Hitung Penggunaan
            </>
          )}
        </button>
      </div>

      {error && (
        <div style={{
          padding: '12px',
          background: '#fee2e2',
          color: '#991b1b',
          borderRadius: '6px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {!result && !error && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
          <TrendingUp size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <p>Pilih tanggal, pilih alat elektronik, dan klik "Hitung Penggunaan" untuk melihat analisis</p>
        </div>
      )}

      {result && (
        <div>
          {/* Date Info */}
          <div style={{
            background: '#eff6ff',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: '1px solid #bfdbfe'
          }}>
            <Calendar size={18} color="#3b82f6" />
            <span style={{ fontWeight: '600', color: '#1e40af' }}>
              Tanggal: {new Date(result.data.date).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>

          {/* Main Result Card */}
          <div style={{
            background: getCategoryColor(result.data.fuzzyCategory).bg,
            border: `3px solid ${getCategoryColor(result.data.fuzzyCategory).border}`,
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: '16px' }}>
              {getCategoryIcon(result.data.fuzzyCategory)}
            </div>
            <h3 style={{ 
              fontSize: '32px', 
              fontWeight: '700', 
              color: getCategoryColor(result.data.fuzzyCategory).color,
              marginBottom: '8px'
            }}>
              {result.data.fuzzyCategory}
            </h3>
            <p style={{ fontSize: '14px', color: getCategoryColor(result.data.fuzzyCategory).color }}>
              Kategori Penggunaan Listrik
            </p>
            <div style={{ 
              marginTop: '16px', 
              padding: '12px', 
              background: 'white', 
              borderRadius: '8px',
              display: 'inline-block'
            }}>
              <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                Fuzzy Score
              </p>
              <p style={{ 
                fontSize: '28px', 
                fontWeight: '700', 
                color: getCategoryColor(result.data.fuzzyCategory).color 
              }}>
                {result.data.fuzzyScore}/100
              </p>
            </div>
          </div>

          {/* Usage Details */}
          <div className="grid grid-2" style={{ marginBottom: '24px' }}>
            <div style={{
              background: '#dbeafe',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '12px', color: '#1e40af', marginBottom: '8px' }}>
                Total Penggunaan
              </p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#1e40af' }}>
                {result.data.totalKwh} kWh
              </p>
              <p style={{ fontSize: '14px', color: '#1e40af', marginTop: '4px' }}>
                Pada tanggal ini
              </p>
            </div>

            <div style={{
              background: '#d1fae5',
              padding: '20px',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <p style={{ fontSize: '12px', color: '#065f46', marginBottom: '8px' }}>
                Total Biaya
              </p>
              <p style={{ fontSize: '32px', fontWeight: '700', color: '#065f46' }}>
                Rp {result.data.totalCost.toLocaleString('id-ID')}
              </p>
              <p style={{ fontSize: '14px', color: '#065f46', marginTop: '4px' }}>
                @ Rp {result.data.pricePerKwh}/kWh
              </p>
            </div>
          </div>

          {/* Breakdown by Appliance */}
          <div style={{
            background: '#f9fafb',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '24px'
          }}>
            <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
              Breakdown per Alat
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {result.data.appliances.map((appliance, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'white',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div>
                    <p style={{ fontWeight: '600', color: '#1f2937' }}>{appliance.name}</p>
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>
                      {appliance.kwhUsed} kWh
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: '600', color: '#10b981' }}>
                      Rp {appliance.cost.toLocaleString('id-ID')}
                    </p>
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>
                      {((appliance.kwhUsed / result.data.totalKwh) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fuzzy Membership Values */}
          <div style={{
            background: '#f9fafb',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '24px'
          }}>
            <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
              Fuzzy Membership Values
            </h4>
            <div className="grid grid-3">
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                  Hemat
                </p>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: '#e5e7eb',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '8px'
                }}>
                  <div style={{
                    width: `${result.fuzzyAnalysis.membership.hemat * 100}%`,
                    height: '100%',
                    background: '#10b981'
                  }}></div>
                </div>
                <p style={{ fontSize: '18px', fontWeight: '700', color: '#10b981' }}>
                  {(result.fuzzyAnalysis.membership.hemat * 100).toFixed(1)}%
                </p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                  Normal
                </p>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: '#e5e7eb',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '8px'
                }}>
                  <div style={{
                    width: `${result.fuzzyAnalysis.membership.normal * 100}%`,
                    height: '100%',
                    background: '#f59e0b'
                  }}></div>
                </div>
                <p style={{ fontSize: '18px', fontWeight: '700', color: '#f59e0b' }}>
                  {(result.fuzzyAnalysis.membership.normal * 100).toFixed(1)}%
                </p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                  Boros
                </p>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: '#e5e7eb',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '8px'
                }}>
                  <div style={{
                    width: `${result.fuzzyAnalysis.membership.boros * 100}%`,
                    height: '100%',
                    background: '#ef4444'
                  }}></div>
                </div>
                <p style={{ fontSize: '18px', fontWeight: '700', color: '#ef4444' }}>
                  {(result.fuzzyAnalysis.membership.boros * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* Suggestions */}
          <div style={{
            background: '#eff6ff',
            border: '2px solid #3b82f6',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <h4 style={{ 
              fontSize: '16px', 
              fontWeight: '600', 
              color: '#1e40af',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <TrendingUp size={20} />
              Saran & Rekomendasi
            </h4>
            <ul style={{ 
              listStyle: 'none', 
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              {result.data.suggestions.map((suggestion, index) => (
                <li key={index} style={{
                  padding: '12px',
                  background: 'white',
                  borderRadius: '8px',
                  color: '#1f2937',
                  fontSize: '14px',
                  lineHeight: '1.6'
                }}>
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default FuzzyAnalysis;