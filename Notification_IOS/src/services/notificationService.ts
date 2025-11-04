import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { Platform, Alert, NativeModules } from 'react-native';

const { CustomNotification } = NativeModules;

// 🟩 Request notification permission
export async function requestUserPermission() {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('✅ Notification permission granted');
    } else {
      Alert.alert(
        'Notifications blocked',
        'Please enable notifications in Settings to receive updates.'
      );
    }
  } catch (error) {
    console.error('❌ Permission request failed:', error);
  }
}

// 🟩 Get FCM token
export async function getFcmToken(): Promise<string | null> {
  try {
    // Required on iOS before getting token
    if (Platform.OS === 'ios') {
      await messaging().registerDeviceForRemoteMessages();
    }

    const token = await messaging().getToken();
    if (token) {
      console.log('📱 FCM Token:', token);
      return token;
    } else {
      console.log('⚠️ No FCM token generated');
      return null;
    }
  } catch (error) {
    console.error('❌ Error getting FCM token:', error);
    return null;
  }
}

// 🟩 Handle foreground messages
export function setupForegroundHandler() {
  messaging().onMessage(async remoteMessage => {
    const { data } = remoteMessage;
    const title = data?.title ?? 'Notification';
    const body = data?.body ?? '';
    const totalCalls = parseInt(data?.totalCalls ?? '0');
    const completedCalls = parseInt(data?.completedCalls ?? '0');

    try {
      CustomNotification?.show(0, totalCalls, completedCalls);
    } catch (e) {
      console.log('⚠️ CustomNotification not available:', e);
    }

    await notifee.displayNotification({
      id: 'live-tracking',
      title,
      body,
      android: {
        channelId: 'default',
        importance: AndroidImportance.HIGH,
        color: '#0E7C66',
        colorized: true,
        onlyAlertOnce: true,
        progress: {
          max: totalCalls,
          current: completedCalls,
        },
      },
    });
  });
}

// 🟩 Create default Android channel
export async function createDefaultChannel() {
  if (Platform.OS === 'android') {
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });
  }
}
