import { ThemeProvider as AppThemeProvider, useAppTheme } from "@/context/ThemeContext";
import { ToastProvider, useToast } from "@/context/ToastContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { supabase } from "@/lib/supabase";
import { registerForPushNotificationsAsync } from "@/lib/notifications";
import { setStoreErrorHandler } from "@/store/useStore";
import { useStore } from "@/store/useStore";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState, useRef } from "react";
import "react-native-reanimated";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const unstable_settings = {
  anchor: "(tabs)",
};

function StoreErrorBridge() {
  const { showToast } = useToast();
  useEffect(() => {
    setStoreErrorHandler((msg) => showToast(msg, "error"));
  }, [showToast]);
  return null;
}

function NotificationsBridge() {
  const { showToast } = useToast();
  const { addNotification } = useStore();
  const notificationListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      const { title, body } = notification.request.content;
      
      let type: any = "reminder";
      if (title?.toLowerCase().includes("habit")) type = "streak";
      if (title?.toLowerCase().includes("goal")) type = "achievement";
      
      const displayTitle = title || "Notification";
      const displayMessage = body || "";
      
      showToast(displayTitle, "info");
      addNotification(type, displayTitle, displayMessage);
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
    };
  }, [showToast, addNotification]);

  return null;
}

function RootNavigation() {
  const { activeTheme } = useAppTheme();
  return (
    <ThemeProvider value={activeTheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
        <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
        <Stack.Screen name="verify-code" options={{ headerShown: false }} />
        <Stack.Screen
          name="set-new-password"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal", title: "Modal" }}
        />
      </Stack>
      <StatusBar style={activeTheme === "dark" ? "light" : "dark"} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [session, setSession] = useState<any>(null);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();
  const segments = useSegments() as string[]; // cast: avoids TS tuple-length literal narrowing
  const { fetchData, clearStore } = useStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitialized(true);
      if (session) {
        registerForPushNotificationsAsync();
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        registerForPushNotificationsAsync();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup =
      segments[0] === "login" ||
      segments[0] === "sign-up" ||
      segments[0] === "forgot-password";

    if (session) {
      fetchData();
      if (inAuthGroup || segments.length === 0) {
        router.replace("/(tabs)");
      }
    } else {
      clearStore();
      if (!inAuthGroup) {
        router.replace("/login");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, initialized, segments]);

  if (!initialized) return null;

  return (
    <AppThemeProvider>
      <ToastProvider>
        <StoreErrorBridge />
        <NotificationsBridge />
        <RootNavigation />
      </ToastProvider>
    </AppThemeProvider>
  );
}
