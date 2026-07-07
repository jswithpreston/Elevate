import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ProgressScreen() {
  const { activeTheme } = useAppTheme();
  const isDark = activeTheme === 'dark';
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
          <Ionicons name="arrow-back" size={24} color={isDark ? "#F9FAFB" : "#111827"} />
        </TouchableOpacity>
        <Text style={[styles.title, isDark && styles.textDark]}>Progress</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, isDark && styles.cardDark]}>
          <Text style={[styles.cardTitle, isDark && styles.textDarkSecondary]}>AVG. FOCUS TIME</Text>
          <Text style={[styles.value, isDark && styles.textDark]}>--h --m</Text>
        </View>

        <View style={[styles.card, isDark && styles.cardDark]}>
          <Text style={[styles.cardTitle, isDark && styles.textDarkSecondary]}>GOAL COMPLETION RATE</Text>
          <Text style={[styles.value, isDark && styles.textDark]}>--%</Text>
        </View>

        <View style={[styles.emptyState, isDark && styles.emptyStateDark]}>
          <Text style={[styles.emptyStateText, isDark && styles.textDarkSecondary]}>Check back later for detailed stats.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  containerDark: { backgroundColor: '#111827' },
  header: { padding: 24, paddingBottom: 16, flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 32, fontWeight: '700', color: '#111827' },
  textDark: { color: '#F9FAFB' },
  scrollContent: { padding: 24, paddingBottom: 100 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 1 },
  cardDark: { backgroundColor: '#1F2937' },
  cardTitle: { fontSize: 12, color: '#6B7280', fontWeight: '600', letterSpacing: 1, marginBottom: 8 },
  value: { fontSize: 36, fontWeight: '700', color: '#111827' },
  textDarkSecondary: { color: '#9CA3AF' },
  emptyState: { padding: 40, backgroundColor: '#FFFFFF', borderRadius: 16, alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#D1D5DB', marginTop: 16 },
  emptyStateDark: { backgroundColor: '#1F2937', borderColor: '#374151' },
  emptyStateText: { color: '#6B7280', fontSize: 16 },
});
