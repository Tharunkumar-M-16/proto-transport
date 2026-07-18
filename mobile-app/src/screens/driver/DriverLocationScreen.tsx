import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { getBusById, updateBusLocation } from '../../services/api';
import { useAppContext } from '../../context/AppContext';

export default function DriverLocationScreen() {
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

  if (!bus) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.busId}>{bus.busId}</Text>
      <Text style={styles.currentStop}>Current: {bus.currentStop}</Text>
      <TouchableOpacity style={styles.button} onPress={markNextStop} disabled={updating}>
        <Text style={styles.buttonText}>
          {updating ? 'Updating...' : 'Mark Next Stop Reached'}
        </Text>
      </TouchableOpacity>
      <Text style={styles.hint}>
        No internet? Send SMS: "{bus.busId} STOPNAME" to the tracking number.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 16 },
  busId: { fontSize: 26, fontWeight: 'bold', textAlign: 'center' },
  currentStop: { fontSize: 16, textAlign: 'center', color: '#555', marginBottom: 16 },
  button: { backgroundColor: '#16a34a', padding: 18, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  hint: { fontSize: 12, color: '#888', textAlign: 'center', marginTop: 24 },
});