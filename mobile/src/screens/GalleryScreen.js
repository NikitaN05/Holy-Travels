import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { galleryAPI } from '../services/api';

const { width } = Dimensions.get('window');
const numColumns = 2;

const GalleryScreen = ({ navigation }) => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const res = await galleryAPI.getAll({});
      setAlbums(res.data.data.albums || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderAlbum = ({ item }) => (
    <TouchableOpacity style={styles.albumCard}>
      <Image source={{ uri: item.coverImage || 'https://via.placeholder.com/200' }} style={styles.albumImage} />
      <View style={styles.albumInfo}>
        <Text style={styles.albumTitle} numberOfLines={1}>{item.title?.en}</Text>
        <View style={styles.albumMeta}>
          <Ionicons name="images-outline" size={12} color="#888" />
          <Text style={styles.albumCount}>{item.totalPhotos} photos</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#333" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Photo Gallery</Text>
        <View style={{ width: 24 }} />
      </View>
      <FlatList
        data={albums}
        renderItem={renderAlbum}
        keyExtractor={(item) => item._id}
        numColumns={numColumns}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyText}>No albums yet</Text></View>}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  listContent: { padding: 8 },
  albumCard: { width: (width - 32) / 2, margin: 4, backgroundColor: '#fff', borderRadius: 12, overflow: 'hidden', elevation: 2 },
  albumImage: { width: '100%', aspectRatio: 1 },
  albumInfo: { padding: 10 },
  albumTitle: { fontWeight: 'bold', color: '#333', marginBottom: 4 },
  albumMeta: { flexDirection: 'row', alignItems: 'center' },
  albumCount: { color: '#888', fontSize: 12, marginLeft: 4 },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyText: { color: '#888' },
});

export default GalleryScreen;

