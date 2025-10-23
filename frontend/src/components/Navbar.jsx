import React from 'react';
import { Zap } from 'lucide-react';

const Navbar = () => {
  return (
    <nav style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px 0',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      marginBottom: '30px'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Zap size={32} color="white" />
          <h1 style={{ color: 'white', fontSize: '28px', fontWeight: '700' }}>
            Voltify
          </h1>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>
          Smart Electricity Management System
        </p>
      </div>
    </nav>
  );
};

export default Navbar;