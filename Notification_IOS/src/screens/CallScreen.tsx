import { View, Text } from 'react-native'
import React from 'react'
import styles from './styles'
import Ionicons from '@react-native-vector-icons/ionicons'
import { SafeAreaView } from 'react-native-safe-area-context'

const CallScreen = () => {
    return (
        <View style={[styles.root]}>
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.text}>Call Screen</Text>
                    <Text style={styles.text}><Ionicons name='call' size={23} color={'#d9d9d9ff'} /></Text>
                </View>
            </SafeAreaView>
        </View>
    )
}

export default CallScreen