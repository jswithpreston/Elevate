import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type Task = {
  id: string;
  user_id: string;
  title: string;
  completed: boolean;
  start_date: string | null;
  deadline: string | null;
  created_at: string;
};

export type Habit = {
  id: string;
  user_id: string;
  title: string;
  streak: number;
  start_date: string | null;
  last_completed_date: string | null;
  created_at: string;
};

export type NotificationType = "reminder" | "streak" | "achievement";

export type Notification = {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
};

export type Goal = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string | null;
  priority: "low" | "medium" | "high";
  progress: number;
  start_date: string | null;
  target_date: string | null;
  created_at: string;
};

// Global error handler — set by the app root so store can show toasts
let _onError: ((msg: string) => void) | null = null;
export function setStoreErrorHandler(handler: (msg: string) => void) {
  _onError = handler;
}

function reportError(msg: string) {
  console.error(msg);
  _onError?.(msg);
}

interface AppState {
  tasks: Task[];
  habits: Habit[];
  goals: Goal[];
  notifications: Notification[];
  isLoading: boolean;

  fetchData: () => Promise<void>;

  addTask: (
    title: string,
    startDate?: string,
    deadline?: string,
  ) => Promise<void>;
  updateTask: (
    id: string,
    updates: Partial<Pick<Task, "title" | "start_date" | "deadline">>,
  ) => Promise<void>;
  toggleTask: (id: string, currentCompleted: boolean) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;

  addHabit: (title: string, startDate?: string) => Promise<void>;
  completeHabit: (
    id: string,
    currentStreak: number,
    lastCompleted: string | null,
  ) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  /** Checks all habits and resets streak to 0 if last_completed_date is not yesterday or today */
  resetMissedStreaks: () => Promise<void>;

  addGoal: (
    title: string,
    targetDate?: string,
    startDate?: string,
    description?: string,
    category?: string,
    priority?: "low" | "medium" | "high",
  ) => Promise<void>;
  updateGoal: (
    id: string,
    updates: Partial<
      Pick<Goal, "title" | "description" | "category" | "priority" | "start_date" | "target_date">
    >,
  ) => Promise<void>;
  updateGoalProgress: (id: string, progress: number) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;

  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  addNotification: (type: NotificationType, title: string, message: string) => Promise<void>;

  clearStore: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      tasks: [],
      habits: [],
      goals: [],
      notifications: [],
      isLoading: false,

      clearStore: () =>
        set({ tasks: [], habits: [], goals: [], notifications: [], isLoading: false }),

      fetchData: async () => {
        set({ isLoading: true });
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          set({ isLoading: false });
          return;
        }

        const [tasksRes, habitsRes, goalsRes, notifRes] = await Promise.all([
          supabase
            .from("tasks")
            .select("*")
            .order("created_at", { ascending: false }),
          supabase
            .from("habits")
            .select("*")
            .order("created_at", { ascending: false }),
          supabase
            .from("goals")
            .select("*")
            .order("created_at", { ascending: false }),
          supabase
            .from("notifications")
            .select("*")
            .order("created_at", { ascending: false }),
        ]);

        if (tasksRes.error) reportError("Failed to load tasks. Check your connection.");
        if (habitsRes.error) reportError("Failed to load habits. Check your connection.");
        if (goalsRes.error) reportError("Failed to load goals. Check your connection.");
        if (notifRes.error) reportError("Failed to load notifications.");

        set({
          tasks: tasksRes.data || [],
          habits: habitsRes.data || [],
          goals: goalsRes.data || [],
          notifications: notifRes.data || [],
          isLoading: false,
        });

        // Auto-reset missed streaks on fetch
        await get().resetMissedStreaks();
      },

      addTask: async (title, startDate, deadline) => {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return;

        const { data, error } = await supabase
          .from("tasks")
          .insert({
            user_id: userData.user.id,
            title,
            completed: false,
            start_date: startDate || null,
            deadline: deadline || null,
          })
          .select()
          .single();

        if (error) {
          reportError("Failed to add task. Please try again.");
        } else if (data) {
          set((state) => ({ tasks: [data, ...state.tasks] }));
        }
      },

      updateTask: async (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }));
        const { error } = await supabase.from("tasks").update(updates).eq("id", id);
        if (error) {
          reportError("Failed to update task.");
          await get().fetchData();
        }
      },

      toggleTask: async (id, currentCompleted) => {
        // Optimistic update
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, completed: !currentCompleted } : t,
          ),
        }));

        const { error } = await supabase
          .from("tasks")
          .update({ completed: !currentCompleted })
          .eq("id", id);

        if (error) {
          reportError("Failed to update task status.");
          // Revert
          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === id ? { ...t, completed: currentCompleted } : t,
            ),
          }));
        }
      },

      deleteTask: async (id) => {
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
        const { error } = await supabase.from("tasks").delete().eq("id", id);
        if (error) reportError("Failed to delete task.");
      },

      addHabit: async (title, startDate) => {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return;

        const { data, error } = await supabase
          .from("habits")
          .insert({
            user_id: userData.user.id,
            title,
            streak: 0,
            start_date: startDate || null,
            last_completed_date: null,
          })
          .select()
          .single();

        if (error) {
          reportError("Failed to add habit. Please try again.");
        } else if (data) {
          set((state) => ({ habits: [data, ...state.habits] }));
        }
      },

      completeHabit: async (id, currentStreak, lastCompleted) => {
        const today = new Date().toISOString().split("T")[0];
        if (lastCompleted === today) return; // Already completed today

        const newStreak = currentStreak + 1;

        // Optimistic update
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id
              ? { ...h, streak: newStreak, last_completed_date: today }
              : h,
          ),
        }));

        const { error } = await supabase
          .from("habits")
          .update({ streak: newStreak, last_completed_date: today })
          .eq("id", id);

        if (error) {
          reportError("Failed to record habit completion.");
        }
      },

      deleteHabit: async (id) => {
        set((state) => ({ habits: state.habits.filter((h) => h.id !== id) }));
        const { error } = await supabase.from("habits").delete().eq("id", id);
        if (error) reportError("Failed to delete habit.");
      },

      resetMissedStreaks: async () => {
        const today = new Date().toISOString().split("T")[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

        const { habits } = get();
        const toReset = habits.filter(
          (h) =>
            h.streak > 0 &&
            h.last_completed_date !== null &&
            h.last_completed_date !== today &&
            h.last_completed_date !== yesterday,
        );

        if (toReset.length === 0) return;

        // Optimistic reset
        set((state) => ({
          habits: state.habits.map((h) =>
            toReset.find((r) => r.id === h.id) ? { ...h, streak: 0 } : h,
          ),
        }));

        // Persist to DB in parallel
        await Promise.all(
          toReset.map((h) =>
            supabase.from("habits").update({ streak: 0 }).eq("id", h.id),
          ),
        );
      },

      addGoal: async (title, targetDate, startDate, description, category, priority) => {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return;

        const { data, error } = await supabase
          .from("goals")
          .insert({
            user_id: userData.user.id,
            title,
            description: description || null,
            category: category || null,
            priority: priority || "medium",
            progress: 0,
            start_date: startDate || null,
            target_date: targetDate || null,
          })
          .select()
          .single();

        if (error) {
          reportError("Failed to add goal. Please try again.");
        } else if (data) {
          set((state) => ({ goals: [data, ...state.goals] }));
        }
      },

      updateGoal: async (id, updates) => {
        set((state) => ({
          goals: state.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
        }));
        const { error } = await supabase.from("goals").update(updates).eq("id", id);
        if (error) {
          reportError("Failed to update goal.");
          await get().fetchData();
        }
      },

      updateGoalProgress: async (id, progress) => {
        set((state) => ({
          goals: state.goals.map((g) => (g.id === id ? { ...g, progress } : g)),
        }));
        const { error } = await supabase.from("goals").update({ progress }).eq("id", id);
        if (error) reportError("Failed to update goal progress.");
      },

      deleteGoal: async (id) => {
        set((state) => ({ goals: state.goals.filter((g) => g.id !== id) }));
        const { error } = await supabase.from("goals").delete().eq("id", id);
        if (error) reportError("Failed to delete goal.");
      },

      markNotificationAsRead: async (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n,
          ),
        }));
        await supabase.from("notifications").update({ read: true }).eq("id", id);
      },

      markAllNotificationsAsRead: async () => {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return;
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));
        await supabase
          .from("notifications")
          .update({ read: true })
          .eq("user_id", userData.user.id);
      },

      addNotification: async (type, title, message) => {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return;
        const { data, error } = await supabase
          .from("notifications")
          .insert({
            user_id: userData.user.id,
            type,
            title,
            message,
            read: false,
          })
          .select()
          .single();

        if (error) {
          reportError("Failed to save notification.");
        } else if (data) {
          set((state) => ({ notifications: [data, ...state.notifications] }));
        }
      },
    }),
    {
      name: "elevate-store",
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist the data arrays (not loading state)
      partialize: (state) => ({
        tasks: state.tasks,
        habits: state.habits,
        goals: state.goals,
        notifications: state.notifications,
      }),
    },
  ),
);
