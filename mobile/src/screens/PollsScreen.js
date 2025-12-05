import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { pollsAPI } from '../services/api';

const PollsScreen = ({ navigation }) => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const res = await pollsAPI.getActive();
      setPolls(res.data.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (pollId, optionIndex) => {
    try {
      await pollsAPI.vote(pollId, optionIndex);
      Alert.alert('Success', 'Your vote has been recorded!');
      fetchPolls();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to vote');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#333" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Vote for Next Trip</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView style={styles.content}>
        {polls.length > 0 ? polls.map((poll) => (
          <View key={poll._id} style={styles.pollCard}>
            <Text style={styles.pollTitle}>{poll.title?.en}</Text>
            <Text style={styles.pollQuestion}>{poll.question?.en}</Text>
            {poll.options?.map((option, i) => {
              const percentage = poll.totalVotes > 0 ? Math.round((option.voteCount / poll.totalVotes) * 100) : 0;
              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.optionButton, poll.hasVoted && styles.optionVoted]}
                  onPress={() => !poll.hasVoted && handleVote(poll._id, i)}
                  disabled={poll.hasVoted}
                >
                  <Text style={styles.optionName}>{option.destination?.name?.en}</Text>
                  {poll.hasVoted && (
                    <View style={styles.progressContainer}>
                      <View style={[styles.progressBar, { width: `${percentage}%` }]} />
                      <Text style={styles.percentage}>{percentage}%</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
            <Text style={styles.pollStats}>{poll.totalVotes} votes</Text>
          </View>
        )) : (
          <View style={styles.empty}><Text style={styles.emptyEmoji}>🗳️</Text><Text style={styles.emptyText}>No active polls</Text></View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#fff' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  content: { padding: 16 },
  pollCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, elevation: 2 },
  pollTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  pollQuestion: { color: '#666', marginBottom: 16 },
  optionButton: { backgroundColor: '#f5f5f5', padding: 16, borderRadius: 12, marginBottom: 10 },
  optionVoted: { backgroundColor: '#f0f0ff' },
  optionName: { fontWeight: '600', color: '#333', marginBottom: 8 },
  progressContainer: { height: 8, backgroundColor: '#e0e0e0', borderRadius: 4, overflow: 'hidden', position: 'relative' },
  progressBar: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: '#8b5cf6', borderRadius: 4 },
  percentage: { position: 'absolute', right: 0, top: -20, fontSize: 12, color: '#666' },
  pollStats: { color: '#888', fontSize: 12, marginTop: 8, textAlign: 'center' },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyEmoji: { fontSize: 60, marginBottom: 16 },
  emptyText: { color: '#888', fontSize: 16 },
});

export default PollsScreen;

