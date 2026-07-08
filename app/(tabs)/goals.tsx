import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, ImageBackground } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';
import { useStore } from '@/store/useStore';
import { Ionicons } from '@expo/vector-icons';

export default function GoalsScreen() {
  const { activeTheme } = useAppTheme();
  const isDark = activeTheme === 'dark';
  
  const { goals } = useStore();
  const [filter, setFilter] = useState('Active');

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      
      <View style={styles.header}>
        <Ionicons name="apps-outline" size={24} color="#0041c8" />
        <Text style={[styles.headerTitle, isDark && styles.textDark]}>Elevate</Text>
        <Ionicons name="notifications-outline" size={24} color="#0041c8" />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={[styles.pageTitle, isDark && styles.textDark]}>Goals</Text>
        <Text style={[styles.pageSubtitle, isDark && styles.textDarkSecondary]}>Track your major milestones and stay focused on your long-term vision.</Text>

        <View style={styles.filterRow}>
          {['Active', 'Achieved'].map(f => (
            <TouchableOpacity 
              key={f}
              style={[styles.filterChip, filter === f && styles.filterChipActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.goalCard, { backgroundColor: '#141d23' }]}>
          <View style={styles.goalCardHeader}>
            <View style={styles.goalTag}>
              <Ionicons name="fitness-outline" size={14} color="#ffffff" style={{marginRight: 4}} />
              <Text style={styles.goalTagText}>Health</Text>
            </View>
            <TouchableOpacity style={styles.menuBtn}>
              <Ionicons name="ellipsis-horizontal" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.goalCardBottom}>
            <Text style={styles.goalTitleText}>Run a Full{'\n'}Marathon</Text>
            
            <View style={styles.goalProgressRow}>
              <Text style={styles.goalProgressText}>40% Completed</Text>
              <Text style={styles.goalDateText}>Oct 15, 2024</Text>
            </View>
            
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '40%' }]} />
            </View>
          </View>
        </View>

        <View style={[styles.goalCard, { backgroundColor: '#293138' }]}>
          <View style={styles.goalCardHeader}>
            <View style={styles.goalTag}>
              <Ionicons name="book-outline" size={14} color="#ffffff" style={{marginRight: 4}} />
              <Text style={styles.goalTagText}>Mind</Text>
            </View>
            <TouchableOpacity style={styles.menuBtn}>
              <Ionicons name="ellipsis-horizontal" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.goalCardBottom}>
            <Text style={styles.goalTitleText}>Read 50 Non-{'\n'}Fiction Books</Text>
            
            <View style={styles.goalProgressRow}>
              <Text style={styles.goalProgressText}>65% Completed</Text>
              <Text style={styles.goalDateText}>Dec 31, 2024</Text>
            </View>
            
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '65%' }]} />
            </View>
          </View>
        </View>

        <View style={[styles.goalCard, { backgroundColor: '#1a2b3c' }]}>
          <View style={styles.goalCardHeader}>
            <View style={styles.goalTag}>
              <Ionicons name="rocket-outline" size={14} color="#ffffff" style={{marginRight: 4}} />
              <Text style={styles.goalTagText}>Career</Text>
            </View>
            <TouchableOpacity style={styles.menuBtn}>
              <Ionicons name="ellipsis-horizontal" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.goalCardBottom}>
            <Text style={styles.goalTitleText}>Launch V1 of Tech{'\n'}Startup</Text>
            
            <View style={styles.goalProgressRow}>
              <Text style={styles.goalProgressText}>20% Completed</Text>
              <Text style={styles.goalDateText}>Mar 01, 2025</Text>
            </View>
            
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: '20%' }]} />
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.createCard}>
          <View style={styles.createIconBox}>
            <Ionicons name="add" size={24} color="#0041c8" />
          </View>
          <Text style={styles.createText}>Create New Goal</Text>
        </TouchableOpacity>

      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6faff' },
  containerDark: { backgroundColor: '#141d23' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24 },
  headerTitle: { fontFamily: 'Manrope', fontSize: 20, fontWeight: '700', color: '#141d23' },
  textDark: { color: '#ffffff' },
  textDarkSecondary: { color: '#c3c5d9' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 120 },
  pageTitle: { fontFamily: 'Manrope', fontSize: 48, fontWeight: '700', color: '#141d23', marginBottom: 8, letterSpacing: -0.96 },
  pageSubtitle: { fontFamily: 'Manrope', fontSize: 18, color: '#434656', marginBottom: 24, lineHeight: 28 },
  filterRow: { flexDirection: 'row', backgroundColor: '#e9f2fb', borderRadius: 24, padding: 4, marginBottom: 32, alignSelf: 'flex-start' },
  filterChip: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 },
  filterChipActive: { backgroundColor: '#ffffff', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  filterText: { fontFamily: 'JetBrains Mono', fontSize: 12, color: '#737688', fontWeight: '500', letterSpacing: 1.2 },
  filterTextActive: { color: '#0041c8', fontWeight: '600' },
  goalCard: { height: 280, borderRadius: 24, padding: 24, marginBottom: 16, justifyContent: 'space-between', overflow: 'hidden' },
  goalCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  goalTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  goalTagText: { fontFamily: 'JetBrains Mono', fontSize: 10, color: '#ffffff', letterSpacing: 1.2, fontWeight: '500' },
  menuBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  goalCardBottom: { marginTop: 'auto' },
  goalTitleText: { fontFamily: 'Manrope', fontSize: 32, fontWeight: '600', color: '#ffffff', lineHeight: 36, marginBottom: 24 },
  goalProgressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  goalProgressText: { fontFamily: 'JetBrains Mono', fontSize: 12, color: '#0055ff', fontWeight: '600', letterSpacing: 1.2 },
  goalDateText: { fontFamily: 'JetBrains Mono', fontSize: 12, color: '#0055ff', fontWeight: '600', letterSpacing: 1.2 },
  progressBarBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3 },
  progressBarFill: { height: '100%', backgroundColor: '#0055ff', borderRadius: 3 },
  createCard: { height: 200, borderRadius: 24, borderWidth: 2, borderColor: '#dbe4ed', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  createIconBox: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#e9f2fb', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  createText: { fontFamily: 'Manrope', fontSize: 18, color: '#141d23', fontWeight: '500' },
});
