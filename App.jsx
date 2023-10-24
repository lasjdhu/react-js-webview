import * as Notifications from 'expo-notifications';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import Main from './src/Main';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Main />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
