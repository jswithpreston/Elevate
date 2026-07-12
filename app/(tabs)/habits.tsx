import DatePickerField from "@/components/date-picker-field";
import GlobalHeader from "@/components/global-header";
import QuickSwitcher from "@/components/quick-switcher";
import { useAppTheme } from "@/context/ThemeContext";
import { scheduleHabitReminder } from "@/lib/notifications";
import { useStore } from "@/store/useStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

export default function HabitsScreen() {
  const { activeTheme } = useAppTheme();
  const isDark = activeTheme === "dark";
  const router = useRouter();
  const [switcherVisible, setSwitcherVisible] = useState(false);

  const { habits, addHabit, completeHabit, deleteHabit } = useStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState("");
  const [newHabitStartDate, setNewHabitStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [newHabitTime, setNewHabitTime] = useState("09:00");
  const [isAdding, setIsAdding] = useState(false);

  const today = new Date().toISOString().split("T")[0];
  const todayDayIndex = new Date().getDay(); // 0 = Sunday

  const completedToday = habits.filter(
    (h) => h.last_completed_date === today,
  ).length;
  const bestStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);

  const handleAddHabit = async () => {
    if (!newHabitTitle.trim() || !newHabitStartDate.trim() || isAdding) return;
    setIsAdding(true);
    await addHabit(newHabitTitle.trim(), newHabitStartDate);
    await scheduleHabitReminder(newHabitTitle.trim(), newHabitTitle.trim(), newHabitTime); // We use title as ID temporarily since store doesn't return ID directly
    setNewHabitTitle("");
    setNewHabitStartDate(new Date().toISOString().split("T")[0]);
    setNewHabitTime("09:00");
    setModalVisible(false);
    setIsAdding(false);
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      {/* Header */}
      <GlobalHeader onOpenSwitcher={() => setSwitcherVisible(true)} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.pageTitle, isDark && styles.textDark]}>
          Habits
        </Text>
        <Text style={[styles.pageSubtitle, isDark && styles.textDarkSecondary]}>
          Stay consistent, see results.
        </Text>

        {/* Stats row */}
        {habits.length > 0 && (
          <View style={styles.statsRow}>
            <View style={[styles.statCard, isDark && styles.statCardDark]}>
              <Text style={[styles.statValue, isDark && styles.textDark]}>
                {completedToday}
              </Text>
              <Text style={styles.statLabel}>TODAY{"\n"}DONE</Text>
            </View>
            <View style={[styles.statCard, isDark && styles.statCardDark]}>
              <Text style={[styles.statValue, isDark && styles.textDark]}>
                {habits.length}
              </Text>
              <Text style={styles.statLabel}>TOTAL{"\n"}HABITS</Text>
            </View>
            <View style={[styles.statCard, styles.statCardHighlight]}>
              <Text style={[styles.statValue, { color: "#0041c8" }]}>
                {bestStreak}
              </Text>
              <Text style={[styles.statLabel, { color: "#0041c8" }]}>
                BEST{"\n"}STREAK
              </Text>
            </View>
          </View>
        )}

        {/* This Week row */}
        {habits.length > 0 && (
          <View style={[styles.weekCard, isDark && styles.weekCardDark]}>
            <Text style={[styles.weekTitle, isDark && styles.textDark]}>
              THIS WEEK
            </Text>
            <View style={styles.weekDays}>
              {DAYS.map((d, i) => {
                const isToday = i === todayDayIndex;
                const isPast = i < todayDayIndex;
                return (
                  <View key={i} style={styles.dayItem}>
                    <Text
                      style={[
                        styles.dayLabel,
                        isDark && styles.textDarkSecondary,
                      ]}
                    >
                      {d}
                    </Text>
                    <View
                      style={[
                        styles.dayDot,
                        isToday && styles.dayDotToday,
                        isPast && styles.dayDotPast,
                      ]}
                    >
                      {isToday && completedToday > 0 && (
                        <Ionicons name="checkmark" size={10} color="#fff" />
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Habits list */}
        {habits.length > 0 ? (
          habits.map((habit) => {
            const isCompletedToday = habit.last_completed_date === today;
            return (
              <View
                key={habit.id}
                style={[styles.habitCard, isDark && styles.habitCardDark]}
              >
                <View
                  style={[
                    styles.habitIconBox,
                    {
                      backgroundColor: isCompletedToday ? "#e9f2fb" : "#f0f3f8",
                    },
                  ]}
                >
                  <Ionicons
                    name="repeat-outline"
                    size={24}
                    color={isCompletedToday ? "#0041c8" : "#737688"}
                  />
                </View>

                <View style={styles.habitCardContent}>
                  <Text
                    style={[styles.habitCardTitle, isDark && styles.textDark]}
                    numberOfLines={1}
                  >
                    {habit.title}
                  </Text>
                  <Text
                    style={[
                      styles.habitCardStreak,
                      isCompletedToday && { color: "#0041c8" },
                    ]}
                  >
                    {isCompletedToday
                      ? `\u2713 Done today \u00b7 ${habit.streak} day streak`
                      : `${habit.streak} day streak`}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() =>
                    completeHabit(
                      habit.id,
                      habit.streak,
                      habit.last_completed_date,
                    )
                  }
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <View
                    style={
                      isCompletedToday
                        ? styles.checkCircleActive
                        : styles.checkCircleEmpty
                    }
                  >
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color={isCompletedToday ? "#ffffff" : "#c3c5d9"}
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ marginLeft: 12 }}
                  onPress={() => deleteHabit(habit.id)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="trash-outline" size={18} color="#c3c5d9" />
                </TouchableOpacity>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="repeat-outline" size={56} color="#dbe4ed" />
            <Text style={styles.emptyTitle}>No habits yet</Text>
            <Text style={styles.emptySubtitle}>
              Build consistency by tracking a habit daily. Tap below to create
              your first one.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Add Habit Button */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fabPill}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={20} color="#0041c8" />
          <Text style={styles.fabText}>NEW HABIT</Text>
        </TouchableOpacity>
      </View>

      {/* Add Habit Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={() => setModalVisible(false)}
            activeOpacity={1}
          />
          <ScrollView
            style={[styles.modalContent, isDark && styles.modalContentDark]}
            contentContainerStyle={{ paddingBottom: 100 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.modalHandle} />
            <Text style={[styles.modalTitle, isDark && styles.textDark]}>
              New Habit
            </Text>
            <TextInput
              style={[styles.modalInput, isDark && styles.modalInputDark]}
              placeholder="What habit do you want to build?"
              placeholderTextColor="#c3c5d9"
              value={newHabitTitle}
              onChangeText={setNewHabitTitle}
              autoFocus
              returnKeyType="next"
            />
            <DatePickerField
              label="START DATE"
              value={newHabitStartDate}
              onChange={setNewHabitStartDate}
              mode="date"
            />
            <DatePickerField
              label="REMINDER TIME"
              value={newHabitTime}
              onChange={setNewHabitTime}
              mode="time"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalBtnCancel}
                onPress={() => {
                  setModalVisible(false);
                  setNewHabitTitle("");
                  setNewHabitStartDate(new Date().toISOString().split("T")[0]);
                  setNewHabitTime("09:00");
                }}
              >
                <Text style={styles.modalBtnTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalBtnAdd,
                  (!newHabitTitle.trim() || !newHabitStartDate.trim()) && styles.modalBtnDisabled,
                ]}
                onPress={handleAddHabit}
                disabled={!newHabitTitle.trim() || !newHabitStartDate.trim() || isAdding}
              >
                <Text style={styles.modalBtnTextAdd}>
                  {isAdding ? "Adding\u2026" : "Add Habit"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
      <QuickSwitcher
        visible={switcherVisible}
        onClose={() => setSwitcherVisible(false)}
        currentRoute="habits"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 20, backgroundColor: "#f6faff" },
  containerDark: { backgroundColor: "#141d23" },
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
  textDarkSecondary: { color: "#c3c5d9" },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 120,
    flexGrow: 1,
  },
  pageTitle: {
    fontFamily: "Manrope",
    fontSize: 42,
    fontWeight: "700",
    color: "#141d23",
    marginBottom: 8,
    letterSpacing: -0.84,
    marginTop: 16,
  },
  pageSubtitle: {
    fontFamily: "Manrope",
    fontSize: 17,
    color: "#434656",
    marginBottom: 28,
    lineHeight: 26,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  statCardDark: { backgroundColor: "#293138" },
  statCardHighlight: {
    backgroundColor: "#e9f2fb",
    borderWidth: 1,
    borderColor: "#dbe4ed",
  },
  statValue: {
    fontFamily: "Manrope",
    fontSize: 32,
    fontWeight: "700",
    color: "#141d23",
    letterSpacing: -0.64,
  },
  statLabel: {
    fontFamily: "JetBrains Mono",
    fontSize: 10,
    color: "#737688",
    letterSpacing: 0.8,
    textAlign: "center",
    marginTop: 4,
    lineHeight: 16,
  },
  weekCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  weekCardDark: { backgroundColor: "#293138" },
  weekTitle: {
    fontFamily: "JetBrains Mono",
    fontSize: 11,
    color: "#434656",
    letterSpacing: 1.2,
    marginBottom: 14,
  },
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayItem: { alignItems: "center", gap: 6 },
  dayLabel: {
    fontFamily: "JetBrains Mono",
    fontSize: 11,
    color: "#737688",
    letterSpacing: 0.5,
  },
  dayDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f0f3f8",
    alignItems: "center",
    justifyContent: "center",
  },
  dayDotToday: { backgroundColor: "#0041c8" },
  dayDotPast: { backgroundColor: "#dbe4ed" },
  habitCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
  },
  habitCardDark: { backgroundColor: "#293138" },
  habitIconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  habitCardContent: { flex: 1, marginRight: 12 },
  habitCardTitle: {
    fontFamily: "Manrope",
    fontSize: 17,
    fontWeight: "600",
    color: "#141d23",
    marginBottom: 4,
  },
  habitCardStreak: {
    fontFamily: "Manrope",
    fontSize: 13,
    color: "#737688",
  },
  checkCircleEmpty: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#dbe4ed",
    alignItems: "center",
    justifyContent: "center",
  },
  checkCircleActive: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#0041c8",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0041c8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 40,
  },
  emptyTitle: {
    fontFamily: "Manrope",
    fontSize: 20,
    fontWeight: "600",
    color: "#141d23",
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: "Manrope",
    fontSize: 15,
    color: "#737688",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 280,
  },
  fabContainer: {
    position: "absolute",
    bottom: 32,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  fabPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e9f2fb",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: "#dbe4ed",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  fabText: {
    fontFamily: "JetBrains Mono",
    fontSize: 13,
    fontWeight: "600",
    color: "#0041c8",
    letterSpacing: 1.2,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 24,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  modalContentDark: { backgroundColor: "#293138" },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#dbe4ed",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: "Manrope",
    fontSize: 22,
    fontWeight: "700",
    color: "#141d23",
    marginBottom: 20,
  },
  modalLabel: {
    fontFamily: "JetBrains Mono",
    fontSize: 11,
    color: "#434656",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: "#f6faff",
    borderWidth: 1,
    borderColor: "#dbe4ed",
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    fontFamily: "Manrope",
    color: "#141d23",
    marginBottom: 24,
  },
  modalInputDark: {
    backgroundColor: "#141d23",
    borderColor: "#434656",
    color: "#ffffff",
  },
  modalActions: { flexDirection: "row", justifyContent: "flex-end", gap: 12 },
  modalBtnCancel: { padding: 14 },
  modalBtnTextCancel: {
    color: "#737688",
    fontFamily: "Manrope",
    fontWeight: "600",
    fontSize: 16,
  },
  modalBtnAdd: {
    backgroundColor: "#0041c8",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 14,
  },
  modalBtnDisabled: { backgroundColor: "#c3c5d9" },
  modalBtnTextAdd: {
    color: "#fff",
    fontFamily: "Manrope",
    fontWeight: "700",
    fontSize: 16,
  },
});
