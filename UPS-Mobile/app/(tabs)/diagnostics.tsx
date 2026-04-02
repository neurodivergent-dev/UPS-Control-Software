import React from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { ShieldCheck, Zap, Thermometer, Gauge, Battery, Activity, Cpu } from 'lucide-react-native';
import { useUPSData } from '../../services/upsService';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

import { GlowCard } from '../../components/GlowCard';

const DiagnosticCard = ({ 
  icon: Icon, 
  title, 
  value, 
  subtitle, 
  status = "NOMINAL",
  index,
  theme,
  isDark,
  palette
}: { 
  icon: any, 
  title: string, 
  value: string, 
  subtitle: string, 
  status?: string,
  index: number,
  theme: any,
  isDark: boolean,
  palette: any
}) => {
  return (
    <Animated.View 
      entering={FadeInDown.delay(index * 100).duration(600).springify()}
      style={styles.techCardWrapper}
    >
      <GlowCard palette={palette} isDark={isDark} borderRadius={24}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconBg, { backgroundColor: palette.primary + '10' }]}>
              <Icon size={14} color={palette.primary} strokeWidth={2.5} />
            </View>
            <View style={[styles.statusBadge, { backgroundColor: palette.primary + '15' }]}>
              <Text style={[styles.statusText, { color: palette.primary, fontFamily: 'Outfit_900Black' }]}>{status}</Text>
            </View>
          </View>
          
          <View style={styles.cardBody}>
            <Text style={[styles.cardTitle, { color: isDark ? palette.primary + '80' : 'rgba(0,0,0,0.4)', fontFamily: 'Outfit_700Bold' }]}>{title.toUpperCase()}</Text>
            <View style={styles.valueRow}>
              <Text style={[styles.cardValue, { color: isDark ? '#fff' : '#000', fontFamily: 'Outfit_700Bold' }]}>{value}</Text>
            </View>
            <Text style={[styles.cardSubtitle, { color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.3)', fontFamily: 'Outfit_500Medium' }]}>{subtitle}</Text>
          </View>

          <View style={[styles.cardFooter, { borderTopColor: palette.primary + '10' }]}>
            <View style={[styles.progressBar, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
              <LinearGradient
                  colors={palette.gradient as any}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={[styles.progressFill, { width: '70%' }]}
              />
            </View>
          </View>
        </View>
      </GlowCard>
    </Animated.View>
  );
};

export default function DiagnosticScreen() {
  const { theme, isDark, palette, serverIp } = useTheme();
  const { data } = useUPSData(serverIp);
  const insets = useSafeAreaInsets();

  const workInfo = data?.workInfo;

  const diagnostics = [
    {
      icon: Zap,
      title: "UTILITY GRID PHASE",
      value: `${parseFloat(workInfo?.inputVoltage || '0')} VAC`,
      subtitle: `${parseFloat(workInfo?.inputFrequency || '0')}HZ GRID SYNC`,
      status: "NOMINAL"
    },
    {
      icon: Thermometer,
      title: "THERMAL PROFILE",
      value: `${parseFloat(workInfo?.temperatureView || '0')} °C`,
      subtitle: "COOLING ACTIVE",
      status: "NOMINAL"
    },
    {
      icon: Gauge,
      title: "LOAD REGULATION",
      value: `${parseInt(workInfo?.outputLoadPercent || '0')}%`,
      subtitle: "PROCESSING TASK",
      status: parseInt(workInfo?.outputLoadPercent || '0') > 80 ? "CRITICAL" : "NOMINAL"
    },
    {
      icon: Battery,
      title: "CELL CAPACITY",
      value: `${parseInt(workInfo?.batteryCapacity as any || '0')}%`,
      subtitle: `${parseFloat(workInfo?.batteryVoltage || '0')} VDC RESERVE`,
      status: (parseInt(workInfo?.batteryCapacity as any || '0')) < 20 ? "LOW" : "NOMINAL"
    },
    {
      icon: Activity,
      title: "BACK-UP VECTOR",
      value: `${parseInt(workInfo?.batteryRemainTime as any || '0')} MIN`,
      subtitle: "ESTIMATED ORBIT",
      status: "NOMINAL"
    },
    {
      icon: Cpu,
      title: "NODE REGISTRY",
      value: "ONLINE",
      subtitle: "USB-4A0DAEE",
      status: "NOMINAL"
    }
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <Animated.View entering={FadeInUp.duration(800)} style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.headerIcon, { backgroundColor: theme.colors.accent.primary }]}>
              <ShieldCheck size={20} color="#fff" />
            </View>
            <View>
              <Text style={[styles.headerTitle, { color: theme.colors.text.primary, fontFamily: 'Outfit_800ExtraBold' }]}>DIAGNOSTIC CORE</Text>
              <Text style={[styles.headerSubtitle, { color: theme.colors.text.tertiary, fontFamily: 'Outfit_600SemiBold' }]}>SECTOR 7 INTEGRITY PROTOCOL</Text>
            </View>
          </View>
          
          <View style={styles.headerRight}>
             <Text style={[styles.strengthLabel, { color: theme.colors.text.tertiary, fontFamily: 'Outfit_700Bold' }]}>LINK STRENGTH</Text>
             <Text style={[styles.strengthValue, { color: theme.colors.accent.primary, fontFamily: 'Outfit_800ExtraBold' }]}>100% SECURE</Text>
          </View>
        </Animated.View>

        {/* Grid Section */}
        <View style={styles.grid}>
          {diagnostics.map((item, index) => (
            <DiagnosticCard 
              key={index}
              index={index}
              theme={theme}
              isDark={isDark}
              palette={palette}
              {...item}
            />
          ))}
        </View>

        {/* Footer Info */}
        <Animated.View 
          entering={FadeIn.delay(800)}
          style={[styles.footer, { borderColor: theme.colors.border }]}
        >
          <Activity size={14} color={theme.colors.text.tertiary} />
          <Text style={[styles.footerText, { color: theme.colors.text.tertiary, fontFamily: 'Outfit_500Medium' }]}>
            SYSTEM_KERNEL_ACTIVE // LAST_SYNC: {new Date().toLocaleTimeString()}
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
    marginBottom: 32 
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerIcon: { 
    width: 36, 
    height: 36, 
    borderRadius: 10, 
    justifyContent: 'center', 
    alignItems: 'center',
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  headerTitle: { fontSize: 22, letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 10, letterSpacing: 1.5, marginTop: 2 },
  headerRight: { alignItems: 'flex-end', marginTop: 4 },
  strengthLabel: { fontSize: 8, letterSpacing: 1 },
  strengthValue: { fontSize: 12, letterSpacing: 0.5 },
  
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between',
    gap: 12
  },
  techCardWrapper: { width: (width - 52) / 2 },
  card: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    marginBottom: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 16 
  },
  iconBg: { width: 28, height: 28, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: { fontSize: 8, letterSpacing: 1.5 },
  cardBody: { gap: 4, marginBottom: 16 },
  cardTitle: { fontSize: 8, letterSpacing: 1 },
  valueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  cardValue: { fontSize: 24 },
  cardSubtitle: { fontSize: 10 },
  cardFooter: { paddingTop: 14, borderTopWidth: 1 },
  progressBar: { height: 4, borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  footer: {
    marginTop: 32,
    paddingTop: 16,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  footerText: { fontSize: 9, letterSpacing: 1 },
});
