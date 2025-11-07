import { Platform } from "react-native";
import DeviceInfo from "react-native-device-info";

export async function registerDeviceToken(token: string, userId: string) {
  try {

    const platform = Platform.OS;
    const appVersion = DeviceInfo.getVersion();
    const deviceModel = DeviceInfo.getModel();

    const payload = {
      token,
      platform,
      appVersion,
      deviceModel,
      userId: userId ?? "",
    }

    console.log('📡 Registering device token:', payload);

    const response = await fetch('http://10.10.10.116:8080/api/register', {
      // use localhost:5000 for iOS simulator
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Token registered:', result);
    return result;
  } catch (err) {
    console.error('❌ Error registering token', err);
  }
}
