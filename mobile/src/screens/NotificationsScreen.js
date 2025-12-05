import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { notificationsAPI } from '../services/api';

const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await notificationsAPI.getAll();
      setNotifications(res.data.data.notifications || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const typeIcons = {
    tour: { name: 'map-outline', color: '#3b82f6' },
    menu: { name: 'restaurant-outline', color: '#22c55e' },
    poll: { name: 'bar-chart-outline', color: '#8b5cf6' },
    emergency: { name: 'warning-outline', color: '#dc2626' },
    general: { name: 'notifications-outline', color: '#ff7f11' },
  };

  const renderNotification = ({ item }) => {
    const icon = typeIcons[item.type] || typeIcons.general;
    return (
      <TouchableOpacity style={[styles.notificationCard, !item.isRead && styles.unread]}>
        <View style={[styles.iconContainer, { backgroundColor: icon.color + '20' }]}>
          <Ionicons name={icon.name} size={24} color={icon.color} />
        </View>
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>{item.title?.en}</Text>
          <Text style={styles.notificationMessage} numberOfLines={2}>{item.message?.en}</Text>
          <Text style={styles.notificationTime}>{new Date(item.createdAt).toLocaleDateString()}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#333" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity><Ionicons name="checkmark-done-outline" size={24} color="#ff7f11" /></TouchableOpacity>
      </View>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<View style={styles.empty}><Ionicons name="notifications-off-outline" size={60} color="#ccc" /><Text style={styles.emptyText}>No notifications</Text></View>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  listContent: { padding: 16 },
  notificationCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, elevation: 1 },
  unread: { backgroundColor: '#fff9f5', borderLeftWidth: 3, borderLeftColor: '#ff7f11' },
  iconContainer: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  notificationContent: { flex: 1 },
  notificationTitle: { fontWeight: 'bold', color: '#333', marginBottom: 4 },
  notificationMessage: { color: '#666', fontSize: 13, marginBottom: 4 },
  notificationTime: { color: '#888', fontSize: 11 },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { color: '#888', marginTop: 12 },
});

export default NotificationsScreen;

