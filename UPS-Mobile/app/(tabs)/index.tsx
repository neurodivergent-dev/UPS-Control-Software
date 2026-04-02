import React, { useEffect, useState, useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions, ActivityIndicator, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Power, Activity, Fan, Layers, Clock, Shield, Cpu, Terminal, Battery, Zap, Thermometer } from 'lucide-react-native';
import { useUPSData } from '../../services/upsService';
import Animated, { 
   FadeIn, 
   FadeInUp, 
   useSharedValue, 
   useAnimatedStyle, 
   withTiming, 
   withRepeat, 
   withSequence 
} from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';
import { Svg, Path, Defs, LinearGradient as SvgGradient, Stop, Rect } from 'react-native-svg';

const { width } = Dimensions.get('window');

// Yardımcı: Koyu/Derin Gradiyent Renk Üretici (Siyah -> Accent)
const getDeepColors = (palette: any, isDark: boolean): readonly [string, string] => {
   return isDark
      ? ['#020617', palette.primary + '15']
      : ['#FFFFFF', palette.primary + '08'];
};

import { GlowCard } from '../../components/GlowCard';

// 1. BATTERY STATION
const BatteryMonitor = ({ capacity, remainTime, voltage, theme, palette, isDark }: any) => {
   const cap = parseInt(capacity) || 0;
   const hours = Math.floor(remainTime / 60);
   const mins = remainTime % 60;

   return (
      <GlowCard palette={palette} isDark={isDark} borderRadius={32}>
         <View style={styles.batteryMainCard}>
            <View style={styles.batteryMainHeader}>
               <View style={styles.bTitleRow}>
                  <Battery size={16} color={palette.primary} strokeWidth={2.5} />
                  <Text style={[styles.bTitleText, { color: isDark ? palette.primary : '#000', fontFamily: 'Outfit_700Bold' }]}>ENERGY_RESERVE</Text>
               </View>
               <View style={[styles.bStatusBadge, { backgroundColor: palette.primary + '15' }]}>
                  <Text style={[styles.bStatusText, { color: palette.primary, fontFamily: 'Outfit_900Black' }]}>STABLE</Text>
               </View>
            </View>

            <View style={styles.bContentRow}>
               <View style={styles.bValueColumn}>
                  <Text style={[styles.bPercentValue, { color: isDark ? '#fff' : '#000', fontFamily: 'Outfit_900Black' }]}>{cap}%</Text>
                  <View style={styles.bRuntimeRow}>
                     <Clock size={12} color={palette.primary + '80'} />
                     <Text style={[styles.bRuntimeText, { color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', fontFamily: 'Outfit_700Bold' }]}>
                        {hours}H {mins}M REMAINING
                     </Text>
                  </View>
               </View>
               <View style={styles.bVisualColumn}>
                  <Svg width={70} height={90} viewBox="0 0 80 100">
                     <Defs>
                        <SvgGradient id="batGrad" x1="0" y1="1" x2="0" y2="0">
                           <Stop offset="0" stopColor={palette.primary} />
                           <Stop offset="1" stopColor={palette.secondary} />
                        </SvgGradient>
                     </Defs>
                     <Rect x="10" y="10" width="60" height="80" rx="8" fill="transparent" stroke={palette.primary + '30'} strokeWidth="2" />
                     <Rect x="30" y="2" width="20" height="8" rx="2" fill={palette.primary + '30'} />
                     <Rect x="15" y={90 - (cap * 0.7)} width="50" height={cap * 0.7} rx="5" fill="url(#batGrad)" />
                  </Svg>
               </View>
            </View>

            <View style={[styles.bFooterGrid, { borderTopColor: palette.primary + '10' }]}>
               <View style={styles.bFooterItem}>
                  <Zap size={14} color={palette.primary} />
                  <Text style={[styles.bFooterValue, { color: isDark ? '#fff' : '#000' }]}>{parseFloat(voltage)}V</Text>
               </View>
               <View style={styles.bFooterItem}>
                  <Thermometer size={14} color={palette.primary} />
                  <Text style={[styles.bFooterValue, { color: isDark ? '#fff' : '#000' }]}>32°C</Text>
               </View>
            </View>
         </View>
      </GlowCard>
   );
};

// 2. VOLTAGE MONITOR (FIXED FOR THEME ENGINE)
const VoltageDisplay = ({ voltage, frequency, theme, palette, isDark }: any) => {
   const currentV = parseFloat(voltage) || 0;
   const [history, setHistory] = useState<number[]>([currentV, currentV, currentV, currentV, currentV]);

   useEffect(() => {
      if (currentV > 0) setHistory(prev => [...prev.slice(-9), currentV]);
   }, [currentV]);

   const minV = Math.min(...history).toFixed(1);
   const maxV = Math.max(...history).toFixed(1);
   const avgV = (history.reduce((a, b) => a + b, 0) / history.length).toFixed(1);

   const chartWidth = width - 80;
   const chartHeight = 84;
   const points = history.map((v, i) => ({
      x: (i / (history.length - 1)) * chartWidth,
      y: chartHeight - ((v - 180) / (260 - 180)) * chartHeight
   }));

   const d = `M 0 ${chartHeight} ${points.map(p => `L ${p.x} ${p.y}`).join(' ')} L ${chartWidth} ${chartHeight} Z`;

   return (
      <GlowCard palette={palette} isDark={isDark} borderRadius={28}>
         <View style={styles.voltageCard}>
            <View style={styles.voltageHeader}>
               <View style={styles.vTitleRow}>
                  <View style={[styles.vDot, { backgroundColor: palette.primary }]} />
                  <Text style={[styles.vLabel, { color: palette.primary, fontFamily: 'Outfit_700Bold' }]}>INPUT VOLTAGE</Text>
               </View>
               <View style={[styles.vFreqBadge, { backgroundColor: palette.primary + '15' }]}>
                  <Text style={[styles.vFreqText, { color: palette.primary, fontFamily: 'Outfit_700Bold' }]}>{parseFloat(frequency)} Hz</Text>
               </View>
            </View>

            <View style={styles.vMainRow}>
               <Text style={[styles.vMainValue, { color: isDark ? '#fff' : '#000', fontFamily: 'Outfit_900Black' }]}>{currentV}</Text>
               <Text style={[styles.vMainUnit, { color: palette.primary + '60', fontFamily: 'Outfit_700Bold' }]}>V RMS</Text>
            </View>

            <View style={styles.vStatsGrid}>
               <View style={[styles.vStatBox, { backgroundColor: palette.primary + '10' }]}>
                  <Text style={[styles.vStatLabel, { color: palette.primary + '60' }]}>MIN</Text>
                  <Text style={[styles.vStatValue, { color: isDark ? '#fff' : '#000' }]}>{minV}V</Text>
               </View>
               <View style={[styles.vStatBox, { backgroundColor: palette.primary + '20' }]}>
                  <Text style={[styles.vStatLabel, { color: palette.primary }]}>AVG</Text>
                  <Text style={[styles.vStatValue, { color: palette.primary }]}>{avgV}V</Text>
               </View>
               <View style={[styles.vStatBox, { backgroundColor: palette.primary + '10' }]}>
                  <Text style={[styles.vStatLabel, { color: palette.primary + '60' }]}>MAX</Text>
                  <Text style={[styles.vStatValue, { color: isDark ? '#fff' : '#000' }]}>{maxV}V</Text>
               </View>
            </View>

            <View style={styles.vChartContainer}>
               <Svg width={chartWidth} height={chartHeight}>
                  <Defs>
                     <SvgGradient id="vGrad" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0" stopColor={palette.primary} stopOpacity="0.5" />
                        <Stop offset="1" stopColor={palette.primary} stopOpacity="0" />
                     </SvgGradient>
                  </Defs>
                  <Path d={d} fill="url(#vGrad)" stroke={palette.primary} strokeWidth="2.5" />
               </Svg>
            </View>

            <View style={[styles.vFooter, { borderTopColor: palette.primary + '10' }]}>
               <Text style={[styles.vFooterLabel, { color: palette.primary + '60' }]}>REAL-TIME AUDIT</Text>
               <Text style={[styles.vFooterLabel, { color: palette.primary + '60' }]}>{history.length} SAMPLES</Text>
            </View>
         </View>
      </GlowCard>
   );
};

// 3. TECH GRID CARDS
const TechCard = ({ icon: Icon, label, value, unit, delay, isDark, palette }: any) => {
   return (
      <Animated.View entering={FadeInUp.delay(delay)} style={styles.techCardWrapper}>
         <GlowCard palette={palette} isDark={isDark} borderRadius={24}>
            <View style={styles.techCard}>
               <View style={styles.techCardHeader}>
                  <View style={[styles.techIconBg, { backgroundColor: palette.primary + '10' }]}>
                     <Icon size={14} color={palette.primary} strokeWidth={2.5} />
                  </View>
                  <Text style={[styles.techLabel, { color: isDark ? palette.primary + '80' : 'rgba(0,0,0,0.4)', fontFamily: 'Outfit_700Bold' }]}>{label.toUpperCase()}</Text>
               </View>
               <View style={styles.techContent}>
                  <Text style={[styles.techValue, { color: isDark ? '#fff' : '#000', fontFamily: 'Outfit_700Bold' }]}>{value}</Text>
                  <Text style={[styles.techUnit, { color: palette.primary, fontFamily: 'Outfit_800ExtraBold' }]}>{unit}</Text>
               </View>
               <View style={[styles.techCardFooter, { borderTopColor: palette.primary + '10' }]}>
                  <View style={[styles.techBar, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                     <LinearGradient
                        colors={palette.gradient as any}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                        style={[styles.techBarFill, { width: '60%' }]}
                     />
                  </View>
               </View>
            </View>
         </GlowCard>
      </Animated.View>
   );
};

const PulseBadge = ({ color }: { color: string }) => {
   const opacity = useSharedValue(1);

   useEffect(() => {
      opacity.value = withRepeat(
         withSequence(
            withTiming(0.4, { duration: 800 }),
            withTiming(1, { duration: 800 })
         ),
         -1,
         true
      );
   }, []);

   const animatedStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
   }));

   return <Animated.View style={[styles.statusPulse, { backgroundColor: color }, animatedStyle]} />;
};

export default function MonitorScreen() {
   const { theme, isDark, palette, apiKey, modelId, serverIp } = useTheme();
   const { data, isLoading } = useUPSData(serverIp);
   const [time, setTime] = useState(new Date());
   const insets = useSafeAreaInsets();

   useEffect(() => {
      const timer = setInterval(() => setTime(new Date()), 1000);
      return () => clearInterval(timer);
   }, []);

   if (isLoading) {
      return (
         <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
            <ActivityIndicator color={palette.primary} size="large" />
         </View>
      );
   }

   const workInfo = data?.workInfo;
   const isOnline = workInfo?.workMode === 'Power on' || workInfo?.workMode === 'Online';

   return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
         <View style={[styles.auroraContainer, { opacity: isDark ? 0.3 : 0.1 }]}>
            <LinearGradient colors={[palette.primary + '20', palette.primary + '00'] as any} style={styles.aurora1} />
            <LinearGradient colors={[palette.secondary + '15', palette.secondary + '00'] as any} style={styles.aurora2} />
         </View>

         <ScrollView
            contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 }]}
            showsVerticalScrollIndicator={false}
         >
            <Animated.View entering={FadeIn} style={styles.header}>
               <View>
                  <View style={styles.statusBadge}>
                     <PulseBadge color={palette.primary} />
                     <Text style={[styles.statusText, { color: palette.primary, fontFamily: 'Outfit_900Black' }]}>
                        SYSTEM ONLINE
                     </Text>
                  </View>
                  <Text style={[styles.title, { color: theme.colors.text.primary, fontFamily: 'Outfit_800ExtraBold' }]}>UPS-CORE X1</Text>
               </View>
               <View style={[styles.timeBox, { backgroundColor: isDark ? 'rgba(15, 23, 42, 0.6)' : '#fff', borderColor: palette.primary + '20' }]}>
                  <Text style={[styles.timeText, { color: theme.colors.text.primary, fontFamily: 'Outfit_700Bold' }]}>
                     {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
               </View>
            </Animated.View>

            {/* 1. BATTERY STATION */}
            <Animated.View entering={FadeInUp.delay(100)} style={styles.sectionMargin}>
               <BatteryMonitor
                  capacity={workInfo?.batteryCapacity || '0'}
                  remainTime={workInfo?.batteryRemainTime || 0}
                  voltage={workInfo?.batteryVoltage || '0'}
                  theme={theme} palette={palette} isDark={isDark}
               />
            </Animated.View>

            {/* 2. VOLTAGE MONITOR (NOW THEMED) */}
            <Animated.View entering={FadeInUp.delay(200)} style={styles.sectionMargin}>
               <VoltageDisplay
                  voltage={workInfo?.inputVoltage || '0'} frequency={workInfo?.inputFrequency || '0'}
                  theme={theme} palette={palette} isDark={isDark}
               />
            </Animated.View>

            {/* 3. GRID CARDS */}
            <View style={styles.grid}>
               <TechCard icon={Power} label="Out Voltage" value={parseFloat(workInfo?.outputVoltage || '0').toString()} unit="VAC" isDark={isDark} palette={palette} delay={300} />
               <TechCard icon={Activity} label="System Flow" value={parseFloat(workInfo?.outputCurrent || '0').toString()} unit="A" isDark={isDark} palette={palette} delay={400} />
               <TechCard icon={Fan} label="Thermal Core" value={parseFloat(workInfo?.temperatureView || '0').toString()} unit="°C" isDark={isDark} palette={palette} delay={500} />
               <TechCard icon={Layers} label="Active Load" value={parseInt(workInfo?.outputLoadPercent || '0').toString()} unit="%" isDark={isDark} palette={palette} delay={600} />
            </View>

         </ScrollView>
      </View>
   );
}

const styles = StyleSheet.create({
   container: { flex: 1 },
   auroraContainer: { ...StyleSheet.absoluteFillObject, overflow: 'hidden' },
   aurora1: { position: 'absolute', top: -100, right: -100, width: 300, height: 300, borderRadius: 150 },
   aurora2: { position: 'absolute', bottom: -100, left: -100, width: 300, height: 300, borderRadius: 150 },
   scrollContent: { paddingHorizontal: 20 },
   header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
   statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
   statusPulse: { width: 8, height: 8, borderRadius: 4 },
   statusText: { fontSize: 9, letterSpacing: 2 },
   title: { fontSize: 32, letterSpacing: -1.5 },
   timeBox: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 14, borderWidth: 1.5 },
   timeText: { fontSize: 13 },
   sectionMargin: { marginBottom: 24 },
   batteryMainCard: { borderRadius: 32, padding: 24, borderWidth: 1.5 },
   batteryMainHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
   bTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
   bTitleText: { fontSize: 12, letterSpacing: 1 },
   bStatusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
   bStatusText: { fontSize: 8, letterSpacing: 1.5 },
   bContentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
   bValueColumn: { gap: 4 },
   bPercentValue: { fontSize: 64, letterSpacing: -4 },
   bRuntimeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
   bRuntimeText: { fontSize: 10, letterSpacing: 0.5 },
   bVisualColumn: { width: 70, alignItems: 'center' },
   bFooterGrid: { flexDirection: 'row', borderTopWidth: 1, paddingTop: 16, gap: 12 },
   bFooterItem: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10 },
   bFooterValue: { fontSize: 14, fontFamily: 'Outfit_700Bold' },
   voltageCard: { borderRadius: 28, padding: 24, borderWidth: 1.5 },
   voltageHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
   vTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
   vDot: { width: 8, height: 8, borderRadius: 4 },
   vLabel: { fontSize: 10, letterSpacing: 1 },
   vFreqBadge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
   vFreqText: { fontSize: 12 },
   vMainRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10, marginBottom: 20 },
   vMainValue: { fontSize: 56, letterSpacing: -3 },
   vMainUnit: { fontSize: 12, letterSpacing: 1 },
   vStatsGrid: { flexDirection: 'row', gap: 10, marginBottom: 20 },
   vStatBox: { flex: 1, padding: 12, borderRadius: 12, alignItems: 'center', paddingVertical: 14 },
   vStatLabel: { fontSize: 8, fontFamily: 'Outfit_700Bold', marginBottom: 4 },
   vStatValue: { fontSize: 14, fontFamily: 'Outfit_700Bold' },
   vChartContainer: { height: 80, marginBottom: 12, alignItems: 'center' },
   vFooter: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, paddingTop: 12 },
   vFooterLabel: { fontSize: 8, fontFamily: 'Outfit_700Bold', letterSpacing: 0.5 },
   grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
   techCardWrapper: { width: (width - 52) / 2 },
   techCard: { borderRadius: 24, padding: 20, borderWidth: 1.5 },
   techCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
   techIconBg: { width: 28, height: 28, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
   techLabel: { fontSize: 8, fontFamily: 'Outfit_700Bold', letterSpacing: 1 },
   techContent: { flexDirection: 'row', alignItems: 'baseline', gap: 4, marginBottom: 14 },
   techValue: { fontSize: 24 },
   techUnit: { fontSize: 10 },
   techCardFooter: { paddingTop: 14, borderTopWidth: 1 },
   techBar: { height: 4, borderRadius: 2, overflow: 'hidden' },
   techBarFill: { height: '100%', borderRadius: 2 },
   center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
