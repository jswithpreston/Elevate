import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

interface Props {
  onFinish: () => void;
}

export function CustomSplashScreen({ onFinish }: Props) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 10000,
      useNativeDriver: false, // width interpolation doesn't support native driver easily without reanimated
    }).start(() => {
      onFinish();
    });
  }, [progress, onFinish]);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.glow} />
      
      <View style={styles.content}>
        {/* Logo Placeholder: Left empty space for future logo */}
        <View style={styles.logoPlaceholder} />
        
        <Text style={styles.title}>Elevate</Text>
        <Text style={styles.subtitle}>Your Personal Growth OS</Text>
      </View>

      <View style={styles.loadingContainer}>
        <View style={styles.loadingTrack}>
          <Animated.View style={[styles.loadingFill, { width }]} />
        </View>
      </View>
    </View>
  );
}

const { width: screenWidth } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  glow: {
    position: 'absolute',
    width: screenWidth * 1.5,
    height: screenWidth * 1.5,
    borderRadius: screenWidth,
    backgroundColor: '#0A1128', // Dark blue subtle glow
    opacity: 0.6,
  },
  content: {
    alignItems: 'center',
    zIndex: 1,
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 24,
    backgroundColor: '#161d36', // Very subtle placeholder box
    marginBottom: 24,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: '700',
    letterSpacing: -1,
  },
  subtitle: {
    color: '#E0E0E0',
    fontSize: 18,
    marginTop: 8,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 80,
    width: '50%',
    alignItems: 'center',
  },
  loadingTrack: {
    width: '100%',
    height: 4,
    backgroundColor: '#333333',
    borderRadius: 2,
    overflow: 'hidden',
  },
  loadingFill: {
    height: '100%',
    backgroundColor: '#7C9BFF', // Match typical brand blue/purple
    borderRadius: 2,
  },
});
