import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getBusById } from '../../services/api';
import { getSocket } from '../../services/socket';
import { useAppContext } from '../../context/AppContext';

export default function LiveTrackingScreen() {
  const { selectedBusId } = useAppContext();
  const [busData, setBusData] = useState<any>(null);

  useEffect(() => {
    getBusById(selectedBusId).then((res) => setBusData(res.data));

    const socket = getSocket();
    socket.emit('trackBus', selectedBusId);

    const handler = (data: any) => {
      if (data && data.busId === selectedBusId) {
        setBusData((prev: any) => {
          if (!prev) return data;
          return { ...prev, ...data };
        });
      }
    };

    socket.on('locationUpdate', handler);

    return () => {
      socket.off('locationUpdate', handler);
    };
  }, [selectedBusId]);

  const formatTime = (dateStr: any) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? 'N/A' : date.toLocaleTimeString();
  };

  if (!busData) return <Text style={styles.loading}>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.busId}>{busData.busId}</Text>
      <Text style={styles.route}>{busData.routeName}</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Current Stop</Text>
        <Text style={styles.stop}>{busData.currentStop}</Text>
        <Text style={styles.meta}>
          Updated via {busData.updatedVia} • {formatTime(busData.lastUpdated)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  loading: { flex: 1, textAlign: 'center', marginTop: 40 },
  busId: { fontSize: 24, fontWeight: 'bold' },
  route: { fontSize: 16, color: '#555', marginBottom: 24 },
  card: { backgroundColor: '#f1f5f9', padding: 20, borderRadius: 12 },
  label: { fontSize: 14, color: '#666' },
  stop: { fontSize: 22, fontWeight: '700', marginVertical: 8 },
  meta: { fontSize: 12, color: '#888' },
});