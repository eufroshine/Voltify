import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ApplianceForm from './components/ApplianceForm';
import ApplianceList from './components/ApplianceList';
import FuzzyAnalysis from './components/FuzzyAnalysis';
import Dashboard from './components/Dashboard';
import UsageChart from './components/UsageChart';
import UsageHistory from './components/UsageHistory';
import Settings from './components/Settings';
import Login from './pages/Login';
import Register from './pages/Register'; // ✅ Import Register

function App() {
  // ===== STATE UTAMA =====
  const [refreshAppliances, setRefreshAppliances] = useState(0);
  const [refreshDashboard, setRefreshDashboard] = useState(0);
  const [selectedAppliances, setSelectedAppliances] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ===== CEK TOKEN LOGIN =====
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  // ===== HANDLER UTAMA (MEMOIZED) =====
  const handleApplianceAdded = useCallback(() => {
    console.log('🔄 Appliance added');
    setRefreshAppliances((prev) => prev + 1);
  }, []);
  
  const handleCalculated = useCallback(() => {
    console.log('✅ Calculation completed');
    setRefreshDashboard((prev) => prev + 1);
  }, []);
  
  const handleSelectionChange = useCallback((ids) => {
    console.log('📋 Selection changed to:', ids.length, 'items');
    setSelectedAppliances(ids);
  }, []);
  
  const handleHistoryChanged = useCallback(() => {
    console.log('📊 History changed');
    setRefreshDashboard((prev) => prev + 1);
  }, []);

  // ===== LOGOUT FUNCTION =====
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setActiveTab('dashboard');
  }, []);

  // ===== RENDER ISI HALAMAN =====
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div key="dashboard">
            <Dashboard refresh={refreshDashboard} />
            <UsageChart refresh={refreshDashboard} />
          </div>
        );

      case 'calculate':
        return (
          <div key="calculate">
            <ApplianceForm onApplianceAdded={handleApplianceAdded} />
            <ApplianceList
              refresh={refreshAppliances}
              onSelectionChange={handleSelectionChange}
            />
            <FuzzyAnalysis
              selectedAppliances={selectedAppliances}
              onCalculated={handleCalculated}
            />
          </div>
        );

      case 'history':
        return (
          <div key="history">
            <UsageHistory refresh={refreshDashboard} onDataChanged={handleHistoryChanged} />
          </div>
        );

      case 'settings':
        return (
          <div key="settings">
            <Settings />
          </div>
        );

      default:
        return null;
    }
  };

  // ===== HALAMAN UTAMA =====
  const HomePage = () => (
    <div style={{ minHeight: '100vh', background: '#fafbfc' }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="container" style={{ paddingTop: '20px', paddingBottom: '60px' }}>
        {renderContent()}
      </main>

      {/* Footer */}
      <footer
        style={{
          marginTop: '60px',
          padding: '40px 0',
          background:
            'linear-gradient(135deg, rgba(107, 138, 153, 0.03) 0%, rgba(107, 138, 153, 0.08) 100%)',
          borderTop: '2px solid rgba(107, 138, 153, 0.1)'
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px',
              marginBottom: '24px'
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#567180',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span style={{ fontSize: '24px' }}>⚡</span>
                Voltify
              </h3>
              <p style={{ color: '#6b7a88', fontSize: '14px', margin: 0 }}>
                Smart Electricity Management System
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap'
              }}
            >
              <div
                style={{
                  background: 'white',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                  border: '1px solid rgba(225, 230, 235, 0.6)'
                }}
              >
                <p
                  style={{
                    fontSize: '11px',
                    color: '#6b7a88',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontWeight: '600'
                  }}
                >
                  Technology
                </p>
                <p
                  style={{
                    fontSize: '14px',
                    color: '#567180',
                    fontWeight: '700',
                    margin: 0
                  }}
                >
                  Fuzzy Logic DSS
                </p>
              </div>

              <div
                style={{
                  background: 'white',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                  border: '1px solid rgba(225, 230, 235, 0.6)'
                }}
              >
                <p
                  style={{
                    fontSize: '11px',
                    color: '#6b7a88',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontWeight: '600'
                  }}
                >
                  Version
                </p>
                <p
                  style={{
                    fontSize: '14px',
                    color: '#567180',
                    fontWeight: '700',
                    margin: 0
                  }}
                >
                  v1.0.0
                </p>
              </div>
            </div>
          </div>

          <div
            style={{
              paddingTop: '24px',
              borderTop: '1px solid rgba(107, 138, 153, 0.1)',
              textAlign: 'center'
            }}
          >
            <p
              style={{
                color: '#6b7a88',
                fontSize: '13px',
                margin: 0,
                fontWeight: '500'
              }}
            >
              © 2025 Voltify. Built with ❤️ for sustainable energy management
            </p>
          </div>
        </div>
      </footer>
    </div>
  );

  // ===== ROUTES =====
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        
        {/* ✅ Login Route */}
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/" />
            ) : (
              <Login setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />
        
        {/* ✅ Register Route - BARU */}
        <Route
          path="/register"
          element={
            isLoggedIn ? (
              <Navigate to="/" />
            ) : (
              <Register />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;