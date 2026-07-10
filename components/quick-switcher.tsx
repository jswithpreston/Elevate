import { useAppTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Section = {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: string;
};

const SECTIONS: Section[] = [
  {
    key: "tasks",
    label: "Tasks",
    icon: "checkbox-outline",
    route: "/(tabs)/tasks",
  },
  {
    key: "habits",
    label: "Habits",
    icon: "repeat-outline",
    route: "/(tabs)/habits",
  },
  {
    key: "goals",
    label: "Goals",
    icon: "flag-outline",
    route: "/(tabs)/goals",
  },
  {
    key: "progress",
    label: "Progress",
    icon: "stats-chart-outline",
    route: "/(tabs)/progress",
  },
];

type Props = {
  visible: boolean;
  onClose: () => void;
  currentRoute?: string; // e.g. "progress" to highlight the active section
};

export default function QuickSwitcher({
  visible,
  onClose,
  currentRoute,
}: Props) {
  const { activeTheme } = useAppTheme();
  const isDark = activeTheme === "dark";
  const router = useRouter();

  const handleNavigate = (route: string) => {
    onClose();
    router.push(route as any);
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={[styles.sheet, isDark && styles.sheetDark]}
          // stop backdrop press from closing when tapping inside the sheet
          onPress={() => {}}
        >
          <View style={styles.handle} />
          <Text style={[styles.title, isDark && styles.textDark]}>Jump to</Text>
          <View style={styles.grid}>
            {SECTIONS.map((section) => {
              const isActive = currentRoute === section.key;
              return (
                <TouchableOpacity
                  key={section.key}
                  style={[
                    styles.gridItem,
                    isDark && styles.gridItemDark,
                    isActive && styles.gridItemActive,
                  ]}
                  onPress={() => handleNavigate(section.route)}
                  disabled={isActive}
                >
                  <Ionicons
                    name={section.icon}
                    size={26}
                    color={isActive ? "#FFFFFF" : "#0041c8"}
                  />
                  <Text
                    style={[
                      styles.gridLabel,
                      isDark && styles.textDark,
                      isActive && styles.gridLabelActive,
                    ]}
                  >
                    {section.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  sheetDark: { backgroundColor: "#1F2937" },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D1D5DB",
    alignSelf: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  textDark: { color: "#F9FAFB" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  gridItem: {
    width: "47%",
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: "center",
    gap: 8,
  },
  gridItemDark: { backgroundColor: "#111827" },
  gridItemActive: { backgroundColor: "#0041c8" },
  gridLabel: { fontSize: 14, fontWeight: "600", color: "#111827" },
  gridLabelActive: { color: "#FFFFFF" },
});
