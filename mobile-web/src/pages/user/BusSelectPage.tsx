import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBusesByArea } from '../../services/api';
import { useAppContext } from '../../context/AppContext';

export default function BusSelectPage() {
  const { selectedArea, setSelectedBusId } = useAppContext();
  const [buses, setBuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedArea) {
      navigate('/user/area');
      return;
    }

    getBusesByArea(selectedArea)
      .then((res) => setBuses(res.data))
      .catch(() => setError('Failed to load shuttles in this area.'))
      .finally(() => setLoading(false));
  }, [selectedArea, navigate]);

  if (loading) {
    return (
      <div style={containerStyle} className="animate-fade-in">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={spinnerStyle}></div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '16px' }}>Locating shuttles...</p>
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
          onClick={() => navigate('/user/area')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h1 className="gradient-text" style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.5px' }}>
          Select Shuttle
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '4px' }}>
          Active routes in <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{selectedArea}</span>
        </p>
      </div>

      {error && (
        <div className="glass-card" style={{ padding: '16px', color: '#ef4444', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {/* Shuttle List */}
      <div style={listStyle}>
        {buses.map((bus) => (
          <div
            key={bus.busId}
            className="glass-card"
            style={itemStyle}
            onClick={() => {
              setSelectedBusId(bus.busId);
              navigate('/user/tracking');
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="gradient-text" style={{ fontWeight: 800, fontSize: '18px' }}>
                  {bus.busId}
                </span>
                <span style={statusBadgeStyle}>
                  Active
                </span>
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {bus.routeName}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--success)' }}>
                    <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path>
                  </svg>
                  Last Stop Reached: <span style={{ color: 'var(--text-secondary)' }}>{bus.currentStop || 'Depot'}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {buses.length === 0 && !error && (
          <div className="glass-card" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-secondary)' }}>
            No shuttle routes currently running in this sector.
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
  padding: '20px',
  cursor: 'pointer',
  display: 'flex',
};

const statusBadgeStyle: React.CSSProperties = {
  backgroundColor: 'var(--success-glow)',
  color: 'var(--success)',
  padding: '3px 8px',
  borderRadius: '6px',
  fontSize: '11px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const spinnerStyle: React.CSSProperties = {
  width: '40px',
  height: '40px',
  border: '3px solid rgba(99, 102, 241, 0.1)',
  borderTop: '3px solid var(--accent)',
  borderRadius: '50%',
  animation: 'pulse-ring 1.5s infinite linear'
};