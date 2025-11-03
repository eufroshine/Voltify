import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trash2, Zap, Clock } from 'lucide-react';
import { applianceAPI } from '../services/api';

const ApplianceList = ({ refresh, onSelectionChange }) => {
  const [appliances, setAppliances] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🔥 CRITICAL FIX: Prevent calling onSelectionChange on every render
  const isInitialMount = useRef(true);
  const previousSelectionRef = useRef([]);

  useEffect(() => {
    fetchAppliances();
  }, [refresh]);

  // 🔥 FIX: Only call onSelectionChange when selection ACTUALLY changes
  useEffect(() => {
    // Skip on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Only call if selection actually changed
    const prev = previousSelectionRef.current;
    const hasChanged = 
      prev.length !== selectedIds.length ||
      !prev.every(id => selectedIds.includes(id));

    if (hasChanged) {
      console.log('📋 Selection actually changed:', selectedIds.length, 'items');
      onSelectionChange(selectedIds);
      previousSelectionRef.current = selectedIds;
    }
  }, [selectedIds, onSelectionChange]);

  const fetchAppliances = async () => {
    try {
      const response = await applianceAPI.getAll();
      if (response.data.success) {
        setAppliances(response.data.data);
        
        // 🔥 FIX: Only auto-select on first load
        if (previousSelectionRef.current.length === 0 && response.data.data.length > 0) {
          const allIds = response.data.data.map(a => a._id);
          setSelectedIds(allIds);
          previousSelectionRef.current = allIds;
          console.log('✅ Initial auto-select:', allIds.length, 'items');
        }
      }
    } catch (error) {
      console.error('Error fetching appliances:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus alat ini?')) return;

    try {
      await applianceAPI.delete(id);
      
      // Update selection before refetch
      const newSelected = selectedIds.filter(selectedId => selectedId !== id);
      setSelectedIds(newSelected);
      
      fetchAppliances();
    } catch (error) {
      alert('Gagal menghapus alat');
    }
  };

  const handleCheckboxChange = useCallback((id) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(selectedId => selectedId !== id);
      } else {
        return [...prev, id];
      }
    });
  }, []);

  const handleSelectAll = useCallback((checked) => {
    if (checked) {
      const allIds = appliances.map(a => a._id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  }, [appliances]);

  const calculateKwh = (wattage, hours) => {
    return ((wattage * hours) / 1000).toFixed(3);
  };

  if (loading) {
    return (
      <div className="card text-center">
        <div className="spinner" style={{ margin: '0 auto' }}></div>
        <p style={{ marginTop: '10px' }}>Memuat data...</p>
      </div>
    );
  }

  if (appliances.length === 0) {
    return (
      <div className="card text-center">
        <p style={{ color: '#6b7280' }}>Belum ada alat elektronik. Tambahkan alat pertama Anda!</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Daftar Alat Elektronik ({appliances.length})</h2>
        <span style={{ fontSize: '14px', color: '#6b7280' }}>
          {selectedIds.length} dipilih
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>
                <input
                  type="checkbox"
                  checked={selectedIds.length === appliances.length && appliances.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Nama</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Kategori</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Daya</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Jam/Hari</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>kWh/Hari</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {appliances.map((appliance) => (
              <tr key={appliance._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                <td style={{ padding: '12px' }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(appliance._id)}
                    onChange={() => handleCheckboxChange(appliance._id)}
                  />
                </td>
                <td style={{ padding: '12px', fontWeight: '500' }}>{appliance.name}</td>
                <td style={{ padding: '12px' }}>
                  <span className="badge badge-success">{appliance.category}</span>
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <Zap size={14} color="#f59e0b" />
                    {appliance.wattage}W
                  </div>
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <Clock size={14} color="#6b7280" />
                    {appliance.hoursPerDay}h
                  </div>
                </td>
                <td style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#3b82f6' }}>
                  {calculateKwh(appliance.wattage, appliance.hoursPerDay)} kWh
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <button
                    onClick={() => handleDelete(appliance._id)}
                    className="btn-danger"
                    style={{
                      padding: '6px 12px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#ef4444'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplianceList;