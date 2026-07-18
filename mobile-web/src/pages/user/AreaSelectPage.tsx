import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAreas } from '../../services/api';
import { useAppContext } from '../../context/AppContext';

export default function AreaSelectPage() {
  const [areas, setAreas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setSelectedArea } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    getAreas()
      .then((res) => setAreas(res.data))
      .catch(() => setError('Failed to load active transit areas.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={containerStyle} className="animate-fade-in">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={spinnerStyle}></div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '16px' }}>Fetching transit sectors...</p>
        </div>
      </div>
    );
  }

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
          Select Sector
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '4px' }}>
          Choose a sector to view active shuttle routes
        </p>
      </div>

      {error && (
        <div className="glass-card" style={{ padding: '16px', color: '#ef4444', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {/* Grid List */}
      <div style={listStyle}>
        {areas.map((area) => (
          <div
            key={area}
            className="glass-card"
            style={itemStyle}
            onClick={() => {
              setSelectedArea(area);
              navigate('/user/bus');
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={iconBgStyle}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '16px' }}>{area}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Active route coverage</div>
              </div>
            </div>
            <div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>
        ))}

        {areas.length === 0 && !error && (
          <div className="glass-card" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No sectors populated. Conductor registration required.
          </div>
        )}
      </div>
    </div>
  );
}

// Styling Declarations
const containerStyle: React.CSSProperties = {
  padding: '24px 20px',
  maxWidth: '440px',
  margin: '0 auto',
  minHeight: '100vh',
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

const listStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
};

const itemStyle: React.CSSProperties = {
  padding: '18px 20px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const iconBgStyle: React.CSSProperties = {
  background: 'rgba(99, 102, 241, 0.12)',
  color: 'var(--accent)',
  width: '40px',
  height: '40px',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const spinnerStyle: React.CSSProperties = {
  width: '40px',
  height: '40px',
  border: '3px solid rgba(99, 102, 241, 0.1)',
  borderTop: '3px solid var(--accent)',
  borderRadius: '50%',
  animation: 'pulse-ring 1.5s infinite linear'
};