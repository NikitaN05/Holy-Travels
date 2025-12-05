import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { travellersAPI } from '../services/api';

const MyTripScreen = ({ navigation }) => {
  const [tripData, setTripData] = useState(null);
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTripData();
  }, []);

  const fetchTripData = async () => {
    try {
      const [tripRes, itineraryRes] = await Promise.all([
        travellersAPI.getCurrentTrip(),
        travellersAPI.getItinerary().catch(() => ({ data: { data: null } }))
      ]);
      setTripData(tripRes.data.data);
      setItinerary(itineraryRes.data.data);
    } catch (error) {
      console.error('Error fetching trip data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!tripData?.tour) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>✈️</Text>
          <Text style={styles.emptyTitle}>No Active Trip</Text>
          <Text style={styles.emptyText}>Book a tour to see your trip details here</Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => navigation.navigate('Tours')}
          >
            <Text style={styles.browseButtonText}>Browse Tours</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentDay = Math.max(1, Math.ceil((new Date() - new Date(tripData.booking?.tourDate)) / (1000 * 60 * 60 * 24)) + 1);
  const currentDayItinerary = itinerary?.itinerary?.find(d => d.day === currentDay);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchTripData} />}>
        {/* Header */}
        <LinearGradient colors={['#ff7f11', '#de5b0f']} style={styles.header}>
          <Text style={styles.dayBadge}>Day {currentDay} of {tripData.tour.duration?.days}</Text>
          <Text style={styles.tourTitle}>{tripData.tour.title?.en}</Text>
          <Text style={styles.bookingId}>Booking ID: {tripData.booking?.bookingId}</Text>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Menu')}>
            <Text style={styles.actionIcon}>🍽️</Text>
            <Text style={styles.actionLabel}>Menu</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionCard, styles.emergencyCard]} onPress={() => navigation.navigate('Emergency')}>
            <Text style={styles.actionIcon}>🚨</Text>
            <Text style={[styles.actionLabel, styles.emergencyLabel]}>SOS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Gallery')}>
            <Text style={styles.actionIcon}>📷</Text>
            <Text style={styles.actionLabel}>Photos</Text>
          </TouchableOpacity>
        </View>

        {/* Travel Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="ticket-outline" size={18} /> Travel Details
          </Text>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Ticket No.</Text>
              <Text style={styles.detailValue}>{tripData.ticketNumber || 'TBA'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Platform</Text>
              <Text style={styles.detailValue}>{tripData.platformNumber || 'TBA'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Coach / Seat</Text>
              <Text style={styles.detailValue}>{tripData.coachNumber || '-'} / {tripData.seatNumber || '-'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Station</Text>
              <Text style={styles.detailValue}>{tripData.railwayStation || 'TBA'}</Text>
            </View>
          </View>
        </View>

        {/* Hotel Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="home-outline" size={18} /> Accommodation
          </Text>
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Hotel</Text>
              <Text style={styles.detailValue}>{tripData.hotelName || 'TBA'}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Room</Text>
              <Text style={styles.detailValue}>{tripData.roomNumber || 'TBA'}</Text>
            </View>
          </View>
        </View>

        {/* Today's Itinerary */}
        {currentDayItinerary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="calendar-outline" size={18} /> Today's Schedule
            </Text>
            <View style={styles.itineraryCard}>
              <Text style={styles.itineraryTitle}>Day {currentDayItinerary.day}: {currentDayItinerary.title}</Text>
              <Text style={styles.itineraryDesc}>{currentDayItinerary.description}</Text>
              {currentDayItinerary.activities?.map((activity, i) => (
                <View key={i} style={styles.activityRow}>
                  <View style={styles.activityDot} />
                  <Text style={styles.activityText}>{activity}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Full Itinerary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Ionicons name="map-outline" size={18} /> Full Itinerary
          </Text>
          {itinerary?.itinerary?.map((day, index) => (
            <View key={index} style={[styles.dayCard, day.day === currentDay && styles.currentDayCard]}>
              {day.day === currentDay && <Text style={styles.todayBadge}>Today</Text>}
              <Text style={styles.dayTitle}>Day {day.day}: {day.title}</Text>
              <Text style={styles.dayDesc}>{day.description}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#888' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyEmoji: { fontSize: 60, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  emptyText: { color: '#888', textAlign: 'center', marginBottom: 24 },
  browseButton: { backgroundColor: '#ff7f11', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  browseButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  header: { padding: 20, paddingTop: 10 },
  dayBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start', color: '#fff', fontSize: 12, marginBottom: 8 },
  tourTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  bookingId: { color: 'rgba(255,255,255,0.8)', fontSize: 12 },
  quickActions: { flexDirection: 'row', justifyContent: 'center', marginTop: -20, marginBottom: 16, paddingHorizontal: 16 },
  actionCard: { backgroundColor: '#fff', padding: 16, borderRadius: 12, alignItems: 'center', flex: 1, marginHorizontal: 6, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  emergencyCard: { backgroundColor: '#fee2e2' },
  actionIcon: { fontSize: 24, marginBottom: 4 },
  actionLabel: { fontSize: 12, color: '#666' },
  emergencyLabel: { color: '#dc2626' },
  section: { paddingHorizontal: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  detailsCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  detailLabel: { color: '#888' },
  detailValue: { fontWeight: '600', color: '#333' },
  itineraryCard: { backgroundColor: '#fff4e6', borderRadius: 12, padding: 16 },
  itineraryTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  itineraryDesc: { color: '#666', marginBottom: 12 },
  activityRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  activityDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#ff7f11', marginRight: 10 },
  activityText: { color: '#333', flex: 1 },
  dayCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 10 },
  currentDayCard: { borderWidth: 2, borderColor: '#ff7f11' },
  todayBadge: { backgroundColor: '#ff7f11', color: '#fff', fontSize: 10, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 8 },
  dayTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  dayDesc: { color: '#666', fontSize: 13 },
});

export default MyTripScreen;

