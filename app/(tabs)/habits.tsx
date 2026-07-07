import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';
import { useStore } from '@/store/useStore';
import { Ionicons } from '@expo/vector-icons';

export default function HabitsScreen() {
  const { activeTheme } = useAppTheme();
  const isDark = activeTheme === 'dark';
  
  const { habits, addHabit, completeHabit, deleteHabit } = useStore();
  const [newHabitTitle, setNewHabitTitle] = useState('');

  const handleAddHabit = () => {
    if (newHabitTitle.trim()) {
      addHabit(newHabitTitle.trim());
      setNewHabitTitle('');
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Text style={[styles.title, isDark && styles.textDark]}>Habits</Text>
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          placeholder="Add a new habit..."
          placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
          value={newHabitTitle}
          onChangeText={setNewHabitTitle}
          onSubmitEditing={handleAddHabit}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddHabit}>
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {habits.length === 0 ? (
          <View style={[styles.emptyState, isDark && styles.emptyStateDark]}>
            <Text style={[styles.emptyStateText, isDark && styles.textDarkSecondary]}>Start building consistency today.</Text>
          </View>
        ) : (
          habits.map(habit => {
            const completedToday = habit.last_completed_date === today;
            return (
              <View key={habit.id} style={[styles.habitItem, isDark && styles.habitItemDark]}>
                <View style={styles.habitInfo}>
                  <Text style={[styles.habitTitle, isDark && styles.textDark]}>{habit.title}</Text>
                  <View style={styles.streakContainer}>
                    <Ionicons name="flame" size={16} color="#F59E0B" />
                    <Text style={[styles.streakText, isDark && styles.textDarkSecondary]}>
                      {habit.streak} day streak
                    </Text>
                  </View>
                </View>
                <View style={styles.actionsContainer}>
                  <TouchableOpacity 
                    style={[styles.checkButton, completedToday && styles.checkButtonCompleted]} 
                    onPress={() => completeHabit(habit.id, habit.streak, habit.last_completed_date)}
                    disabled={completedToday}
                  >
                    <Ionicons name="checkmark" size={20} color={completedToday ? "#FFF" : "#9CA3AF"} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteHabit(habit.id)} style={styles.deleteButton}>
                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  containerDark: { backgroundColor: '#111827' },
  header: { padding: 24, paddingBottom: 16, alignItems: 'flex-start' },
  title: { fontSize: 32, fontWeight: '700', color: '#111827' },
  textDark: { color: '#F9FAFB' },
  inputContainer: { flexDirection: 'row', paddingHorizontal: 24, marginBottom: 16, gap: 12 },
  input: { flex: 1, backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, borderWidth: 1, borderColor: '#E5E7EB', color: '#111827' },
  inputDark: { backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' },
  addButton: { backgroundColor: '#10B981', borderRadius: 12, width: 48, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 24, paddingBottom: 100 },
  habitItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  habitItemDark: { backgroundColor: '#1F2937' },
  habitInfo: { flex: 1 },
  habitTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 4 },
  streakContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  streakText: { fontSize: 14, color: '#6B7280' },
  actionsContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  checkButton: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, borderColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF' },
  checkButtonCompleted: { backgroundColor: '#10B981', borderColor: '#10B981' },
  deleteButton: { padding: 8 },
  emptyState: { padding: 40, backgroundColor: '#FFFFFF', borderRadius: 16, alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#D1D5DB' },
  emptyStateDark: { backgroundColor: '#1F2937', borderColor: '#374151' },
  emptyStateText: { color: '#6B7280', fontSize: 16 },
  textDarkSecondary: { color: '#9CA3AF' },
});
