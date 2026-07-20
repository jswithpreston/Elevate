import GlobalHeader from "@/components/global-header";
import QuickSwitcher from "@/components/quick-switcher";
import { useAppTheme } from "@/context/ThemeContext";
import { useStore } from "@/store/useStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Period = "week" | "month" | "year";

const GOAL_TARGET_PERCENT = 90; // adjust to match your actual target source if you store one

function startOfPeriod(period: Period): Date {
  const now = new Date();
  const start = new Date(now);
  if (period === "week") {
    const day = start.getDay(); // 0 = Sunday
    start.setDate(start.getDate() - day);
  } else if (period === "month") {
    start.setDate(1);
  } else {
    start.setMonth(0, 1);
  }
  start.setHours(0, 0, 0, 0);
  return start;
}

function last7Days(): Date[] {
  const days: Date[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    days.push(d);
  }
  return days;
}

export default function ProgressScreen() {
  const { activeTheme } = useAppTheme();
  const isDark = activeTheme === "dark";
  const router = useRouter();
  const { tasks = [], goals = [] } = useStore();

  const [period, setPeriod] = useState<Period>("week");
  const [switcherVisible, setSwitcherVisible] = useState(false);

  // TODO: replace with a real unread count from your store/notifications source
  const unreadNotifications = 2;

  const periodStart = useMemo(() => startOfPeriod(period), [period]);

  // Tasks completed in this period (since we don't have a completedAt field,
  // we estimate by filtering tasks that are completed and created within the period)
  const completedTasksInPeriod = useMemo(() => {
    return tasks.filter((t: any) => {
      if (!t.completed) return false;
      const createdDate = new Date(t.created_at);
      return createdDate >= periodStart;
    });
  }, [tasks, periodStart]);

  // Average focus time isn't tracked yet — placeholder
  const avgFocusTime = useMemo(() => {
    return { hours: 0, minutes: 0 };
  }, []);

  const goalCompletionRate = useMemo(() => {
    if (goals.length === 0) return 0;
    const completedGoals = goals.filter((g: any) => g.progress >= 100).length;
    return Math.round((completedGoals / goals.length) * 100);
  }, [goals]);

  const dailyChartData = useMemo(() => {
    const days = last7Days();
    return days.map((day) => {
      const count = tasks.filter((t: any) => {
        if (!t.completed) return false;
        return new Date(t.created_at).toDateString() === day.toDateString();
      }).length;
      return {
        label: day.toLocaleDateString(undefined, { weekday: "short" })[0],
        count,
      };
    });
  }, [tasks]);

  const maxDailyCount = Math.max(1, ...dailyChartData.map((d) => d.count));
  const hasAnyData = tasks.length > 0 || goals.length > 0;

  return (
    <SafeAreaView
      style={[styles.container, isDark && styles.containerDark]}
      edges={["top"]}
    >
      {/* Header */}
      {/* Header */}
      <GlobalHeader onOpenSwitcher={() => setSwitcherVisible(true)} title="Progress" />
      <View style={styles.header}>
        <Text style={[styles.title, isDark && styles.textDark]}>Progress</Text>
      </View>

      {/* Period toggle */}
      <View style={styles.toggleRow}>
        {(["week", "month", "year"] as Period[]).map((p) => (
          <TouchableOpacity
            key={p}
            style={[
              styles.toggleButton,
              period === p && styles.toggleButtonActive,
            ]}
            onPress={() => setPeriod(p)}
          >
            <Text
              style={[
                styles.toggleText,
                period === p && styles.toggleTextActive,
              ]}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, isDark && styles.cardDark]}>
          <Text style={[styles.cardTitle, isDark && styles.textDarkSecondary]}>
            AVG. FOCUS TIME
          </Text>
          <Text style={[styles.value, isDark && styles.textDark]}>
            {avgFocusTime.hours}h {avgFocusTime.minutes}m
          </Text>
        </View>

        <View style={[styles.card, isDark && styles.cardDark]}>
          <Text style={[styles.cardTitle, isDark && styles.textDarkSecondary]}>
            GOAL COMPLETION RATE
          </Text>
          <View style={styles.goalRow}>
            <Text style={[styles.value, isDark && styles.textDark]}>
              {goalCompletionRate}%
            </Text>
            <Text
              style={[styles.targetText, isDark && styles.textDarkSecondary]}
            >
              Target: {GOAL_TARGET_PERCENT}%
            </Text>
          </View>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(goalCompletionRate, 100)}%` },
              ]}
            />
          </View>
        </View>

        <View style={[styles.card, isDark && styles.cardDark]}>
          <Text style={[styles.cardTitle, isDark && styles.textDarkSecondary]}>
            TASKS COMPLETED PER DAY
          </Text>
          <View style={styles.chartRow}>
            {dailyChartData.map((d, i) => (
              <View key={i} style={styles.chartBarWrapper}>
                <View
                  style={[
                    styles.chartBar,
                    { height: (d.count / maxDailyCount) * 80 || 2 },
                  ]}
                />
                <Text
                  style={[
                    styles.chartLabel,
                    isDark && styles.textDarkSecondary,
                  ]}
                >
                  {d.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {!hasAnyData && (
          <View style={[styles.emptyState, isDark && styles.emptyStateDark]}>
            <Text
              style={[
                styles.emptyStateText,
                isDark && styles.textDarkSecondary,
              ]}
            >
              Complete some tasks and goals to see your progress here.
            </Text>
          </View>
        )}
      </ScrollView>

      <QuickSwitcher
        visible={switcherVisible}
        onClose={() => setSwitcherVisible(false)}
        currentRoute="progress"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  containerDark: { backgroundColor: "#111827" },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  headerbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  headerTitle: {
    fontFamily: "Manrope",
    fontSize: 20,
    fontWeight: "700",
    color: "#141d23",
  },
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
  title: { fontSize: 32, fontWeight: "700", color: "#111827" },
  textDark: { color: "#F9FAFB" },
  toggleRow: {
    flexDirection: "row",
    marginHorizontal: 24,
    backgroundColor: "#E5E9F0",
    borderRadius: 24,
    padding: 4,
    marginBottom: 8,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
  },
  toggleButtonActive: { backgroundColor: "#0041c8" },
  toggleText: { color: "#6B7280", fontWeight: "600" },
  toggleTextActive: { color: "#FFFFFF" },
  scrollContent: { padding: 24, paddingBottom: 100 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 1,
  },
  cardDark: { backgroundColor: "#1F2937" },
  cardTitle: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
    letterSpacing: 1,
    marginBottom: 8,
  },
  value: { fontSize: 36, fontWeight: "700", color: "#111827" },
  goalRow: { flexDirection: "row", alignItems: "baseline" },
  targetText: { marginLeft: 12, fontSize: 14, color: "#6B7280" },
  progressTrack: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    marginTop: 16,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "#0041c8" },
  chartRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 110,
    marginTop: 8,
  },
  chartBarWrapper: { alignItems: "center", flex: 1 },
  chartBar: {
    width: 18,
    borderRadius: 4,
    backgroundColor: "#0041c8",
    marginBottom: 6,
  },
  chartLabel: { fontSize: 11, color: "#6B7280" },
  textDarkSecondary: { color: "#9CA3AF" },
  emptyState: {
    padding: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    alignItems: "center",
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    marginTop: 16,
  },
  emptyStateDark: { backgroundColor: "#1F2937", borderColor: "#374151" },
  emptyStateText: { color: "#6B7280", fontSize: 16, textAlign: "center" },
});
