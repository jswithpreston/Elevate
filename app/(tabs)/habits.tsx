import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';

export default function HabitsScreen() {
  const { activeTheme } = useAppTheme();
  const isDark = activeTheme === 'dark';

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <View style={styles.header}>
        <Text style={[styles.title, isDark && styles.textDark]}>Habits</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.emptyState, isDark && styles.emptyStateDark]}>
          <Text style={[styles.emptyStateText, isDark && styles.textDarkSecondary]}>Start building consistency today.</Text>
        </View>
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
  scrollContent: { padding: 24, paddingBottom: 100 },
  emptyState: { padding: 40, backgroundColor: '#FFFFFF', borderRadius: 16, alignItems: 'center', borderStyle: 'dashed', borderWidth: 1, borderColor: '#D1D5DB' },
  emptyStateDark: { backgroundColor: '#1F2937', borderColor: '#374151' },
  emptyStateText: { color: '#6B7280', fontSize: 16 },
  textDarkSecondary: { color: '#9CA3AF' },
});
