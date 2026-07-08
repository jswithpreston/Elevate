import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';
import { useStore } from '@/store/useStore';
import { Ionicons } from '@expo/vector-icons';

export default function HabitsScreen() {
  const { activeTheme } = useAppTheme();
  const isDark = activeTheme === 'dark';
  
  const { habits } = useStore();

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      
      <View style={styles.header}>
        <Ionicons name="apps-outline" size={24} color="#0041c8" />
        <Text style={[styles.headerTitle, isDark && styles.textDark]}>Elevate</Text>
        <Ionicons name="notifications-outline" size={24} color="#0041c8" />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={[styles.pageTitle, isDark && styles.textDark]}>Habits</Text>
        <Text style={[styles.pageSubtitle, isDark && styles.textDarkSecondary]}>Stay consistent, see results.</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>TOTAL COMPLETIONS</Text>
            <Text style={styles.statValue}>342</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>BEST STREAK</Text>
            <Text style={styles.statValue}>28</Text>
          </View>
        </View>

        <View style={styles.weekCard}>
          <View style={styles.weekHeaderRow}>
            <Text style={styles.weekTitle}>This Week</Text>
            <View style={styles.weekDateBox}>
              <Text style={styles.weekDateText}>OCT 16 - 22</Text>
              <Ionicons name="calendar-outline" size={16} color="#0041c8" style={{marginLeft: 8}} />
            </View>
          </View>
          <View style={styles.daysRow}>
            {/* Just mocking the days to match visual for now */}
            <View style={styles.dayCol}>
              <Text style={styles.dayName}>S</Text>
              <View style={styles.dayCirclePast}><View style={styles.dayDot} /></View>
            </View>
            <View style={styles.dayCol}>
              <Text style={styles.dayName}>M</Text>
              <View style={styles.dayCirclePast}><View style={styles.dayDot} /></View>
            </View>
            <View style={styles.dayCol}>
              <Text style={styles.dayName}>T</Text>
              <View style={styles.dayCircleMissed}><View style={styles.dayDotMissed} /></View>
            </View>
            <View style={styles.dayCol}>
              <Text style={[styles.dayName, {color: '#0041c8', fontWeight: '700'}]}>W</Text>
              <View style={styles.dayCircleActive}><Text style={styles.dayActiveText}>19</Text></View>
            </View>
            <View style={styles.dayCol}>
              <Text style={styles.dayName}>T</Text>
              <View style={styles.dayCircleFuture}><Text style={styles.dayFutureText}>20</Text></View>
            </View>
            <View style={styles.dayCol}>
              <Text style={styles.dayName}>F</Text>
              <View style={styles.dayCircleFuture}><Text style={styles.dayFutureText}>21</Text></View>
            </View>
          </View>
        </View>

        <View style={styles.habitCard}>
          <View style={[styles.habitIconBox, { backgroundColor: '#e9f2fb' }]}>
            <Ionicons name="water-outline" size={24} color="#0041c8" />
          </View>
          <View style={styles.habitCardContent}>
            <Text style={styles.habitCardTitle}>Hydration</Text>
            <Text style={styles.habitCardStreak}>12 day streak</Text>
          </View>
          <View style={styles.checkCircleEmpty}>
            <Ionicons name="checkmark" size={20} color="#c3c5d9" />
          </View>
        </View>

        <View style={styles.habitCard}>
          <View style={[styles.habitIconBox, { backgroundColor: '#e9f2fb' }]}>
            <Ionicons name="book-outline" size={24} color="#0041c8" />
          </View>
          <View style={styles.habitCardContent}>
            <Text style={styles.habitCardTitle}>Read 20 Pages</Text>
            <Text style={[styles.habitCardStreak, { color: '#0041c8' }]}>5 day streak</Text>
          </View>
          <View style={styles.checkCircleActive}>
            <Ionicons name="checkmark" size={20} color="#ffffff" />
          </View>
        </View>

        <View style={styles.habitCard}>
          <View style={[styles.habitIconBox, { backgroundColor: '#e9f2fb' }]}>
            <Ionicons name="barbell-outline" size={24} color="#0041c8" />
          </View>
          <View style={styles.habitCardContent}>
            <Text style={styles.habitCardTitle}>Morning Workout</Text>
            <Text style={styles.habitCardStreak}>0 day streak</Text>
          </View>
          <View style={styles.checkCircleEmpty}>
            <Ionicons name="checkmark" size={20} color="#c3c5d9" />
          </View>
        </View>

        <View style={styles.habitCard}>
          <View style={[styles.habitIconBox, { backgroundColor: '#e9f2fb' }]}>
            <Ionicons name="body-outline" size={24} color="#0041c8" />
          </View>
          <View style={styles.habitCardContent}>
            <Text style={styles.habitCardTitle}>Meditation</Text>
            <Text style={styles.habitCardStreak}>2 day streak</Text>
          </View>
          <View style={styles.checkCircleEmpty}>
            <Ionicons name="checkmark" size={20} color="#c3c5d9" />
          </View>
        </View>

      </ScrollView>

      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fabPill}>
          <Ionicons name="add" size={20} color="#0041c8" />
          <Text style={styles.fabText}>NEW HABIT</Text>
        </TouchableOpacity>
      </View>

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
  pageSubtitle: { fontFamily: 'Manrope', fontSize: 18, color: '#434656', marginBottom: 32 },
  statsRow: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: '#ffffff', borderRadius: 16, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 10, elevation: 1 },
  statLabel: { fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: '500', color: '#141d23', letterSpacing: 1.2, marginBottom: 8 },
  statValue: { fontFamily: 'Manrope', fontSize: 24, fontWeight: '700', color: '#0041c8' },
  weekCard: { backgroundColor: '#ffffff', borderRadius: 24, padding: 24, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.03, shadowRadius: 40, elevation: 2 },
  weekHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  weekTitle: { fontFamily: 'Manrope', fontSize: 20, fontWeight: '600', color: '#141d23' },
  weekDateBox: { flexDirection: 'row', alignItems: 'center' },
  weekDateText: { fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: '600', color: '#0041c8', letterSpacing: 1.2 },
  daysRow: { flexDirection: 'row', justifyContent: 'space-between' },
  dayCol: { alignItems: 'center' },
  dayName: { fontFamily: 'JetBrains Mono', fontSize: 12, color: '#434656', marginBottom: 12 },
  dayCirclePast: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#e9f2fb', alignItems: 'center', justifyContent: 'center' },
  dayDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#0041c8' },
  dayCircleMissed: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#e1e3e4', alignItems: 'center', justifyContent: 'center' },
  dayDotMissed: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#c3c5d9' },
  dayCircleActive: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#0041c8', alignItems: 'center', justifyContent: 'center', shadowColor: '#0041c8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 3 },
  dayActiveText: { fontFamily: 'Manrope', fontSize: 16, fontWeight: '700', color: '#ffffff' },
  dayCircleFuture: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#e1e3e4', alignItems: 'center', justifyContent: 'center' },
  dayFutureText: { fontFamily: 'Manrope', fontSize: 16, color: '#c3c5d9' },
  habitCard: { backgroundColor: '#ffffff', borderRadius: 24, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 10, elevation: 1 },
  habitIconBox: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  habitCardContent: { flex: 1 },
  habitCardTitle: { fontFamily: 'Manrope', fontSize: 18, fontWeight: '600', color: '#141d23', marginBottom: 4 },
  habitCardStreak: { fontFamily: 'Manrope', fontSize: 14, color: '#434656' },
  checkCircleEmpty: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: '#dbe4ed', alignItems: 'center', justifyContent: 'center' },
  checkCircleActive: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#0041c8', alignItems: 'center', justifyContent: 'center', shadowColor: '#0041c8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 3 },
  fabContainer: { position: 'absolute', bottom: 32, left: 0, right: 0, alignItems: 'center' },
  fabPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e9f2fb', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 32, borderWidth: 1, borderColor: '#dbe4ed', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  fabText: { fontFamily: 'JetBrains Mono', fontSize: 14, fontWeight: '600', color: '#0041c8', letterSpacing: 1.2, marginLeft: 8 },
});
