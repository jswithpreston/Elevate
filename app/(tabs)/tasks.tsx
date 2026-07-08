import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';
import { useStore } from '@/store/useStore';
import { Ionicons } from '@expo/vector-icons';

export default function TasksScreen() {
  const { activeTheme } = useAppTheme();
  const isDark = activeTheme === 'dark';
  
  const { tasks, addTask, toggleTask } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('All');

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      
      <View style={styles.header}>
        <Ionicons name="apps-outline" size={24} color="#0041c8" />
        <Text style={[styles.headerTitle, isDark && styles.textDark]}>Tasks</Text>
        <Ionicons name="notifications-outline" size={24} color="#0041c8" />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#737688" style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, isDark && styles.searchInputDark]}
          placeholder="Search tasks..."
          placeholderTextColor="#c3c5d9"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.filterRow}>
        {['All', 'Pending', 'Completed'].map(f => (
          <TouchableOpacity 
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.sectionTitle}>MORNING</Text>
        
        <View style={styles.taskCard}>
          <View style={styles.radioEmpty} />
          <View style={styles.taskCardContent}>
            <Text style={styles.taskCardTitle}>Deep Work Session</Text>
            <Text style={styles.taskCardTime}>08:00 AM - 10:00 AM</Text>
          </View>
          <View style={styles.indicatorDot} />
        </View>

        <View style={styles.taskCard}>
          <View style={styles.radioEmpty} />
          <View style={styles.taskCardContent}>
            <Text style={styles.taskCardTitle}>Review Weekly Metrics</Text>
            <Text style={styles.taskCardTime}>10:30 AM</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>AFTERNOON</Text>
        
        <View style={styles.taskCard}>
          <View style={styles.radioEmpty} />
          <View style={styles.taskCardContent}>
            <Text style={styles.taskCardTitle}>Design System Alignment</Text>
            <Text style={styles.taskCardTime}>02:00 PM</Text>
          </View>
          <View style={styles.indicatorDot} />
        </View>
        
      </ScrollView>

      <TouchableOpacity style={styles.fab}>
        <Ionicons name="add" size={32} color="#ffffff" />
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6faff' },
  containerDark: { backgroundColor: '#141d23' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 },
  headerTitle: { fontFamily: 'Manrope', fontSize: 24, fontWeight: '700', color: '#141d23' },
  textDark: { color: '#ffffff' },
  searchContainer: { marginHorizontal: 24, marginBottom: 24, position: 'relative' },
  searchIcon: { position: 'absolute', left: 16, top: 14, zIndex: 1 },
  searchInput: { backgroundColor: '#e9f2fb', borderRadius: 8, paddingLeft: 48, paddingRight: 16, paddingVertical: 12, fontFamily: 'Manrope', fontSize: 16, color: '#141d23', borderWidth: 1, borderColor: '#dbe4ed' },
  searchInputDark: { backgroundColor: '#293138', borderColor: '#434656', color: '#ffffff' },
  filterRow: { flexDirection: 'row', paddingHorizontal: 24, marginBottom: 32, gap: 12 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#e1e3e4', backgroundColor: '#ffffff' },
  filterChipActive: { backgroundColor: '#0041c8', borderColor: '#0041c8' },
  filterText: { fontFamily: 'JetBrains Mono', fontSize: 12, color: '#141d23' },
  filterTextActive: { color: '#ffffff' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 120 },
  sectionTitle: { fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: '500', letterSpacing: 1.2, color: '#737688', marginBottom: 16 },
  taskCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#e1e3e4', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 10, elevation: 1 },
  radioEmpty: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#737688', marginRight: 16 },
  taskCardContent: { flex: 1 },
  taskCardTitle: { fontFamily: 'Manrope', fontSize: 16, fontWeight: '400', color: '#141d23', marginBottom: 4 },
  taskCardTime: { fontFamily: 'JetBrains Mono', fontSize: 12, color: '#737688' },
  indicatorDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#0041c8' },
  fab: { position: 'absolute', bottom: 32, right: 24, width: 64, height: 64, borderRadius: 24, backgroundColor: '#0041c8', alignItems: 'center', justifyContent: 'center', shadowColor: '#0041c8', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 5 },
});
