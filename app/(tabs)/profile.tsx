import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/store/useStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { activeTheme, theme, setTheme } = useAppTheme();
  const isDark = activeTheme === 'dark';
  
  const [userName, setUserName] = useState('Julian Vance');
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

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      
      <View style={styles.header}>
        <Ionicons name="apps-outline" size={24} color="#0041c8" />
        <Text style={[styles.headerTitle, isDark && styles.textDark]}>Elevate</Text>
        <Ionicons name="notifications-outline" size={24} color="#0041c8" />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {/* Mock avatar */}
            <View style={styles.avatarPlaceholder}>
               <Ionicons name="person" size={60} color="#c3c5d9" />
            </View>
          </View>
          <Text style={[styles.name, isDark && styles.textDark]}>{userName}</Text>
          <View style={styles.badge}>
            <Ionicons name="star-outline" size={12} color="#0041c8" style={{marginRight: 6}} />
            <Text style={styles.badgeText}>LEVEL 12 - GROWTH ARCHITECT</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle-outline" size={24} color="#434656" />
            <Text style={styles.statValue}>842</Text>
            <Text style={styles.statLabel}>TASKS DONE</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="refresh-outline" size={24} color="#434656" />
            <Text style={styles.statValue}>45</Text>
            <Text style={styles.statLabel}>HABITS KEPT</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="flag-outline" size={24} color="#434656" />
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>GOALS MET</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#e9f2fb', borderColor: '#dbe4ed', borderWidth: 1 }]}>
            <Ionicons name="flash-outline" size={24} color="#0041c8" />
            <Text style={[styles.statValue, { color: '#0041c8' }]}>14.2k</Text>
            <Text style={[styles.statLabel, { color: '#0055ff' }]}>TOTAL POINTS</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="settings-outline" size={20} color="#141d23" style={styles.menuIcon} />
              <Text style={styles.menuText}>Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#c3c5d9" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="notifications-outline" size={20} color="#141d23" style={styles.menuIcon} />
              <Text style={styles.menuText}>Notifications</Text>
            </View>
            <View style={styles.menuRight}>
              <View style={styles.notificationBadge}><Text style={styles.notificationBadgeText}>3</Text></View>
              <Ionicons name="chevron-forward" size={16} color="#c3c5d9" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="color-palette-outline" size={20} color="#141d23" style={styles.menuIcon} />
              <Text style={styles.menuText}>Appearance</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#c3c5d9" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="person-outline" size={20} color="#141d23" style={styles.menuIcon} />
              <Text style={styles.menuText}>Account</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#c3c5d9" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="help-circle-outline" size={20} color="#141d23" style={styles.menuIcon} />
              <Text style={styles.menuText}>Help</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#c3c5d9" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={handleLogout}>
            <View style={styles.menuLeft}>
              <Ionicons name="log-out-outline" size={20} color="#ba1a1a" style={styles.menuIcon} />
              <Text style={[styles.menuText, { color: '#ba1a1a' }]}>Logout</Text>
            </View>
          </TouchableOpacity>

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
  scrollContent: { paddingHorizontal: 24, paddingBottom: 120 },
  profileSection: { alignItems: 'center', marginBottom: 32 },
  avatarContainer: { width: 120, height: 120, borderRadius: 60, padding: 4, backgroundColor: '#ffffff', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2, marginBottom: 16, alignItems: 'center', justifyContent: 'center' },
  avatarPlaceholder: { width: 112, height: 112, borderRadius: 56, backgroundColor: '#e1e3e4', alignItems: 'center', justifyContent: 'center' },
  name: { fontFamily: 'Manrope', fontSize: 24, fontWeight: '600', color: '#141d23', marginBottom: 12 },
  badge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e9f2fb', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  badgeText: { fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: '600', color: '#0041c8', letterSpacing: 1.2 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 32 },
  statCard: { width: '48%', backgroundColor: '#ffffff', borderRadius: 24, padding: 24, alignItems: 'center', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.02, shadowRadius: 40, elevation: 2 },
  statValue: { fontFamily: 'Manrope', fontSize: 48, fontWeight: '700', color: '#141d23', marginVertical: 8, letterSpacing: -0.96 },
  statLabel: { fontFamily: 'JetBrains Mono', fontSize: 10, fontWeight: '500', color: '#141d23', letterSpacing: 1.2 },
  menuContainer: { backgroundColor: '#ffffff', borderRadius: 24, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.02, shadowRadius: 40, elevation: 2 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, paddingHorizontal: 8 },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  menuIcon: { marginRight: 16 },
  menuText: { fontFamily: 'Manrope', fontSize: 16, color: '#141d23', fontWeight: '400' },
  menuRight: { flexDirection: 'row', alignItems: 'center' },
  notificationBadge: { backgroundColor: '#0041c8', borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  notificationBadgeText: { fontFamily: 'Manrope', fontSize: 12, fontWeight: '700', color: '#ffffff' },
  menuDivider: { height: 1, backgroundColor: '#f6faff', marginVertical: 8 },
});
