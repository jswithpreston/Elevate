import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';
import { useStore } from '@/store/useStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { activeTheme } = useAppTheme();
  const isDark = activeTheme === 'dark';
  
  const { tasks, habits, goals } = useStore();
  
  const today = new Date().toISOString().split('T')[0];
  const pendingTasks = tasks.filter(t => !t.completed).length;
  const habitsCompletedToday = habits.filter(h => h.last_completed_date === today).length;
  const totalHabits = habits.length;
  const activeGoals = goals.filter(g => g.progress < 100).length;

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Text style={[styles.greeting, isDark && styles.textDark]}>Hello, Preston 👋</Text>
        <Text style={[styles.subtitle, isDark && styles.textDarkSecondary]}>Here's your summary for today.</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Overview Cards */}
        <View style={styles.cardsGrid}>
          <TouchableOpacity 
            style={[styles.card, styles.tasksCard, isDark && styles.cardDark]}
            onPress={() => router.push('/(tabs)/tasks')}
          >
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
              <Ionicons name="checkbox" size={24} color="#3B82F6" />
            </View>
            <Text style={[styles.cardValue, isDark && styles.textDark]}>{pendingTasks}</Text>
            <Text style={[styles.cardLabel, isDark && styles.textDarkSecondary]}>Pending Tasks</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, styles.habitsCard, isDark && styles.cardDark]}
            onPress={() => router.push('/(tabs)/habits')}
          >
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
              <Ionicons name="leaf" size={24} color="#10B981" />
            </View>
            <Text style={[styles.cardValue, isDark && styles.textDark]}>{habitsCompletedToday} / {totalHabits}</Text>
            <Text style={[styles.cardLabel, isDark && styles.textDarkSecondary]}>Habits Done</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.card, styles.goalsCard, isDark && styles.cardDark]}
            onPress={() => router.push('/(tabs)/goals')}
          >
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
              <Ionicons name="trophy" size={24} color="#8B5CF6" />
            </View>
            <Text style={[styles.cardValue, isDark && styles.textDark]}>{activeGoals}</Text>
            <Text style={[styles.cardLabel, isDark && styles.textDarkSecondary]}>Active Goals</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity or Motivations */}
        <View style={[styles.motivationSection, isDark && styles.motivationSectionDark]}>
          <Ionicons name="rocket-outline" size={32} color="#F59E0B" />
          <Text style={[styles.motivationTitle, isDark && styles.textDark]}>Keep it up!</Text>
          <Text style={[styles.motivationText, isDark && styles.textDarkSecondary]}>
            "Success is the sum of small efforts, repeated day in and day out."
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  containerDark: { backgroundColor: '#111827' },
  header: { padding: 24, paddingBottom: 16 },
  greeting: { fontSize: 32, fontWeight: '700', color: '#111827', marginBottom: 4 },
  subtitle: { fontSize: 16, color: '#6B7280' },
  textDark: { color: '#F9FAFB' },
  textDarkSecondary: { color: '#9CA3AF' },
  scrollContent: { padding: 24, paddingBottom: 100 },
  cardsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 32 },
  card: { flex: 1, minWidth: '45%', backgroundColor: '#FFF', padding: 20, borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 3 },
  cardDark: { backgroundColor: '#1F2937' },
  tasksCard: { borderTopWidth: 4, borderTopColor: '#3B82F6' },
  habitsCard: { borderTopWidth: 4, borderTopColor: '#10B981' },
  goalsCard: { borderTopWidth: 4, borderTopColor: '#8B5CF6' },
  iconContainer: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  cardValue: { fontSize: 28, fontWeight: '700', color: '#111827', marginBottom: 4 },
  cardLabel: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  motivationSection: { backgroundColor: '#FFF', padding: 24, borderRadius: 16, alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#D1D5DB' },
  motivationSectionDark: { backgroundColor: '#1F2937', borderColor: '#374151' },
  motivationTitle: { fontSize: 20, fontWeight: '600', color: '#111827', marginTop: 12, marginBottom: 8 },
  motivationText: { fontSize: 15, color: '#6B7280', textAlign: 'center', lineHeight: 22 },
});
