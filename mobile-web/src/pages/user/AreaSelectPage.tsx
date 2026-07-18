import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAreas } from '../../services/api';
import { useAppContext } from '../../context/AppContext';

export default function AreaSelectPage() {
  const [areas, setAreas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { setSelectedArea } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    getAreas()
      .then((res) => setAreas(res.data))
      .catch((err) => alert('Failed to load areas: ' + err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ textAlign: 'center', marginTop: 40 }}>Loading...</p>;

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Select Area</h2>
      {areas.map((area) => (
        <div
          key={area}
          style={itemStyle}
          onClick={() => {
            setSelectedArea(area);
            navigate('/user/bus');
          }}
        >
          {area}
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
  marginBottom: '8px', cursor: 'pointer', fontSize: '16px',
};