import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useStore } from "@/store/useStore";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function GlobalHeader({
  onOpenSwitcher,
  title = "Elevate",
}: {
  onOpenSwitcher: () => void;
  title?: string;
}) {
  const { activeTheme } = useAppTheme();
  const isDark = activeTheme === "dark";
  const router = useRouter();

  const { notifications } = useStore();
  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onOpenSwitcher}>
        <Ionicons name="apps-outline" size={24} color="#0041c8" />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, isDark && styles.textDark]}>
        {title}
      </Text>
      <TouchableOpacity
        onPress={() => router.push("/(tabs)/notifications")}
        style={styles.bellWrap}
      >
        <Ionicons name="notifications-outline" size={24} color="#0041c8" />
        {unreadNotifications > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {unreadNotifications > 9 ? "9+" : unreadNotifications}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontFamily: "Manrope",
    fontSize: 20,
    fontWeight: "700",
    color: "#141d23",
  },
  textDark: { color: "#ffffff" },
  bellWrap: { position: "relative" },
  badge: {
    position: "absolute",
    top: -4,
    right: -6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: { color: "#FFFFFF", fontSize: 9, fontWeight: "700" },
});
