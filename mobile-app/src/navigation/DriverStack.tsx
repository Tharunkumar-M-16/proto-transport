import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DriverLoginScreen from '../screens/driver/DriverLoginScreen';
import DriverLocationScreen from '../screens/driver/DriverLocationScreen';

const Stack = createNativeStackNavigator();

export default function DriverStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="DriverLogin" component={DriverLoginScreen} options={{ title: 'Driver Login' }} />
      <Stack.Screen name="DriverLocation" component={DriverLocationScreen} options={{ title: 'Update Location' }} />
    </Stack.Navigator>
  );
}