import React from 'react';
import { StyleSheet, View, ViewProps, LayoutChangeEvent, Pressable } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  Easing,
  withSpring,
  interpolate
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

interface GlowCardProps extends ViewProps {
  children: React.ReactNode;
  palette: any;
  isDark: boolean;
  borderRadius?: number;
  onPress?: () => void;
}

export const GlowCard = ({ children, palette, isDark, borderRadius = 28, style, onPress, ...props }: GlowCardProps) => {
  const [layout, setLayout] = React.useState({ width: 0, height: 0 });
  const rotation = useSharedValue(0);
  const tiltRotateX = useSharedValue(0);
  const tiltRotateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const isActive = useSharedValue(0);

  // Sitedeki 4s linear dönen lazer kırıntısı
  React.useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 4000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setLayout({ width, height });
  };

  const gesture = Gesture.Pan()
    .onBegin((event) => {
      isActive.value = withTiming(1, { duration: 150 });
      scale.value = withSpring(0.96);
      
      const centerX = layout.width / 2;
      const centerY = layout.height / 2;
      tiltRotateY.value = withSpring(((event.x - centerX) / centerX) * 15);
      tiltRotateX.value = withSpring(((centerY - event.y) / centerY) * 15);
    })
    .onUpdate((event) => {
      const centerX = layout.width / 2;
      const centerY = layout.height / 2;
      tiltRotateY.value = withSpring(((event.x - centerX) / centerX) * 15);
      tiltRotateX.value = withSpring(((centerY - event.y) / centerY) * 15);
    })
    .onFinalize(() => {
      isActive.value = withTiming(0, { duration: 250 });
      scale.value = withSpring(1);
      tiltRotateX.value = withSpring(0);
      tiltRotateY.value = withSpring(0);
    });

  const animatedTilt = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { scale: scale.value },
      { rotateX: `${tiltRotateX.value}deg` },
      { rotateY: `${tiltRotateY.value}deg` },
    ],
  }));

  const animatedBeam = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const beamSize = Math.max(layout.width, layout.height) * 2;

  return (
    <GestureHandlerRootView>
      <GestureDetector gesture={gesture}>
        <Animated.View 
          onLayout={onLayout}
          style={[styles.container, { borderRadius }, animatedTilt, style]}
          {...props}
        >
          {/* Sitedeki .rotating-border-light (The Lazer Beam) */}
          {layout.width > 0 && (
            <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
              <Animated.View style={[
                { width: beamSize, height: beamSize, borderRadius: beamSize / 2 },
                animatedBeam
              ]}>
                <LinearGradient
                  colors={['transparent', palette.primary, 'transparent', palette.primary, 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />
              </Animated.View>
            </View>
          )}

          {/* Sitedeki .glass-panel iç katmanı (1.5px border sızıntısı için marjinli) */}
          <View style={[
            styles.innerContent, 
            { 
              borderRadius: borderRadius - 1.5, 
              backgroundColor: isDark ? '#020617' : '#FFFFFF',
              margin: 1.5 
            }
          ]}>
            <Pressable onPress={onPress} style={{ flex: 1 }}>
              {children}
            </Pressable>
          </View>
        </Animated.View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  innerContent: {
    zIndex: 1,
    flex: 1,
    overflow: 'hidden',
  }
});
