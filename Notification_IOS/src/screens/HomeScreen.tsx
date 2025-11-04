import React from 'react';
import { View, Text, StyleSheet, StatusBar, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* iOS: translucent + barStyle, Android: backgroundColor */}
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="#292929ff"
      />

      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.text}>🚀 Notifications Ready for iOS</Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#292929ff', // 👈 this fills status bar area on iOS
  },
  container: {
    flex: 1,
    backgroundColor: '#292929ff', // same color to match below
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
});
