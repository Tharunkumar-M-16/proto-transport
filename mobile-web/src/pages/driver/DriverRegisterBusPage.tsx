import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { createBus } from '../../services/api';

export default function DriverRegisterBusPage() {
  const { setSelectedBusId } = useAppContext();
  const [busId, setBusId] = useState('');
  const [routeName, setRouteName] = useState('');
  const [area, setArea] = useState('');
  const [stopsInput, setStopsInput] = useState('');
  const [registering, setRegistering] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!busId.trim() || !routeName.trim() || !area.trim() || !stopsInput.trim()) {
      return alert('All fields are required');
    }

    const stops = stopsInput.split(',').map(s => s.trim()).filter(s => s.length > 0);
    if (stops.length === 0) {
      return alert('At least one stop is required');
    }

    setRegistering(true);
    try {
      const res = await createBus(busId.trim().toUpperCase(), routeName.trim(), area.trim(), stops);
      setSelectedBusId(res.data.busId);
      navigate('/driver/location');
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Failed to register bus';
      alert(msg);
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div style={containerStyle} className="animate-slide-up">
      {/* Header */}
      <div style={headerStyle}>
        <button 
          style={backButtonStyle}
          onClick={() => navigate('/driver/login')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h1 className="gradient-text" style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-0.5px' }}>
          New Shuttle
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '4px' }}>
          Register a shuttle route onto the tracking grid
        </p>
      </div>

      {/* Form Card */}
      <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Shuttle ID</label>
          <input
            className="form-input"
            placeholder="e.g. BUS101"
            value={busId}
            onChange={(e) => setBusId(e.target.value.toUpperCase())}
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Route Description</label>
          <input
            className="form-input"
            placeholder="e.g. Depot to Central Station"
            value={routeName}
            onChange={(e) => setRouteName(e.target.value)}
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Sector / Area</label>
          <input
            className="form-input"
            placeholder="e.g. Adyar"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Stops (Comma-separated)</label>
          <input
            className="form-input"
            placeholder="Depot, Metro Stn, Central Stn"
            value={stopsInput}
            onChange={(e) => setStopsInput(e.target.value)}
          />
        </div>

        <button 
          className="btn-primary" 
          style={{ width: '100%', marginTop: '8px' }} 
          onClick={handleRegister}
          disabled={registering}
        >
          {registering ? 'Registering Route...' : 'Create Shuttle Route'}
        </button>
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

const formGroupStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px'
};

const labelStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 700,
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};