import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppContext } from '../context/AppContext';

export default function RoleSelectScreen({ navigation }: any) {
  const { setRole, setName } = useAppContext();
  const [localName, setLocalName] = useState('');

  const pickRole = (role: 'user' | 'driver') => {
    if (!localName.trim()) return alert('Enter your name first');
    setName(localName);
    setRole(role);
    navigation.replace(role === 'user' ? 'UserStack' : 'DriverStack');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bus Tracker</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={localName}
        onChangeText={setLocalName}
      />
      <TouchableOpacity style={styles.button} onPress={() => pickRole('user')}>
        <Text style={styles.buttonText}>I'm a Passenger</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => pickRole('driver')}>
        <Text style={styles.buttonText}>I'm a Driver/Conductor</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, gap: 16 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16 },
  button: { backgroundColor: '#2563eb', padding: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});