import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import useAuthStore from '../store/authStore';

const ProfileScreen = ({ navigation }) => {
  const { user, traveller, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout }
    ]);
  };

  const menuItems = [
    { icon: 'person-outline', label: 'Edit Profile', screen: 'EditProfile' },
    { icon: 'time-outline', label: 'Travel History', screen: 'TravelHistory' },
    { icon: 'call-outline', label: 'Emergency Contacts', screen: 'EmergencyContacts' },
    { icon: 'settings-outline', label: 'Preferences', screen: 'Preferences' },
    { icon: 'language-outline', label: 'Language', screen: 'Language' },
    { icon: 'help-circle-outline', label: 'Help & Support', screen: 'Help' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <LinearGradient colors={['#ff7f11', '#de5b0f']} style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <View style={styles.tierBadge}>
            <Text style={styles.tierText}>{traveller?.membershipTier?.toUpperCase() || 'BRONZE'} MEMBER</Text>
          </View>
        </LinearGradient>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{traveller?.totalTrips || 0}</Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{traveller?.loyaltyPoints || 0}</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <View style={styles.menuIconContainer}>
                <Ionicons name={item.icon} size={22} color="#ff7f11" />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#dc2626" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { alignItems: 'center', paddingVertical: 30 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.3)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: '#fff' },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  userEmail: { color: 'rgba(255,255,255,0.8)', marginBottom: 12 },
  tierBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  tierText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  statsContainer: { flexDirection: 'row', backgroundColor: '#fff', marginHorizontal: 16, marginTop: -20, borderRadius: 16, padding: 20, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  statLabel: { color: '#888', fontSize: 12, marginTop: 4 },
  statDivider: { width: 1, backgroundColor: '#e0e0e0' },
  menuContainer: { backgroundColor: '#fff', margin: 16, borderRadius: 16, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  menuIconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#fff4e6', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  menuLabel: { flex: 1, fontSize: 16, color: '#333' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', margin: 16, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#fee2e2' },
  logoutText: { color: '#dc2626', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
});

export default ProfileScreen;

