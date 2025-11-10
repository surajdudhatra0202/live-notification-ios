import Ionicons from '@react-native-vector-icons/ionicons';
import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import styles from './styles';

const HomeScreen = () => {

  return (
    <View style={[styles.root]}>

      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.text}>🚀 Notifications Ready for iOS</Text>
          <Text style={styles.text}><Ionicons name='home' size={23} color={'#d9d9d9ff'} /></Text>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default HomeScreen;