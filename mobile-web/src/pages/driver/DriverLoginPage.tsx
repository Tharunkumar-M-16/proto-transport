import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

export default function DriverLoginPage() {
  const { setSelectedBusId } = useAppContext();
  const [busId, setBusId] = useState('');
  const navigate = useNavigate();

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Driver Login</h2>
      <input
        style={inputStyle}
        placeholder="Enter Bus ID (e.g. BUS101)"
        value={busId}
        onChange={(e) => setBusId(e.target.value)}
      />
      <button
        style={buttonStyle}
        onClick={() => {
          if (!busId.trim()) return alert('Enter a bus ID');
          setSelectedBusId(busId.trim().toUpperCase());
          navigate('/driver/location');
        }}
      >
        Continue
      </button>
      <button
        style={{ ...buttonStyle, backgroundColor: '#2563eb' }}
        onClick={() => navigate('/driver/register')}
      >
        Register a new bus
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