import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function RoleSelectPage() {
  const { setRole, setName } = useAppContext();
  const [localName, setLocalName] = useState('');
  const navigate = useNavigate();

  const pickRole = (role: 'user' | 'driver') => {
    if (!localName.trim()) return alert('Please enter your name first');
    setName(localName.trim());
    setRole(role);
    navigate(role === 'user' ? '/user/area' : '/driver/login');
  };

  return (
    <div style={containerStyle} className="animate-slide-up">
      {/* Brand logo & tagline */}
      <div style={brandContainerStyle}>
        <div style={logoIconStyle}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
            <path d="M17 9H7"></path>
          </svg>
        </div>
        <h1 className="gradient-text" style={brandTitleStyle}>
          ProtoTransport
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
          Real-time transit intelligence platform
        </p>
      </div>

      {/* Name Input Section */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Your Name
        </label>
        <input
          className="form-input"
          placeholder="e.g. Alex"
          value={localName}
          onChange={(e) => setLocalName(e.target.value)}
        />
      </div>

      {/* Role Selection Cards */}
      <div style={cardsContainerStyle}>
        {/* Passenger Card */}
        <div 
          className="glass-card" 
          style={roleCardStyle}
          onClick={() => pickRole('user')}
        >
          <div style={cardHeaderStyle}>
            <div style={{ ...iconBgStyle, background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>Passenger</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Track live bus locations and view route progress</p>
          </div>
        </div>

        {/* Conductor/Driver Card */}
        <div 
          className="glass-card" 
          style={roleCardStyle}
          onClick={() => pickRole('driver')}
        >
          <div style={cardHeaderStyle}>
            <div style={{ ...iconBgStyle, background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="2" x2="12" y2="22"></line>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49"></path>
              </svg>
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>Conductor</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Update bus locations dynamically or register new buses</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Styling Declarations
const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: '40px 24px',
  gap: '24px',
  minHeight: '100vh',
  maxWidth: '440px',
  margin: '0 auto',
};

const brandContainerStyle: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '16px'
};

const logoIconStyle: React.CSSProperties = {
  background: 'var(--accent-gradient)',
  width: '64px',
  height: '64px',
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 16px auto',
  boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)'
};

const brandTitleStyle: React.CSSProperties = {
  fontSize: '32px',
  fontWeight: 850,
  letterSpacing: '-0.75px',
  margin: 0
};

const cardsContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
};

const roleCardStyle: React.CSSProperties = {
  padding: '24px',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
};

const cardHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
};

const iconBgStyle: React.CSSProperties = {
  width: '48px',
  height: '48px',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};