import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { getBusesByArea } from '../../services/api';
import { useAppContext } from '../../context/AppContext';

export default function BusSelectScreen({ navigation }: any) {
  const { selectedArea, setSelectedBusId } = useAppContext();
  const [buses, setBuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBusesByArea(selectedArea)
      .then((res) => setBuses(res.data))
      .catch((err) => alert('Failed to load buses: ' + err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buses in {selectedArea}</Text>
      <FlatList
        data={buses}
        keyExtractor={(item) => item.busId}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              setSelectedBusId(item.busId);
              navigation.navigate('LiveTracking');
            }}
          >
            <Text style={styles.busId}>{item.busId}</Text>
            <Text style={styles.route}>{item.routeName}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  item: { padding: 16, backgroundColor: '#f1f5f9', borderRadius: 8, marginBottom: 8 },
  busId: { fontSize: 16, fontWeight: '600' },
  route: { fontSize: 14, color: '#555' },
});