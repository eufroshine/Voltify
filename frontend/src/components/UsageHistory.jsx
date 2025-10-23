import React, { useState, useEffect } from 'react';
import { Trash2, Calendar, Zap, DollarSign, AlertTriangle } from 'lucide-react';
import { usageAPI } from '../services/api';

const UsageHistory = ({ refresh, onDataChanged }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, [refresh]);

  const fetchHistory = async () => {
    try {
      const response = await usageAPI.getAll({ limit: 30 });
      if (response.data.success) {
        setHistory(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus data penggunaan ini?')) return;

    setDeleting(id);
    try {
      await usageAPI.delete(id);
      fetchHistory();
      onDataChanged();
    } catch (error) {
      alert('Gagal menghapus data');
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteAll = async () => {
    const confirmed = window.confirm(
      '⚠️ PERHATIAN!\n\nAnda akan menghapus SEMUA history penggunaan listrik.\nTindakan ini TIDAK DAPAT dibatalkan!\n\nLanjutkan?'
    );
    
    if (!confirmed) return;

    const doubleConfirm = window.confirm('Apakah Anda BENAR-BENAR yakin?');
    if (!doubleConfirm) return;

    setLoading(true);
    try {
      const response = await usageAPI.deleteAll();
      if (response.data.success) {
        alert('✅ Semua history berhasil dihapus!');
        setHistory([]);
        onDataChanged();
      }
    } catch (error) {
      alert('❌ Gagal menghapus history');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryBadge = (category) => {
    const styles = {
      Hemat: { bg: '#d1fae5', color: '#065f46' },
      Normal: { bg: '#fef3c7', color: '#92400e' },
      Boros: { bg: '#fee2e2', color: '#991b1b' }
    };
    const style = styles[category] || styles.Normal;
    return (
      <span style={{
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        background: style.bg,
        color: style.color
      }}>
        {category}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="card text-center">
        <div className="spinner" style={{ margin: '0 auto' }}></div>
        <p style={{ marginTop: '10px' }}>Memuat history...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">History Penggunaan</h2>
        {history.length > 0 && (
          <button
            onClick={handleDeleteAll}
            className="btn btn-danger"
            style={{ padding: '8px 16px' }}
          >
            <Trash2 size={16} />
            Hapus Semua History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
          <Calendar size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <p>Belum ada history penggunaan</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Tanggal</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Total kWh</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Total Biaya</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Kategori</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Score</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={16} color="#6b7280" />
                      {new Date(item.date).toLocaleDateString('id-ID', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      <Zap size={14} color="#3b82f6" />
                      <strong style={{ color: '#3b82f6' }}>{item.totalKwh}</strong> kWh
                    </div>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                      <DollarSign size={14} color="#10b981" />
                      <strong style={{ color: '#10b981' }}>
                        Rp {item.totalCost.toLocaleString('id-ID')}
                      </strong>
                    </div>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {getCategoryBadge(item.fuzzyCategory)}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', fontWeight: '700', fontSize: '16px' }}>
                    {item.fuzzyScore}/100
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button
                      onClick={() => handleDelete(item._id)}
                      disabled={deleting === item._id}
                      style={{
                        padding: '6px 12px',
                        background: deleting === item._id ? '#d1d5db' : 'transparent',
                        border: 'none',
                        cursor: deleting === item._id ? 'not-allowed' : 'pointer',
                        color: '#ef4444',
                        borderRadius: '4px',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.background = '#fee2e2'}
                      onMouseLeave={(e) => e.target.style.background = 'transparent'}
                    >
                      {deleting === item._id ? (
                        <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {history.length > 10 && (
        <div style={{
          marginTop: '20px',
          padding: '12px',
          background: '#f9fafb',
          borderRadius: '8px',
          textAlign: 'center',
          color: '#6b7280',
          fontSize: '14px'
        }}>
          Menampilkan {history.length} data terakhir
        </div>
      )}
    </div>
  );
};

export default UsageHistory;