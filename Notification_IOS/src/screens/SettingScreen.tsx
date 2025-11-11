import { View, Text } from 'react-native'
import React from 'react'
import styles from './styles'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from '@react-native-vector-icons/ionicons'

const SettingScreen = () => {
    return (
        <View style={[styles.root]}>

            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.text}>Setting Screen</Text>
                    <Text style={styles.text}><Ionicons name='settings' size={23} color={'#d9d9d9ff'} /></Text>
                </View>
            </SafeAreaView>
        </View>
    )
}

export default SettingScreen