import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type ToastType = "success" | "error" | "info";

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({
  showToast: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

let _nextId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = _nextId++;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <View style={styles.container} pointerEvents="none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </View>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast }: { toast: ToastMessage }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(opacity, {
        toValue: 1,
        useNativeDriver: true,
        tension: 120,
        friction: 8,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 120,
        friction: 8,
      }),
    ]).start();
  }, []);

  const iconName =
    toast.type === "success"
      ? "checkmark-circle"
      : toast.type === "error"
        ? "alert-circle"
        : "information-circle";

  const iconColor =
    toast.type === "success"
      ? "#22c55e"
      : toast.type === "error"
        ? "#ba1a1a"
        : "#0041c8";

  const borderColor =
    toast.type === "success"
      ? "#86efac"
      : toast.type === "error"
        ? "#fca5a5"
        : "#b6c4ff";

  return (
    <Animated.View
      style={[
        styles.toast,
        { borderLeftColor: borderColor, opacity, transform: [{ translateY }] },
      ]}
    >
      <Ionicons name={iconName as any} size={20} color={iconColor} />
      <Text style={styles.toastText}>{toast.message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 100,
    left: 16,
    right: 16,
    zIndex: 9999,
    gap: 8,
  },
  toast: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  toastText: {
    fontFamily: "Manrope",
    fontSize: 14,
    color: "#141d23",
    flex: 1,
    lineHeight: 20,
  },
});
