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
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!busId.trim() || !routeName.trim() || !area.trim() || !stopsInput.trim()) {
      return alert('All fields are required');
    }

    const stops = stopsInput.split(',').map(s => s.trim()).filter(s => s.length > 0);
    if (stops.length === 0) {
      return alert('At least one stop is required');
    }

    try {
      const res = await createBus(busId.trim().toUpperCase(), routeName.trim(), area.trim(), stops);
      setSelectedBusId(res.data.busId);
      navigate('/driver/location');
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Failed to register bus';
      alert(msg);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Register New Bus</h2>
      <input
        style={inputStyle}
        placeholder="Bus ID (e.g. BUS101)"
        value={busId}
        onChange={(e) => setBusId(e.target.value.toUpperCase())}
      />
      <input
        style={inputStyle}
        placeholder="Route Name"
        value={routeName}
        onChange={(e) => setRouteName(e.target.value)}
      />
      <input
        style={inputStyle}
        placeholder="Area"
        value={area}
        onChange={(e) => setArea(e.target.value)}
      />
      <input
        style={inputStyle}
        placeholder="Stops (comma-separated, e.g. Adyar Depot, Thiruvanmiyur, T Nagar)"
        value={stopsInput}
        onChange={(e) => setStopsInput(e.target.value)}
      />
      <button style={buttonStyle} onClick={handleRegister}>
        Register Bus
      </button>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', justifyContent: 'center',
  padding: '24px', gap: '16px', minHeight: '100vh', maxWidth: '400px', margin: '0 auto',
};
const titleStyle: React.CSSProperties = {
  fontSize: '24px', fontWeight: 'bold', textAlign: 'center', marginBottom: '24px',
};
const inputStyle: React.CSSProperties = {
  border: '1px solid #ccc', borderRadius: '8px', padding: '12px', fontSize: '16px',
};
const buttonStyle: React.CSSProperties = {
  backgroundColor: '#16a34a', color: 'white', padding: '16px', borderRadius: '8px',
  border: 'none', fontSize: '16px', fontWeight: 600, cursor: 'pointer',
};