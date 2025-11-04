import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { registerDeviceToken } from './src/api/notificationApi';
import HomeScreen from './src/screens/HomeScreen';
import { createDefaultChannel, getFcmToken, requestUserPermission, setupForegroundHandler } from './src/services/notificationService';


export default function App() {
  useEffect(() => {
    async function init() {
      await requestUserPermission();
      await createDefaultChannel();
      setupForegroundHandler();

      const token = await getFcmToken();
      if (token) {
        await registerDeviceToken(token);
      }
    }

    init();
  }, []);

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <HomeScreen />
    </SafeAreaProvider>
  );
}
