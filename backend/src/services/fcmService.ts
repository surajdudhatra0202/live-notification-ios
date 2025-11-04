import admin, { messaging } from "firebase-admin";
import path from "path";

const serviceAccount = require(path.join(__dirname, "../config/firebase-key.json"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

async function sendNotification(
  token: string,
  title: string,
  body: string,
  totalCalls: number,
  completedCalls: number
) {
  const message : messaging.Message = {
    token,
    data: {
      title,
      body,
      totalCalls: String(totalCalls),
      completedCalls: String(completedCalls),
    }, // only data payload
    android: { priority: "high" },
    apns: { headers: { "apns-priority": "10" } },
  };

  return await admin.messaging().send(message);
}

export default sendNotification;
