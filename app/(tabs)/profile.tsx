import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/store/useStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { activeTheme, theme, setTheme } = useAppTheme();
  const isDark = activeTheme === 'dark';
  
  const [userName, setUserName] = useState('User');
  const { tasks, habits } = useStore();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user && user.user_metadata?.full_name) {
        setUserName(user.user_metadata.full_name);
      } else if (user?.email) {
        setUserName(user.email.split('@')[0]);
      }
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const toggleTheme = () => {
    // Cycle between light, dark, and system
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const themeLabel = theme === 'system' ? 'System Default' : theme === 'dark' ? 'Dark Mode' : 'Light Mode';
  
  const completedTasksCount = tasks.filter(t => t.completed).length;
  const completedHabitsCount = habits.filter(h => h.streak > 0).length;

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={40} color={isDark ? "#9CA3AF" : "#CBD5E1"} />
          </View>
          <Text style={[styles.name, isDark && styles.textDark]}>{userName}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>LEVEL 12 - GROWTH ARCHITECT</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, isDark && styles.cardDark]}>
            <Text style={[styles.statValue, isDark && styles.textDark]}>{completedTasksCount}</Text>
            <Text style={[styles.statLabel, isDark && styles.textDarkSecondary]}>TASKS DONE</Text>
          </View>
          <View style={[styles.statCard, isDark && styles.cardDark]}>
            <Text style={[styles.statValue, isDark && styles.textDark]}>{completedHabitsCount}</Text>
            <Text style={[styles.statLabel, isDark && styles.textDarkSecondary]}>HABITS KEPT</Text>
          </View>
        </View>

        <View style={[styles.menuContainer, isDark && styles.cardDark]}>
          <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/progress')}>
            <Ionicons name="bar-chart-outline" size={20} color={isDark ? "#F9FAFB" : "#111827"} />
            <Text style={[styles.menuText, isDark && styles.textDark]}>View Progress & Stats</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={toggleTheme}>
            <Ionicons name={isDark ? "moon-outline" : "sunny-outline"} size={20} color={isDark ? "#F9FAFB" : "#111827"} />
            <Text style={[styles.menuText, isDark && styles.textDark]}>Appearance ({themeLabel})</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="settings-outline" size={20} color={isDark ? "#F9FAFB" : "#111827"} />
            <Text style={[styles.menuText, isDark && styles.textDark]}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text style={[styles.menuText, { color: '#EF4444' }]}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  containerDark: { backgroundColor: '#111827' },
  scrollContent: { padding: 24, paddingBottom: 100 },
  header: { alignItems: 'center', marginBottom: 32 },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginBottom: 16, borderWidth: 4, borderColor: '#FFFFFF' },
  name: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 8 },
  badge: { backgroundColor: '#EFF6FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 100 },
  badgeText: { color: '#3B82F6', fontSize: 12, fontWeight: '600', letterSpacing: 1 },
  textDark: { color: '#F9FAFB' },
  textDarkSecondary: { color: '#9CA3AF' },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 32 },
  statCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, alignItems: 'center', marginHorizontal: 4, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 1 },
  cardDark: { backgroundColor: '#1F2937' },
  statValue: { fontSize: 28, fontWeight: '700', color: '#111827', marginBottom: 4 },
  statLabel: { fontSize: 10, color: '#6B7280', fontWeight: '600', letterSpacing: 1 },
  menuContainer: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 8, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  menuText: { fontSize: 16, color: '#111827', marginLeft: 16 },
});
