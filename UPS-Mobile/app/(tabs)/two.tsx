import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Brain,
  Activity,
  Zap,
  Terminal,
  Cpu,
  MessageSquare,
  ChevronRight,
  ScanLine,
  ShieldCheck
} from 'lucide-react-native';
import { useUPSData, analyzeUPSWithAI } from '../../services/upsService';
import Animated, { FadeIn, FadeInUp, Layout, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useTheme, AccentColor, Palettes } from '../../contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { GlowCard } from '../../components/GlowCard';

const { width } = Dimensions.get('window');

export default function AIScreen() {
  const { theme, isDark, palette, apiKey, modelId, serverIp } = useTheme();
  const { data } = useUPSData(serverIp);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleAnalyze = async () => {
    if (!data?.workInfo || !apiKey) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeUPSWithAI(apiKey, data.workInfo, modelId);
      setAnalysis(result);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const TelemetryRow = ({ icon: Icon, label, value }: any) => (
    <View style={[styles.telemetryRow, { backgroundColor: palette.primary + '08' }]}>
      <View style={styles.telemetryLeft}>
        <Icon size={14} color={palette.primary} />
        <Text style={[styles.telemetryLabel, { color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontFamily: 'Outfit_700Bold' }]}>{label.toUpperCase()}</Text>
      </View>
      <Text style={[styles.telemetryValue, { color: isDark ? '#fff' : '#000', fontFamily: 'Outfit_800ExtraBold' }]}>{value}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <Animated.View entering={FadeIn} style={styles.header}>
          <View style={styles.headerLayout}>
            <View style={styles.headerLeft}>
              <View style={[styles.headerIcon, { backgroundColor: palette.primary }]}>
                <Brain size={20} color="#fff" />
              </View>
              <View>
                <Text style={[styles.headerTitle, { color: theme.colors.text.primary, fontFamily: 'Outfit_800ExtraBold' }]}>CORE INTELLIGENCE</Text>
                <Text style={[styles.headerSubtitle, { color: theme.colors.text.tertiary, fontFamily: 'Outfit_600SemiBold' }]}>NEURAL LINK & SYSTEM DIAGNOSTICS</Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => router.push('/chat')}
              style={[styles.chatTrigger, { backgroundColor: palette.primary + '15', borderColor: palette.primary + '30' }]}
            >
              <MessageSquare size={18} color={palette.primary} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Live Telemetry Panel */}
        <Animated.View entering={FadeInUp.delay(100)} style={styles.sectionMargin}>
          <View style={styles.sectionHeaderRow}>
            <Activity size={14} color={palette.primary} />
            <Text style={[styles.sectionHeaderText, { color: palette.primary, fontFamily: 'Outfit_800ExtraBold' }]}>LIVE TELEMETRY</Text>
          </View>
          <GlowCard palette={palette} isDark={isDark} borderRadius={28}>
            <View style={styles.telemetryCard}>
              <View style={styles.telemetryRows}>
                <TelemetryRow icon={Cpu} label="Core Health" value="100%" />
                <TelemetryRow icon={Zap} label="Grid Input" value={`${parseFloat(data?.workInfo?.inputVoltage || '0')}V`} />
                <TelemetryRow icon={Terminal} label="Logic Mode" value={data?.workInfo?.workMode?.toUpperCase() || 'BUSY'} />
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleAnalyze}
                disabled={isAnalyzing}
                style={[styles.initiateButton, { backgroundColor: palette.primary }]}
              >
                <Text style={[styles.initiateButtonText, { color: theme.colors.text.inverse, fontFamily: 'Outfit_900Black' }]}>INITIATE ANALYSIS</Text>
              </TouchableOpacity>
            </View>
          </GlowCard>

          <TouchableOpacity style={styles.authLink}>
            <Text style={[styles.authLinkText, { color: theme.colors.text.tertiary, fontFamily: 'Outfit_700Bold' }]}>UPDATE AUTHENTICATION KEY</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Intelligence Output Panel */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.sectionMargin}>
          <View style={styles.sectionHeaderRow}>
            <MessageSquare size={14} color={palette.primary} />
            <Text style={[styles.sectionHeaderText, { color: palette.primary, fontFamily: 'Outfit_800ExtraBold' }]}>INTELLIGENCE OUTPUT</Text>
          </View>

          <GlowCard palette={palette} isDark={isDark} borderRadius={28}>
            <View style={[styles.outputCard, { minHeight: 240 }]}>
              {isAnalyzing ? (
                <View style={styles.outputEmpty}>
                  <ActivityIndicator size="small" color={palette.primary} />
                  <Text style={[styles.outputEmptyTitle, { color: isDark ? '#fff' : '#000', fontFamily: 'Outfit_800ExtraBold' }]}>STREAMS INHALING...</Text>
                </View>
              ) : analysis ? (
                <ScrollView style={styles.analysisScroll} showsVerticalScrollIndicator={false}>
                  <Text style={[styles.analysisText, { color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)', fontFamily: 'Outfit_500Medium' }]}>
                    {analysis}
                  </Text>
                  <TouchableOpacity style={styles.flushButton} onPress={() => setAnalysis(null)}>
                    <Text style={[styles.flushButtonText, { color: palette.primary, fontFamily: 'Outfit_700Bold' }]}>FLUSH_LOCAL_CACHE</Text>
                  </TouchableOpacity>
                </ScrollView>
              ) : (
                <View style={styles.outputEmpty}>
                  <Brain size={42} color={palette.primary + '20'} strokeWidth={1} />
                  <Text style={[styles.outputEmptyTitle, { color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontFamily: 'Outfit_800ExtraBold' }]}>AWAITING UPLINK</Text>
                  <Text style={[styles.outputEmptySub, { color: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)', fontFamily: 'Outfit_600SemiBold' }]}>
                    INITIATE HARDWARE ANALYSIS THROUGH THE CORE HUB
                  </Text>
                </View>
              )}
            </View>
          </GlowCard>
        </Animated.View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  header: { marginBottom: 32 },
  headerLayout: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 22, letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 10, letterSpacing: 1.5, marginTop: 2 },
  chatTrigger: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  sectionMargin: { marginBottom: 24 },
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  sectionHeaderText: { fontSize: 10, letterSpacing: 1.5 },
  telemetryCard: { borderRadius: 28, padding: 20, borderWidth: 1.5 },
  telemetryRows: { gap: 8, marginBottom: 20 },
  telemetryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14, borderRadius: 16 },
  telemetryLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  telemetryLabel: { fontSize: 9, letterSpacing: 0.5 },
  telemetryValue: { fontSize: 11, letterSpacing: 0.5 },
  initiateButton: { height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  initiateButtonText: { fontSize: 12, letterSpacing: 2 },
  authLink: { paddingVertical: 16, alignItems: 'center' },
  authLinkText: { fontSize: 8, letterSpacing: 1, opacity: 0.6 },
  outputCard: { borderRadius: 28, padding: 24, borderWidth: 1.5, minHeight: 240 },
  outputEmpty: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  outputEmptyTitle: { fontSize: 14, letterSpacing: 2 },
  outputEmptySub: { fontSize: 9, letterSpacing: 1, textAlign: 'center', opacity: 0.5 },
  analysisScroll: { flex: 1 },
  analysisText: { fontSize: 12, lineHeight: 20, letterSpacing: 0.2 },
  flushButton: { marginTop: 24, paddingVertical: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', alignItems: 'center' },
  flushButtonText: { fontSize: 8, letterSpacing: 2 },
});
