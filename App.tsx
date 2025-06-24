import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppDrawer from './DrawerNavigator';
import LoginScreen from './screens/LoginScreen';
import * as SecureStore from 'expo-secure-store';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';


const Stack = createStackNavigator();

export default function App() {
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRole = async () => {
      await SecureStore.deleteItemAsync('role'); 
      setRole(null);
      setIsLoading(false);
    };
    loadRole();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {role ? (
            <Stack.Screen name="Home">
              {() => <AppDrawer userRole={role} setRole={setRole} />}
            </Stack.Screen>
          ) : (
            <Stack.Screen name="Login">
              {() => <LoginScreen setRole={setRole} />}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>

     
      
    </>
  );
}
