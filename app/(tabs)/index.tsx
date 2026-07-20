import GlobalHeader from "@/components/global-header";
import QuickSwitcher from "@/components/quick-switcher";
import { useAppTheme } from "@/context/ThemeContext";
import { supabase } from "@/lib/supabase";
import { useStore } from "@/store/useStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";


function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning,";
  if (hour < 17) return "Good afternoon,";
  return "Good evening,";
}

export default function HomeScreen() {
  const { activeTheme } = useAppTheme();
  const isDark = activeTheme === "dark";

  const { tasks, habits, goals, fetchData, toggleTask, completeHabit } =
    useStore();
  const [lastName, setLastName] = useState("");
  const [switcherVisible, setSwitcherVisible] = useState(false);

  // Format date: THURSDAY, OCT 26
  const dateOpts: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "short",
    day: "numeric",
  };
  const dateStr = new Date()
    .toLocaleDateString("en-US", dateOpts)
    .toUpperCase();
  const greeting = getGreeting();
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetchData();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      const fullName: string =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "";
      const nameParts = fullName.trim().split(" ");
      // Use last name if available, otherwise first name, otherwise email prefix
      const last =
        nameParts.length > 1
          ? nameParts[nameParts.length - 1]
          : nameParts[0] || "";
      setLastName(last);
    });
  }, []);

  // Daily goals met = completed tasks / total tasks (percentage)
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const dailyPercent =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Top 3 incomplete tasks for "Top Priorities"
  const topTasks = tasks.filter((t) => !t.completed).slice(0, 3);

  // Today's habits
  const todayHabits = habits.slice(0, 3);

  // Upcoming incomplete tasks beyond top priorities
  const upcomingTasks = tasks.filter((t) => !t.completed).slice(3, 5);

  const progressMessage = () => {
    if (totalTasks === 0)
      return "Add your first tasks to start tracking your day.";
    if (dailyPercent === 100)
      return "Incredible! You've completed all your tasks for today. \ud83c\udf89";
    if (dailyPercent >= 75)
      return "Great progress! You're almost there. Keep pushing.";
    if (dailyPercent >= 50)
      return "You're making solid progress. Maintain focus to complete your primary objectives.";
    return "A great day starts with a single step. You've got this!";
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Nav */}
        {/* Top Nav */}
        <GlobalHeader onOpenSwitcher={() => setSwitcherVisible(true)} />

        {/* Header - single line greeting */}
        <View style={styles.header}>
          <Text style={[styles.dateLabel, isDark && styles.textDarkSecondary]}>
            {dateStr}
          </Text>
          <Text style={[styles.greeting, isDark && styles.textDark]} numberOfLines={1} adjustsFontSizeToFit>
            {greeting} {lastName || ""}
          </Text>
        </View>

        {/* Daily Progress Ring */}
        <View
          style={[styles.progressSection, isDark && styles.progressSectionDark]}
        >
          <View style={styles.ringWrapper}>
            <View style={styles.ringOuter}>
              <View style={styles.ringInner}>
                <Text style={[styles.progressValue, isDark && styles.textDark]}>
                  {dailyPercent}
                  <Text style={styles.progressPercent}>%</Text>
                </Text>
                <Text
                  style={[
                    styles.progressLabel,
                    isDark && styles.textDarkSecondary,
                  ]}
                >
                  Daily Goals Met
                </Text>
              </View>
            </View>
          </View>
          <Text
            style={[styles.progressText, isDark && styles.textDarkSecondary]}
          >
            {progressMessage()}
          </Text>
        </View>

        {/* Top Priorities */}
        <View style={styles.sectionHeader}>
          <Text
            style={[styles.sectionTitle, isDark && styles.textDarkSecondary]}
          >
            TOP PRIORITIES
          </Text>
        </View>

        {topTasks.length > 0 ? (
          <View style={styles.prioritiesList}>
            {topTasks.map((task, i) => (
              <View
                key={task.id}
                style={[styles.card, isDark && styles.cardDark]}
              >
                <View
                  style={[
                    styles.iconBox,
                    { backgroundColor: i === 0 ? "#0041c8" : "#e1e3e4" },
                  ]}
                >
                  <Ionicons
                    name={i === 0 ? "star-outline" : "ellipse-outline"}
                    size={22}
                    color={i === 0 ? "#fff" : "#626566"}
                  />
                </View>
                <View style={styles.cardContent}>
                  <Text style={[styles.cardTitle, isDark && styles.textDark]}>
                    {task.title}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => toggleTask(task.id, task.completed)}
                >
                  <View style={styles.radioEmpty} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-done-outline" size={32} color="#c3c5d9" />
            <Text style={styles.emptyText}>No pending tasks. Great job!</Text>
          </View>
        )}

        {/* Habit Progress */}
        <View style={styles.sectionHeaderRow}>
          <Text
            style={[styles.sectionTitle, isDark && styles.textDarkSecondary]}
          >
            HABIT PROGRESS
          </Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/habits")}>
            <Text style={styles.editLink}>EDIT</Text>
          </TouchableOpacity>
        </View>

        {habits.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.habitScroll}
            contentContainerStyle={styles.habitScrollContent}
          >
            {todayHabits.map((habit) => {
              const done = habit.last_completed_date === today;
              return (
                <TouchableOpacity
                  key={habit.id}
                  style={[
                    styles.habitCard,
                    { backgroundColor: done ? "#0041c8" : "#ffffff" },
                    !done && styles.habitCardEmpty,
                  ]}
                  onPress={() =>
                    completeHabit(
                      habit.id,
                      habit.streak,
                      habit.last_completed_date,
                    )
                  }
                >
                  <View style={styles.habitCardHeader}>
                    <Ionicons
                      name="sync-outline"
                      size={20}
                      color={done ? "#fff" : "#434656"}
                    />
                    {done && (
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="rgba(255,255,255,0.7)"
                      />
                    )}
                  </View>
                  <View>
                    <Text
                      style={[
                        styles.habitCardTitle,
                        !done && { color: "#141d23" },
                      ]}
                      numberOfLines={1}
                    >
                      {habit.title}
                    </Text>
                    <Text
                      style={[
                        styles.habitCardSubtitle,
                        !done && { color: "#434656" },
                      ]}
                    >
                      {habit.streak} day streak
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="repeat-outline" size={32} color="#c3c5d9" />
            <Text style={styles.emptyText}>
              No habits yet. Add one to get started.
            </Text>
          </View>
        )}

        {/* Upcoming Tasks */}
        <View style={[styles.tasksContainer, isDark && styles.cardDark]}>
          <View style={styles.sectionHeaderRow}>
            <Text
              style={[styles.sectionTitle, isDark && styles.textDarkSecondary]}
            >
              UPCOMING TASKS
            </Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/tasks")}>
              <Text style={styles.editLink}>VIEW ALL</Text>
            </TouchableOpacity>
          </View>
          {upcomingTasks.length > 0 ? (
            upcomingTasks.map((task, i) => (
              <View key={task.id}>
                <View style={styles.taskItem}>
                  <TouchableOpacity
                    onPress={() => toggleTask(task.id, task.completed)}
                  >
                    <View style={styles.radioEmpty} />
                  </TouchableOpacity>
                  <Text
                    style={[styles.taskText, isDark && styles.textDark]}
                    numberOfLines={1}
                  >
                    {task.title}
                  </Text>
                </View>
                {i < upcomingTasks.length - 1 && (
                  <View style={styles.taskDivider} />
                )}
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>
              {tasks.length === 0
                ? "No tasks yet. Head to Tasks to add some."
                : "All tasks are in your Top Priorities section."}
            </Text>
          )}
        </View>

        {/* Quote */}
        <View style={styles.quoteSection}>
          <Text style={styles.quoteText}>
            Consistency is what transforms average into excellence.
          </Text>
        </View>
      </ScrollView>
      <QuickSwitcher
        visible={switcherVisible}
        onClose={() => setSwitcherVisible(false)}
        currentRoute="home"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 20, backgroundColor: "#f6faff" },
  containerDark: { backgroundColor: "#141d23" },
  scrollContent: { paddingBottom: 120 },
  topNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  navTitle: {
    fontFamily: "Manrope",
    fontSize: 20,
    fontWeight: "700",
    color: "#141d23",
  },
  header: { paddingHorizontal: 24, marginBottom: 32, marginTop: 8 },
  dateLabel: {
    fontFamily: "JetBrains Mono",
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 1.2,
    color: "#434656",
    marginBottom: 8,
  },
  greeting: {
    fontFamily: "Manrope",
    fontSize: 22,
    fontWeight: "700",
    color: "#141d23",
    letterSpacing: -0.56,
  },
  textDark: { color: "#ffffff" },
  textDarkSecondary: { color: "#c3c5d9" },
  progressSection: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    marginHorizontal: 24,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.03,
    shadowRadius: 40,
    elevation: 2,
  },
  progressSectionDark: { backgroundColor: "#293138" },
  ringWrapper: { marginBottom: 24 },
  ringOuter: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 14,
    borderColor: "#0041c8",
    borderTopColor: "#e1e3e4",
    borderRightColor: "#e1e3e4",
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "135deg" }],
  },
  ringInner: {
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "-135deg" }],
  },
  progressValue: {
    fontFamily: "Manrope",
    fontSize: 48,
    fontWeight: "700",
    color: "#141d23",
  },
  progressPercent: { fontSize: 22 },
  progressLabel: {
    fontFamily: "JetBrains Mono",
    fontSize: 11,
    color: "#434656",
    letterSpacing: 0.5,
    marginTop: 4,
    textAlign: "center",
  },
  progressText: {
    fontFamily: "Manrope",
    fontSize: 15,
    color: "#434656",
    textAlign: "center",
    lineHeight: 24,
  },
  sectionHeader: { paddingHorizontal: 24, marginBottom: 16 },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: "JetBrains Mono",
    fontSize: 12,
    fontWeight: "500",
    letterSpacing: 1.2,
    color: "#434656",
  },
  editLink: {
    fontFamily: "JetBrains Mono",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1.2,
    color: "#0041c8",
  },
  prioritiesList: { marginBottom: 32, paddingHorizontal: 24 },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.03,
    shadowRadius: 40,
    elevation: 2,
  },
  cardDark: { backgroundColor: "#293138" },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  cardContent: { flex: 1 },
  cardTitle: {
    fontFamily: "Manrope",
    fontSize: 18,
    fontWeight: "600",
    color: "#141d23",
  },
  radioEmpty: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#c3c5d9",
  },
  habitScroll: { marginBottom: 32 },
  habitScrollContent: { paddingHorizontal: 24, gap: 16 },
  habitCard: {
    width: 140,
    height: 160,
    borderRadius: 24,
    padding: 20,
    justifyContent: "space-between",
  },
  habitCardEmpty: {
    borderWidth: 1,
    borderColor: "#e1e3e4",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 1,
  },
  habitCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  habitCardTitle: {
    fontFamily: "Manrope",
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 4,
  },
  habitCardSubtitle: {
    fontFamily: "Manrope",
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
  },
  tasksContainer: {
    backgroundColor: "#ecf5fe",
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 24,
    marginBottom: 32,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  taskText: {
    fontFamily: "Manrope",
    fontSize: 16,
    color: "#141d23",
    marginLeft: 16,
    flex: 1,
  },
  taskDivider: { height: 1, backgroundColor: "#dbe4ed", marginLeft: 40 },
  emptyState: {
    alignItems: "center",
    paddingVertical: 24,
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  emptyText: {
    fontFamily: "Manrope",
    fontSize: 15,
    color: "#737688",
    textAlign: "center",
    marginTop: 8,
  },
  quoteSection: {
    paddingVertical: 24,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  quoteText: {
    fontFamily: "Manrope",
    fontSize: 16,
    fontStyle: "italic",
    color: "#434656",
    textAlign: "center",
    lineHeight: 25.6,
  },
});
