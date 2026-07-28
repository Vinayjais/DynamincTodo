/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { StatusBar, Text, useColorScheme, LogBox, View, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { initializeApp } from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || 'your_api_key_here',
  appId: process.env.FIREBASE_APP_ID || 'your_app_id_here',
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || 'your_messaging_sender_id_here',
  projectId: process.env.FIREBASE_PROJECT_ID || 'your_project_id_here',
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'your_auth_domain_here',
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'your_storage_bucket_here',
};
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './utils/NavigationService';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './app/screens/Home';
import TodoListGroups from './app/screens/todo/TodoListGroups';
import DynamicTodo from './app/screens/todo/DynamicTodo';
import { Provider } from 'react-redux';
import { store, persistor } from './store/store';
import { PersistGate } from 'redux-persist/integration/react';
const Stack = createNativeStackNavigator();
LogBox.ignoreAllLogs();

initializeApp(firebaseConfig);

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [lastOfflineAt, setLastOfflineAt] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected = !!(state.isConnected && state.isInternetReachable !== false);
      setIsConnected(connected);
      if (!connected) setLastOfflineAt(Date.now());
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(currentUser => {
      setUser(currentUser);
    });

    return subscriber;
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          {isConnected === false && (
            <View style={styles.offlineBanner}>
              <Text style={styles.offlineText}>
                Offline
                {lastOfflineAt ? ` — since ${new Date(lastOfflineAt).toLocaleTimeString()}` : ''}
              </Text>
            </View>
          )}
          <NavigationContainer ref={navigationRef}>
            <Stack.Navigator initialRouteName='Home'>
              <Stack.Screen name="Home" options={{ title: 'Home' }}>
                {props => <Home {...props} user={user} />}
              </Stack.Screen>
              <Stack.Screen name="TodoListGroups" component={TodoListGroups} options={{ title: 'Todo Lists' }} />
              <Stack.Screen name="DynamicTodo" component={DynamicTodo} options={{ title: 'Dynamic Todo' }} />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  offlineBanner: {
    backgroundColor: '#b00020',
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  offlineText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default App;
