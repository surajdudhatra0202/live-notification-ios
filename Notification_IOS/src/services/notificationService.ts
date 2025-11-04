import {
  getMessaging,
  requestPermission,
  getToken,
  onMessage,
  AuthorizationStatus,
} from '@react-native-firebase/messaging';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { Platform, Alert, NativeModules } from 'react-native';

const { CustomNotification } = NativeModules;

export async function requestUserPermission() {
  const messaging = getMessaging();

  const authStatus = await requestPermission(messaging);
  const enabled =
    authStatus === AuthorizationStatus.AUTHORIZED ||
    authStatus === AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    // console.log('✅ Notification permission granted');
  } else {
    Alert.alert('Notifications blocked', 'Enable notifications in settings');
  }
}

export async function getFcmToken(): Promise<string | null> {
  try {
    const messaging = getMessaging();
    const token = await getToken(messaging);
    // console.log('📱 FCM Token:', token);
    return token;
  } catch (err) {
    console.error('❌ Error fetching FCM token', err);
    return null;
  }
}

export function setupForegroundHandler() {
  const messaging = getMessaging();

  onMessage(messaging, async remoteMessage => {
    const { data } = remoteMessage;

    const title = data?.title ?? 'Notification';
    const body = data?.body ?? '';
    const totalCalls = parseInt(data?.totalCalls ?? '0');
    const completedCalls = parseInt(data?.completedCalls ?? '0');
    const pendingCalls = totalCalls - completedCalls;

    CustomNotification.show(0, totalCalls, completedCalls);
    // console.log(totalCalls, completedCalls);
    // console.log(remoteMessage);
    await notifee.displayNotification({
      id: 'live-tracking',
      title: title,
      body: body,
      android: {
        channelId: 'default',
        asForegroundService: true, // ✅ required
        color: '#0E7C66', // 🟢 Background color
        colorized: true, // ✅ makes whole background colored
        onlyAlertOnce: true,
        progress: {
          max: totalCalls,
          current: completedCalls,
        },
      },
    });
  });
}

export async function createDefaultChannel() {
  if (Platform.OS === 'android') {
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });
  }
}
