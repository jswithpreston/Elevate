import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SetNewPasswordScreen() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Simple validation checks
  const hasEightChars = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const CheckItem = ({ label, checked }: { label: string; checked: boolean }) => (
    <View style={styles.checkItem}>
      <Ionicons 
        name="checkmark-circle-outline" 
        size={18} 
        color={checked ? "#3B82F6" : "#9CA3AF"} 
      />
      <Text style={[styles.checkText, checked && styles.checkTextActive]}>{label}</Text>
    </View>
  );

  const handleReset = () => {
    // Navigate back to login after password reset
    router.dismissAll();
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.card}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>

          <Text style={styles.title}>Set New Password</Text>
          <Text style={styles.subtitle}>Secure your account with a new password.</Text>

          {/* Current password removed as per user request */}

          {/* New Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>New Password</Text>
            <View style={styles.passwordInputWrapper}>
              <TextInput
                style={[styles.input, { flex: 1, borderBottomWidth: 0, paddingVertical: 0 }]}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#A0A0A0" />
              </TouchableOpacity>
            </View>
            <View style={styles.inputBorder} />
          </View>

          {/* Confirm New Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm New Password</Text>
            <View style={styles.passwordInputWrapper}>
              <TextInput
                style={[styles.input, { flex: 1, borderBottomWidth: 0, paddingVertical: 0 }]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                <Ionicons name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#A0A0A0" />
              </TouchableOpacity>
            </View>
            <View style={styles.inputBorder} />
          </View>

          {/* Validation Checklist */}
          <View style={styles.checklistContainer}>
            <CheckItem label="At least 8 characters" checked={hasEightChars} />
            <CheckItem label="One number" checked={hasNumber} />
            <CheckItem label="One special character" checked={hasSpecialChar} />
          </View>

          {/* Reset Password Button (Text changed based on action) */}
          <TouchableOpacity style={styles.primaryButton} onPress={handleReset}>
            <Text style={styles.primaryButtonText}>Reset Password</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelButtonText}>CANCEL</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  backButton: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '400',
    color: '#111827',
    marginBottom: 8,
  },
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  input: {
    fontSize: 16,
    color: '#111827',
  },
  inputBorder: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  eyeIcon: {
    padding: 4,
  },
  checklistContainer: {
    marginBottom: 40,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B7280',
  },
  checkTextActive: {
    color: '#374151',
  },
  primaryButton: {
    backgroundColor: '#3B82F6', // Light blue
    borderRadius: 100,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    letterSpacing: 1,
  },
});
