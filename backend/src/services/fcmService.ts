import admin, { messaging } from 'firebase-admin';
import path from 'path';

const serviceAccount = require(path.join(__dirname, '../config/firebase-key.json'));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

interface NotificationPayload {
  token: string;
  title: string;
  body: string;
  totalCalls: string;
  completedCalls: string;
  platform: 'android' | 'ios';
  screen: string,
  userId: string,
}

export async function sendNotification({
  token,
  title,
  body,
  totalCalls,
  completedCalls,
  platform,
  screen,
  userId
}: NotificationPayload) {
  try {
    const data = {
      title,
      body,
      totalCalls: String(totalCalls),
      completedCalls: String(completedCalls),
      screen,
      userId,
    };

    let message: messaging.Message;

    if (platform === 'android') {
      // Android: use "notification" payload so system displays automatically in background
      message = {
        token,
        notification: {
          title,
          body: `${completedCalls} of ${totalCalls} calls completed`,
        },
        data,
        android: {
          priority: 'high',
          notification: {
            channelId: 'default',
            sound: 'default',
          },
        },
      };
    } else if (platform === 'ios') {
      // iOS: visible alert notification
      message = {
        token,
        notification: {
          title,
          body: `${completedCalls} of ${totalCalls} calls completed and ${screen}-${userId}`,
        },
        data,
        apns: {
          headers: {
            'apns-priority': '10',
          },
          payload: {
            aps: {
              alert: {
                title,
                body: `${completedCalls} of ${totalCalls} calls completed`,
              },
              sound: 'default',
            },
          },
        },
      };
    } else {
      throw new Error(`Unknown platform: ${platform}`);
    }

    const response = await admin.messaging().send(message);
    console.log(`✅ Notification sent to ${platform}:`, response);
    return response;
  } catch (error: any) {
    console.error(`❌ Error sending notification to ${platform}:`, error?.message || error);
    throw error;
  }
}