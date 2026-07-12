import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { BackHandler, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";

export default function SettingsScreen() {
  const { activeTheme } = useAppTheme();
  const isDark = activeTheme === "dark";
  const router = useRouter();

  // TODO: persist these to your store / AsyncStorage / Supabase user prefs
  const [pushEnabled, setPushEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [reminderEnabled, setReminderEnabled] = useState(true);

  useEffect(() => {
    const onBackPress = () => {
      router.push("/(tabs)/profile");
      return true;
    };
    const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, isDark && styles.containerDark]}
      edges={["top"]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/(tabs)/profile")}
          style={{ marginRight: 16 }}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={isDark ? "#F9FAFB" : "#111827"}
          />
        </TouchableOpacity>
        <Text style={[styles.title, isDark && styles.textDark]}>
          Settings
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.sectionLabel, isDark && styles.textDarkSecondary]}>
          PREFERENCES
        </Text>
        <View style={[styles.card, isDark && styles.cardDark]}>
          <View style={styles.row}>
            <Text style={[styles.rowText, isDark && styles.textDark]}>
              Push notifications
            </Text>
            <Switch value={pushEnabled} onValueChange={setPushEnabled} />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={[styles.rowText, isDark && styles.textDark]}>
              Daily reminders
            </Text>
            <Switch
              value={reminderEnabled}
              onValueChange={setReminderEnabled}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={[styles.rowText, isDark && styles.textDark]}>
              Sound effects
            </Text>
            <Switch value={soundEnabled} onValueChange={setSoundEnabled} />
          </View>
        </View>

        <Text style={[styles.sectionLabel, isDark && styles.textDarkSecondary]}>
          MORE
        </Text>
        <View style={[styles.card, isDark && styles.cardDark]}>
          <TouchableOpacity
            style={styles.row}
            onPress={() => router.push("/(tabs)/appearance")}
          >
            <Text style={[styles.rowText, isDark && styles.textDark]}>
              Appearance
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#c3c5d9" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.row}
            onPress={() => router.push("/(tabs)/account")}
          >
            <Text style={[styles.rowText, isDark && styles.textDark]}>
              Account
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#c3c5d9" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.row}
            onPress={() => router.push("/(tabs)/help")}
          >
            <Text style={[styles.rowText, isDark && styles.textDark]}>
              Help
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#c3c5d9" />
          </TouchableOpacity>
        </View>

        <Text style={[styles.versionText, isDark && styles.textDarkSecondary]}>
          Elevate v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, backgroundColor: "#F8FAFC" },
  containerDark: { backgroundColor: "#111827" },
  textDark: { color: "#F9FAFB" },
  textDarkSecondary: { color: "#9CA3AF" },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  title: { fontSize: 24, fontWeight: "700", color: "#111827" },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 60 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 1,
  },
  cardDark: { backgroundColor: "#1F2937" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  rowText: { fontSize: 16, color: "#111827" },
  divider: { height: 1, backgroundColor: "#F1F5F9" },
  versionText: {
    textAlign: "center",
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 32,
  },
});
