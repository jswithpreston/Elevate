import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { BackHandler, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";

type ThemeOption = "light" | "dark" | "system";

const OPTIONS: {
  key: ThemeOption;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { key: "light", label: "Light", icon: "sunny-outline" },
  { key: "dark", label: "Dark", icon: "moon-outline" },
  { key: "system", label: "System default", icon: "phone-portrait-outline" },
];

export default function AppearanceScreen() {
  const router = useRouter();
  const { activeTheme, theme, setTheme } = useAppTheme() as {
    activeTheme: string;
    theme: ThemeOption;
    setTheme: (t: ThemeOption) => void;
  };
  const isDark = activeTheme === "dark";

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
          Appearance
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.sectionLabel, isDark && styles.textDarkSecondary]}>
          THEME
        </Text>
        <View style={[styles.card, isDark && styles.cardDark]}>
          {OPTIONS.map((option, i) => (
            <View key={option.key}>
              <TouchableOpacity
                style={styles.row}
                onPress={() => setTheme(option.key)}
              >
                <View style={styles.rowLeft}>
                  <Ionicons
                    name={option.icon}
                    size={20}
                    color={isDark ? "#F9FAFB" : "#111827"}
                    style={{ marginRight: 12 }}
                  />
                  <Text style={[styles.rowText, isDark && styles.textDark]}>
                    {option.label}
                  </Text>
                </View>
                {theme === option.key && (
                  <Ionicons name="checkmark-circle" size={22} color="#0041c8" />
                )}
              </TouchableOpacity>
              {i < OPTIONS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  containerDark: { backgroundColor: "#111827" },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  title: { fontSize: 24, fontWeight: "700", color: "#111827" },
  textDark: { color: "#F9FAFB" },
  textDarkSecondary: { color: "#9CA3AF" },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 60 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    letterSpacing: 1,
    marginBottom: 8,
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
  rowLeft: { flexDirection: "row", alignItems: "center" },
  rowText: { fontSize: 16, color: "#111827" },
  divider: { height: 1, backgroundColor: "#F1F5F9" },
});
