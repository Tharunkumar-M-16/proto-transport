import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBusById, updateBusLocation } from '../../services/api';
import { useAppContext } from '../../context/AppContext';

export default function DriverLocationPage() {
  const { selectedBusId } = useAppContext();
  const [bus, setBus] = useState<any>(null);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadBus = () => {
    if (!selectedBusId) {
      navigate('/driver/login');
      return;
    }
    getBusById(selectedBusId)
      .then((res) => setBus(res.data))
      .catch(() => setError('Failed to retrieve shuttle route from grid.'));
  };

  useEffect(() => {
    loadBus();
  }, [selectedBusId]);

  const markNextStop = async () => {
    if (!bus) return;
    const isFinished = bus.currentStopIndex >= bus.stops.length - 1;
    const nextIndex = isFinished ? 0 : bus.currentStopIndex + 1;

    setUpdating(true);
    try {
      await updateBusLocation(selectedBusId, bus.stops[nextIndex]);
      loadBus();
    } catch {
      alert('Network update failed. Please use SMS fallback if offline.');
    } finally {
      setUpdating(false);
    }
  };

  if (error) {
    return (
      <div style={containerStyle} className="animate-fade-in">
        <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
          <p style={{ color: '#ef4444', marginBottom: '16px' }}>{error}</p>
          <button className="btn-primary" style={{ width: '100%' }} onClick={() => navigate('/driver/login')}>
            Back to Portal
          </button>
        </div>
      </div>
    );
  }

  if (!bus) {
    return (
      <div style={containerStyle} className="animate-fade-in">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={spinnerStyle}></div>
          <p style={{ color: 'var(--text-secondary)', marginTop: '16px' }}>Connecting to console...</p>
        </div>
      </div>
    );
  }

  const stops = bus.stops || [];
  const currentIndex = bus.currentStopIndex !== undefined ? bus.currentStopIndex : 0;
  const isFinished = currentIndex >= stops.length - 1;
  const nextStopName = !isFinished ? stops[currentIndex + 1] : null;

  return (
    <div style={containerStyle} className="animate-slide-up">
      {/* Header */}
      <div style={headerStyle}>
        <button 
          style={backButtonStyle}
          onClick={() => navigate('/driver/login')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
        <div>
          <span style={activeBadgeStyle}>
            Console Active
          </span>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h1 className="gradient-text" style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.5px' }}>
          {bus.busId}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '4px' }}>
          {bus.routeName}
        </p>
      </div>

      {/* Main Console Action Card */}
      <div className="glass-card" style={actionCardStyle}>
        <div>
          <p style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Current Station
          </p>
          <p style={{ color: 'var(--text-primary)', fontSize: '20px', fontWeight: 700, marginTop: '4px' }}>
            {bus.currentStop || 'Route Started'}
          </p>
        </div>

        <div style={dividerStyle}></div>

        <div>
          {!isFinished ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>
              Next Stop: <strong style={{ color: 'var(--text-primary)' }}>{nextStopName}</strong>
            </p>
          ) : (
            <p style={{ color: 'var(--success)', fontSize: '13px', marginBottom: '16px', fontWeight: 600 }}>
              ✓ Route completed. Ready to restart.
            </p>
          )}
          <button 
            className="btn-primary" 
            style={{ width: '100%', padding: '18px' }} 
            onClick={markNextStop}
            disabled={updating}
          >
            {updating ? 'Transmitting...' : isFinished ? 'Restart Route Loop' : 'Mark Next Stop Reached'}
          </button>
        </div>
      </div>

      {/* SMS Offline Webhook Instruction */}
      <div className="glass-card" style={smsInstructionCardStyle}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ fontSize: '20px' }}>📟</div>
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Offline SMS Fallback
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              If internet connection fails, transmit updates via SMS to transit pool:
              <br />
              <code style={codeBlockStyle}>{bus.busId} {nextStopName || 'STOPNAME'}</code>
            </p>
          </div>
        </div>
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
  display: 'flex',
  flexDirection: 'column'
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
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

const activeBadgeStyle: React.CSSProperties = {
  backgroundColor: 'rgba(99, 102, 241, 0.15)',
  color: 'var(--accent)',
  padding: '6px 12px',
  borderRadius: '20px',
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '0.5px'
};

const actionCardStyle: React.CSSProperties = {
  padding: '24px',
  marginBottom: '16px',
  background: 'linear-gradient(135deg, rgba(19, 27, 46, 0.9) 0%, rgba(11, 15, 25, 0.95) 100%)',
};

const dividerStyle: React.CSSProperties = {
  height: '1px',
  backgroundColor: 'var(--border)',
  margin: '20px 0'
};

const smsInstructionCardStyle: React.CSSProperties = {
  padding: '16px 20px',
  borderStyle: 'dashed',
  borderColor: 'var(--border)',
  background: 'transparent'
};

const codeBlockStyle: React.CSSProperties = {
  display: 'inline-block',
  background: 'var(--bg-secondary)',
  padding: '4px 8px',
  borderRadius: '6px',
  border: '1px solid var(--border)',
  fontSize: '11px',
  fontWeight: 700,
  marginTop: '8px',
  color: 'var(--accent)'
};

const spinnerStyle: React.CSSProperties = {
  width: '40px',
  height: '40px',
  border: '3px solid rgba(99, 102, 241, 0.1)',
  borderTop: '3px solid var(--accent)',
  borderRadius: '50%',
  animation: 'pulse-ring 1.5s infinite linear'
};