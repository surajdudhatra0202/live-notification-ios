export async function registerDeviceToken(token: string) {
  try {
    const response = await fetch('http://10.10.10.116:5000/api/register', {
      // use localhost:5000 for iOS simulator
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
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
