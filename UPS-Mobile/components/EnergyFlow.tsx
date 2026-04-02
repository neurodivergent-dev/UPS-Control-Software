import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import {
  Canvas,
  Circle,
  Group,
  Path,
  Skia,
} from '@shopify/react-native-skia';
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  useDerivedValue
} from 'react-native-reanimated';
import { Power, Cpu, Activity } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';

const { width } = Dimensions.get('window');

interface EnergyFlowProps {
  workMode: string;
  loadPercent: number;
}

const CARD_INNER_WIDTH = width - 64;

export const EnergyFlow = ({ workMode, loadPercent }: EnergyFlowProps) => {
  const { theme } = useTheme();
  const isBatteryMode = workMode.toLowerCase().includes('battery') || workMode.toLowerCase().includes('on battery');
  const accentColor = isBatteryMode ? '#ef4444' : '#BC00FF';

  const duration = Math.max(800, 3000 - (loadPercent * 20));

  const path = useMemo(() => {
    const p = Skia.Path.Make();
    const startX = 50;
    const endX = CARD_INNER_WIDTH - 50;
    const y = 50;

    p.moveTo(startX, y);
    p.cubicTo(startX + 60, y, startX + 60, y, CARD_INNER_WIDTH / 2 - 30, y);
    p.moveTo(CARD_INNER_WIDTH / 2 + 30, y);
    p.cubicTo(CARD_INNER_WIDTH / 2 + 90, y, CARD_INNER_WIDTH / 2 + 90, y, endX, y);
    return p;
  }, []);

  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas}>
        <Group>
          <Path
            path={path}
            color={accentColor}
            style="stroke"
            strokeWidth={2}
            opacity={0.2}
          />

          {[...Array(4)].map((_, i) => (
            <SkiaParticle
              key={i}
              index={i}
              total={4}
              duration={duration}
              color={accentColor}
              delay={i * (duration / 4)}
              theme={theme}
            />
          ))}
        </Group>
      </Canvas>

      <View style={styles.nodeRow}>
        <FlowNode
          label="GRID"
          icon={Power}
          active={!isBatteryMode}
          color={!isBatteryMode ? theme.colors.accent.primary : theme.colors.text.tertiary}
          theme={theme}
        />
        <FlowNode
          label="CORE"
          icon={Cpu}
          active={true}
          color={accentColor}
          isCore
          theme={theme}
        />
        <FlowNode
          label="LOAD"
          icon={Activity}
          active={loadPercent > 0}
          color={loadPercent > 0 ? theme.colors.accent.success : theme.colors.text.tertiary}
          theme={theme}
        />
      </View>
    </View>
  );
};

const FlowNode = ({ label, icon: Icon, active, color, isCore, theme }: any) => (
  <View style={[
    styles.node,
    isCore && styles.coreNode,
    {
      backgroundColor: theme.colors.backgroundSecondary,
      borderColor: active ? color : theme.colors.border,
      borderWidth: 1,
    }
  ]}>
    <View style={[
      styles.iconBg,
      { backgroundColor: active ? `${color}15` : 'transparent' }
    ]}>
      <Icon size={isCore ? 20 : 16} color={active ? color : theme.colors.text.tertiary} strokeWidth={2} />
    </View>
    <Text style={[
      styles.nodeText,
      { color: active ? color : theme.colors.text.tertiary }
    ]}>
      {label}
    </Text>
    {active && <View style={[styles.activeDot, { backgroundColor: color }]} />}
  </View>
);

const SkiaParticle = ({ index, total, duration, color, delay, theme }: any) => {
  const progress = useSharedValue(-0.2);

  useEffect(() => {
    progress.value = -0.2;
    const timeout = setTimeout(() => {
      progress.value = withRepeat(
        withTiming(1.2, { duration, easing: Easing.linear }),
        -1,
        false
      );
    }, delay);

    return () => clearTimeout(timeout);
  }, [duration, delay]);

  const cx = useDerivedValue(() => {
    const totalDist = CARD_INNER_WIDTH - 100;
    return 50 + (progress.value * totalDist);
  });

  return (
    <Circle cx={cx} cy={50} r={3} color={color} opacity={0.6} />
  );
};

const styles = StyleSheet.create({
  container: {
    height: 120,
    justifyContent: 'center',
  },
  canvas: {
    ...StyleSheet.absoluteFillObject,
  },
  nodeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingTop: 60,
  },
  node: {
    width: 56,
    height: 64,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  coreNode: {
    width: 68,
    height: 76,
    borderRadius: 16,
    transform: [{ translateY: -6 }],
  },
  iconBg: {
    padding: 8,
    borderRadius: 10,
  },
  nodeText: {
    fontSize: 8,
    fontFamily: 'Outfit_600SemiBold',
    letterSpacing: 0.3,
  },
  activeDot: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 4,
    height: 4,
    borderRadius: 2,
  }
});
