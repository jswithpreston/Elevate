import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type NotificationType = "reminder" | "streak" | "achievement";

type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string; // ISO date
  read: boolean;
};

// TODO: replace with real data from your store / Supabase table once wired up
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "reminder",
    title: "Task due soon",
    message: '"Finish weekly report" is due in 2 hours.',
    createdAt: new Date().toISOString(),
    read: false,
  },
  {
    id: "2",
    type: "streak",
    title: "5-day streak!",
    message: "You've completed your morning habit 5 days in a row.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    read: false,
  },
  {
    id: "3",
    type: "achievement",
    title: "Goal completed",
    message: 'You reached your goal: "Read 12 books this year."',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    read: true,
  },
  {
    id: "4",
    type: "reminder",
    title: "Habit check-in",
    message: "Don't forget to log today's \"Drink water\" habit.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    read: true,
  },
];

const ICONS: Record<NotificationType, keyof typeof Ionicons.glyphMap> = {
  reminder: "alarm-outline",
  streak: "flame-outline",
  achievement: "trophy-outline",
};

const ICON_COLORS: Record<NotificationType, string> = {
  reminder: "#0041c8",
  streak: "#F97316",
  achievement: "#16A34A",
};

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationsScreen() {
  const { activeTheme } = useAppTheme();
  const isDark = activeTheme === "dark";
  const router = useRouter();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <SafeAreaView
      style={[styles.container, isDark && styles.containerDark]}
      edges={["top"]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginRight: 16 }}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color={isDark ? "#F9FAFB" : "#111827"}
          />
        </TouchableOpacity>
        <Text style={[styles.title, isDark && styles.textDark]}>
          Notifications
        </Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead} style={styles.markAllBtn}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              isDark && styles.cardDark,
              !item.read && styles.cardUnread,
              !item.read && isDark && styles.cardUnreadDark,
            ]}
            onPress={() => markAsRead(item.id)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.iconWrap,
                { backgroundColor: ICON_COLORS[item.type] + "1A" },
              ]}
            >
              <Ionicons
                name={ICONS[item.type]}
                size={20}
                color={ICON_COLORS[item.type]}
              />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.cardHeaderRow}>
                <Text
                  style={[styles.cardTitle, isDark && styles.textDark]}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
                {!item.read && <View style={styles.unreadDot} />}
              </View>
              <Text
                style={[styles.cardMessage, isDark && styles.textDarkSecondary]}
              >
                {item.message}
              </Text>
              <Text style={[styles.cardTime, isDark && styles.textDarkMuted]}>
                {timeAgo(item.createdAt)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons
              name="notifications-off-outline"
              size={32}
              color="#9CA3AF"
            />
            <Text
              style={[
                styles.emptyStateText,
                isDark && styles.textDarkSecondary,
              ]}
            >
              {"You're all caught up."}
            </Text>
          </View>
        }
      />
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
  title: { fontSize: 24, fontWeight: "700", color: "#111827", flex: 1 },
  textDark: { color: "#F9FAFB" },
  textDarkSecondary: { color: "#9CA3AF" },
  textDarkMuted: { color: "#6B7280" },
  markAllBtn: { paddingVertical: 4, paddingHorizontal: 8 },
  markAllText: { color: "#0041c8", fontWeight: "600", fontSize: 13 },
  listContent: { paddingHorizontal: 24, paddingBottom: 40 },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 1,
  },
  cardDark: { backgroundColor: "#1F2937" },
  cardUnread: { borderWidth: 1, borderColor: "#DBEAFE" },
  cardUnreadDark: { borderColor: "#1E3A8A" },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardHeaderRow: { flexDirection: "row", alignItems: "center" },
  cardTitle: { fontSize: 15, fontWeight: "700", color: "#111827", flex: 1 },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#0041c8",
    marginLeft: 8,
  },
  cardMessage: { fontSize: 13, color: "#6B7280", marginTop: 4 },
  cardTime: { fontSize: 11, color: "#9CA3AF", marginTop: 6 },
  emptyState: { alignItems: "center", paddingTop: 80, gap: 12 },
  emptyStateText: { fontSize: 14, color: "#6B7280" },
});
