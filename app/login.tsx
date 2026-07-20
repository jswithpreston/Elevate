import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useToast } from "@/context/ToastContext";

export default function LoginScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      showToast("Please fill in all fields", "error");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });

    setLoading(false);

    if (error) {
      showToast(error.message, "error");
    } else {
      router.replace("/(tabs)");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
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
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Focus awaits.</Text>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>EMAIL</Text>
              <View
                style={[
                  styles.inputWrapper,
                  emailFocused && styles.inputWrapperFocused,
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color={emailFocused ? "#0041c8" : "#c3c5d9"}
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

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>PASSWORD</Text>
                <TouchableOpacity onPress={() => router.push("/forgot-password")}>
                  <Text style={styles.forgotPassword}>Forgot?</Text>
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.inputWrapper,
                  passwordFocused && styles.inputWrapperFocused,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color={passwordFocused ? "#0041c8" : "#c3c5d9"}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="••••••••"
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
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={18}
                    color="#c3c5d9"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.primaryButtonLoading]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Text style={styles.primaryButtonText}>Sign In</Text>
                  <Ionicons name="arrow-forward" size={18} color="#fff" />
                </>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>NEW HERE?</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Sign Up Link */}
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.push("/sign-up")}
            >
              <Text style={styles.secondaryButtonText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f6faff" },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  brandContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  brandIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#e9f2fb",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#dbe4ed",
  },
  logoText: {
    fontFamily: "Manrope",
    fontSize: 36,
    fontWeight: "700",
    color: "#141d23",
    letterSpacing: -0.72,
    marginBottom: 6,
  },
  tagline: {
    fontFamily: "Manrope",
    fontSize: 16,
    color: "#737688",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 28,
    padding: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f0f3f8",
  },
  title: {
    fontFamily: "Manrope",
    fontSize: 26,
    fontWeight: "700",
    color: "#141d23",
    marginBottom: 4,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontFamily: "Manrope",
    fontSize: 16,
    color: "#737688",
    marginBottom: 28,
  },
  inputGroup: { marginBottom: 24 },
  label: {
    fontFamily: "JetBrains Mono",
    fontSize: 11,
    fontWeight: "600",
    color: "#434656",
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  forgotPassword: {
    fontFamily: "Manrope",
    fontSize: 13,
    fontWeight: "600",
    color: "#0041c8",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f6faff",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#dbe4ed",
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  inputWrapperFocused: {
    borderColor: "#0041c8",
    backgroundColor: "#ffffff",
  },
  inputIcon: { marginRight: 10 },
  input: {
    flex: 1,
    fontFamily: "Manrope",
    fontSize: 16,
    color: "#141d23",
    paddingVertical: 14,
  },
  primaryButton: {
    backgroundColor: "#0041c8",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 4,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#0041c8",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryButtonLoading: { opacity: 0.8 },
  primaryButtonText: {
    fontFamily: "Manrope",
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
    gap: 12,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#e6eff8" },
  dividerText: {
    fontFamily: "JetBrains Mono",
    fontSize: 10,
    color: "#c3c5d9",
    letterSpacing: 1.5,
  },
  secondaryButton: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#dbe4ed",
    backgroundColor: "#f6faff",
  },
  secondaryButtonText: {
    fontFamily: "Manrope",
    color: "#141d23",
    fontSize: 16,
    fontWeight: "600",
  },
});
