import DatePickerField from "@/components/date-picker-field";
import GlobalHeader from "@/components/global-header";
import QuickSwitcher from "@/components/quick-switcher";
import { useAppTheme } from "@/context/ThemeContext";
import { scheduleTaskReminder } from "@/lib/notifications";
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

function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

export default function TasksScreen() {
  const { activeTheme } = useAppTheme();
  const isDark = activeTheme === "dark";
  const router = useRouter();
  const [switcherVisible, setSwitcherVisible] = useState(false);

  const { tasks, addTask, toggleTask, deleteTask } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("All");

  const [modalVisible, setModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskStartDate, setNewTaskStartDate] = useState("");
  const [newTaskDeadline, setNewTaskDeadline] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddTask = async () => {
    if (!newTaskTitle.trim() || isAdding) return;
    setIsAdding(true);
    await addTask(
      newTaskTitle.trim(),
      newTaskStartDate,
      newTaskDeadline,
    );
    if (newTaskDeadline) {
      try {
        await scheduleTaskReminder(newTaskTitle.trim(), newTaskTitle.trim(), newTaskDeadline);
      } catch (e) {
        console.warn("Failed to schedule reminder:", e);
      }
    }
    setNewTaskTitle("");
    setNewTaskStartDate("");
    setNewTaskDeadline("");
    setModalVisible(false);
    setIsAdding(false);
  };

  const filteredTasks = tasks.filter((task) => {
    if (
      searchQuery &&
      !task.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (filter === "Pending" && task.completed) return false;
    if (filter === "Completed" && !task.completed) return false;
    return true;
  });

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      {/* Header */}
      <GlobalHeader onOpenSwitcher={() => setSwitcherVisible(true)} title="Tasks" />

      {/* Summary row */}
      {tasks.length > 0 && (
        <View style={styles.summaryRow}>
          <View style={[styles.summaryChip, { backgroundColor: "#e9f2fb" }]}>
            <Text style={[styles.summaryChipText, { color: "#0041c8" }]}>
              {pendingCount} PENDING
            </Text>
          </View>
          <View style={[styles.summaryChip, { backgroundColor: "#e6eff8" }]}>
            <Text style={[styles.summaryChipText, { color: "#434656" }]}>
              {completedCount} DONE
            </Text>
          </View>
        </View>
      )}

      {/* Search */}
      <View
        style={[styles.searchContainer, isDark && styles.searchContainerDark]}
      >
        <Ionicons
          name="search-outline"
          size={18}
          color="#737688"
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, isDark && styles.searchInputDark]}
          placeholder="Search tasks..."
          placeholderTextColor="#c3c5d9"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={18} color="#737688" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter pills */}
      <View style={styles.filterRow}>
        {["All", "Pending", "Completed"].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
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

      {/* List */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <View
              key={task.id}
              style={[styles.taskCard, isDark && styles.taskCardDark]}
            >
              <TouchableOpacity
                onPress={() => toggleTask(task.id, task.completed)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <View
                  style={[styles.radio, task.completed && styles.radioFilled]}
                >
                  {task.completed && (
                    <Ionicons name="checkmark" size={14} color="#fff" />
                  )}
                </View>
              </TouchableOpacity>

              <View style={styles.taskCardContent}>
                <Text
                  style={[
                    styles.taskCardTitle,
                    isDark && styles.textDark,
                    task.completed && styles.taskCardTitleCompleted,
                  ]}
                  numberOfLines={2}
                >
                  {task.title}
                </Text>
                <Text style={styles.taskCardTime}>
                  {formatRelativeTime(task.created_at)}
                </Text>
                {task.deadline && (
                  <Text
                    style={[
                      styles.taskCardDeadline,
                      new Date(task.deadline) < new Date() && !task.completed
                        ? styles.taskCardDeadlineOverdue
                        : null,
                    ]}
                  >
                    Due: {new Date(task.deadline).toLocaleDateString()}
                  </Text>
                )}
              </View>

              <TouchableOpacity
                onPress={() => deleteTask(task.id)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="trash-outline" size={18} color="#c3c5d9" />
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons
              name={
                filter === "Completed"
                  ? "checkmark-circle-outline"
                  : "document-text-outline"
              }
              size={56}
              color="#dbe4ed"
            />
            <Text style={styles.emptyTitle}>
              {filter === "All" && tasks.length === 0
                ? "No tasks yet"
                : filter === "Completed"
                  ? "No completed tasks"
                  : "All caught up!"}
            </Text>
            <Text style={styles.emptySubtitle}>
              {filter === "All" && tasks.length === 0
                ? "Tap + to add your first task."
                : filter === "Pending"
                  ? "You have no pending tasks right now."
                  : "Complete a task to see it here."}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={30} color="#ffffff" />
      </TouchableOpacity>

      {/* Add Task Modal */}
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
              New Task
            </Text>
            <TextInput
              style={[styles.modalInput, isDark && styles.modalInputDark]}
              placeholder="What do you need to do?"
              placeholderTextColor="#c3c5d9"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              autoFocus
              returnKeyType="next"
            />
            <DatePickerField
              label="START DATE (OPTIONAL)"
              value={newTaskStartDate}
              onChange={setNewTaskStartDate}
            />
            <DatePickerField
              label="DEADLINE (OPTIONAL)"
              value={newTaskDeadline}
              onChange={setNewTaskDeadline}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalBtnCancel}
                onPress={() => {
                  setModalVisible(false);
                  setNewTaskTitle("");
                  setNewTaskStartDate("");
                  setNewTaskDeadline("");
                }}
              >
                <Text style={styles.modalBtnTextCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalBtnAdd,
                  !newTaskTitle.trim() && styles.modalBtnDisabled,
                ]}
                onPress={handleAddTask}
                disabled={!newTaskTitle.trim() || isAdding}
              >
                <Text style={styles.modalBtnTextAdd}>
                  {isAdding ? "Adding\u2026" : "Add Task"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
      <QuickSwitcher
        visible={switcherVisible}
        onClose={() => setSwitcherVisible(false)}
        currentRoute="tasks"
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
    paddingBottom: 16,
  },
  headerTitle: {
    fontFamily: "Manrope",
    fontSize: 24,
    fontWeight: "700",
    color: "#141d23",
  },
  textDark: { color: "#ffffff" },
  textDarkSecondary: { color: "#c3c5d9" },
  summaryRow: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginBottom: 16,
    gap: 8,
  },
  summaryChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  summaryChipText: {
    fontFamily: "JetBrains Mono",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.8,
  },
  searchContainer: {
    marginHorizontal: 24,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ecf5fe",
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#dbe4ed",
  },
  searchContainerDark: { backgroundColor: "#293138", borderColor: "#434656" },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    paddingVertical: 13,
    fontFamily: "Manrope",
    fontSize: 15,
    color: "#141d23",
  },
  searchInputDark: { color: "#ffffff" },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#dbe4ed",
    backgroundColor: "#ffffff",
  },
  filterChipActive: { backgroundColor: "#0041c8", borderColor: "#0041c8" },
  filterText: {
    fontFamily: "JetBrains Mono",
    fontSize: 11,
    color: "#434656",
    letterSpacing: 0.5,
  },
  filterTextActive: { color: "#ffffff" },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 120, flexGrow: 1 },
  taskCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f0f3f8",
  },
  taskCardDark: { backgroundColor: "#293138", borderColor: "#434656" },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#c3c5d9",
    marginRight: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  radioFilled: { backgroundColor: "#0041c8", borderColor: "#0041c8" },
  taskCardContent: { flex: 1, marginRight: 12 },
  taskCardTitle: {
    fontFamily: "Manrope",
    fontSize: 16,
    fontWeight: "500",
    color: "#141d23",
    marginBottom: 4,
    lineHeight: 22,
  },
  taskCardTitleCompleted: {
    textDecorationLine: "line-through",
    color: "#c3c5d9",
  },
  taskCardTime: {
    fontFamily: "JetBrains Mono",
    fontSize: 11,
    color: "#737688",
    letterSpacing: 0.3,
  },
  taskCardDeadline: {
    fontFamily: "JetBrains Mono",
    fontSize: 11,
    color: "#737688",
    letterSpacing: 0.3,
    marginTop: 2,
  },
  taskCardDeadlineOverdue: {
    color: "#ba1a1a",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
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
  },
  fab: {
    position: "absolute",
    bottom: 32,
    right: 24,
    width: 62,
    height: 62,
    borderRadius: 20,
    backgroundColor: "#0041c8",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0041c8",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 6,
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
