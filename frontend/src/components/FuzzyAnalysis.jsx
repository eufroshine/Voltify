import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Calculator, TrendingUp, AlertCircle, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { usageAPI } from '../services/api';
import '../styles/fuzzy.css';

const FuzzyAnalysis = ({ selectedAppliances, onCalculated }) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // 🔥 FIX: Prevent infinite callback calls
  const onCalculatedRef = useRef(onCalculated);
  
  useEffect(() => {
    onCalculatedRef.current = onCalculated;
  }, [onCalculated]);

  // 🔥 FIX: Memoize handleCalculate to prevent re-creation
  const handleCalculate = useCallback(async () => {
    console.log('🧮 Starting calculation...', { 
      selectedAppliances: selectedAppliances.length,
      date: selectedDate 
    });

    if (selectedAppliances.length === 0) {
      setError('Pilih minimal 1 alat elektronik untuk dihitung');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await usageAPI.calculate({
        applianceIds: selectedAppliances,
        date: new Date(selectedDate).toISOString(),
      });

      console.log('✅ Calculation success:', response.data);

      if (response.data.success) {
        setResult(response.data);
        // Use ref to prevent dependency issues
        onCalculatedRef.current?.();
      } else {
        setError('Gagal menghitung. Server tidak mengembalikan hasil.');
      }
    } catch (err) {
      console.error('❌ Calculation error:', err);
      setError(err.response?.data?.message || 'Gagal menghitung penggunaan');
    } finally {
      setLoading(false);
      console.log('🏁 Calculation finished');
    }
  }, [selectedAppliances, selectedDate]); // Dependencies yang tepat

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Hemat': return <CheckCircle size={48} color="#10b981" />;
      case 'Normal': return <AlertCircle size={48} color="#f59e0b" />;
      case 'Boros': return <XCircle size={48} color="#ef4444" />;
      default: return null;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Hemat': return { bg: '#d1fae5', color: '#065f46', border: '#10b981' };
      case 'Normal': return { bg: '#fef3c7', color: '#92400e', border: '#f59e0b' };
      case 'Boros': return { bg: '#fee2e2', color: '#991b1b', border: '#ef4444' };
      default: return { bg: '#f3f4f6', color: '#1f2937', border: '#e5e7eb' };
    }
  };

  // 🔍 Debug: Log setiap render
  useEffect(() => {
    console.log('🎨 FuzzyAnalysis rendered', {
      selectedAppliances: selectedAppliances.length,
      loading,
      hasResult: !!result,
      hasError: !!error
    });
  });

  return (
    <div className="card fuzzy-analysis">
      <div className="card-header">
        <h2 className="card-title">Analisis Fuzzy Logic</h2>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
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
            max={new Date().toISOString().split('T')[0]}
            disabled={loading}
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
              <div className="spinner" />
              <span style={{ marginLeft: '8px' }}>Menghitung...</span>
            </>
          ) : (
            <>
              <Calculator size={18} />
              <span>Hitung Penggunaan</span>
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

      {!result && !error && !loading && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
          <TrendingUp size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <p>Pilih tanggal, pilih alat elektronik, dan klik "Hitung Penggunaan" untuk melihat analisis</p>
        </div>
      )}

      {result && !loading && (
        <div>
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

          <div style={{
            background: getCategoryColor(result.data.fuzzyCategory).bg,
            border: `3px solid ${getCategoryColor(result.data.fuzzyCategory).border}`,
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: '16px' }}>{getCategoryIcon(result.data.fuzzyCategory)}</div>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default FuzzyAnalysis;