import React, { useEffect, useState } from 'react';
import { getBusById, updateBusLocation } from '../../services/api';
import { useAppContext } from '../../context/AppContext';

export default function DriverLocationPage() {
  const { selectedBusId } = useAppContext();
  const [bus, setBus] = useState<any>(null);
  const [updating, setUpdating] = useState(false);

  const loadBus = () => {
    getBusById(selectedBusId).then((res) => setBus(res.data));
  };

  useEffect(() => {
    loadBus();
  }, []);

  const markNextStop = async () => {
    if (!bus) return;
    const nextIndex = bus.currentStopIndex + 1;
    if (nextIndex >= bus.stops.length) return alert('Already at last stop');

    setUpdating(true);
    try {
      await updateBusLocation(selectedBusId, bus.stops[nextIndex]);
      loadBus();
    } catch (err: any) {
      alert('Update failed — check WiFi. Use SMS fallback if offline.');
    } finally {
      setUpdating(false);
    }
  };

  if (!bus) return <p style={{ textAlign: 'center', marginTop: 40 }}>Loading...</p>;

  return (
    <div style={containerStyle}>
      <h2 style={{ fontSize: '26px', fontWeight: 'bold', textAlign: 'center', margin: 0 }}>
        {bus.busId}
      </h2>
      <p style={{ fontSize: '16px', textAlign: 'center', color: '#555', marginBottom: '16px' }}>
        Current: {bus.currentStop}
      </p>
      <button style={buttonStyle} onClick={markNextStop} disabled={updating}>
        {updating ? 'Updating...' : 'Mark Next Stop Reached'}
      </button>
      <p style={{ fontSize: '12px', color: '#888', textAlign: 'center', marginTop: '24px' }}>
        No internet? Send SMS: "{bus.busId} STOPNAME" to the tracking number.
      </p>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  display: 'flex', flexDirection: 'column', justifyContent: 'center',
  padding: '24px', gap: '16px', minHeight: '100vh', maxWidth: '400px', margin: '0 auto',
};
const buttonStyle: React.CSSProperties = {
  backgroundColor: '#16a34a', color: 'white', padding: '18px', borderRadius: '8px',
  border: 'none', fontSize: '16px', fontWeight: 600, cursor: 'pointer',
};