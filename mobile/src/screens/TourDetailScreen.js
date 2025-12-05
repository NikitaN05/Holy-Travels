import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { toursAPI } from '../services/api';

const { width } = Dimensions.get('window');

const TourDetailScreen = ({ route, navigation }) => {
  const { slug } = route.params;
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTour();
  }, [slug]);

  const fetchTour = async () => {
    try {
      const res = await toursAPI.getBySlug(slug);
      setTour(res.data.data.tour);
    } catch (error) {
      Alert.alert('Error', 'Failed to load tour details');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !tour) {
    return <SafeAreaView style={styles.container}><View style={styles.loadingContainer}><Text>Loading...</Text></View></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView>
        <View style={styles.imageContainer}>
          <Image source={{ uri: tour.images?.[0]?.url || 'https://via.placeholder.com/400' }} style={styles.image} />
          <LinearGradient colors={['rgba(0,0,0,0.5)', 'transparent']} style={styles.imageOverlay}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={styles.content}>
          <View style={styles.categoryBadge}><Text style={styles.categoryText}>{tour.category}</Text></View>
          <Text style={styles.title}>{tour.title?.en}</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}><Ionicons name="time-outline" size={18} color="#ff7f11" /><Text style={styles.infoText}>{tour.duration?.days}D / {tour.duration?.nights}N</Text></View>
            <View style={styles.infoItem}><Ionicons name="star" size={18} color="#fbbf24" /><Text style={styles.infoText}>{tour.averageRating?.toFixed(1) || '4.5'} ({tour.totalReviews || 0})</Text></View>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{tour.description?.en}</Text>

          {tour.destinations?.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Destinations</Text>
              <View style={styles.destinationsRow}>
                {tour.destinations.map((dest, i) => (
                  <View key={i} style={styles.destinationChip}>
                    <Text style={styles.destinationIcon}>{dest.type === 'religious' ? '🛕' : '🏰'}</Text>
                    <Text style={styles.destinationText}>{dest.name}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          <Text style={styles.sectionTitle}>Itinerary</Text>
          {tour.itinerary?.map((day, i) => (
            <View key={i} style={styles.itineraryDay}>
              <View style={styles.dayNumber}><Text style={styles.dayNumberText}>{day.day}</Text></View>
              <View style={styles.dayContent}>
                <Text style={styles.dayTitle}>{day.title}</Text>
                <Text style={styles.dayDesc}>{day.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View><Text style={styles.priceLabel}>Starting from</Text><Text style={styles.price}>₹{tour.price?.amount?.toLocaleString()}</Text></View>
        <TouchableOpacity style={styles.bookButton}><Text style={styles.bookButtonText}>Book Now</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imageContainer: { height: 300, position: 'relative' },
  image: { width: '100%', height: '100%' },
  imageOverlay: { position: 'absolute', top: 0, left: 0, right: 0, padding: 16, paddingTop: 50 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  content: { padding: 20 },
  categoryBadge: { backgroundColor: '#fff4e6', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start', marginBottom: 8 },
  categoryText: { color: '#ff7f11', fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  infoRow: { flexDirection: 'row', marginBottom: 20 },
  infoItem: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  infoText: { marginLeft: 6, color: '#666' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 16, marginBottom: 12 },
  description: { color: '#666', lineHeight: 22 },
  destinationsRow: { flexDirection: 'row', flexWrap: 'wrap' },
  destinationChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 8, marginBottom: 8 },
  destinationIcon: { marginRight: 6 },
  destinationText: { color: '#333' },
  itineraryDay: { flexDirection: 'row', marginBottom: 16 },
  dayNumber: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#ff7f11', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  dayNumberText: { color: '#fff', fontWeight: 'bold' },
  dayContent: { flex: 1 },
  dayTitle: { fontWeight: 'bold', color: '#333', marginBottom: 4 },
  dayDesc: { color: '#666', fontSize: 13 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderTopWidth: 1, borderTopColor: '#f0f0f0', backgroundColor: '#fff' },
  priceLabel: { color: '#888', fontSize: 12 },
  price: { fontSize: 24, fontWeight: 'bold', color: '#ff7f11' },
  bookButton: { backgroundColor: '#ff7f11', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 },
  bookButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default TourDetailScreen;

