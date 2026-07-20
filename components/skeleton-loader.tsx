import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, ViewStyle } from "react-native";

interface SkeletonBlockProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

function SkeletonBlock({ width = "100%", height = 20, borderRadius = 8, style }: SkeletonBlockProps) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const opacity = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.85],
  });

  return (
    <Animated.View
      style={[
        { width, height, borderRadius, backgroundColor: "#dbe4ed", opacity },
        style,
      ]}
    />
  );
}

/** A skeleton placeholder for a single task/habit/goal card row */
export function CardSkeleton({ isDark }: { isDark?: boolean }) {
  return (
    <View style={[styles.card, isDark && styles.cardDark]}>
      <SkeletonBlock width={32} height={32} borderRadius={16} />
      <View style={styles.content}>
        <SkeletonBlock height={16} width="70%" borderRadius={8} />
        <SkeletonBlock height={11} width="40%" borderRadius={6} style={{ marginTop: 8 }} />
      </View>
    </View>
  );
}

/** Renders `count` card skeletons */
export function SkeletonList({ count = 4, isDark }: { count?: number; isDark?: boolean }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} isDark={isDark} />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 16,
    borderWidth: 1,
    borderColor: "#f0f3f8",
  },
  cardDark: {
    backgroundColor: "#293138",
    borderColor: "#434656",
  },
  content: {
    flex: 1,
    gap: 4,
  },
});
