import React, { useEffect, useState } from 'react';
import { getBusById } from '../../services/api';
import { getSocket } from '../../services/socket';
import { useAppContext } from '../../context/AppContext';

export default function LiveTrackingPage() {
  const { selectedBusId } = useAppContext();
  const [busData, setBusData] = useState<any>(null);

  useEffect(() => {
    getBusById(selectedBusId).then((res) => setBusData(res.data));

    const socket = getSocket();
    socket.emit('trackBus', selectedBusId);

    const handler = (data: any) => {
      if (data.busId === selectedBusId) {
        setBusData((prev: any) => ({ ...prev, ...data }));
      }
    };

    socket.on('locationUpdate', handler);

    return () => {
      socket.off('locationUpdate', handler);
    };
  }, [selectedBusId]);

  if (!busData) return <p style={{ textAlign: 'center', marginTop: 40 }}>Loading...</p>;

  return (
    <div style={containerStyle}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{busData.busId}</h2>
      <p style={{ fontSize: '16px', color: '#555', marginBottom: '24px' }}>{busData.routeName}</p>
      <div style={cardStyle}>
        <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>Current Stop</p>
        <p style={{ fontSize: '22px', fontWeight: 700, margin: '8px 0' }}>{busData.currentStop}</p>
        <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>
          Updated via {busData.updatedVia} &bull; {new Date(busData.lastUpdated).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  padding: '16px', maxWidth: '400px', margin: '0 auto',
};
const cardStyle: React.CSSProperties = {
  backgroundColor: '#f1f5f9', padding: '20px', borderRadius: '12px',
};