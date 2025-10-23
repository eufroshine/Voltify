import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { applianceAPI } from '../services/api';

const ApplianceForm = ({ onApplianceAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    wattage: '',
    hoursPerDay: '',
    category: 'Lainnya'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = ['Penerangan', 'Pendingin', 'Elektronik', 'Dapur', 'Lainnya'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await applianceAPI.create({
        name: formData.name,
        wattage: parseFloat(formData.wattage),
        hoursPerDay: parseFloat(formData.hoursPerDay),
        category: formData.category
      });

      if (response.data.success) {
        setFormData({
          name: '',
          wattage: '',
          hoursPerDay: '',
          category: 'Lainnya'
        });
        onApplianceAdded();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menambahkan alat');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="card-title">Tambah Alat Elektronik</h2>
      </div>

      {error && (
        <div style={{
          padding: '12px',
          background: '#fee2e2',
          color: '#991b1b',
          borderRadius: '6px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-2">
          <div className="form-group">
            <label className="form-label">Nama Alat</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="e.g., Kulkas, TV, Lampu"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Kategori</label>
            <select
              name="category"
              className="form-select"
              value={formData.category}
              onChange={handleChange}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Daya (Watt)</label>
            <input
              type="number"
              name="wattage"
              className="form-input"
              placeholder="e.g., 100"
              value={formData.wattage}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Jam Pemakaian per Hari</label>
            <input
              type="number"
              name="hoursPerDay"
              className="form-input"
              placeholder="e.g., 8"
              value={formData.hoursPerDay}
              onChange={handleChange}
              min="0"
              max="24"
              step="0.5"
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (
            <>
              <div className="spinner" style={{ width: '16px', height: '16px' }}></div>
              Menyimpan...
            </>
          ) : (
            <>
              <Plus size={18} />
              Tambah Alat
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ApplianceForm;