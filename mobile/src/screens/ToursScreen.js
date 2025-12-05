import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, TextInput, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { toursAPI } from '../services/api';

const ToursScreen = ({ navigation }) => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    fetchTours();
  }, [category]);

  const fetchTours = async () => {
    try {
      const res = await toursAPI.getAll({ category, search });
      setTours(res.data.data.tours || []);
    } catch (error) {
      console.error('Error fetching tours:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: '', label: 'All', icon: '✨' },
    { id: 'pilgrimage', label: 'Pilgrimage', icon: '🛕' },
    { id: 'historic', label: 'Historic', icon: '🏰' },
    { id: 'cultural', label: 'Cultural', icon: '🎭' }
  ];

  const renderTour = ({ item }) => (
    <TouchableOpacity
      style={styles.tourCard}
      onPress={() => navigation.navigate('TourDetail', { slug: item.slug })}
    >
      <Image
        source={{ uri: item.images?.[0]?.url || 'https://via.placeholder.com/400' }}
        style={styles.tourImage}
      />
      <View style={styles.tourInfo}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <Text style={styles.tourTitle}>{item.title?.en}</Text>
        <View style={styles.tourDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={14} color="#666" />
            <Text style={styles.detailText}>{item.duration?.days}D/{item.duration?.nights}N</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="star" size={14} color="#fbbf24" />
            <Text style={styles.detailText}>{item.averageRating?.toFixed(1) || '4.5'}</Text>
          </View>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>From</Text>
          <Text style={styles.price}>₹{item.price?.amount?.toLocaleString()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Explore Tours</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search tours..."
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={fetchTours}
        />
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.categoryChip, category === item.id && styles.categoryChipActive]}
              onPress={() => setCategory(item.id)}
            >
              <Text style={styles.categoryEmoji}>{item.icon}</Text>
              <Text style={[styles.categoryLabel, category === item.id && styles.categoryLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={tours}
        renderItem={renderTour}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchTours} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tours found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { padding: 20, backgroundColor: '#fff' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 16 },
  categoriesContainer: { paddingHorizontal: 16, marginBottom: 8 },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  categoryChipActive: { backgroundColor: '#ff7f11', borderColor: '#ff7f11' },
  categoryEmoji: { marginRight: 6, fontSize: 16 },
  categoryLabel: { color: '#333', fontWeight: '500' },
  categoryLabelActive: { color: '#fff' },
  listContent: { padding: 16 },
  tourCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tourImage: { width: '100%', height: 180 },
  tourInfo: { padding: 16 },
  categoryBadge: {
    backgroundColor: '#fff4e6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  categoryText: { color: '#ff7f11', fontSize: 12, fontWeight: '500', textTransform: 'capitalize' },
  tourTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  tourDetails: { flexDirection: 'row', marginBottom: 12 },
  detailItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  detailText: { color: '#666', fontSize: 13, marginLeft: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'center' },
  priceLabel: { color: '#888', fontSize: 12, marginRight: 4 },
  price: { fontSize: 20, fontWeight: 'bold', color: '#ff7f11' },
  emptyContainer: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { color: '#888', fontSize: 16 },
});

export default ToursScreen;

