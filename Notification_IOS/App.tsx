import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BootSplash from 'react-native-bootsplash';
import { registerDeviceToken } from './src/api/notificationApi';
import {
  checkInitialNotification,
  createDefaultChannel,
  getFcmToken,
  notificationOpened,
  requestUserPermission,
  setupForegroundHandler,
  setupNotificationInteractionHandler
} from './src/services/notificationService';
import { NavigationContainer } from '@react-navigation/native';
import Tabs from './src/tab';
import { executePendingNavigation, navigationRef, setPendingNavigation } from './src/navigation/navigationRef';
import { ActivityIndicator, View } from 'react-native';
import styles from './src/screens/styles';


export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        console.log('🚀 Initializing Notification setup...');

        const initialNotification = await checkInitialNotification();
        if (initialNotification?.screen) {
          console.log('📍 Queuing initial navigation to:', initialNotification.screen);
          setPendingNavigation(initialNotification.screen, initialNotification.params);
        }

        const permissionGranted = await requestUserPermission();
        if (!permissionGranted) {
          console.warn('🔒 Notification permission denied');
        }

        await createDefaultChannel();
        setupForegroundHandler();
        setupNotificationInteractionHandler(); // Add this line
        notificationOpened()

        const token = await getFcmToken();
        if (token) {
          const userId = 'USER_123';
          await registerDeviceToken(token, userId);
        } else {
          console.warn('⚠️ No FCM token retrieved');
        }

      } catch (err) {
        console.error('❌ Notification setup failed:', err);
      } finally {
        setIsAppReady(true)
      }
    }
    init();
  }, []);

  const handleNavigationReady = () => {
    console.log('✅ Navigation ready');
    executePendingNavigation();

    BootSplash.hide({ fade: true });
    console.log('👋 Splash hidden');
  };

  if (!isAppReady) {
    return null;
  }

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <NavigationContainer ref={navigationRef} onReady={handleNavigationReady}>
        <Tabs />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}