import React from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { History, ShieldCheck, Activity, Info, AlertTriangle, Clock } from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { GlowCard } from '../../components/GlowCard';

const { width } = Dimensions.get('window');

const LogItem = ({ date, time, title, subtitle, status = "INFO", isDark, palette, delay }: any) => (
  <Animated.View entering={FadeInDown.delay(delay)} style={styles.logWrapper}>
    <GlowCard palette={palette} isDark={isDark} borderRadius={20}>
      <View style={styles.logCard}>
        <View style={styles.logLeft}>
           <Text style={[styles.logDate, { color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontFamily: 'Outfit_700Bold' }]}>{date}</Text>
           <Text style={[styles.logTime, { color: isDark ? '#fff' : '#000', fontFamily: 'Outfit_900Black' }]}>{time}</Text>
        </View>

        <View style={styles.logMiddle}>
           <View style={styles.logTitleRow}>
              <View style={[styles.statusDot, { backgroundColor: status === "WARN" ? '#ffae00' : palette.primary }]} />
              <Text style={[styles.logTitle, { color: isDark ? '#fff' : '#000', fontFamily: 'Outfit_800ExtraBold' }]}>{title.toUpperCase()}</Text>
           </View>
           <Text style={[styles.logSubtitle, { color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)', fontFamily: 'Outfit_600SemiBold' }]}>{subtitle.toUpperCase()}</Text>
        </View>

        <View style={[styles.statusBadge, { borderColor: status === "WARN" ? '#ffae0040' : palette.primary + '25' }]}>
           <Text style={[styles.statusText, { color: status === "WARN" ? '#ffae00' : palette.primary, fontFamily: 'Outfit_900Black' }]}>{status}</Text>
        </View>
      </View>
    </GlowCard>
  </Animated.View>
);

export default function LogsScreen() {
  const { theme, isDark, palette } = useTheme();
  const insets = useSafeAreaInsets();

  const logs = [
    { date: "31 MAR", time: "16:24:55", title: "UTILITY GRID: STABLE LINK ESTABLISHED", subtitle: "USB_4A0DAEE", status: "INFO" },
    { date: "31 MAR", time: "15:10:02", title: "SYSTEM NODE SYNC: 200 OK", subtitle: "KERNEL_ROOT", status: "INFO" },
    { date: "31 MAR", time: "13:45:12", title: "BATTERY CELL HEALTH: 100% CALIBRATED", subtitle: "BATT_LAYER_1", status: "INFO" },
    { date: "31 MAR", time: "09:12:33", title: "BUZZER NODE: MUTED BY ADMIN", subtitle: "HARDWARE_IO", status: "WARN" },
    { date: "30 MAR", time: "22:05:14", title: "GRID INPUT LOSS: AUTO-SWITCH ACTIVE", subtitle: "VECTOR_SCAN", status: "WARN" },
    { date: "30 MAR", time: "21:40:02", title: "COOLING FAN STARTUP: NORMAL", subtitle: "THERMAL_CORE", status: "INFO" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <Animated.View entering={FadeIn} style={styles.header}>
           <View style={styles.headerLeft}>
              <View style={[styles.headerIcon, { backgroundColor: palette.primary }]}>
                <History size={20} color="#fff" />
              </View>
              <View>
                <Text style={[styles.headerTitle, { color: theme.colors.text.primary, fontFamily: 'Outfit_800ExtraBold' }]}>EVENT HORIZON</Text>
                <Text style={[styles.headerSubtitle, { color: theme.colors.text.tertiary, fontFamily: 'Outfit_600SemiBold' }]}>TEMPORAL NODE ACTIVITY LOG</Text>
              </View>
           </View>
           
           <View style={[styles.streamBadge, { borderColor: palette.primary + '40' }]}>
              <View style={[styles.liveDot, { backgroundColor: palette.primary }]} />
              <Text style={[styles.streamText, { color: palette.primary, fontFamily: 'Outfit_800ExtraBold' }]}>REAL-TIME STREAM</Text>
           </View>
        </Animated.View>

        {/* Shield Status Panel */}
        <Animated.View entering={FadeInUp.delay(100)} style={styles.sectionMargin}>
           <View style={styles.sectionHeaderRow}>
              <ShieldCheck size={14} color={palette.primary} />
              <Text style={[styles.sectionHeaderText, { color: palette.primary, fontFamily: 'Outfit_800ExtraBold' }]}>CRITICAL VECTOR ANALYSIS</Text>
           </View>
           
           <GlowCard palette={palette} isDark={isDark} borderRadius={28}>
              <View style={styles.shieldCard}>
                <View style={[styles.shieldIconBox, { backgroundColor: palette.primary }]}>
                   <ShieldCheck size={24} color="#fff" strokeWidth={2.5} />
                </View>
                <View style={styles.shieldContent}>
                   <Text style={[styles.shieldLabel, { color: palette.primary, fontFamily: 'Outfit_800ExtraBold' }]}>SHIELD STATUS</Text>
                   <Text style={[styles.shieldText, { color: isDark ? '#fff' : '#000', fontFamily: 'Outfit_700Bold' }]}>
                      ALL SYSTEMS NOMINAL. NO HARDWARE BREACHES.
                   </Text>
                </View>
              </View>
           </GlowCard>
        </Animated.View>

        {/* Temporal Node History Section */}
        <View style={styles.sectionMargin}>
           <View style={styles.sectionHeaderRow}>
              <Activity size={14} color={palette.primary} />
              <Text style={[styles.sectionHeaderText, { color: palette.primary, fontFamily: 'Outfit_800ExtraBold' }]}>TEMPORAL NODE HISTORY</Text>
           </View>
           
           <View style={styles.logsContainer}>
              {logs.map((log, index) => (
                <LogItem key={index} {...log} isDark={isDark} palette={palette} delay={200 + (index * 100)} />
              ))}
           </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 22, letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 10, letterSpacing: 1.5, marginTop: 2 },
  streamBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1, marginTop: 4 },
  liveDot: { width: 6, height: 6, borderRadius: 3 },
  streamText: { fontSize: 8, letterSpacing: 1 },
  sectionMargin: { marginBottom: 24 },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  sectionHeaderText: { fontSize: 10, letterSpacing: 1.5 },
  shieldCard: { padding: 24, flexDirection: 'row', alignItems: 'center', gap: 20 }, // Removed border and borderRadius here as GlowCard handles it
  shieldIconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  shieldContent: { flex: 1, gap: 4 },
  shieldLabel: { fontSize: 9, letterSpacing: 1.5 },
  shieldText: { fontSize: 14, letterSpacing: 0.5 },
  logsContainer: { gap: 12 },
  logWrapper: { width: '100%' },
  logCard: { borderRadius: 24, padding: 18, borderWidth: 1.5, flexDirection: 'row', alignItems: 'center', gap: 16 },
  logLeft: { width: 70, gap: 2 },
  logDate: { fontSize: 8, letterSpacing: 1 },
  logTime: { fontSize: 10, letterSpacing: 0.5 },
  logMiddle: { flex: 1, gap: 4 },
  logTitleRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  logTitle: { fontSize: 10, letterSpacing: 0.2 },
  logSubtitle: { fontSize: 8, letterSpacing: 1, opacity: 0.6 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },
  statusText: { fontSize: 8, letterSpacing: 1.5 },
});
