import { useAppTheme } from "@/context/ThemeContext";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountScreen() {
  const { activeTheme } = useAppTheme();
  const isDark = activeTheme === "dark";
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [joinedDate, setJoinedDate] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setEmail(user.email ?? "");
      setFullName(
        user.user_metadata?.full_name || user.user_metadata?.name || "",
      );
      if (user.created_at) {
        setJoinedDate(
          new Date(user.created_at).toLocaleDateString(undefined, {
            month: "long",
            year: "numeric",
          }),
        );
      }
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete account",
      "This will permanently delete your account and all your data. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // TODO: wire to a Supabase edge function / admin API call
            Alert.alert(
              "Not implemented",
              "Account deletion isn't wired up yet.",
            );
          },
        },
      ],
    );
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
          <Text style={[styles.title, isDark && styles.textDark]}>Account</Text>
        </View>
        <View style={[styles.card, isDark && styles.cardDark]}>
          <View style={styles.row}>
            <Text style={[styles.label, isDark && styles.textDarkSecondary]}>
              Name
            </Text>
            <Text style={[styles.value, isDark && styles.textDark]}>
              {fullName || "\u2014"}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={[styles.label, isDark && styles.textDarkSecondary]}>
              Email
            </Text>
            <Text style={[styles.value, isDark && styles.textDark]}>
              {email || "\u2014"}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={[styles.label, isDark && styles.textDarkSecondary]}>
              Joined
            </Text>
            <Text style={[styles.value, isDark && styles.textDark]}>
              {joinedDate || "\u2014"}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.actionRow, isDark && styles.cardDark]}
          onPress={() => router.push("/set-new-password")}
        >
          <Text style={[styles.rowText, isDark && styles.textDark]}>
            Change password
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionRow, isDark && styles.cardDark]}
          onPress={handleLogout}
        >
          <Text style={[styles.rowText, { color: "#0041c8" }]}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionRow}
          onPress={handleDeleteAccount}
        >
          <Text style={[styles.rowText, { color: "#ba1a1a" }]}>
            Delete account
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40, backgroundColor: "#F8FAFC" },
  containerDark: { backgroundColor: "#111827" },
  title: { fontSize: 24, fontWeight: "700", color: "#111827" },
  textDark: { color: "#F9FAFB" },
  textDarkSecondary: { color: "#9CA3AF" },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 60 },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
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
  label: { fontSize: 14, color: "#6B7280" },
  value: { fontSize: 15, color: "#111827", fontWeight: "600" },
  divider: { height: 1, backgroundColor: "#F1F5F9" },
  actionRow: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 1,
  },
  rowText: { fontSize: 16, fontWeight: "600", color: "#111827" },
});
