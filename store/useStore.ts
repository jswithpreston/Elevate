import { supabase } from "@/lib/supabase";
import { create } from "zustand";

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

interface AppState {
  tasks: Task[];
  habits: Habit[];
  goals: Goal[];
  notifications: Notification[];

  fetchData: () => Promise<void>;

  addTask: (
    title: string,
    startDate?: string,
    deadline?: string,
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

  addGoal: (
    title: string,
    targetDate?: string,
    startDate?: string,
    description?: string,
    category?: string,
    priority?: "low" | "medium" | "high",
  ) => Promise<void>;
  updateGoalProgress: (id: string, progress: number) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;

  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
  addNotification: (type: NotificationType, title: string, message: string) => Promise<void>;

  clearStore: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  tasks: [],
  habits: [],
  goals: [],
  notifications: [],

  clearStore: () => set({ tasks: [], habits: [], goals: [], notifications: [] }),

  fetchData: async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;

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

    set({
      tasks: tasksRes.data || [],
      habits: habitsRes.data || [],
      goals: goalsRes.data || [],
      notifications: notifRes.data || [],
    });
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

    if (error) console.error("Error adding task:", error);
    if (!error && data) {
      set((state) => ({ tasks: [data, ...state.tasks] }));
    }
  },

  toggleTask: async (id, currentCompleted) => {
    // Optimistic update
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, completed: !currentCompleted } : t,
      ),
    }));

    await supabase
      .from("tasks")
      .update({ completed: !currentCompleted })
      .eq("id", id);
  },

  deleteTask: async (id) => {
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
    await supabase.from("tasks").delete().eq("id", id);
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

    if (error) console.error("Error adding habit:", error);
    if (!error && data) {
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

    await supabase
      .from("habits")
      .update({
        streak: newStreak,
        last_completed_date: today,
      })
      .eq("id", id);
  },

  deleteHabit: async (id) => {
    set((state) => ({ habits: state.habits.filter((h) => h.id !== id) }));
    await supabase.from("habits").delete().eq("id", id);
  },

  addGoal: async (
    title,
    targetDate,
    startDate,
    description,
    category,
    priority,
  ) => {
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

    if (error) console.error("Error adding goal:", error);
    if (!error && data) {
      set((state) => ({ goals: [data, ...state.goals] }));
    }
  },

  updateGoalProgress: async (id, progress) => {
    set((state) => ({
      goals: state.goals.map((g) => (g.id === id ? { ...g, progress } : g)),
    }));
    await supabase.from("goals").update({ progress }).eq("id", id);
  },

  deleteGoal: async (id) => {
    set((state) => ({ goals: state.goals.filter((g) => g.id !== id) }));
    await supabase.from("goals").delete().eq("id", id);
  },

  markNotificationAsRead: async (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
    await supabase.from("notifications").update({ read: true }).eq("id", id);
  },

  markAllNotificationsAsRead: async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));
    await supabase.from("notifications").update({ read: true }).eq("user_id", userData.user.id);
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

    if (error) console.error("Error adding notification:", error);
    if (!error && data) {
      set((state) => ({ notifications: [data, ...state.notifications] }));
    }
  },
}));
