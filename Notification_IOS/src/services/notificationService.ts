import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { Platform, PermissionsAndroid } from 'react-native';

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
  if (Platform.OS === 'ios') await messaging().registerDeviceForRemoteMessages();
  const token = await messaging().getToken();
  console.log('📱 FCM Token:', token);
  return token;
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
export async function displayNotification(title?: string, body?: string) {
  await notifee.displayNotification({
    title: title || 'Notification',
    body: body || '',
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

    const { title, body, totalCalls, completedCalls } = remoteMessage.data || {};
    const displayBody =
      body ||
      (completedCalls && totalCalls
        ? `${completedCalls} of ${totalCalls} calls completed`
        : '');

    await displayNotification(title, displayBody);
  });

  return unsubscribe;
}

// Handle notification taps
export function setupNotificationInteractionHandler() {
  notifee.onBackgroundEvent(async ({ type, detail }) => {
    if (type === EventType.PRESS) {
      console.log('📲 Notification pressed in background:', detail);
    }
  });

  notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS) {
      console.log('📲 Notification pressed in foreground:', detail);
    }
  });
}
