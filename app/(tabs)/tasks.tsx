import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';
import { useStore } from '@/store/useStore';
import { Ionicons } from '@expo/vector-icons';

export default function TasksScreen() {
  const { activeTheme } = useAppTheme();
  const isDark = activeTheme === 'dark';
  
  const { tasks, addTask, toggleTask, deleteTask } = useStore();
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle.trim());
      setNewTaskTitle('');
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Text style={[styles.title, isDark && styles.textDark]}>Tasks</Text>
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, isDark && styles.inputDark]}
          placeholder="Add a new task..."
          placeholderTextColor={isDark ? '#9CA3AF' : '#6B7280'}
          value={newTaskTitle}
          onChangeText={setNewTaskTitle}
          onSubmitEditing={handleAddTask}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {tasks.length === 0 ? (
          <View style={[styles.emptyState, isDark && styles.emptyStateDark]}>
            <Text style={[styles.emptyStateText, isDark && styles.textDarkSecondary]}>Your tasks list is clean.</Text>
          </View>
        ) : (
          tasks.map(task => (
            <View key={task.id} style={[styles.taskItem, isDark && styles.taskItemDark]}>
              <TouchableOpacity style={styles.taskContent} onPress={() => toggleTask(task.id, task.completed)}>
                <View style={[styles.checkbox, task.completed && styles.checkboxCompleted, isDark && styles.checkboxDark]}>
                  {task.completed && <Ionicons name="checkmark" size={16} color="#FFF" />}
                </View>
                <Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted, isDark && styles.textDark]}>
                  {task.title}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteTask(task.id)} style={styles.deleteButton}>
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
              </TouchableOpacity>
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
  header: { padding: 24, paddingBottom: 16, alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', color: '#111827' },
  textDark: { color: '#F9FAFB' },
  inputContainer: { flexDirection: 'row', paddingHorizontal: 24, marginBottom: 16, gap: 12 },
  input: { flex: 1, backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 16, borderWidth: 1, borderColor: '#E5E7EB', color: '#111827' },
  inputDark: { backgroundColor: '#1F2937', borderColor: '#374151', color: '#F9FAFB' },
  addButton: { backgroundColor: '#3B82F6', borderRadius: 12, width: 48, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 24, paddingBottom: 100 },
  taskItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  taskItemDark: { backgroundColor: '#1F2937' },
  taskContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  checkboxDark: { borderColor: '#4B5563' },
  checkboxCompleted: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
  taskTitle: { fontSize: 16, color: '#111827', flex: 1 },
  taskTitleCompleted: { textDecorationLine: 'line-through', color: '#9CA3AF' },
  deleteButton: { padding: 8 },
  emptyState: { padding: 40, backgroundColor: '#FFFFFF', borderRadius: 16, alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#D1D5DB' },
  emptyStateDark: { backgroundColor: '#1F2937', borderColor: '#374151' },
  emptyStateText: { color: '#6B7280', fontSize: 16 },
  textDarkSecondary: { color: '#9CA3AF' },
});
