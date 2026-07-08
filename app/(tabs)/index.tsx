import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';
import { useStore } from '@/store/useStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { activeTheme } = useAppTheme();
  const isDark = activeTheme === 'dark';
  
  const { tasks, habits } = useStore();
  
  // Format date: THURSDAY, OCT 26
  const dateOpts: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric' };
  const dateStr = new Date().toLocaleDateString('en-US', dateOpts).toUpperCase();

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <Text style={[styles.dateLabel, isDark && styles.textDarkSecondary]}>{dateStr}</Text>
          <Text style={[styles.greeting, isDark && styles.textDark]}>Good morning,{'\n'}Alex.</Text>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressCircleContainer}>
            {/* Mock progress circle - simplified for React Native View */}
            <View style={styles.progressCircle}>
               <Text style={styles.progressValue}>65<Text style={styles.progressPercent}>%</Text></Text>
               <Text style={styles.progressLabel}>Daily Goals Met</Text>
            </View>
          </View>
          <Text style={styles.progressText}>
            You're making solid progress. Maintain focus to complete your primary objectives.
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>TOP PRIORITIES</Text>
        </View>
        
        <View style={styles.prioritiesList}>
          <View style={styles.card}>
            <View style={[styles.iconBox, { backgroundColor: '#0041c8' }]}>
              <Ionicons name="hardware-chip-outline" size={24} color="#fff" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Deep Work</Text>
              <Text style={styles.cardSubtitle}>2 Hours Focused Coding</Text>
            </View>
            <View style={styles.radioEmpty} />
          </View>
          
          <View style={styles.card}>
            <View style={[styles.iconBox, { backgroundColor: '#e1e3e4' }]}>
              <Ionicons name="barbell-outline" size={24} color="#626566" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Exercise</Text>
              <Text style={styles.cardSubtitle}>45 Min Strength Training</Text>
            </View>
            <View style={styles.radioEmpty} />
          </View>
          
          <View style={styles.card}>
            <View style={[styles.iconBox, { backgroundColor: '#e1e3e4' }]}>
              <Ionicons name="book-outline" size={24} color="#626566" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Read</Text>
              <Text style={styles.cardSubtitle}>Chapter 4: System Design</Text>
            </View>
            <View style={styles.radioEmpty} />
          </View>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>HABIT PROGRESS</Text>
          <Text style={styles.editLink}>EDIT</Text>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.habitScroll}>
          <View style={[styles.habitCard, { backgroundColor: '#0041c8' }]}>
            <View style={styles.habitCardHeader}>
              <Ionicons name="water-outline" size={20} color="#fff" />
              <Ionicons name="checkmark-circle" size={20} color="rgba(255,255,255,0.7)" />
            </View>
            <View style={styles.habitCardBottom}>
              <Text style={styles.habitCardTitle}>Hydrate</Text>
              <Text style={styles.habitCardSubtitle}>2L / 2L</Text>
            </View>
          </View>
          
          <View style={[styles.habitCard, { backgroundColor: '#0041c8' }]}>
            <View style={styles.habitCardHeader}>
              <Ionicons name="body-outline" size={20} color="#fff" />
              <Ionicons name="checkmark-circle" size={20} color="rgba(255,255,255,0.7)" />
            </View>
            <View style={styles.habitCardBottom}>
              <Text style={styles.habitCardTitle}>Meditate</Text>
              <Text style={styles.habitCardSubtitle}>10 Mins</Text>
            </View>
          </View>
          
          <View style={[styles.habitCard, { backgroundColor: '#fff', borderColor: '#e1e3e4', borderWidth: 1 }]}>
            <View style={styles.habitCardHeader}>
              <Ionicons name="book-outline" size={20} color="#141d23" />
            </View>
            <View style={styles.habitCardBottom}>
              <Text style={[styles.habitCardTitle, { color: '#141d23' }]}>Journal</Text>
              <Text style={[styles.habitCardSubtitle, { color: '#434656' }]}>Evening</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.tasksContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>UPCOMING TASKS</Text>
            <Text style={styles.editLink}>VIEW ALL</Text>
          </View>
          <View style={styles.taskItem}>
            <View style={styles.radioEmpty} />
            <Text style={styles.taskText}>Review Q3 analytics report</Text>
          </View>
          <View style={styles.taskDivider} />
          <View style={styles.taskItem}>
            <View style={styles.radioEmpty} />
            <Text style={styles.taskText}>Call client regarding scope</Text>
          </View>
        </View>

        <View style={styles.quoteSection}>
          <Text style={styles.quoteText}>"Consistency is what transforms average into excellence."</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6faff' },
  containerDark: { backgroundColor: '#141d23' },
  scrollContent: { paddingHorizontal: 24, paddingVertical: 32, paddingBottom: 120 },
  header: { marginBottom: 32 },
  dateLabel: { fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: '500', letterSpacing: 1.2, color: '#434656', marginBottom: 12 },
  greeting: { fontFamily: 'Manrope', fontSize: 48, fontWeight: '700', lineHeight: 52, color: '#141d23', letterSpacing: -0.96 },
  textDark: { color: '#ffffff' },
  textDarkSecondary: { color: '#c3c5d9' },
  progressSection: { backgroundColor: '#ffffff', borderRadius: 24, padding: 32, alignItems: 'center', marginBottom: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.03, shadowRadius: 40, elevation: 2 },
  progressCircleContainer: { marginBottom: 24 },
  progressCircle: { width: 200, height: 200, borderRadius: 100, borderWidth: 12, borderColor: '#0041c8', alignItems: 'center', justifyContent: 'center', borderTopColor: '#e1e3e4', transform: [{ rotate: '-45deg' }] },
  progressValue: { fontFamily: 'Manrope', fontSize: 48, fontWeight: '700', color: '#141d23', transform: [{ rotate: '45deg' }] },
  progressPercent: { fontSize: 24 },
  progressLabel: { fontFamily: 'JetBrains Mono', fontSize: 12, color: '#434656', marginTop: 4, transform: [{ rotate: '45deg' }] },
  progressText: { fontFamily: 'Manrope', fontSize: 16, color: '#434656', textAlign: 'center', lineHeight: 25.6 },
  sectionHeader: { marginBottom: 16 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: '500', letterSpacing: 1.2, color: '#434656' },
  editLink: { fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: '600', letterSpacing: 1.2, color: '#0041c8' },
  prioritiesList: { marginBottom: 32 },
  card: { backgroundColor: '#ffffff', borderRadius: 24, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.03, shadowRadius: 40, elevation: 2 },
  iconBox: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  cardContent: { flex: 1 },
  cardTitle: { fontFamily: 'Manrope', fontSize: 18, fontWeight: '600', color: '#141d23', marginBottom: 4 },
  cardSubtitle: { fontFamily: 'Manrope', fontSize: 14, color: '#434656' },
  radioEmpty: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#c3c5d9' },
  habitScroll: { marginHorizontal: -24, paddingHorizontal: 24, marginBottom: 32 },
  habitCard: { width: 140, height: 160, borderRadius: 24, padding: 20, justifyContent: 'space-between', marginRight: 16 },
  habitCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  habitCardBottom: {},
  habitCardTitle: { fontFamily: 'Manrope', fontSize: 18, fontWeight: '600', color: '#ffffff', marginBottom: 4 },
  habitCardSubtitle: { fontFamily: 'Manrope', fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  tasksContainer: { backgroundColor: '#f6faff', borderRadius: 24, padding: 24, marginBottom: 32 },
  taskItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  taskText: { fontFamily: 'Manrope', fontSize: 16, color: '#141d23', marginLeft: 16 },
  taskDivider: { height: 1, backgroundColor: '#e1e3e4', marginLeft: 40 },
  quoteSection: { paddingVertical: 24, alignItems: 'center' },
  quoteText: { fontFamily: 'Manrope', fontSize: 16, fontStyle: 'italic', color: '#434656', textAlign: 'center', lineHeight: 25.6 },
});

