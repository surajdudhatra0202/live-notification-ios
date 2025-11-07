import admin, { messaging } from "firebase-admin";
import path from "path";

const serviceAccount = require(path.join(__dirname, "../config/firebase-key.json"));

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
}

export async function sendNotification({
  token,
  title,
  body,
  totalCalls,
  completedCalls,
  platform
}: NotificationPayload) {
  try {
    const data = {
      title,
      body,
      totalCalls: String(totalCalls),
      completedCalls: String(completedCalls),
      type: 'live-update',
    };

    let message: messaging.Message;

    if (platform === 'android') {
      // CRITICAL: Data-only message for Android
      // This prevents the system from auto-displaying notifications
      message = {
        token,
        data, // Only data, no notification payload
        android: {
          priority: 'high',
          // No notification object here!
        },
      };
    } else if (platform === "ios") {
      // iOS: Keep data-only for silent updates
      message = {
        token,
        data,
        apns: {
          headers: {
            'apns-priority': '10',
            'apns-collapse-id': 'live-update',
          },
          payload: {
            aps: {
              contentAvailable: true,
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