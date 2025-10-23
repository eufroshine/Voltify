import { useState } from 'react';
import Navbar from './components/Navbar';
import ApplianceForm from './components/ApplianceForm';
import ApplianceList from './components/ApplianceList';
import FuzzyAnalysis from './components/FuzzyAnalysis';
import Dashboard from './components/Dashboard';
import UsageChart from './components/UsageChart';
import UsageHistory from './components/UsageHistory';  // BARU
import Settings from './components/Settings';

function App() {
  const [refreshAppliances, setRefreshAppliances] = useState(0);
  const [refreshDashboard, setRefreshDashboard] = useState(0);
  const [selectedAppliances, setSelectedAppliances] = useState([]);
  const [activeTab, setActiveTab] = useState('home');

  const handleApplianceAdded = () => {
    setRefreshAppliances(prev => prev + 1);
  };

  const handleCalculated = () => {
    setRefreshDashboard(prev => prev + 1);
  };

  const handleSelectionChange = (ids) => {
    setSelectedAppliances(ids);
  };

  // BARU: Handler untuk history changed
  const handleHistoryChanged = () => {
    setRefreshDashboard(prev => prev + 1);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <>
            <Dashboard refresh={refreshDashboard} />
            <UsageChart refresh={refreshDashboard} />
          </>
        );
      case 'calculate':
        return (
          <>
            <ApplianceForm onApplianceAdded={handleApplianceAdded} />
            <ApplianceList 
              refresh={refreshAppliances} 
              onSelectionChange={handleSelectionChange}
            />
            <FuzzyAnalysis 
              selectedAppliances={selectedAppliances}
              onCalculated={handleCalculated}
            />
          </>
        );
      case 'history':  // BARU
        return (
          <UsageHistory 
            refresh={refreshDashboard}
            onDataChanged={handleHistoryChanged}
          />
        );
      case 'settings':
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <Navbar />
      
      {/* Tab Navigation */}
      <div className="container">
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '30px',
          borderBottom: '2px solid #e5e7eb',
          paddingBottom: '0'
        }}>
          <button
            onClick={() => setActiveTab('home')}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '15px',
              color: activeTab === 'home' ? '#3b82f6' : '#6b7280',
              borderBottom: activeTab === 'home' ? '3px solid #3b82f6' : '3px solid transparent',
              transition: 'all 0.3s ease'
            }}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setActiveTab('calculate')}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '15px',
              color: activeTab === 'calculate' ? '#3b82f6' : '#6b7280',
              borderBottom: activeTab === 'calculate' ? '3px solid #3b82f6' : '3px solid transparent',
              transition: 'all 0.3s ease'
            }}
          >
            ⚡ Hitung Penggunaan
          </button>
          {/* BARU: Tab History */}
          <button
            onClick={() => setActiveTab('history')}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '15px',
              color: activeTab === 'history' ? '#3b82f6' : '#6b7280',
              borderBottom: activeTab === 'history' ? '3px solid #3b82f6' : '3px solid transparent',
              transition: 'all 0.3s ease'
            }}
          >
            📜 History
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            style={{
              padding: '12px 24px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '15px',
              color: activeTab === 'settings' ? '#3b82f6' : '#6b7280',
              borderBottom: activeTab === 'settings' ? '3px solid #3b82f6' : '3px solid transparent',
              transition: 'all 0.3s ease'
            }}
          >
            ⚙️ Pengaturan
          </button>
        </div>

        {/* Content */}
        {renderContent()}
      </div>

      {/* Footer */}
      <footer style={{
        marginTop: '60px',
        padding: '30px 0',
        background: 'white',
        borderTop: '1px solid #e5e7eb',
        textAlign: 'center'
      }}>
        <div className="container">
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            © 2025 Voltify - Smart Electricity Management System
          </p>
          <p style={{ color: '#9ca3af', fontSize: '12px', marginTop: '8px' }}>
            Powered by Fuzzy Logic DSS
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;