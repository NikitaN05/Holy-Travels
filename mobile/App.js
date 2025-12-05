import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import './src/i18n';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import ToursScreen from './src/screens/ToursScreen';
import TourDetailScreen from './src/screens/TourDetailScreen';
import MyTripScreen from './src/screens/MyTripScreen';
import MenuScreen from './src/screens/MenuScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import EmergencyScreen from './src/screens/EmergencyScreen';
import GalleryScreen from './src/screens/GalleryScreen';
import PollsScreen from './src/screens/PollsScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';

import useAuthStore from './src/store/authStore';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Tours':
              iconName = focused ? 'map' : 'map-outline';
              break;
            case 'MyTrip':
              iconName = focused ? 'airplane' : 'airplane-outline';
              break;
            case 'Menu':
              iconName = focused ? 'restaurant' : 'restaurant-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#ff7f11',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Tours" component={ToursScreen} />
      <Tab.Screen name="MyTrip" component={MyTripScreen} options={{ tabBarLabel: 'My Trip' }} />
      <Tab.Screen name="Menu" component={MenuScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const App = () => {
  const { isAuthenticated, token } = useAuthStore();

  useEffect(() => {
    // Register for push notifications
    registerForPushNotifications();
  }, []);

  const registerForPushNotifications = async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }
  };

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isAuthenticated ? (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Main" component={TabNavigator} />
              <Stack.Screen name="TourDetail" component={TourDetailScreen} />
              <Stack.Screen name="Emergency" component={EmergencyScreen} />
              <Stack.Screen name="Gallery" component={GalleryScreen} />
              <Stack.Screen name="Polls" component={PollsScreen} />
              <Stack.Screen name="Notifications" component={NotificationsScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;

