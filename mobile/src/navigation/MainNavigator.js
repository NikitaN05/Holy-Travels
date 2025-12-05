import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import ToursScreen from '../screens/ToursScreen';
import TourDetailScreen from '../screens/TourDetailScreen';
import MyTripScreen from '../screens/MyTripScreen';
import MenuScreen from '../screens/MenuScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EmergencyScreen from '../screens/EmergencyScreen';
import GalleryScreen from '../screens/GalleryScreen';
import PollsScreen from '../screens/PollsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="TourDetail" component={TourDetailScreen} />
    <Stack.Screen name="Gallery" component={GalleryScreen} />
    <Stack.Screen name="Polls" component={PollsScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
  </Stack.Navigator>
);

const ToursStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ToursList" component={ToursScreen} />
    <Stack.Screen name="TourDetail" component={TourDetailScreen} />
  </Stack.Navigator>
);

const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home': iconName = focused ? 'home' : 'home-outline'; break;
            case 'Tours': iconName = focused ? 'map' : 'map-outline'; break;
            case 'MyTrip': iconName = focused ? 'calendar' : 'calendar-outline'; break;
            case 'Menu': iconName = focused ? 'restaurant' : 'restaurant-outline'; break;
            case 'Profile': iconName = focused ? 'person' : 'person-outline'; break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#ff7f11',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { paddingBottom: 8, paddingTop: 8, height: 65 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Tours" component={ToursStack} />
      <Tab.Screen name="MyTrip" component={MyTripScreen} options={{ title: 'My Trip' }} />
      <Tab.Screen name="Menu" component={MenuScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainNavigator;

