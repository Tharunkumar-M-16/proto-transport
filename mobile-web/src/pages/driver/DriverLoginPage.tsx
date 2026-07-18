import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

export default function DriverLoginPage() {
  const { setSelectedBusId } = useAppContext();
  const [busId, setBusId] = useState('');
  const navigate = useNavigate();

  return (
    <div style={containerStyle} className="animate-slide-up">
      {/* Header */}
      <div style={headerStyle}>
        <button 
          style={backButtonStyle}
          onClick={() => navigate('/')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h1 className="gradient-text" style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.5px' }}>
          Conductor Portal
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '4px' }}>
          Enter a registered Shuttle ID to start tracking
        </p>
      </div>

      {/* Login Card */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Shuttle ID
          </label>
          <input
            className="form-input"
            placeholder="e.g. BUS101"
            value={busId}
            onChange={(e) => setBusId(e.target.value)}
          />
        </div>

        <button
          className="btn-primary"
          style={{ width: '100%' }}
          onClick={() => {
            if (!busId.trim()) return alert('Please enter a shuttle ID');
            setSelectedBusId(busId.trim().toUpperCase());
            navigate('/driver/location');
          }}
        >
          Access Route Console
        </button>

        <div style={orSeparatorStyle}>
          <div style={lineStyle}></div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>OR</span>
          <div style={lineStyle}></div>
        </div>

        <button
          className="btn-secondary"
          style={{ width: '100%', fontSize: '15px' }}
          onClick={() => navigate('/driver/register')}
        >
          Register New Shuttle
        </button>
      </div>
    </div>
  );
}

// Styling Declarations
const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: '24px 20px',
  minHeight: '100vh',
  maxWidth: '440px',
  margin: '0 auto',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '20px'
};

const backButtonStyle: React.CSSProperties = {
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid var(--border)',
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--text-primary)',
  cursor: 'pointer',
  transition: 'all 0.2s'
};

const orSeparatorStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
  margin: '8px 0'
};

const lineStyle: React.CSSProperties = {
  height: '1px',
  backgroundColor: 'var(--border)',
  flexGrow: 1
};