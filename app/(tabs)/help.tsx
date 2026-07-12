import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const FAQS = [
  {
    q: "How do I create a new task?",
    a: "Go to the Tasks tab and tap the + button in the bottom right corner.",
  },
  {
    q: "How are streaks calculated?",
    a: "A streak increases by 1 each day you complete a habit, and resets to 0 if you miss a day.",
  },
  {
    q: "Can I use Elevate offline?",
    a: "You can view and edit existing data offline, but changes sync to your account once you're back online.",
  },
  {
    q: "How do I change my password?",
    a: "Go to Profile \u2192 Account \u2192 Change password.",
  },
];

export default function HelpScreen() {
  const { activeTheme } = useAppTheme();
  const isDark = activeTheme === "dark";
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleContact = () => {
    Linking.openURL("mailto:support@elevateapp.com?subject=Elevate%20Support");
  };

  return (
    <SafeAreaView
      style={[styles.container, isDark && styles.containerDark]}
      edges={["top"]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
          <Text style={[styles.title, isDark && styles.textDark]}>Help</Text>
        </View>

        <Text style={[styles.sectionLabel, isDark && styles.textDarkSecondary]}>
          FREQUENTLY ASKED
        </Text>
        <View style={[styles.card, isDark && styles.cardDark]}>
          {FAQS.map((item, i) => (
            <View key={i}>
              <TouchableOpacity
                style={styles.row}
                onPress={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <Text style={[styles.question, isDark && styles.textDark]}>
                  {item.q}
                </Text>
                <Ionicons
                  name={openIndex === i ? "chevron-up" : "chevron-down"}
                  size={16}
                  color="#c3c5d9"
                />
              </TouchableOpacity>
              {openIndex === i && (
                <Text
                  style={[styles.answer, isDark && styles.textDarkSecondary]}
                >
                  {item.a}
                </Text>
              )}
              {i < FAQS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        <Text style={[styles.sectionLabel, isDark && styles.textDarkSecondary]}>
          STILL NEED HELP?
        </Text>
        <TouchableOpacity
          style={[styles.contactCard, isDark && styles.cardDark]}
          onPress={handleContact}
        >
          <Ionicons
            name="mail-outline"
            size={20}
            color="#0041c8"
            style={{ marginRight: 12 }}
          />
          <Text style={[styles.rowText, { color: "#0041c8" }]}>
            Email support@elevateapp.com
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, backgroundColor: "#F8FAFC" },
  containerDark: { backgroundColor: "#111827" },
  textDark: { color: "#F9FAFB" },
  title: { fontSize: 24, fontWeight: "700", color: "#111827" },
  textDarkSecondary: { color: "#9CA3AF" },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 60 },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 100,
    flexDirection: "row",
    alignItems: "center",
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 8,
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
  question: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
    marginRight: 8,
  },
  answer: { fontSize: 14, color: "#6B7280", paddingBottom: 16, lineHeight: 20 },
  divider: { height: 1, backgroundColor: "#F1F5F9" },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 1,
  },
  rowText: { fontSize: 15, fontWeight: "600" },
});
