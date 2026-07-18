import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBusesByArea } from '../../services/api';
import { useAppContext } from '../../context/AppContext';

export default function BusSelectPage() {
  const { selectedArea, setSelectedBusId } = useAppContext();
  const [buses, setBuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getBusesByArea(selectedArea)
      .then((res) => setBuses(res.data))
      .catch((err) => alert('Failed to load buses: ' + err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ textAlign: 'center', marginTop: 40 }}>Loading...</p>;

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Buses in {selectedArea}</h2>
      {buses.map((bus) => (
        <div
          key={bus.busId}
          style={itemStyle}
          onClick={() => {
            setSelectedBusId(bus.busId);
            navigate('/user/tracking');
          }}
        >
          <div style={{ fontWeight: 600 }}>{bus.busId}</div>
          <div style={{ fontSize: '14px', color: '#555' }}>{bus.routeName}</div>
        </div>
      ))}
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  padding: '16px', maxWidth: '400px', margin: '0 auto',
};
const titleStyle: React.CSSProperties = {
  fontSize: '22px', fontWeight: 'bold', marginBottom: '16px',
};
const itemStyle: React.CSSProperties = {
  padding: '16px', backgroundColor: '#f1f5f9', borderRadius: '8px',
  marginBottom: '8px', cursor: 'pointer',
};