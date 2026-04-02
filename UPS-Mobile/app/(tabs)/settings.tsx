import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions, TextInput } from 'react-native';
import { Settings as SettingsIcon, Sun, Moon, Monitor, ChevronDown, Activity, ShieldCheck, Cpu, Key, Save } from 'lucide-react-native';
import Animated, { FadeIn, FadeInUp, Layout, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useTheme, AccentColor, Palettes } from '../../contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlowCard } from '../../components/GlowCard';

const { width } = Dimensions.get('window');

const PaletteItem = React.memo(({ colorName, values, isActive, onPress, isDark }: any) => (
  <View style={styles.paletteWrapper}>
    <GlowCard palette={values} isDark={isDark} borderRadius={16} onPress={() => onPress(colorName)}>
      <View style={[styles.paletteBox, { borderColor: isActive ? values.primary : 'transparent', borderWidth: isActive ? 2 : 0 }]}>
        <View style={[styles.paletteCircle, { backgroundColor: values.primary }]} />
        <Text style={[styles.paletteLabel, { color: isActive ? values.primary : (isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'), fontFamily: isActive ? 'Outfit_700Bold' : 'Outfit_500Medium' }]}>
          {colorName.toUpperCase()}
        </Text>
      </View>
    </GlowCard>
  </View>
));

const CollapsibleSection = React.memo(({ title, children, isOpen, onToggle, theme }: any) => {
  const rotate = useAnimatedStyle(() => ({
    transform: [{ rotate: withTiming(isOpen ? '180deg' : '0deg') }]
  }));

  return (
    <View style={styles.section}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onToggle}
        style={[
          styles.sectionHeader,
          {
            backgroundColor: isOpen ? theme.colors.accent.primary + '08' : theme.colors.surface,
            borderColor: isOpen ? theme.colors.accent.primary + '30' : theme.colors.border,
          }
        ]}
      >
        <View style={styles.sectionHeaderLeft}>
          <View style={[styles.statusDot, { backgroundColor: isOpen ? theme.colors.accent.primary : theme.colors.text.tertiary + '40' }]} />
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary, fontFamily: 'Outfit_700Bold' }]}>{title}</Text>
        </View>
        <Animated.View style={rotate}>
          <ChevronDown size={14} color={isOpen ? theme.colors.accent.primary : theme.colors.text.tertiary} />
        </Animated.View>
      </TouchableOpacity>

      {isOpen && (
        <Animated.View
          entering={FadeInUp.duration(300)}
          layout={Layout.springify()}
          style={styles.sectionContent}
        >
          {children}
        </Animated.View>
      )}
    </View>
  );
});

const NeuralToast = ({ visible, palette, isDark }: { visible: boolean; palette: any; isDark: boolean }) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withTiming(visible ? 0 : 100, { duration: 500 }) }],
    opacity: withTiming(visible ? 1 : 0, { duration: 300 })
  }));

  if (!visible && animatedStyle.opacity === 0) return null;

  return (
    <Animated.View style={[styles.toastContainer, animatedStyle]}>
      <GlowCard palette={palette} isDark={isDark} borderRadius={20}>
        <View style={styles.toastContent}>
          <ShieldCheck size={18} color={palette.primary} />
          <View>
            <Text style={[styles.toastTitle, { color: palette.primary, fontFamily: 'Outfit_800ExtraBold' }]}>SECURE UPLINK ESTABLISHED</Text>
            <Text style={[styles.toastSub, { color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontFamily: 'Outfit_600SemiBold' }]}>AI CORE CONFIGURATION SYNCHRONIZED</Text>
          </View>
        </View>
      </GlowCard>
    </Animated.View>
  );
};

export default function SettingsScreen() {
  const { theme, mode, setMode, isDark, accent, setAccent, apiKey, setApiKey, modelId, setModelId, serverIp, setServerIp } = useTheme();
  const insets = useSafeAreaInsets();
  const [showToast, setShowToast] = useState(false);

  const [sections, setSections] = useState({
    palette: true,
    appearance: true,
    neural: true,
    network: true
  });

  const [localKey, setLocalKey] = useState(apiKey);
  const [localModel, setLocalModel] = useState(modelId);
  const [localIp, setLocalIp] = useState(serverIp);

  useEffect(() => {
    setLocalKey(apiKey);
  }, [apiKey]);

  useEffect(() => {
    setLocalModel(modelId);
  }, [modelId]);

  useEffect(() => {
    setLocalIp(serverIp);
  }, [serverIp]);

  const toggleSection = useCallback((key: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const handleAccentChange = useCallback((color: AccentColor) => {
    setAccent(color);
  }, [setAccent]);

  const saveConfig = () => {
    setApiKey(localKey);
    setModelId(localModel);
    setServerIp(localIp);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const paletteGridContent = useMemo(() => (
    <View style={styles.paletteGrid}>
      {Object.entries(Palettes).map(([name, values]) => (
        <PaletteItem
          key={name}
          colorName={name as AccentColor}
          values={values}
          isActive={accent === name}
          onPress={handleAccentChange}
          isDark={isDark}
        />
      ))}
    </View>
  ), [accent, handleAccentChange, isDark]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeIn} style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.headerIcon, { backgroundColor: theme.colors.accent.primary }]}>
              <SettingsIcon size={20} color="#fff" />
            </View>
            <View>
              <Text style={[styles.headerTitle, { color: theme.colors.text.primary, fontFamily: 'Outfit_800ExtraBold' }]}>CONTROL PANEL</Text>
              <Text style={[styles.headerSubtitle, { color: theme.colors.text.tertiary, fontFamily: 'Outfit_600SemiBold' }]}>SYSTEM_CONFIGURATION_ACTIVE</Text>
            </View>
          </View>
        </Animated.View>

        <CollapsibleSection title="PALETTE ENGINE" isOpen={sections.palette} onToggle={() => toggleSection('palette')} theme={theme}>
          {paletteGridContent}
        </CollapsibleSection>

        <CollapsibleSection title="APPEARANCE" isOpen={sections.appearance} onToggle={() => toggleSection('appearance')} theme={theme}>
          <View style={styles.themeGrid}>
            <View style={{ flex: 1 }}>
              <GlowCard palette={Palettes[accent]} isDark={isDark} borderRadius={20} onPress={() => setMode('light')}>
                <View style={[styles.themeOption, { borderColor: mode === 'light' ? theme.colors.accent.primary : 'transparent', borderWidth: mode === 'light' ? 2 : 0 }]}>
                  <Sun size={20} color={mode === 'light' ? theme.colors.accent.primary : theme.colors.text.tertiary} />
                  <Text style={[styles.themeOptionLabel, { color: mode === 'light' ? theme.colors.text.primary : theme.colors.text.tertiary }]}>LIGHT</Text>
                </View>
              </GlowCard>
            </View>
            <View style={{ flex: 1 }}>
              <GlowCard palette={Palettes[accent]} isDark={isDark} borderRadius={20} onPress={() => setMode('dark')}>
                <View style={[styles.themeOption, { borderColor: mode === 'dark' ? theme.colors.accent.primary : 'transparent', borderWidth: mode === 'dark' ? 2 : 0 }]}>
                  <Moon size={20} color={mode === 'dark' ? theme.colors.accent.primary : theme.colors.text.tertiary} />
                  <Text style={[styles.themeOptionLabel, { color: mode === 'dark' ? theme.colors.text.primary : theme.colors.text.tertiary }]}>DARK</Text>
                </View>
              </GlowCard>
            </View>
            <View style={{ flex: 1 }}>
              <GlowCard palette={Palettes[accent]} isDark={isDark} borderRadius={20} onPress={() => setMode('system')}>
                <View style={[styles.themeOption, { borderColor: mode === 'system' ? theme.colors.accent.primary : 'transparent', borderWidth: mode === 'system' ? 2 : 0 }]}>
                  <Monitor size={20} color={mode === 'system' ? theme.colors.accent.primary : theme.colors.text.tertiary} />
                  <Text style={[styles.themeOptionLabel, { color: mode === 'system' ? theme.colors.text.primary : theme.colors.text.tertiary }]}>SYSTEM</Text>
                </View>
              </GlowCard>
            </View>
          </View>
        </CollapsibleSection>

        <CollapsibleSection title="NETWORK CONFIGURATION" isOpen={sections.network} onToggle={() => toggleSection('network')} theme={theme}>
          <GlowCard palette={Palettes[accent]} isDark={isDark} borderRadius={28}>
            <View style={styles.aiConfigCard}>
              <Text style={[styles.aiDescription, { color: theme.colors.text.tertiary, fontFamily: 'Outfit_500Medium' }]}>
                Define the target UPS server address to synchronize local telemetry with the hardware core.
              </Text>
              <View style={{ gap: 8 }}>
                <Text style={[styles.inputLabel, { color: theme.colors.accent.primary, fontFamily: 'Outfit_800ExtraBold' }]}>SERVER IP ADDRESS</Text>
                <TextInput
                  value={localIp}
                  onChangeText={setLocalIp}
                  placeholder="e.g. 192.168.1.100"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  style={[styles.textInput, {
                    backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                    borderColor: theme.colors.accent.primary + '30',
                    color: theme.colors.text.primary,
                    fontFamily: 'Outfit_600SemiBold'
                  }]}
                />
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={saveConfig}
                style={[styles.saveButton, { backgroundColor: theme.colors.accent.primary }]}
              >
                <Save size={16} color="#000" />
                <Text style={[styles.saveButtonText, { color: theme.colors.text.inverse, fontFamily: 'Outfit_900Black' }]}>INITIALIZE NETWORK</Text>
              </TouchableOpacity>
            </View>
          </GlowCard>
        </CollapsibleSection>

        <CollapsibleSection title="NEURAL LINK AUTHORIZATION" isOpen={sections.neural} onToggle={() => toggleSection('neural')} theme={theme}>
          <GlowCard palette={Palettes[accent]} isDark={isDark} borderRadius={28}>
            <View style={styles.aiConfigCard}>
              <Text style={[styles.aiDescription, { color: theme.colors.text.tertiary, fontFamily: 'Outfit_500Medium' }]}>
                Connect your BYOK (Bring Your Own Key) to activate Groq powered hardware diagnostics.
              </Text>

              <View style={styles.inputRow}>
                <View style={{ flex: 1.5, gap: 8 }}>
                  <Text style={[styles.inputLabel, { color: theme.colors.accent.primary, fontFamily: 'Outfit_800ExtraBold' }]}>API KEY</Text>
                  <TextInput
                    value={localKey}
                    onChangeText={setLocalKey}
                    placeholder="Enter Groq API Key..."
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    secureTextEntry
                    style={[styles.textInput, {
                      backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                      borderColor: theme.colors.accent.primary + '30',
                      color: theme.colors.text.primary,
                      fontFamily: 'Outfit_600SemiBold'
                    }]}
                  />
                </View>
                <View style={{ flex: 1, gap: 8 }}>
                  <Text style={[styles.inputLabel, { color: theme.colors.text.tertiary, fontFamily: 'Outfit_800ExtraBold' }]}>MODEL ID</Text>
                  <TextInput
                    value={localModel}
                    onChangeText={setLocalModel}
                    placeholder="Model ID..."
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    style={[styles.textInput, {
                      backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                      borderColor: theme.colors.border,
                      color: theme.colors.text.primary,
                      fontFamily: 'Outfit_600SemiBold'
                    }]}
                  />
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={saveConfig}
                style={[styles.saveButton, { backgroundColor: theme.colors.accent.primary }]}
              >
                <Save size={16} color={theme.colors.text.inverse} />
                <Text style={[styles.saveButtonText, { color: theme.colors.text.inverse, fontFamily: 'Outfit_900Black' }]}>SAVE CONFIGURATION</Text>
              </TouchableOpacity>
            </View>
          </GlowCard>
        </CollapsibleSection>

        {/* System Info Panel */}
        <Animated.View entering={FadeInUp.delay(400)} style={styles.section}>
          <GlowCard palette={Palettes[accent]} isDark={isDark} borderRadius={24}>
            <View style={[styles.systemPanel, { backgroundColor: isDark ? 'rgba(15, 23, 42, 0.4)' : 'rgba(226, 232, 240, 0.4)' }]}>
              <View style={styles.systemRow}>
                <ShieldCheck size={16} color={theme.colors.accent.success} />
                <Text style={[styles.systemLabel, { color: theme.colors.text.tertiary }]}>CORE_ENGINE:</Text>
                <Text style={[styles.systemValue, { color: theme.colors.accent.success, fontFamily: 'Outfit_700Bold' }]}>STABLE</Text>
              </View>
              <View style={styles.systemRow}>
                <Cpu size={16} color={theme.colors.accent.primary} />
                <Text style={[styles.systemLabel, { color: theme.colors.text.tertiary }]}>ACTIVE_ATMOSPHERE:</Text>
                <Text style={[styles.systemValue, { color: theme.colors.accent.primary, fontFamily: 'Outfit_700Bold' }]}>{accent.toUpperCase()}</Text>
              </View>
            </View>
          </GlowCard>
        </Animated.View>
      </ScrollView>

      {/* Persistent Alert Layer */}
      <NeuralToast visible={showToast} palette={Palettes[accent]} isDark={isDark} />
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
  section: { marginBottom: 16 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
  },
  sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  statusDot: { width: 4, height: 4, borderRadius: 2 },
  sectionTitle: { fontSize: 10, letterSpacing: 2 },
  sectionContent: { paddingTop: 20, paddingHorizontal: 4 },
  paletteGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 8,
  },
  paletteWrapper: {
    width: (width - 72) / 3,
    marginBottom: 8
  },
  paletteBox: {
    padding: 10,
    borderRadius: 16,
    alignItems: 'center',
    gap: 6,
    height: 72,
    justifyContent: 'center'
  },
  paletteCircle: { width: 24, height: 24, borderRadius: 12 },
  paletteLabel: { fontSize: 9, letterSpacing: 0.5 },
  themeGrid: { flexDirection: 'row', gap: 12 },
  themeOption: { flex: 1, height: 80, borderRadius: 20, padding: 12, alignItems: 'center', justifyContent: 'center', gap: 10, borderWidth: 1 },
  themeOptionLabel: { fontSize: 10, fontFamily: 'Outfit_700Bold', letterSpacing: 1 },
  aiConfigCard: { padding: 24, gap: 20 },
  aiDescription: { fontSize: 9, lineHeight: 14, letterSpacing: 0.5 },
  inputRow: { flexDirection: 'row', gap: 16 },
  inputLabel: { fontSize: 8, letterSpacing: 1.5 },
  textInput: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 11
  },
  saveButton: {
    height: 52,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12
  },
  saveButtonText: { fontSize: 11, letterSpacing: 2 },
  systemPanel: { padding: 20, borderRadius: 24, borderWidth: 1.5, gap: 12 },
  systemRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  systemLabel: { fontSize: 9, fontFamily: 'Outfit_700Bold', letterSpacing: 1, flex: 1 },
  systemValue: { fontSize: 10, letterSpacing: 0.5 },
  toastContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    zIndex: 1000
  },
  toastContent: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16
  },
  toastTitle: { fontSize: 11, letterSpacing: 1.5 },
  toastSub: { fontSize: 8, letterSpacing: 0.5, marginTop: 2 },
});
