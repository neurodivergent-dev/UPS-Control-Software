import React from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { History, ShieldCheck, Activity, AlertTriangle, Info, Clock } from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlowCard } from '../../components/GlowCard';
import { useTranslation } from 'react-i18next';
import { useUPSLogs } from '../../services/upsService';

const { width } = Dimensions.get('window');

const LogItem = ({ date, time, title, subtitle, status = "INFO", isDark, palette, delay }: any) => {
  const getStatusColor = () => {
    switch(status) {
      case "ERROR": return "#ff4444";
      case "WARN": return "#ffae00";
      default: return palette.primary;
    }
  };

  return (
    <Animated.View entering={FadeInDown.delay(delay)} style={styles.logWrapper}>
      <GlowCard palette={palette} isDark={isDark} borderRadius={20}>
        <View style={styles.logCard}>
          <View style={styles.logLeft}>
             <Text style={[styles.logDate, { color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontFamily: 'Outfit_700Bold' }]}>{date}</Text>
             <Text style={[styles.logTime, { color: isDark ? '#fff' : '#000', fontFamily: 'Outfit_900Black' }]}>{time}</Text>
          </View>

          <View style={styles.logMiddle}>
             <View style={styles.logTitleRow}>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
                <Text style={[styles.logTitle, { color: isDark ? '#fff' : '#000', fontFamily: 'Outfit_800ExtraBold' }]}>{title.toUpperCase()}</Text>
             </View>
             <Text style={[styles.logSubtitle, { color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)', fontFamily: 'Outfit_600SemiBold' }]}>{subtitle.toUpperCase()}</Text>
          </View>

          <View style={[styles.statusBadge, { borderColor: getStatusColor() + '40' }]}>
             <Text style={[styles.statusText, { color: getStatusColor(), fontFamily: 'Outfit_900Black' }]}>{status}</Text>
          </View>
        </View>
      </GlowCard>
    </Animated.View>
  );
};

export default function LogsScreen() {
  const { theme, isDark, palette, serverIp } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { data: logs, isLoading, isError } = useUPSLogs(serverIp);

  // Helper to format ViewPower date strings
  const parseUPSDate = (dateStr: string) => {
    if (!dateStr) return { date: "--", time: "--" };
    const parts = dateStr.split(" ");
    return {
      date: parts[0] || "--",
      time: parts[1] || "--"
    };
  };

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
                <Text style={[styles.headerTitle, { color: theme.colors.text.primary, fontFamily: 'Outfit_800ExtraBold' }]}>{t('logs.header')}</Text>
                <Text style={[styles.headerSubtitle, { color: theme.colors.text.tertiary, fontFamily: 'Outfit_600SemiBold' }]}>{t('logs.subtitle')}</Text>
              </View>
           </View>
           
           <View style={[styles.streamBadge, { borderColor: palette.primary + '40' }]}>
              <View style={[styles.liveDot, { backgroundColor: palette.primary }]} />
              <Text style={[styles.streamText, { color: palette.primary, fontFamily: 'Outfit_800ExtraBold' }]}>{t('logs.stream_badge')}</Text>
           </View>
        </Animated.View>

        {/* Shield Status Panel */}
        <Animated.View entering={FadeInUp.delay(100)} style={styles.sectionMargin}>
           <View style={styles.sectionHeaderRow}>
              <ShieldCheck size={14} color={palette.primary} />
              <Text style={[styles.sectionHeaderText, { color: palette.primary, fontFamily: 'Outfit_800ExtraBold' }]}>{t('logs.section_analysis')}</Text>
           </View>
           
           <GlowCard palette={palette} isDark={isDark} borderRadius={28}>
              <View style={styles.shieldCard}>
                <View style={[styles.shieldIconBox, { backgroundColor: palette.primary }]}>
                   <ShieldCheck size={24} color="#fff" strokeWidth={2.5} />
                </View>
                <View style={styles.shieldContent}>
                   <Text style={[styles.shieldLabel, { color: palette.primary, fontFamily: 'Outfit_800ExtraBold' }]}>{t('logs.shield.label')}</Text>
                   <Text style={[styles.shieldText, { color: isDark ? '#fff' : '#000', fontFamily: 'Outfit_700Bold' }]}>
                      {isLoading ? "PROBING GRID..." : 
                       isError ? "COMMUNICATION BREACH" : 
                       logs && logs.length > 0 ? t('logs.shield.events_detected', { count: logs.length }) : t('logs.shield.text')}
                   </Text>
                </View>
              </View>
           </GlowCard>
        </Animated.View>

        {/* Temporal Node History Section */}
        <View style={styles.sectionMargin}>
           <View style={styles.sectionHeaderRow}>
              <Activity size={14} color={palette.primary} />
              <Text style={[styles.sectionHeaderText, { color: palette.primary, fontFamily: 'Outfit_800ExtraBold' }]}>{t('logs.section_history')}</Text>
           </View>
           
           <View style={styles.logsContainer}>
              {isLoading ? (
                <View style={styles.loadingBox}>
                  <ActivityIndicator size="small" color={palette.primary} />
                  <Text style={[styles.loadingText, { color: theme.colors.text.tertiary, fontFamily: 'Outfit_600SemiBold' }]}>UPLINKING TO HARDWARE...</Text>
                </View>
              ) : logs && logs.length > 0 ? (
                logs.map((log: any, index: number) => {
                  const { date, time } = parseUPSDate(log.occurTime);
                  const isWarn = log.eventLevel === "1" || log.eventName.toLowerCase().includes('fail');
                  return (
                    <LogItem 
                      key={log.id || index} 
                      date={date}
                      time={time}
                      title={log.eventName}
                      subtitle={log.devName || "UPS_NODE_0"}
                      status={isWarn ? "WARN" : "INFO"}
                      isDark={isDark} 
                      palette={palette} 
                      delay={200 + (index * 50)} 
                    />
                  );
                })
              ) : (
                <View style={styles.emptyBox}>
                   <Clock size={32} color={palette.primary + '20'} />
                   <Text style={[styles.emptyText, { color: theme.colors.text.tertiary, fontFamily: 'Outfit_600SemiBold' }]}>NO ANOMALIES DETECTED IN LAST 24H</Text>
                </View>
              )}
           </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, gap: 12 },
  headerLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 9, letterSpacing: 1.2, marginTop: 2 },
  streamBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, borderWidth: 1, marginTop: 4, flexShrink: 0 },
  liveDot: { width: 4, height: 4, borderRadius: 2 },
  streamText: { fontSize: 7, letterSpacing: 0.8 },
  sectionMargin: { marginBottom: 24 },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  sectionHeaderText: { fontSize: 10, letterSpacing: 1.5 },
  shieldCard: { padding: 24, flexDirection: 'row', alignItems: 'center', gap: 20 },
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
  loadingBox: { padding: 40, alignItems: 'center', gap: 12 },
  loadingText: { fontSize: 10, letterSpacing: 2, opacity: 0.5 },
  emptyBox: { padding: 60, alignItems: 'center', gap: 16, opacity: 0.5 },
  emptyText: { fontSize: 10, letterSpacing: 1, textAlign: 'center' }
});
