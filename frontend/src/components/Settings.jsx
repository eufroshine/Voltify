import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import { settingsAPI } from '../services/api';

const Settings = () => {
  const [settings, setSettings] = useState({
    pricePerKwh: 1445,
    monthlyTarget: 300
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.get();
      if (response.data.success) {
        setSettings(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: parseFloat(e.target.value)
    });
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const response = await settingsAPI.update(settings);
      if (response.data.success) {
        setMessage('Pengaturan berhasil disimpan!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Gagal menyimpan pengaturan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="card text-center">
        <div className="spinner" style={{ margin: '0 auto' }}></div>
        <p style={{ marginTop: '10px' }}>Memuat pengaturan...</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SettingsIcon size={24} />
          Pengaturan Sistem
        </h2>
      </div>

      {message && (
        <div style={{
          padding: '12px',
          background: message.includes('berhasil') ? '#d1fae5' : '#fee2e2',
          color: message.includes('berhasil') ? '#065f46' : '#991b1b',
          borderRadius: '6px',
          marginBottom: '20px'
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">
            Harga per kWh (Rupiah)
          </label>
          <input
            type="number"
            name="pricePerKwh"
            className="form-input"
            value={settings.pricePerKwh}
            onChange={handleChange}
            min="1"
            step="1"
            required
          />
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
            Tarif listrik PLN per kWh. Default: Rp 1.445 (tarif 900 VA - 1.300 VA)
          </p>
        </div>

        <div className="form-group">
          <label className="form-label">
            Target Bulanan (kWh)
          </label>
          <input
            type="number"
            name="monthlyTarget"
            className="form-input"
            value={settings.monthlyTarget}
            onChange={handleChange}
            min="1"
            step="1"
            required
          />
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
            Target penggunaan listrik per bulan dalam kWh
          </p>
        </div>

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? (
            <>
              <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
              Menyimpan...
            </>
          ) : (
            <>
              <Save size={18} />
              Simpan Pengaturan
            </>
          )}
        </button>
      </form>

      {/* Info Tarif Listrik */}
      <div style={{
        marginTop: '30px',
        padding: '20px',
        background: '#f9fafb',
        borderRadius: '12px',
        border: '1px solid #e5e7eb'
      }}>
        <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
          📌 Referensi Tarif Listrik PLN 2024
        </h4>
        <div style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.8' }}>
          <p>• 450 VA: Rp 415/kWh</p>
          <p>• 900 VA: Rp 1.352/kWh</p>
          <p>• 1.300 VA: Rp 1.445/kWh</p>
          <p>• 2.200 VA: Rp 1.445/kWh</p>
          <p>• 3.500 - 5.500 VA: Rp 1.699/kWh</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;