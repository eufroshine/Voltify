import React, { useState, useEffect } from 'react';
import { Zap, Home, Calculator, History, Settings, LogIn, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ activeTab, setActiveTab, isLoggedIn, onLogout }) => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'calculate', label: 'Hitung', icon: Calculator },
    { id: 'history', label: 'Riwayat', icon: History },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className={`navbar-content ${scrolled ? '' : 'container'}`}>
        {/* === Brand === */}
        <div className="navbar-brand">
          <div className="navbar-icon">
            <Zap size={scrolled ? 24 : 28} strokeWidth={2.5} />
          </div>
          <div className="navbar-title-wrapper">
            <h1 className="navbar-title">Voltify</h1>
            {!scrolled && <p className="navbar-subtitle">Smart Energy</p>}
          </div>
        </div>

        {/* === Menu === */}
        <div className="navbar-menu">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`navbar-menu-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* === Right Section (Login/Logout + Live) === */}
        <div className="navbar-right">
          {/* ✅ Conditional: Login atau Logout */}
          {isLoggedIn ? (
            <button 
              className="navbar-login-btn navbar-logout-btn" 
              onClick={onLogout}
              title="Logout"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          ) : (
            <button 
              className="navbar-login-btn" 
              onClick={() => navigate('/login')}
              title="Login"
            >
              <LogIn size={18} />
              <span>Login</span>
            </button>
          )}

          <div className="navbar-badge">
            <span className="status-dot"></span>
            <span>Live</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;