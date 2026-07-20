import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Visualize Your Future',
    description: 'Set clear intentions and define the peak you want to reach. Clarity is the first step to evolution.',
    icon: 'flag-outline' as const,
  },
  {
    id: '2',
    title: 'Track Your Progress',
    description: 'Monitor your daily habits and see your growth over time. Consistency is the key to mastery.',
    icon: 'bar-chart-outline' as const,
  },
  {
    id: '3',
    title: 'Reach the Summit',
    description: 'Achieve your goals, celebrate your milestones, and elevate your personal growth journey.',
    icon: 'trophy-outline' as const,
  },
];

const AVATAR_OPTIONS = ['🎯', '🚀', '⚡', '🌊', '🔥', '🌟', '💎', '🏔️'];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Profile setup state
  const [fullName, setFullName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🎯');
  const [saving, setSaving] = useState(false);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handleSkip = () => {
    setShowProfileSetup(true);
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      setShowProfileSetup(true);
    }
  };

  const handleSaveProfile = async () => {
    if (saving) return;
    setSaving(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const nameToSave = fullName.trim() || user.email?.split('@')[0] || 'User';
      // Update profile in Supabase
      await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: nameToSave,
          avatar_url: selectedAvatar, // emoji avatar stored as string
          updated_at: new Date().toISOString(),
        });

      // Update auth metadata too
      await supabase.auth.updateUser({
        data: { full_name: nameToSave, avatar_emoji: selectedAvatar },
      });
    }

    setSaving(false);
    router.replace('/(tabs)');
  };

  const renderItem = ({ item }: { item: typeof SLIDES[0] }) => {
    return (
      <View style={styles.slide}>
        <View style={styles.iconCircle}>
          <Ionicons name={item.icon} size={64} color="#0041c8" />
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    );
  };

  if (showProfileSetup) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.profileContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.profileHeader}>
            <Text style={styles.profileTitle}>Make it yours</Text>
            <Text style={styles.profileSubtitle}>
              Set up your profile to personalize your Elevate experience.
            </Text>
          </View>

          {/* Avatar selection */}
          <Text style={styles.sectionLabel}>CHOOSE YOUR AVATAR</Text>
          <View style={styles.avatarGrid}>
            {AVATAR_OPTIONS.map((emoji) => (
              <TouchableOpacity
                key={emoji}
                style={[
                  styles.avatarOption,
                  selectedAvatar === emoji && styles.avatarOptionSelected,
                ]}
                onPress={() => setSelectedAvatar(emoji)}
              >
                <Text style={styles.avatarEmoji}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Selected avatar preview */}
          <View style={styles.avatarPreview}>
            <Text style={styles.avatarPreviewEmoji}>{selectedAvatar}</Text>
          </View>

          {/* Name input */}
          <Text style={styles.sectionLabel}>YOUR NAME</Text>
          <TextInput
            style={styles.nameInput}
            placeholder="Enter your name..."
            placeholderTextColor="#c3c5d9"
            value={fullName}
            onChangeText={setFullName}
            returnKeyType="done"
            onSubmitEditing={handleSaveProfile}
          />

          <TouchableOpacity
            style={[styles.continueBtn, saving && { opacity: 0.7 }]}
            onPress={handleSaveProfile}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.continueBtnText}>Start Your Journey</Text>
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.replace('/(tabs)')} style={styles.skipLink}>
            <Text style={styles.skipLinkText}>Skip for now</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logoText}>Elevate</Text>
        <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Carousel */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfig}
      />

      {/* Footer: Pagination & Next Button */}
      <View style={styles.footer}>
        <View style={styles.paginationContainer}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <Ionicons
            name={currentIndex === SLIDES.length - 1 ? 'checkmark' : 'arrow-forward'}
            size={18}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f6faff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#141d23',
    fontFamily: 'Manrope',
    letterSpacing: -0.5,
  },
  skipBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#e6eff8',
  },
  skipText: {
    fontSize: 14,
    color: '#434656',
    fontWeight: '600',
    fontFamily: 'Manrope',
  },
  slide: {
    width,
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: height * 0.08,
  },
  iconCircle: {
    width: width * 0.55,
    height: width * 0.55,
    borderRadius: (width * 0.55) / 2,
    backgroundColor: '#e9f2fb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 48,
    borderWidth: 1,
    borderColor: '#dbe4ed',
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#141d23',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Manrope',
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 17,
    color: '#434656',
    textAlign: 'center',
    lineHeight: 27,
    fontFamily: 'Manrope',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: 'center',
    gap: 24,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  activeDot: { width: 28, backgroundColor: '#0041c8' },
  inactiveDot: { width: 8, backgroundColor: '#dbe4ed' },
  nextButton: {
    backgroundColor: '#0041c8',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#0041c8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Manrope',
  },

  // Profile setup styles
  profileContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  profileHeader: { marginBottom: 32 },
  profileTitle: {
    fontFamily: 'Manrope',
    fontSize: 36,
    fontWeight: '700',
    color: '#141d23',
    letterSpacing: -0.72,
    marginBottom: 8,
  },
  profileSubtitle: {
    fontFamily: 'Manrope',
    fontSize: 16,
    color: '#434656',
    lineHeight: 24,
  },
  sectionLabel: {
    fontFamily: 'JetBrains Mono',
    fontSize: 11,
    color: '#434656',
    letterSpacing: 1.2,
    marginBottom: 14,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  avatarOption: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: '#ecf5fe',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarOptionSelected: {
    borderColor: '#0041c8',
    backgroundColor: '#e9f2fb',
    shadowColor: '#0041c8',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarEmoji: { fontSize: 28 },
  avatarPreview: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#e9f2fb',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: '#dbe4ed',
  },
  avatarPreviewEmoji: { fontSize: 40 },
  nameInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dbe4ed',
    borderRadius: 16,
    padding: 18,
    fontSize: 17,
    fontFamily: 'Manrope',
    color: '#141d23',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  continueBtn: {
    backgroundColor: '#0041c8',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 16,
    shadowColor: '#0041c8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  continueBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    fontFamily: 'Manrope',
  },
  skipLink: { alignItems: 'center', paddingVertical: 8 },
  skipLinkText: {
    fontFamily: 'Manrope',
    fontSize: 15,
    color: '#737688',
    fontWeight: '500',
  },
});
