import React from 'react';
import { Platform } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import JournalScreen from '../screens/JournalScreen';
import ActivitiesScreen from '../screens/ActivitiesScreen';
import CheckInScreen from '../screens/CheckInScreen';

const Tab = createBottomTabNavigator();

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Journal') {
                    iconName = focused ? 'book' : 'book-outline';
                } else if (route.name === 'Activities') {
                    iconName = focused ? 'fitness' : 'fitness-outline';
                } else if (route.name === 'Check-In') {
                    iconName = focused ? 'heart' : 'heart-outline';
                }

                return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: Platform.OS === 'ios' ? '#1976D2' : '#4CAF50',
            tabBarInactiveTintColor: 'gray',
            headerShown: false,
            
        })}
    >
        <Tab.Screen name="Journal" component={JournalScreen} options={{title: 'Journal', headerTitle: 'Journal'}} />
        <Tab.Screen name="Activities" component={ActivitiesScreen} />
        <Tab.Screen name="Check-In" component={CheckInScreen} />
    </Tab.Navigator>
  );
}
