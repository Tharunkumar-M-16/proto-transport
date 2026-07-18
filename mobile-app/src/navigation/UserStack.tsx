import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AreaSelectScreen from '../screens/user/AreaSelectScreen';
import BusSelectScreen from '../screens/user/BusSelectScreen';
import LiveTrackingScreen from '../screens/user/LiveTrackingScreen';

const Stack = createNativeStackNavigator();

export default function UserStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AreaSelect" component={AreaSelectScreen} options={{ title: 'Select Area' }} />
      <Stack.Screen name="BusSelect" component={BusSelectScreen} options={{ title: 'Select Bus' }} />
      <Stack.Screen name="LiveTracking" component={LiveTrackingScreen} options={{ title: 'Live Tracking' }} />
    </Stack.Navigator>
  );
}