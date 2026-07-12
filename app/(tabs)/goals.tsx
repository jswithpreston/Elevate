import DatePickerField from "@/components/date-picker-field";
import GlobalHeader from "@/components/global-header";
import QuickSwitcher from "@/components/quick-switcher";
import { useAppTheme } from "@/context/ThemeContext";
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

const CARD_COLORS = ["#141d23", "#0041c8", "#293138", "#1a2b3c", "#343a40"];

const CATEGORIES = ["Personal", "Career", "Health", "Finance", "Education"];
const PRIORITIES = [
  { label: "Low", value: "low" as const, color: "#737688" },
  { label: "Medium", value: "medium" as const, color: "#F59E0B" },
  { label: "High", value: "high" as const, color: "#EF4444" },
];

export default function GoalsScreen() {
  const { activeTheme } = useAppTheme();
  const isDark = activeTheme === "dark";
  const router = useRouter();
  const [switcherVisible, setSwitcherVisible] = useState(false);

  const { goals, addGoal, deleteGoal, updateGoalProgress } = useStore();
  const [filter, setFilter] = useState<"Active" | "Achieved">("Active");

  const [modalVisible, setModalVisible] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalDescription, setNewGoalDescription] = useState("");
  const [newGoalCategory, setNewGoalCategory] = useState("");
  const [newGoalPriority, setNewGoalPriority] = useState<
    "low" | "medium" | "high"
  >("medium");
  const [newGoalStartDate, setNewGoalStartDate] = useState("");
  const [newGoalTargetDate, setNewGoalTargetDate] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddGoal = async () => {
    if (!newGoalTitle.trim() || !newGoalStartDate.trim() || !newGoalTargetDate.trim() || isAdding) return;
    setIsAdding(true);
    await addGoal(
      newGoalTitle.trim(),
      newGoalTargetDate,
      newGoalStartDate,
      newGoalDescription.trim() || undefined,
      newGoalCategory || undefined,
      newGoalPriority,
    );
    setNewGoalTitle("");
    setNewGoalDescription("");
    setNewGoalCategory("");
    setNewGoalPriority("medium");
    setNewGoalStartDate("");
    setNewGoalTargetDate("");
    setModalVisible(false);
    setIsAdding(false);
  };

  const filteredGoals = goals.filter((g) => {
    if (filter === "Active") return g.progress < 100;
    return g.progress >= 100;
  });

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      {/* Header */}
      <GlobalHeader onOpenSwitcher={() => setSwitcherVisible(true)} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.pageTitle, isDark && styles.textDark]}>Goals</Text>
        <Text style={[styles.pageSubtitle, isDark && styles.textDarkSecondary]}>
          Track your major milestones and stay focused on your long-term vision.
        </Text>

        {/* Filter pills */}
        <View style={styles.filterRow}>
          {(["Active", "Achieved"] as const).map((f) => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterChip,
                filter === f && styles.filterChipActive,
              ]}
              onPress={() => setFilter(f)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === f && styles.filterTextActive,
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Goals */}
        {filteredGoals.length > 0 ? (
          filteredGoals.map((goal, index) => {
            const priorityInfo =
              PRIORITIES.find((p) => p.value === goal.priority) ||
              PRIORITIES[1];
            return (
              <View
                key={goal.id}
                style={[
                  styles.goalCard,
                  { backgroundColor: CARD_COLORS[index % CARD_COLORS.length] },
                ]}
              >
                {/* Top row: tag + delete */}
                <View style={styles.goalCardHeader}>
                  <View style={styles.goalTag}>
                    <Ionicons
                      name={
                        goal.progress >= 100 ? "trophy-outline" : "flag-outline"
                      }
                      size={12}
                      color="#ffffff"
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.goalTagText}>
                      {goal.progress >= 100 ? "ACHIEVED" : "ACTIVE"}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => deleteGoal(goal.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={16}
                      color="rgba(255,255,255,0.7)"
                    />
                  </TouchableOpacity>
                </View>

                {/* Category & Priority badges */}
                <View style={styles.goalBadgesRow}>
                  {goal.category && (
                    <View style={styles.goalBadge}>
                      <Text style={styles.goalBadgeText}>{goal.category}</Text>
                    </View>
                  )}
                  <View
                    style={[
                      styles.goalBadge,
                      { backgroundColor: priorityInfo.color + "33" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.goalBadgeText,
                        { color: priorityInfo.color },
                      ]}
                    >
                      {goal.priority.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {/* Title */}
                <Text style={styles.goalTitleText} numberOfLines={2}>
                  {goal.title}
                </Text>

                {/* Description */}
                {goal.description && (
                  <Text style={styles.goalDescriptionText} numberOfLines={2}>
                    {goal.description}
                  </Text>
                )}

                {/* Progress */}
                <View style={styles.goalProgressRow}>
                  <Text style={styles.goalProgressText}>
                    {goal.progress}% COMPLETE
                  </Text>
                  <View style={styles.progressControls}>
                    <TouchableOpacity
                      onPress={() =>
                        updateGoalProgress(
                          goal.id,
                          Math.max(0, goal.progress - 10),
                        )
                      }
                      disabled={goal.progress === 0}
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    >
                      <Ionicons
                        name="remove-circle-outline"
                        size={26}
                        color={
                          goal.progress === 0
                            ? "rgba(255,255,255,0.3)"
                            : "#ffffff"
                        }
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        updateGoalProgress(
                          goal.id,
                          Math.min(100, goal.progress + 10),
                        )
                      }
                      disabled={goal.progress >= 100}
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                    >
                      <Ionicons
                        name="add-circle-outline"
                        size={26}
                        color={
                          goal.progress >= 100
                            ? "rgba(255,255,255,0.3)"
                            : "#ffffff"
                        }
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Progress bar */}
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${goal.progress}%` },
                    ]}
                  />
                </View>

                {/* Target date */}
                {goal.target_date && (
                  <Text style={styles.goalDateText}>
                    Target: {new Date(goal.target_date).toLocaleDateString()}
                  </Text>
                )}
              </View>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="flag-outline" size={56} color="#dbe4ed" />
            <Text style={styles.emptyTitle}>
              {filter === "Active"
                ? "No active goals"
                : "No achieved goals yet"}
            </Text>
            <Text style={styles.emptySubtitle}>
              {filter === "Active"
                ? "Define what you are working towards. Tap below to set your first goal."
                : "Keep pushing \u2014 your first achievement is just around the corner."}
            </Text>
          </View>
        )}

        {/* Create new goal card */}
        <TouchableOpacity
          style={styles.createCard}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}
        >
          <View style={styles.createIconBox}>
            <Ionicons name="add" size={26} color="#0041c8" />
          </View>
          <Text style={styles.createText}>Create New Goal</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Add Goal Modal */}
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
            contentContainerStyle={{ paddingBottom: 150 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.modalHandle} />
            <Text style={[styles.modalTitle, isDark && styles.textDark]}>
              New Goal
            </Text>

            {/* Goal Name */}
            <Text
              style={[styles.modalLabel, isDark && styles.textDarkSecondary]}
            >
              GOAL NAME
            </Text>
            <TextInput
              style={[styles.modalInput, isDark && styles.modalInputDark]}
              placeholder="What is your long-term goal?"
              placeholderTextColor="#c3c5d9"
              value={newGoalTitle}
              onChangeText={setNewGoalTitle}
              autoFocus
              returnKeyType="next"
            />

            {/* Description */}
            <Text
              style={[styles.modalLabel, isDark && styles.textDarkSecondary]}
            >
              DESCRIPTION
            </Text>
            <TextInput
              style={[
                styles.modalInput,
                styles.modalInputMultiline,
                isDark && styles.modalInputDark,
              ]}
              placeholder="Describe your goal in detail..."
              placeholderTextColor="#c3c5d9"
              value={newGoalDescription}
              onChangeText={setNewGoalDescription}
              multiline
              numberOfLines={3}
              returnKeyType="next"
            />

            {/* Category */}
            <Text
              style={[styles.modalLabel, isDark && styles.textDarkSecondary]}
            >
              CATEGORY
            </Text>
            <View style={styles.categoryRow}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    newGoalCategory === cat && styles.categoryChipActive,
                  ]}
                  onPress={() =>
                    setNewGoalCategory(newGoalCategory === cat ? "" : cat)
                  }
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      newGoalCategory === cat && styles.categoryChipTextActive,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Priority */}
            <Text
              style={[styles.modalLabel, isDark && styles.textDarkSecondary]}
            >
              PRIORITY
            </Text>
            <View style={styles.categoryRow}>
              {PRIORITIES.map((p) => (
                <TouchableOpacity
                  key={p.value}
                  style={[
                    styles.priorityChip,
                    newGoalPriority === p.value && {
                      backgroundColor: p.color + "20",
                      borderColor: p.color,
                    },
                  ]}
                  onPress={() => setNewGoalPriority(p.value)}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      newGoalPriority === p.value && {
                        color: p.color,
                        fontWeight: "700",
                      },
                    ]}
                  >
                    {p.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Start Date */}
            <DatePickerField
              label="START DATE (OPTIONAL)"
              value={newGoalStartDate}
              onChange={setNewGoalStartDate}
            />

            {/* Target Date */}
            <DatePickerField
              label="TARGET DATE (OPTIONAL)"
              value={newGoalTargetDate}
              onChange={setNewGoalTargetDate}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalBtnCancel}
                onPress={() => {
                  setModalVisible(false);
                  setNewGoalTitle("");
                  setNewGoalDescription("");
                  setNewGoalCategory("");
                  setNewGoalPriority("medium");
                  setNewGoalStartDate("");
                  setNewGoalTargetDate("");
                }}
              >
                <Text style={styles.modalBtnTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalBtnAdd,
                  (!newGoalTitle.trim() || !newGoalStartDate.trim() || !newGoalTargetDate.trim()) && styles.modalBtnDisabled,
                ]}
                onPress={handleAddGoal}
                disabled={!newGoalTitle.trim() || !newGoalStartDate.trim() || !newGoalTargetDate.trim() || isAdding}
              >
                <Text style={styles.modalBtnTextAdd}>
                  {isAdding ? "Adding\u2026" : "Add Goal"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
      <QuickSwitcher
        visible={switcherVisible}
        onClose={() => setSwitcherVisible(false)}
        currentRoute="goals"
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
  scrollContent: { paddingHorizontal: 24, paddingBottom: 120, flexGrow: 1 },
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
    marginBottom: 24,
    lineHeight: 26,
  },
  filterRow: {
    flexDirection: "row",
    backgroundColor: "#e9f2fb",
    borderRadius: 999,
    padding: 4,
    marginBottom: 32,
    alignSelf: "flex-start",
    gap: 4,
  },
  filterChip: { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 999 },
  filterChipActive: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  filterText: {
    fontFamily: "JetBrains Mono",
    fontSize: 11,
    color: "#737688",
    fontWeight: "500",
    letterSpacing: 1.0,
  },
  filterTextActive: { color: "#0041c8", fontWeight: "700" },
  goalCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    minHeight: 240,
    justifyContent: "space-between",
  },
  goalCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  goalTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
  },
  goalTagText: {
    fontFamily: "JetBrains Mono",
    fontSize: 10,
    color: "#ffffff",
    letterSpacing: 1.2,
    fontWeight: "600",
  },
  goalBadgesRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  goalBadge: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  goalBadgeText: {
    fontFamily: "JetBrains Mono",
    fontSize: 9,
    color: "rgba(255,255,255,0.8)",
    letterSpacing: 0.8,
    fontWeight: "600",
  },
  deleteBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  goalTitleText: {
    fontFamily: "Manrope",
    fontSize: 28,
    fontWeight: "600",
    color: "#ffffff",
    lineHeight: 36,
    marginBottom: 8,
  },
  goalDescriptionText: {
    fontFamily: "Manrope",
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    lineHeight: 20,
    marginBottom: 16,
  },
  goalProgressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  goalProgressText: {
    fontFamily: "JetBrains Mono",
    fontSize: 11,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "600",
    letterSpacing: 1.0,
  },
  progressControls: { flexDirection: "row", gap: 12 },
  progressBarBg: {
    height: 5,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 999,
    marginBottom: 8,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 999,
  },
  goalDateText: {
    fontFamily: "JetBrains Mono",
    fontSize: 10,
    color: "rgba(255,255,255,0.6)",
    letterSpacing: 0.5,
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 32,
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
    maxWidth: 300,
  },
  createCard: {
    height: 160,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#dbe4ed",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  createIconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#e9f2fb",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  createText: {
    fontFamily: "Manrope",
    fontSize: 17,
    color: "#141d23",
    fontWeight: "500",
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
    maxHeight: "90%",
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
  modalInputMultiline: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  modalInputDark: {
    backgroundColor: "#141d23",
    borderColor: "#434656",
    color: "#ffffff",
  },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#dbe4ed",
    backgroundColor: "#f6faff",
  },
  categoryChipActive: {
    backgroundColor: "#e9f2fb",
    borderColor: "#0041c8",
  },
  categoryChipText: {
    fontFamily: "JetBrains Mono",
    fontSize: 10,
    color: "#737688",
    fontWeight: "600",
    letterSpacing: 0.8,
  },
  categoryChipTextActive: {
    color: "#0041c8",
  },
  priorityChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#dbe4ed",
    backgroundColor: "#f6faff",
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
