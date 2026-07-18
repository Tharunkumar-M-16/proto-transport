import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppContext } from '../../context/AppContext';

export default function DriverLoginScreen({ navigation }: any) {
  const { setSelectedBusId } = useAppContext();
  const [busId, setBusId] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Driver Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Bus ID (e.g. BUS101)"
        value={busId}
        onChangeText={setBusId}
        autoCapitalize="characters"
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (!busId.trim()) return alert('Enter a bus ID');
          setSelectedBusId(busId.trim().toUpperCase());
          navigation.navigate('DriverLocation');
        }}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 16 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16 },
  button: { backgroundColor: '#16a34a', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});