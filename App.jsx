import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';

import Main from './src/Main';

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Main />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
