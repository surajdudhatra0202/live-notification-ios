import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { registerDeviceToken } from './src/api/notificationApi';
import HomeScreen from './src/screens/HomeScreen';
import { 
  createDefaultChannel, 
  getFcmToken, 
  requestUserPermission, 
  setupForegroundHandler,
  setupNotificationInteractionHandler  // Add this
} from './src/services/notificationService';
import { NavigationContainer } from '@react-navigation/native';
import Tabs from './src/tab';


export default function App() {
  useEffect(() => {
    async function init() {
      try {
        console.log('🚀 Initializing Notification setup...');

        const permissionGranted = await requestUserPermission();
        if (!permissionGranted) {
          console.warn('🔒 Notification permission denied');
          return;
        }

        await createDefaultChannel();
        setupForegroundHandler();
        setupNotificationInteractionHandler(); // Add this line

        const token = await getFcmToken();
        if (token) {
          const userId = 'USER_123';
          await registerDeviceToken(token, userId);
        } else {
          console.warn('⚠️ No FCM token retrieved');
        }

      } catch (err) {
        console.error('❌ Notification setup failed:', err);
      }
    }

    init();
  }, []);

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <NavigationContainer>
        <Tabs />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}