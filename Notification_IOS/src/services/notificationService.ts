// notificationService.ts
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { Platform, NativeModules, PermissionsAndroid, AppState } from 'react-native';

const { CustomNotification } = NativeModules;

// Request permissions (Android 13+)
export async function requestUserPermission() {
  if (Platform.OS === 'android') {
    if (Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      console.log('🔐 Android POST_NOTIFICATIONS:', granted);
      
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.warn('🔒 Notification permission denied');
        return false;
      }
    }
  }

  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  console.log('🔐 FCM Permission:', enabled);
  return enabled;
}

// Get FCM token
export async function getFcmToken(): Promise<string | null> {
  if (Platform.OS === 'ios') await messaging().registerDeviceForRemoteMessages();
  const token = await messaging().getToken();
  console.log('📱 FCM Token:', token);
  return token;
}

// Create notification channel
export async function createDefaultChannel() {
  if (Platform.OS === 'android') {
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Live Updates',
      importance: AndroidImportance.HIGH,
      sound: 'default',
      vibration: true,
    });
    console.log('✅ Channel created:', channelId);
  }
}

// Display notification handler
async function displayNotification(data: any, isUpdate: boolean = false) {
  const { title, body, totalCalls, completedCalls } = data;

  console.log('📲 Displaying notification:', { title, body, totalCalls, completedCalls, isUpdate });

  try {
    // Native Android notification (your custom progress bar)
    if (Platform.OS === 'android') {
      try {
        CustomNotification?.show(0, Number(totalCalls || 0), Number(completedCalls || 0));
        console.log('✅ Custom notification shown');
      } catch (e) {
        console.log('⚠️ Custom native notification skipped:', e);
      }
    }

    // Check if this is the final update (completed = total)
    const isComplete = Number(completedCalls) >= Number(totalCalls);

    // Notifee notification with progress
    await notifee.displayNotification({
      id: 'live-tracking', // Same ID = updates existing notification
      title: title || 'Update',
      body: body || `${completedCalls} of ${totalCalls} completed`,
      android: {
        channelId: 'default',
        importance: AndroidImportance.HIGH,
        color: '#0E7C66',
        ongoing: !isComplete, // Only persistent if not complete
        autoCancel: isComplete, // Auto dismiss when tapped if complete
        progress: {
          max: Number(totalCalls || 0),
          current: Number(completedCalls || 0),
        },
        smallIcon: 'ic_launcher',
        pressAction: {
          id: 'default',
        },
        showTimestamp: true,
        actions: isComplete ? [] : undefined, // Remove actions when complete
      },
      ios: {
        sound: 'default',
      },
    });
    
    console.log('✅ Notifee notification displayed/updated');

    // Auto-clear notification if complete
    if (isComplete) {
      setTimeout(async () => {
        await clearLiveTracking();
        console.log('✅ Notification auto-cleared after completion');
      }, 3000); // Clear after 3 seconds
    }
  } catch (error) {
    console.error('❌ Error displaying notification:', error);
  }
}

// Foreground listener
export function setupForegroundHandler() {
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    console.log('📩 Foreground message received:', remoteMessage);
    
    if (remoteMessage.data && remoteMessage.data.type === 'live-update') {
      const { title, body, totalCalls, completedCalls } = remoteMessage.data;
      
      await displayNotification({
        title,
        body,
        totalCalls,
        completedCalls,
      }, true);
    }
  });

  return unsubscribe;
}

// Background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('📩 Background message:', remoteMessage);
  
  if (remoteMessage.data && remoteMessage.data.type === 'live-update') {
    const { title, body, totalCalls, completedCalls } = remoteMessage.data;
    
    await displayNotification({
      title,
      body,
      totalCalls,
      completedCalls,
    }, true);
  }
  
  return Promise.resolve();
});

// Handle notification interactions
export function setupNotificationInteractionHandler() {
  // Handle notification press when app is in background/quit
  notifee.onBackgroundEvent(async ({ type, detail }) => {
    console.log('Notifee background event:', type);
    
    if (type === EventType.PRESS) {
      console.log('User pressed notification in background:', detail);
      // You can navigate to a specific screen here
    }
    
    if (type === EventType.DISMISSED) {
      console.log('Notification dismissed');
    }
  });

  // Handle notification press when app is in foreground
  notifee.onForegroundEvent(({ type, detail }) => {
    console.log('Notifee foreground event:', type);
    
    if (type === EventType.PRESS) {
      console.log('User pressed notification in foreground:', detail);
      // You can navigate to a specific screen here
    }
  });
}

// Clear notification when done
export async function clearLiveTracking() {
  try {
    await notifee.cancelNotification('live-tracking');
    console.log('✅ Notifee notification cleared');
    
    if (Platform.OS === 'android') {
      try {
        CustomNotification?.cancel(0);
        console.log('✅ Custom notification cleared');
      } catch (e) {
        console.log('⚠️ Could not cancel custom notification');
      }
    }
  } catch (error) {
    console.error('❌ Error clearing notification:', error);
  }
}