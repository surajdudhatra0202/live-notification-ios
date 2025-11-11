import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { registerDeviceToken } from './src/api/notificationApi';
import { 
  createDefaultChannel, 
  getFcmToken, 
  notificationOpened, 
  requestUserPermission, 

  setupForegroundHandler, 

  setupNotificationInteractionHandler  // Add this
} from './src/services/notificationService';
import { NavigationContainer } from '@react-navigation/native';
import Tabs from './src/tab';
import { navigationRef } from './src/navigation/navigationRef';


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

        notificationOpened();

      } catch (err) {
        console.error('❌ Notification setup failed:', err);
      }
    }
    init();
  }, []);

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <NavigationContainer ref={navigationRef} >
        <Tabs />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}