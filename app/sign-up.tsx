import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';

export default function SignUpScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Focus states
  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password || !name) {
      showToast('Please fill in all fields', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    if (password.length < 8) {
      showToast('Password must be at least 8 characters', 'error');
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: { full_name: name.trim() },
      },
    });

    setLoading(false);

    if (error) {
      showToast(error.message, 'error');
    } else {
      if (data.session) {
        router.replace('/onboarding');
      } else {
        showToast('Check your email for the verification link!', 'success');
        router.push('/login');
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back button */}
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#434656" />
          </TouchableOpacity>

          {/* Branding */}
          <View style={styles.brandContainer}>
            <View style={styles.brandIcon}>
              <Ionicons name="trending-up" size={32} color="#0041c8" />
            </View>
            <Text style={styles.logoText}>Elevate</Text>
            <Text style={styles.tagline}>Your OS for personal growth.</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Start your growth journey today.</Text>

            {/* Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>FULL NAME</Text>
              <View style={[styles.inputWrapper, nameFocused && styles.inputWrapperFocused]}>
                <Ionicons
                  name="person-outline"
                  size={18}
                  color={nameFocused ? '#0041c8' : '#c3c5d9'}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Your name"
                  placeholderTextColor="#c3c5d9"
                  value={name}
                  onChangeText={setName}
                  onFocus={() => setNameFocused(true)}
                  onBlur={() => setNameFocused(false)}
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>EMAIL</Text>
              <View style={[styles.inputWrapper, emailFocused && styles.inputWrapperFocused]}>
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color={emailFocused ? '#0041c8' : '#c3c5d9'}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="your@email.com"
                  placeholderTextColor="#c3c5d9"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>PASSWORD</Text>
              <View style={[styles.inputWrapper, passwordFocused && styles.inputWrapperFocused]}>
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color={passwordFocused ? '#0041c8' : '#c3c5d9'}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Min. 8 characters"
                  placeholderTextColor="#c3c5d9"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color="#c3c5d9"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>CONFIRM PASSWORD</Text>
              <View style={[styles.inputWrapper, confirmFocused && styles.inputWrapperFocused]}>
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color={confirmFocused ? '#0041c8' : '#c3c5d9'}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Re-enter password"
                  placeholderTextColor="#c3c5d9"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirm}
                  onFocus={() => setConfirmFocused(true)}
                  onBlur={() => setConfirmFocused(false)}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirm(!showConfirm)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color="#c3c5d9"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.primaryButtonLoading]}
              onPress={handleSignUp}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Text style={styles.primaryButtonText}>Create Account</Text>
                  <Ionicons name="arrow-forward" size={18} color="#fff" />
                </>
              )}
            </TouchableOpacity>

            {/* Terms note */}
            <Text style={styles.termsText}>
              By creating an account you agree to our Terms of Service and Privacy Policy.
            </Text>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>HAVE AN ACCOUNT?</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.secondaryButtonText}>Sign In Instead</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f6faff' },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#ecf5fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  brandIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#e9f2fb',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#dbe4ed',
  },
  logoText: {
    fontFamily: 'Manrope',
    fontSize: 32,
    fontWeight: '700',
    color: '#141d23',
    letterSpacing: -0.64,
    marginBottom: 4,
  },
  tagline: {
    fontFamily: 'Manrope',
    fontSize: 15,
    color: '#737688',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f3f8',
  },
  title: {
    fontFamily: 'Manrope',
    fontSize: 26,
    fontWeight: '700',
    color: '#141d23',
    marginBottom: 4,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontFamily: 'Manrope',
    fontSize: 15,
    color: '#737688',
    marginBottom: 28,
  },
  inputGroup: { marginBottom: 20 },
  label: {
    fontFamily: 'JetBrains Mono',
    fontSize: 11,
    fontWeight: '600',
    color: '#434656',
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6faff',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#dbe4ed',
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  inputWrapperFocused: {
    borderColor: '#0041c8',
    backgroundColor: '#ffffff',
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    fontFamily: 'Manrope',
    fontSize: 16,
    color: '#141d23',
    paddingVertical: 13,
  },
  primaryButton: {
    backgroundColor: '#0041c8',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#0041c8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryButtonLoading: { opacity: 0.8 },
  primaryButtonText: {
    fontFamily: 'Manrope',
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  termsText: {
    fontFamily: 'Manrope',
    fontSize: 12,
    color: '#c3c5d9',
    textAlign: 'center',
    marginTop: 14,
    lineHeight: 18,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    gap: 12,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#e6eff8' },
  dividerText: {
    fontFamily: 'JetBrains Mono',
    fontSize: 9,
    color: '#c3c5d9',
    letterSpacing: 1.5,
  },
  secondaryButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#dbe4ed',
    backgroundColor: '#f6faff',
  },
  secondaryButtonText: {
    fontFamily: 'Manrope',
    color: '#141d23',
    fontSize: 16,
    fontWeight: '600',
  },
});
