import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { menuAPI } from '../services/api';

const MenuScreen = () => {
  const { t } = useTranslation();
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const res = await menuAPI.getToday();
      setMenu(res.data.data);
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const mealTypes = [
    { key: 'breakfast', icon: '🍳', label: t('menu.breakfast'), time: '7:00 - 9:00 AM' },
    { key: 'lunch', icon: '🍱', label: t('menu.lunch'), time: '12:30 - 2:30 PM' },
    { key: 'dinner', icon: '🍽️', label: t('menu.dinner'), time: '7:30 - 9:30 PM' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.emoji}>🍽️</Text>
        <Text style={styles.headerTitle}>{t('menu.today')}</Text>
        <Text style={styles.date}>
          {new Date().toLocaleDateString('en-IN', {
            weekday: 'long',
            day: 'numeric',
            month: 'long'
          })}
        </Text>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchMenu} />}
      >
        {menu ? (
          mealTypes.map((meal) => (
            <View key={meal.key} style={styles.mealCard}>
              <View style={styles.mealHeader}>
                <Text style={styles.mealIcon}>{meal.icon}</Text>
                <View>
                  <Text style={styles.mealTitle}>{meal.label}</Text>
                  <Text style={styles.mealTime}>{menu[meal.key]?.timing?.start || meal.time}</Text>
                </View>
              </View>
              <View style={styles.mealItems}>
                {menu[meal.key]?.items?.length > 0 ? (
                  menu[meal.key].items.map((item, i) => (
                    <View key={i} style={styles.itemRow}>
                      <View style={[styles.itemDot, { backgroundColor: item.type === 'veg' ? '#22c55e' : '#dc2626' }]} />
                      <Text style={styles.itemName}>{item.name?.en || item.name}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noItems}>Menu not available</Text>
                )}
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📋</Text>
            <Text style={styles.emptyText}>No menu available for today</Text>
          </View>
        )}

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#22c55e' }]} />
            <Text style={styles.legendText}>Vegetarian</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#dc2626' }]} />
            <Text style={styles.legendText}>Non-Vegetarian</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#22c55e', padding: 20, alignItems: 'center' },
  emoji: { fontSize: 40, marginBottom: 8 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  date: { color: 'rgba(255,255,255,0.8)' },
  content: { flex: 1, padding: 16 },
  mealCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  mealHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  mealIcon: { fontSize: 36, marginRight: 12 },
  mealTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  mealTime: { color: '#888', fontSize: 12 },
  mealItems: {},
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  itemDot: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
  itemName: { color: '#333', fontSize: 15 },
  noItems: { color: '#888', fontStyle: 'italic' },
  emptyContainer: { alignItems: 'center', paddingVertical: 60 },
  emptyEmoji: { fontSize: 60, marginBottom: 16 },
  emptyText: { color: '#888', fontSize: 16 },
  legend: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 20 },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16 },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  legendText: { color: '#666', fontSize: 12 },
});

export default MenuScreen;

