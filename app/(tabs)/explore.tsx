import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function ProgressScreen() {
  const { activeTheme } = useAppTheme();
  const isDark = activeTheme === 'dark';
  const [filter, setFilter] = useState('Week');

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      
      <View style={styles.header}>
        <Ionicons name="apps-outline" size={24} color="#0041c8" />
        <Text style={[styles.headerTitle, isDark && styles.textDark]}>Elevate</Text>
        <Ionicons name="notifications-outline" size={24} color="#0041c8" />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={[styles.pageTitle, isDark && styles.textDark]}>Progress</Text>
        <Text style={[styles.pageSubtitle, isDark && styles.textDarkSecondary]}>Track your evolution across all domains.</Text>

        <View style={styles.filterRow}>
          {['Week', 'Month', 'Year'].map(f => (
            <TouchableOpacity 
              key={f}
              style={[styles.filterChip, filter === f && styles.filterChipActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>AVG. FOCUS TIME</Text>
          <View style={styles.cardRow}>
            <Text style={styles.largeValue}>4h 12m</Text>
            <View style={styles.trendBox}>
              <Ionicons name="trending-up" size={16} color="#0041c8" />
              <Text style={styles.trendText}>+15%</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>GOAL COMPLETION RATE</Text>
          <View style={styles.cardRow}>
            <Text style={styles.largeValue}>84%</Text>
            <Text style={styles.targetText}>Target: 90%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '84%' }]} />
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>TASKS COMPLETED PER DAY</Text>
            <Ionicons name="bar-chart" size={20} color="#141d23" />
          </View>
          <View style={styles.barChartContainer}>
            {/* Mock Y Axis */}
            <View style={styles.yAxis}>
              <Text style={styles.axisText}>25</Text>
              <Text style={styles.axisText}>20</Text>
              <Text style={styles.axisText}>15</Text>
              <Text style={styles.axisText}>10</Text>
              <Text style={styles.axisText}>5</Text>
              <Text style={styles.axisText}>0</Text>
            </View>
            
            {/* Mock Bars */}
            <View style={styles.barsArea}>
              {/* Grid lines */}
              <View style={[styles.gridLine, { bottom: '100%' }]} />
              <View style={[styles.gridLine, { bottom: '80%' }]} />
              <View style={[styles.gridLine, { bottom: '60%' }]} />
              <View style={[styles.gridLine, { bottom: '40%' }]} />
              <View style={[styles.gridLine, { bottom: '20%' }]} />
              <View style={[styles.gridLine, { bottom: '0%' }]} />

              <View style={styles.barCol}><View style={[styles.bar, { height: '48%' }]} /><Text style={styles.barLabel}>Mon</Text></View>
              <View style={styles.barCol}><View style={[styles.bar, { height: '76%' }]} /><Text style={styles.barLabel}>Tue</Text></View>
              <View style={styles.barCol}><View style={[styles.bar, { height: '60%' }]} /><Text style={styles.barLabel}>Wed</Text></View>
              <View style={styles.barCol}><View style={[styles.bar, { height: '100%' }]} /><Text style={styles.barLabel}>Thu</Text></View>
              <View style={styles.barCol}><View style={[styles.bar, { height: '88%' }]} /><Text style={styles.barLabel}>Fri</Text></View>
              <View style={styles.barCol}><View style={[styles.bar, { height: '40%' }]} /><Text style={styles.barLabel}>Sat</Text></View>
              <View style={styles.barCol}><View style={[styles.bar, { height: '32%' }]} /><Text style={styles.barLabel}>Sun</Text></View>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>GROWTH PILLARS</Text>
            <Ionicons name="scan-outline" size={20} color="#141d23" />
          </View>
          <View style={styles.chartPlaceholder}>
            <Ionicons name="analytics-outline" size={80} color="#e1e3e4" />
            <Text style={styles.chartPlaceholderText}>Radar Chart Preview</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardLabel}>HABIT CONSISTENCY</Text>
            <Ionicons name="stats-chart" size={20} color="#141d23" />
          </View>
          <View style={styles.chartPlaceholder}>
            <Ionicons name="trending-up-outline" size={80} color="#e1e3e4" />
            <Text style={styles.chartPlaceholderText}>Line Chart Preview</Text>
          </View>
        </View>

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
  pageSubtitle: { fontFamily: 'Manrope', fontSize: 18, color: '#434656', marginBottom: 24 },
  filterRow: { flexDirection: 'row', backgroundColor: '#e9f2fb', borderRadius: 24, padding: 4, marginBottom: 32 },
  filterChip: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 20 },
  filterChipActive: { backgroundColor: '#0041c8', shadowColor: '#0041c8', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 3 },
  filterText: { fontFamily: 'JetBrains Mono', fontSize: 12, color: '#434656', fontWeight: '500', letterSpacing: 1.2 },
  filterTextActive: { color: '#ffffff', fontWeight: '600' },
  card: { backgroundColor: '#ffffff', borderRadius: 24, padding: 24, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.02, shadowRadius: 40, elevation: 2 },
  cardLabel: { fontFamily: 'JetBrains Mono', fontSize: 12, color: '#141d23', fontWeight: '500', letterSpacing: 1.2, marginBottom: 16 },
  cardRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 12, marginBottom: 8 },
  largeValue: { fontFamily: 'Manrope', fontSize: 48, fontWeight: '700', color: '#141d23', letterSpacing: -0.96 },
  trendBox: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  trendText: { fontFamily: 'Manrope', fontSize: 16, fontWeight: '600', color: '#0041c8', marginLeft: 4 },
  targetText: { fontFamily: 'Manrope', fontSize: 16, color: '#434656', marginBottom: 12 },
  progressBarBg: { height: 6, backgroundColor: '#dbe4ed', borderRadius: 3, marginTop: 16 },
  progressBarFill: { height: '100%', backgroundColor: '#0041c8', borderRadius: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  barChartContainer: { flexDirection: 'row', height: 240, paddingTop: 16 },
  yAxis: { justifyContent: 'space-between', paddingRight: 16, paddingBottom: 24 },
  axisText: { fontFamily: 'Manrope', fontSize: 12, color: '#737688' },
  barsArea: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: 24, position: 'relative' },
  gridLine: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: '#f6faff' },
  barCol: { alignItems: 'center', height: '100%', justifyContent: 'flex-end', width: '10%' },
  bar: { width: '100%', backgroundColor: '#0041c8', borderRadius: 4 },
  barLabel: { fontFamily: 'Manrope', fontSize: 10, color: '#737688', position: 'absolute', bottom: -24 },
  chartPlaceholder: { height: 200, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f6faff', borderRadius: 16, borderWidth: 1, borderColor: '#e1e3e4', borderStyle: 'dashed' },
  chartPlaceholderText: { fontFamily: 'Manrope', fontSize: 14, color: '#737688', marginTop: 12 },
});
