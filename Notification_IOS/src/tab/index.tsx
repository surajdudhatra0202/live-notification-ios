import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import HomeScreen from '../screens/HomeScreen';
import CallScreen from '../screens/CallScreen';
import SettingScreen from '../screens/SettingScreen';
import { Ionicons } from '@react-native-vector-icons/ionicons'

const Tab = createBottomTabNavigator();

const Tabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarStyle: {
                    backgroundColor: '#292929ff'
                },
                headerStyle: {
                    backgroundColor: '#292929ff'
                },
                headerTitleAlign: 'center',
                headerTintColor: 'white',
                // eslint-disable-next-line react/no-unstable-nested-components
                tabBarIcon: ({ focused, color, size }) => {
                    let iconname;
                    if (route.name === 'Home') {
                        iconname = focused ? 'home' : 'home-outline'
                    } else if (route.name === 'Calls') {
                        iconname = focused ? 'call' : 'call-outline'
                    } else if (route.name === 'Settings') {
                        iconname = focused ? 'settings' : 'settings-outline'
                    }

                    return <Ionicons name={iconname} size={23} color={'#ffffffff'} />;
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray'
            })}
        >
            <Tab.Screen name='Home' component={HomeScreen} />
            <Tab.Screen name='Calls' component={CallScreen} />
            <Tab.Screen name='Settings' component={SettingScreen} />
        </Tab.Navigator>
    )
}

export default Tabs