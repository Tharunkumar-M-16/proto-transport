import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RoleSelectScreen from '../screens/RoleSelectScreen';
import UserStack from './UserStack';
import DriverStack from './DriverStack';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />
        <Stack.Screen name="UserStack" component={UserStack} />
        <Stack.Screen name="DriverStack" component={DriverStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}