import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import JournalScreen from '../screens/JournalScreen';
import ActivitiesScreen from '../screens/ActivitiesScreen';
import CheckInScreen from '../screens/CheckInScreen';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
      <Tab.Navigator>
        <Tab.Screen name="Journal" component={JournalScreen} />
        <Tab.Screen name="Activities" component={ActivitiesScreen} />
        <Tab.Screen name="Check-In" component={CheckInScreen} />
      </Tab.Navigator>
  );
};

export default AppNavigator;