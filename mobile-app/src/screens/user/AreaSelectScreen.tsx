import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { getAreas } from '../../services/api';
import { useAppContext } from '../../context/AppContext';

export default function AreaSelectScreen({ navigation }: any) {
  const [areas, setAreas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { setSelectedArea } = useAppContext();

  useEffect(() => {
    getAreas()
      .then((res) => setAreas(res.data))
      .catch((err) => alert('Failed to load areas: ' + err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Area</Text>
      <FlatList
        data={areas}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              setSelectedArea(item);
              navigation.navigate('BusSelect');
            }}
          >
            <Text style={styles.itemText}>{item}</Text>
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
  itemText: { fontSize: 16 },
});