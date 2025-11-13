import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { Platform, PermissionsAndroid } from 'react-native';
import { navigate } from '../navigation/navigationRef';

// Ask for permissions
export async function requestUserPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      console.warn('🔒 Notification permission denied');
      return false;
    }
  }

  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  return enabled;
}

// Get FCM token
export async function getFcmToken(): Promise<string | null> {
  try {
    const token = await messaging().getToken();
    console.log('📱 FCM Token:', token);
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
}

// Create default notification channel
export async function createDefaultChannel() {
  if (Platform.OS === 'android') {
    await notifee.createChannel({
      id: 'default',
      name: 'General',
      importance: AndroidImportance.HIGH,
      sound: 'default',
    });
  }
}

// Display a simple notification
export async function displayNotification(title?: string, body?: string, data?: any) {
  await notifee.displayNotification({
    title: title || 'Notification',
    body: body || '',
    data: data,
    android: {
      channelId: 'default',
      importance: AndroidImportance.HIGH,
      smallIcon: 'ic_launcher',
      autoCancel: true,
      pressAction: { id: 'default' },
    },
    ios: {
      sound: 'default',
    },
  });
}

// Foreground messages (show manually)
export function setupForegroundHandler() {
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    console.log('📩 Foreground message:', remoteMessage);

    const { title, body } = remoteMessage.data || {};
    await displayNotification(title, body, remoteMessage.data);
  });

  return unsubscribe;
}

// Handle notification taps
export function setupNotificationInteractionHandler() {
  notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type === EventType.PRESS && detail.notification?.data?.screen) {
      console.log('📲 Background notification tap:', detail.notification.data.screen);
      navigate(detail.notification.data.screen as string, detail.notification.data);
    }
  });

  notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS && detail.notification?.data?.screen) {
      console.log('📲 Foreground notification tap:', detail.notification.data.screen);
      navigate(detail.notification.data.screen as string, detail.notification.data);
    }
  });
}

export async function checkInitialNotification(): Promise<{ screen?: string, params?: any } | null> {
  try {
    const remoteMessage = await messaging().getInitialNotification();
    if (remoteMessage?.data?.screen) {
      console.log('📱 Initial notification found:', remoteMessage.data.screen);
      return {
        screen: remoteMessage.data.screen as string,
        params: remoteMessage.data
      }
    }
  } catch (error) {
    console.error("Error checking initial notification", error)
  }
  return null
}

export function notificationOpened() {
  messaging().onNotificationOpenedApp(remoteMessage => {
    if (remoteMessage?.data?.screen) {
      navigate(remoteMessage?.data?.screen);
    }
    console.log('remote notification data 1', remoteMessage);
  });
};