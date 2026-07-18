import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function RoleSelectPage() {
  const { setRole, setName } = useAppContext();
  const [localName, setLocalName] = useState('');
  const navigate = useNavigate();

  const pickRole = (role: 'user' | 'driver') => {
    if (!localName.trim()) return alert('Enter your name first');
    setName(localName);
    setRole(role);
    navigate(role === 'user' ? '/user/area' : '/driver/login');
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Bus Tracker</h1>
      <input
        style={inputStyle}
        placeholder="Enter your name"
        value={localName}
        onChange={(e) => setLocalName(e.target.value)}
      />
      <button style={buttonStyle} onClick={() => pickRole('user')}>
        I'm a Passenger
      </button>
      <button style={{ ...buttonStyle, backgroundColor: '#16a34a' }} onClick={() => pickRole('driver')}>
        I'm a Driver/Conductor
      </button>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', justifyContent: 'center',
  padding: '24px', gap: '16px', minHeight: '100vh', maxWidth: '400px', margin: '0 auto',
};
const titleStyle: React.CSSProperties = {
  fontSize: '28px', fontWeight: 'bold', textAlign: 'center', marginBottom: '24px',
};
const inputStyle: React.CSSProperties = {
  border: '1px solid #ccc', borderRadius: '8px', padding: '12px', fontSize: '16px',
};
const buttonStyle: React.CSSProperties = {
  backgroundColor: '#2563eb', color: 'white', padding: '16px', borderRadius: '8px',
  border: 'none', fontSize: '16px', fontWeight: 600, cursor: 'pointer',
};