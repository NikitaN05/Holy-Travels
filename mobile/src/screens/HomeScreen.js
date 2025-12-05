import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import useAuthStore from '../store/authStore';
import { toursAPI, travellersAPI } from '../services/api';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [featuredTours, setFeaturedTours] = useState([]);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [toursRes, tripRes] = await Promise.all([
        toursAPI.getFeatured(),
        travellersAPI.getCurrentTrip().catch(() => ({ data: { data: null } }))
      ]);
      setFeaturedTours(toursRes.data.data || []);
      setCurrentTrip(tripRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const renderTourCard = ({ item }) => (
    <TouchableOpacity
      style={styles.tourCard}
      onPress={() => navigation.navigate('TourDetail', { slug: item.slug })}
    >
      <Image
        source={{ uri: item.images?.[0]?.url || 'https://via.placeholder.com/300' }}
        style={styles.tourImage}
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.tourGradient}
      >
        <Text style={styles.tourTitle}>{item.title?.en}</Text>
        <View style={styles.tourInfo}>
          <Text style={styles.tourDuration}>
            {item.duration?.days}D/{item.duration?.nights}N
          </Text>
          <Text style={styles.tourPrice}>₹{item.price?.amount?.toLocaleString()}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <LinearGradient
          colors={['#ff7f11', '#de5b0f']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View>
              <Text style={styles.greeting}>Namaste! 🙏</Text>
              <Text style={styles.userName}>{user?.name}</Text>
            </View>
            <View style={styles.headerIcons}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => navigation.navigate('Notifications')}
              >
                <Ionicons name="notifications-outline" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.iconButton, styles.emergencyButton]}
                onPress={() => navigation.navigate('Emergency')}
              >
                <Ionicons name="warning" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Current Trip Card */}
        {currentTrip?.tour && (
          <TouchableOpacity
            style={styles.currentTripCard}
            onPress={() => navigation.navigate('MyTrip')}
          >
            <LinearGradient
              colors={['#22c55e', '#16a34a']}
              style={styles.currentTripGradient}
            >
              <Ionicons name="airplane" size={24} color="#fff" />
              <View style={styles.currentTripInfo}>
                <Text style={styles.currentTripLabel}>Current Trip</Text>
                <Text style={styles.currentTripTitle}>{currentTrip.tour.title?.en}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Tours')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#fff4e6' }]}>
              <Text style={{ fontSize: 24 }}>🛕</Text>
            </View>
            <Text style={styles.actionText}>Tours</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Menu')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#e6f7e6' }]}>
              <Text style={{ fontSize: 24 }}>🍽️</Text>
            </View>
            <Text style={styles.actionText}>Menu</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Gallery')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#e6e6ff' }]}>
              <Text style={{ fontSize: 24 }}>📷</Text>
            </View>
            <Text style={styles.actionText}>Gallery</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Polls')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#ffe6f0' }]}>
              <Text style={{ fontSize: 24 }}>🗳️</Text>
            </View>
            <Text style={styles.actionText}>Vote</Text>
          </TouchableOpacity>
        </View>

        {/* Featured Tours */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{t('home.featuredTours')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Tours')}>
              <Text style={styles.viewAll}>{t('home.viewAll')}</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={featuredTours}
            renderItem={renderTourCard}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.toursList}
          />
        </View>

        {/* Hospitality Banner */}
        <View style={styles.hospitalityBanner}>
          <LinearGradient
            colors={['#8b5cf6', '#6d28d9']}
            style={styles.hospitalityGradient}
          >
            <View style={styles.hospitalityContent}>
              <Text style={styles.hospitalityTitle}>Experience Our Hospitality</Text>
              <Text style={styles.hospitalityText}>
                Pure veg food • Comfortable stays • Safe transport
              </Text>
            </View>
            <Text style={styles.hospitalityEmoji}>🙏</Text>
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  userName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  emergencyButton: {
    backgroundColor: '#dc2626',
  },
  currentTripCard: {
    marginHorizontal: 20,
    marginTop: -15,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  currentTripGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  currentTripInfo: {
    flex: 1,
    marginLeft: 12,
  },
  currentTripLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  currentTripTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    color: '#333',
    fontSize: 12,
    fontWeight: '500',
  },
  section: {
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAll: {
    color: '#ff7f11',
    fontWeight: '500',
  },
  toursList: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  tourCard: {
    width: width * 0.7,
    height: 200,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  tourImage: {
    width: '100%',
    height: '100%',
  },
  tourGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  tourTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tourInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tourDuration: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
  tourPrice: {
    color: '#fbbf24',
    fontSize: 14,
    fontWeight: 'bold',
  },
  hospitalityBanner: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  hospitalityGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  hospitalityContent: {
    flex: 1,
  },
  hospitalityTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  hospitalityText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
  },
  hospitalityEmoji: {
    fontSize: 40,
  },
});

export default HomeScreen;

