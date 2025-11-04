export async function registerDeviceToken(token: string) {
  try {
    const res = await fetch('http://10.10.10.119:5000/api/register', {
      // use localhost:5000 for iOS simulator
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    const text = await res.text();
    // console.log('Raw response:', text);
  } catch (err) {
    console.error('❌ Error registering token', err);
  }
}
