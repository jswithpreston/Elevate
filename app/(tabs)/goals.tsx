import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';
import { useStore } from '@/store/useStore';
import { Ionicons } from '@expo/vector-icons';

export default function GoalsScreen() {
  const { activeTheme } = useAppTheme();
  const isDark = activeTheme === 'dark';
  
  const { goals, addGoal, updateGoalProgress, deleteGoal } = useStore();
  const [newGoalTitle, setNewGoalTitle] = useState('');

  const handleAddGoal = () => {
    if (newGoalTitle.trim()) {
      addGoal(newGoalTitle.trim());
      setNewGoalTitle('');
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Text style={[styles.title, isDark && styles.textDark]}>Goals</Text>
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          placeholder="Add a new goal..."
          placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
          value={newGoalTitle}
          onChangeText={setNewGoalTitle}
          onSubmitEditing={handleAddGoal}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddGoal}>
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {goals.length === 0 ? (
          <View style={[styles.emptyState, isDark && styles.emptyStateDark]}>
            <Text style={[styles.emptyStateText, isDark && styles.textDarkSecondary]}>Define your next major milestone.</Text>
          </View>
        ) : (
          goals.map(goal => (
            <View key={goal.id} style={[styles.goalItem, isDark && styles.goalItemDark]}>
              <View style={styles.goalHeader}>
                <Text style={[styles.goalTitle, isDark && styles.textDark]}>{goal.title}</Text>
                <TouchableOpacity onPress={() => deleteGoal(goal.id)} style={styles.deleteButton}>
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.progressContainer}>
                <View style={styles.progressBarBackground}>
                  <View style={[styles.progressBarFill, { width: `${goal.progress}%` }]} />
                </View>
                <Text style={[styles.progressText, isDark && styles.textDarkSecondary]}>{goal.progress}%</Text>
              </View>

              <View style={styles.progressActions}>
                <TouchableOpacity 
                  style={[styles.progressButton, isDark && styles.progressButtonDark]}
                  onPress={() => updateGoalProgress(goal.id, Math.max(0, goal.progress - 10))}
                >
                  <Ionicons name="remove" size={20} color={isDark ? "#F9FAFB" : "#111827"} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.progressButton, isDark && styles.progressButtonDark]}
                  onPress={() => updateGoalProgress(goal.id, Math.min(100, goal.progress + 10))}
                >
                  <Ionicons name="add" size={20} color={isDark ? "#F9FAFB" : "#111827"} />
                </TouchableOpacity>
              </View>
            </View>
          ))
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
  addButton: { backgroundColor: '#8B5CF6', borderRadius: 12, width: 48, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 24, paddingBottom: 100 },
  goalItem: { backgroundColor: '#FFF', padding: 16, borderRadius: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 3 },
  goalItemDark: { backgroundColor: '#1F2937' },
  goalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  goalTitle: { fontSize: 18, fontWeight: '600', color: '#111827', flex: 1 },
  deleteButton: { padding: 4 },
  progressContainer: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  progressBarBackground: { flex: 1, height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#8B5CF6', borderRadius: 4 },
  progressText: { fontSize: 14, fontWeight: '600', color: '#6B7280', width: 40, textAlign: 'right' },
  progressActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  progressButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  progressButtonDark: { backgroundColor: '#374151' },
  emptyState: { padding: 40, backgroundColor: '#FFFFFF', borderRadius: 16, alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#D1D5DB' },
  emptyStateDark: { backgroundColor: '#1F2937', borderColor: '#374151' },
  emptyStateText: { color: '#6B7280', fontSize: 16 },
  textDarkSecondary: { color: '#9CA3AF' },
});
