/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { StatusBar, Text, useColorScheme, LogBox, View, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { SafeAreaProvider } from 'react-native-safe-area-context';
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
LogBox.ignoreAllLogs()
function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [isConnected, setIsConnected] = useState<boolean | null>(true);
  const [lastOfflineAt, setLastOfflineAt] = useState<number | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected = !!(state.isConnected && state.isInternetReachable !== false);
      setIsConnected(connected);
      if (!connected) setLastOfflineAt(Date.now());
    });
    return () => unsubscribe();
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
              <Stack.Screen name="Home" component={Home} options={{ title: 'Home' }} />
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
