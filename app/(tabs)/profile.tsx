import GlobalHeader from "@/components/global-header";
import QuickSwitcher from "@/components/quick-switcher";
import { useAppTheme } from "@/context/ThemeContext";
import { supabase } from "@/lib/supabase";
import { useStore } from "@/store/useStore";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CLOUDINARY_CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || "demo";
const CLOUDINARY_UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "docs_upload_example_us_preset";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export default function ProfileScreen() {
  const router = useRouter();
  const { activeTheme } = useAppTheme();
  const isDark = activeTheme === "dark";
  const [switcherVisible, setSwitcherVisible] = useState(false);
  const [userName, setUserName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { tasks, habits, goals } = useStore();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      const fullName: string =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "";
      setUserName(fullName.trim());
      if (user.user_metadata?.avatar_url) {
        setAvatarUrl(user.user_metadata.avatar_url);
      }
    });
  }, []);

  // Calculate level based on total completed tasks + habits streaks + goals achieved
  const totalCompletedTasks = tasks.filter((t) => t.completed).length;
  const totalStreakPoints = habits.reduce((s, h) => s + h.streak, 0);
  const goalsAchieved = goals.filter((g) => g.progress >= 100).length;
  const totalPoints =
    totalCompletedTasks * 2 + totalStreakPoints * 3 + goalsAchieved * 10;
  // Dynamic level progression
  const level = Math.max(1, Math.floor(totalPoints / 25) + 1);

  const getLevelTitle = (lvl: number) => {
    if (lvl >= 25) return "VISIONARY MASTER";
    if (lvl >= 20) return "ELITE ACHIEVER";
    if (lvl >= 15) return "GROWTH ARCHITECT";
    if (lvl >= 10) return "DEDICATED STRIVER";
    if (lvl >= 5) return "RISING STAR";
    return "BEGINNER EXPLORER";
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", {
        uri,
        type: "image/jpeg",
        name: "profile.jpg",
      } as any);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const res = await fetch(CLOUDINARY_UPLOAD_URL, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.secure_url) {
        setAvatarUrl(data.secure_url);
        // Save avatar_url to user metadata
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
          await supabase.auth.updateUser({
            data: { avatar_url: data.secure_url },
          });
        }
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <GlobalHeader onOpenSwitcher={() => setSwitcherVisible(true)} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={handlePickImage}
            disabled={uploading}
          >
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={60} color="#c3c5d9" />
              </View>
            )}
            <View style={styles.cameraIconOverlay}>
              <Ionicons name="camera-outline" size={20} color="#ffffff" />
            </View>
          </TouchableOpacity>
          <Text style={[styles.name, isDark && styles.textDark]}>
            {userName}
          </Text>
          <View style={styles.badge}>
            <Ionicons
              name="star-outline"
              size={12}
              color="#0041c8"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.badgeText}>
              LEVEL {level} - {getLevelTitle(level)}
            </Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons
              name="checkmark-circle-outline"
              size={24}
              color="#434656"
            />
            <Text style={styles.statValue}>{totalCompletedTasks}</Text>
            <Text style={styles.statLabel}>TASKS DONE</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="refresh-outline" size={24} color="#434656" />
            <Text style={styles.statValue}>{totalStreakPoints}</Text>
            <Text style={styles.statLabel}>TOTAL STREAK</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="flag-outline" size={24} color="#434656" />
            <Text style={styles.statValue}>{goalsAchieved}</Text>
            <Text style={styles.statLabel}>GOALS MET</Text>
          </View>
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: "#e9f2fb",
                borderColor: "#dbe4ed",
                borderWidth: 1,
              },
            ]}
          >
            <Ionicons name="flash-outline" size={24} color="#0041c8" />
            <Text style={[styles.statValue, { color: "#0041c8" }]}>
              {tasks.length + habits.length + goals.length}
            </Text>
            <Text style={[styles.statLabel, { color: "#0055ff" }]}>
              TOTAL ITEMS
            </Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/(tabs)/settings")}
          >
            <View style={styles.menuLeft}>
              <Ionicons
                name="settings-outline"
                size={20}
                color="#141d23"
                style={styles.menuIcon}
              />
              <Text style={styles.menuText}>Settings</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#c3c5d9" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/(tabs)/notifications")}
          >
            <View style={styles.menuLeft}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color="#141d23"
                style={styles.menuIcon}
              />
              <Text style={styles.menuText}>Notifications</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#c3c5d9" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/(tabs)/appearance")}
          >
            <View style={styles.menuLeft}>
              <Ionicons
                name="color-palette-outline"
                size={20}
                color="#141d23"
                style={styles.menuIcon}
              />
              <Text style={styles.menuText}>Appearance</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#c3c5d9" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/(tabs)/account")}
          >
            <View style={styles.menuLeft}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#141d23"
                style={styles.menuIcon}
              />
              <Text style={styles.menuText}>Account</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#c3c5d9" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/(tabs)/help")}
          >
            <View style={styles.menuLeft}>
              <Ionicons
                name="help-circle-outline"
                size={20}
                color="#141d23"
                style={styles.menuIcon}
              />
              <Text style={styles.menuText}>Help</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#c3c5d9" />
          </TouchableOpacity>

          <View style={styles.menuDivider} />

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomWidth: 0 }]}
            onPress={handleLogout}
          >
            <View style={styles.menuLeft}>
              <Ionicons
                name="log-out-outline"
                size={20}
                color="#ba1a1a"
                style={styles.menuIcon}
              />
              <Text style={[styles.menuText, { color: "#ba1a1a" }]}>
                Logout
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <QuickSwitcher
        visible={switcherVisible}
        onClose={() => setSwitcherVisible(false)}
        currentRoute="profile"
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
    paddingBottom: 24,
  },
  headerTitle: {
    fontFamily: "Manrope",
    fontSize: 20,
    fontWeight: "700",
    color: "#141d23",
  },
  textDark: { color: "#ffffff" },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 120 },
  profileSection: { alignItems: "center", marginBottom: 32 },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    padding: 4,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  avatarImage: {
    width: 112,
    height: 112,
    borderRadius: 56,
  },
  avatarPlaceholder: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: "#e1e3e4",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraIconOverlay: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#0041c8",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontFamily: "Manrope",
    fontSize: 24,
    fontWeight: "600",
    color: "#141d23",
    marginBottom: 12,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e9f2fb",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeText: {
    fontFamily: "JetBrains Mono",
    fontSize: 10,
    fontWeight: "600",
    color: "#0041c8",
    letterSpacing: 1.2,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.02,
    shadowRadius: 40,
    elevation: 2,
  },
  statValue: {
    fontFamily: "Manrope",
    fontSize: 48,
    fontWeight: "700",
    color: "#141d23",
    marginVertical: 8,
    letterSpacing: -0.96,
  },
  statLabel: {
    fontFamily: "JetBrains Mono",
    fontSize: 10,
    fontWeight: "500",
    color: "#141d23",
    letterSpacing: 1.2,
  },
  menuContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.02,
    shadowRadius: 40,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  menuLeft: { flexDirection: "row", alignItems: "center" },
  menuIcon: { marginRight: 16 },
  menuText: {
    fontFamily: "Manrope",
    fontSize: 16,
    color: "#141d23",
    fontWeight: "400",
  },
  menuRight: { flexDirection: "row", alignItems: "center" },
  notificationBadge: {
    backgroundColor: "#0041c8",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  notificationBadgeText: {
    fontFamily: "Manrope",
    fontSize: 12,
    fontWeight: "700",
    color: "#ffffff",
  },
  menuDivider: { height: 1, backgroundColor: "#f6faff", marginVertical: 8 },
});
