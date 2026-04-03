import React from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Database, Monitor, Globe, Thermometer, ShieldCheck, Zap, Activity, Battery } from 'lucide-react-native';
import { useUPSData } from '../../services/upsService';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useTheme } from '../../contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

import { GlowCard } from '../../components/GlowCard';

const InfoCard = ({ icon: Icon, label, value, isDark, palette, delay }: any) => (
  <Animated.View entering={FadeInDown.delay(delay)} style={styles.infoCardWrapper}>
    <GlowCard palette={palette} isDark={isDark} borderRadius={20}>
      <View style={styles.infoCard}>
        <View style={[styles.infoIconBg, { backgroundColor: palette.primary + '10' }]}>
          <Icon size={16} color={palette.primary} strokeWidth={2.5} />
        </View>
        <View style={styles.infoContent}>
          <Text numberOfLines={1} style={[styles.infoLabel, { color: isDark ? palette.primary + '80' : 'rgba(0,0,0,0.4)', fontFamily: 'Outfit_700Bold' }]}>{label.toUpperCase()}</Text>
          <Text numberOfLines={2} style={[styles.infoValue, { color: isDark ? '#fff' : '#000', fontFamily: 'Outfit_700Bold' }]}>{value}</Text>
        </View>
      </View>
    </GlowCard>
  </Animated.View>
);

const HardwareCheckLabel = ({ text, isDark, palette }: any) => (
  <View style={[styles.checkLabel, { borderColor: palette.primary + '40' }]}>
    <Text style={[styles.checkLabelText, { color: palette.primary, fontFamily: 'Outfit_900Black' }]}>{text.toUpperCase()}</Text>
  </View>
);

export default function HardwareScreen() {
  const { theme, isDark, palette, serverIp, upsModel, upsTopology } = useTheme();
  const { t } = useTranslation();
  const { data } = useUPSData(serverIp);
  const insets = useSafeAreaInsets();

  const workInfo = data?.workInfo;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <Animated.View entering={FadeInUp.duration(800)} style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.headerIcon, { backgroundColor: palette.primary }]}>
              <Database size={20} color="#fff" />
            </View>
            <View>
              <Text style={[styles.headerTitle, { color: theme.colors.text.primary, fontFamily: 'Outfit_800ExtraBold' }]}>{t('hardware.header')}</Text>
              <Text style={[styles.headerSubtitle, { color: theme.colors.text.tertiary, fontFamily: 'Outfit_600SemiBold' }]}>{t('hardware.subtitle')}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Top Info Cards Grid */}
        <View style={styles.infoGrid}>
          <InfoCard icon={Monitor} label={t('hardware.info.model')} value={upsModel} isDark={isDark} palette={palette} delay={100} />
          <InfoCard icon={Globe} label={t('hardware.info.topology')} value={upsTopology} isDark={isDark} palette={palette} delay={200} />
          <InfoCard icon={Thermometer} label={t('hardware.info.thermal')} value={`${parseFloat(workInfo?.temperatureView || '0')} °C`} isDark={isDark} palette={palette} delay={300} />
          <InfoCard icon={ShieldCheck} label={t('hardware.info.interface')} value={`VIEWPOWER ${data?.version || 'V1.0'}`} isDark={isDark} palette={palette} delay={400} />
        </View>

        {/* Hardware Integrity Check Section */}
        <Animated.View entering={FadeInUp.delay(500)} style={styles.sectionMargin}>
          <GlowCard palette={palette} isDark={isDark} borderRadius={28}>
            <View style={styles.integrityCard}>
              <View style={styles.integrityHeader}>
                <View style={[styles.dot, { backgroundColor: palette.primary }]} />
                <Text style={[styles.integrityTitle, { color: isDark ? '#fff' : '#000', fontFamily: 'Outfit_800ExtraBold' }]}>{t('hardware.integrity.title')}</Text>
              </View>

              <View style={styles.integrityBody}>
                <Text style={[styles.integrityText, { color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)', fontFamily: 'Outfit_500Medium' }]}>
                  {t('hardware.integrity.description', { voltage: parseFloat(workInfo?.inputVoltage || '0'), model: upsModel }).split('<colored>').map((part, i) => {
                    if (part.includes('</colored>')) {
                      const [colored, rest] = part.split('</colored>');
                      return <React.Fragment key={i}><Text style={{ color: palette.primary }}>{colored}</Text>{rest}</React.Fragment>;
                    }
                    return part;
                  })}
                </Text>
              </View>

              <View style={styles.checkLabelsRow}>
                <HardwareCheckLabel text={t('hardware.labels.champ')} isDark={isDark} palette={palette} />
                <HardwareCheckLabel text={t('hardware.labels.online')} isDark={isDark} palette={palette} />
              </View>
            </View>
          </GlowCard>
        </Animated.View>

        {/* Regulation Status Section */}
        <Animated.View entering={FadeInUp.delay(600)} style={styles.sectionMargin}>
          <GlowCard palette={palette} isDark={isDark} borderRadius={28}>
            <View style={styles.regulationCard}>
              <View style={styles.regulationHeader}>
                <View style={[styles.regIconBg, { backgroundColor: palette.primary + '20' }]}>
                  <Zap size={18} color={palette.primary} fill={palette.primary + '40'} />
                </View>
                <View>
                  <Text style={[styles.regLabel, { color: isDark ? palette.primary + '80' : 'rgba(0,0,0,0.4)', fontFamily: 'Outfit_700Bold' }]}>{t('hardware.regulation.title')}</Text>
                  <Text style={[styles.regValue, { color: isDark ? '#fff' : '#000', fontFamily: 'Outfit_800ExtraBold' }]}>{workInfo?.workMode?.toUpperCase() || 'LINE MODE'}</Text>
                </View>
              </View>

              <View style={styles.regStats}>
                <View style={[styles.regStatRow, { backgroundColor: palette.primary + '08' }]}>
                  <View style={styles.regStatLeft}>
                    <Activity size={14} color={palette.primary} />
                    <Text style={[styles.regStatLabel, { color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', fontFamily: 'Outfit_700Bold' }]}>{t('hardware.regulation.load')}</Text>
                  </View>
                  <Text style={[styles.regStatValue, { color: isDark ? '#fff' : '#000', fontFamily: 'Outfit_800ExtraBold' }]}>{t('hardware.regulation.load_value', { percent: parseInt(workInfo?.outputLoadPercent || '0') })}</Text>
                </View>

                <View style={[styles.regStatRow, { backgroundColor: palette.primary + '08' }]}>
                  <View style={styles.regStatLeft}>
                    <Battery size={14} color={palette.primary} />
                    <Text style={[styles.regStatLabel, { color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', fontFamily: 'Outfit_700Bold' }]}>{t('hardware.regulation.sync')}</Text>
                  </View>
                  <Text style={[styles.regStatValue, { color: isDark ? '#fff' : '#000', fontFamily: 'Outfit_800ExtraBold' }]}>{t('hardware.regulation.sync_value', { percent: parseInt(workInfo?.batteryCapacity as any || '0') })}</Text>
                </View>
              </View>
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
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  headerIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 22, letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 10, letterSpacing: 1.5, marginTop: 2 },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  infoCardWrapper: { width: (width - 52) / 2 },
  infoCard: {
    borderRadius: 20,
    padding: 12,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 100,
  },
  infoIconBg: { width: 32, height: 32, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  infoContent: { flex: 1, gap: 2 },
  infoLabel: { fontSize: 8, letterSpacing: 0.5, opacity: 0.7 },
  infoValue: { fontSize: 10.5, lineHeight: 14 },
  sectionMargin: { marginBottom: 16 },
  integrityCard: { borderRadius: 28, padding: 24, borderWidth: 1.5 },
  integrityHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  integrityTitle: { fontSize: 14, letterSpacing: 1 },
  integrityBody: { marginBottom: 20 },
  integrityText: { fontSize: 11, lineHeight: 18, letterSpacing: 0.2 },
  checkLabelsRow: { flexDirection: 'row', gap: 8 },
  checkLabel: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  checkLabelText: { fontSize: 8, letterSpacing: 1 },
  regulationCard: { borderRadius: 28, padding: 24, borderWidth: 1.5 },
  regulationHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 24 },
  regIconBg: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  regLabel: { fontSize: 9, letterSpacing: 1, marginBottom: 2 },
  regValue: { fontSize: 18, letterSpacing: 1 },
  regStats: { gap: 10 },
  regStatRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 16 },
  regStatLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  regStatLabel: { fontSize: 9, letterSpacing: 0.5 },
  regStatValue: { fontSize: 11, letterSpacing: 0.5 },
});
