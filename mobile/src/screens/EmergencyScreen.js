import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Vibration,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { Audio } from 'expo-av';
import { emergencyAPI } from '../services/api';

const EmergencyScreen = ({ navigation }) => {
  const [isTriggering, setIsTriggering] = useState(false);
  const [activeAlert, setActiveAlert] = useState(null);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await emergencyAPI.getMyAlerts();
      const active = res.data.data?.find(a => a.status === 'active' || a.status === 'acknowledged');
      setActiveAlert(active);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const triggerEmergency = async (type = 'sos') => {
    Alert.alert(
      'Confirm Emergency',
      'This will alert our support team and your emergency contacts. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          style: 'destructive',
          onPress: async () => {
            setIsTriggering(true);
            Vibration.vibrate([500, 500, 500]);

            try {
              // Get location
              const { status } = await Location.requestForegroundPermissionsAsync();
              let location = {};
              if (status === 'granted') {
                const loc = await Location.getCurrentPositionAsync({});
                location = {
                  latitude: loc.coords.latitude,
                  longitude: loc.coords.longitude
                };
              }

              await emergencyAPI.trigger({ type, location });

              // Play alert sound
              const { sound } = await Audio.Sound.createAsync(
                require('../../assets/emergency-siren.mp3')
              );
              await sound.playAsync();

              Alert.alert('Alert Sent', 'Help is on the way! Our team has been notified.');
              fetchAlerts();
            } catch (error) {
              Alert.alert('Error', 'Failed to send alert. Please call emergency services directly.');
            } finally {
              setIsTriggering(false);
            }
          }
        }
      ]
    );
  };

  const cancelAlert = async () => {
    if (!activeAlert) return;

    try {
      await emergencyAPI.cancel(activeAlert._id);
      Alert.alert('Alert Cancelled');
      setActiveAlert(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to cancel alert');
    }
  };

  const emergencyContacts = [
    { name: 'Police', number: '100', icon: 'shield' },
    { name: 'Ambulance', number: '102', icon: 'medkit' },
    { name: 'Fire', number: '101', icon: 'flame' },
    { name: 'Women', number: '1091', icon: 'woman' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#dc2626', '#b91c1c']} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      {activeAlert && (
        <View style={styles.activeAlert}>
          <View style={styles.alertPulse}>
            <Ionicons name="warning" size={32} color="#fff" />
          </View>
          <Text style={styles.alertText}>Active Emergency Alert</Text>
          <Text style={styles.alertStatus}>Status: {activeAlert.status}</Text>
          <TouchableOpacity style={styles.cancelButton} onPress={cancelAlert}>
            <Text style={styles.cancelButtonText}>Cancel Alert</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.content}>
        {/* SOS Button */}
        <View style={styles.sosContainer}>
          <Text style={styles.sosLabel}>Press in case of emergency</Text>
          <TouchableOpacity
            style={[styles.sosButton, isTriggering && styles.sosButtonActive]}
            onPress={() => triggerEmergency('sos')}
            disabled={isTriggering || activeAlert}
          >
            <View style={styles.sosButtonInner}>
              <Ionicons name="warning" size={50} color="#fff" />
              <Text style={styles.sosText}>SOS</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Emergency Types */}
        <View style={styles.typesContainer}>
          <Text style={styles.typesTitle}>Quick Alerts</Text>
          <View style={styles.typesGrid}>
            {[
              { type: 'medical', icon: 'medkit', label: 'Medical', color: '#22c55e' },
              { type: 'safety', icon: 'shield', label: 'Safety', color: '#3b82f6' },
              { type: 'lost', icon: 'location', label: "I'm Lost", color: '#f59e0b' },
              { type: 'general', icon: 'help-circle', label: 'Other', color: '#8b5cf6' }
            ].map((item) => (
              <TouchableOpacity
                key={item.type}
                style={[styles.typeButton, { backgroundColor: item.color }]}
                onPress={() => triggerEmergency(item.type)}
                disabled={isTriggering || activeAlert}
              >
                <Ionicons name={item.icon} size={24} color="#fff" />
                <Text style={styles.typeLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Emergency Numbers */}
        <View style={styles.contactsContainer}>
          <Text style={styles.contactsTitle}>Emergency Numbers</Text>
          <View style={styles.contactsGrid}>
            {emergencyContacts.map((contact) => (
              <TouchableOpacity
                key={contact.number}
                style={styles.contactButton}
                onPress={() => Linking.openURL(`tel:${contact.number}`)}
              >
                <Ionicons name={contact.icon} size={20} color="#ff7f11" />
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactNumber}>{contact.number}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  activeAlert: {
    backgroundColor: '#fef2f2',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#dc2626',
  },
  alertPulse: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#dc2626',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc2626',
    marginBottom: 4,
  },
  alertStatus: {
    color: '#666',
    marginBottom: 12,
  },
  cancelButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dc2626',
  },
  cancelButtonText: {
    color: '#dc2626',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sosContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  sosLabel: {
    color: '#666',
    fontSize: 14,
    marginBottom: 16,
  },
  sosButton: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#dc2626',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  sosButtonActive: {
    backgroundColor: '#991b1b',
  },
  sosButtonInner: {
    alignItems: 'center',
  },
  sosText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  typesContainer: {
    marginBottom: 24,
  },
  typesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  typesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  typeButton: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  typeLabel: {
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 8,
  },
  contactsContainer: {
    flex: 1,
  },
  contactsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  contactsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  contactButton: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  contactName: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  contactNumber: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EmergencyScreen;

