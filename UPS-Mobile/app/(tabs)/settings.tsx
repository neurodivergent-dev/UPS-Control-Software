import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Dimensions, TextInput, Modal, Pressable } from 'react-native';
import { Settings as SettingsIcon, Sun, Moon, Monitor, ChevronDown, Activity, ShieldCheck, Cpu, Key, Save, Languages, Check, X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
            <Text style={[styles.toastTitle, { color: palette.primary, fontFamily: 'Outfit_800ExtraBold' }]}>{t('settings.toast.title')}</Text>
            <Text style={[styles.toastSub, { color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontFamily: 'Outfit_600SemiBold' }]}>{t('settings.toast.subtitle')}</Text>
          </View>
        </View>
      </GlowCard>
    </Animated.View>
  );
};

export default function SettingsScreen() {
  const { 
    theme, mode, setMode, isDark, accent, setAccent, 
    apiKey, setApiKey, modelId, setModelId, 
    serverIp, setServerIp, upsModel, setUpsModel, 
    upsTopology, setUpsTopology 
  } = useTheme();
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const [showToast, setShowToast] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);

  const [sections, setSections] = useState({
    palette: false,
    appearance: true,
    neural: false,
    network: false,
    language: true
  });

  const [localKey, setLocalKey] = useState(apiKey);
  const [localModel, setLocalModel] = useState(modelId);
  const [localIp, setLocalIp] = useState(serverIp);
  const [localUpsModel, setLocalUpsModel] = useState(upsModel);
  const [localUpsTopology, setLocalUpsTopology] = useState(upsTopology);

  useEffect(() => {
    setLocalKey(apiKey);
  }, [apiKey]);

  useEffect(() => {
    setLocalModel(modelId);
  }, [modelId]);

  useEffect(() => {
    setLocalIp(serverIp);
  }, [serverIp]);

  useEffect(() => {
    setLocalUpsModel(upsModel);
  }, [upsModel]);

  useEffect(() => {
    setLocalUpsTopology(upsTopology);
  }, [upsTopology]);

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
    setUpsModel(localUpsModel);
    setUpsTopology(localUpsTopology);
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
              <Text style={[styles.headerTitle, { color: theme.colors.text.primary, fontFamily: 'Outfit_800ExtraBold' }]}>{t('settings.header')}</Text>
              <Text style={[styles.headerSubtitle, { color: theme.colors.text.tertiary, fontFamily: 'Outfit_600SemiBold' }]}>{t('settings.subtitle')}</Text>
            </View>
          </View>
        </Animated.View>

        <CollapsibleSection title={t('settings.sections.language')} isOpen={sections.language} onToggle={() => toggleSection('language')} theme={theme}>
          <GlowCard palette={Palettes[accent]} isDark={isDark} borderRadius={24}>
            <View style={styles.langSelectorCard}>
              <View style={styles.langHeader}>
                <Languages size={18} color={theme.colors.accent.primary} />
                <Text style={[styles.langTitle, { color: theme.colors.text.primary, fontFamily: 'Outfit_700Bold' }]}>{t('settings.language.title')}</Text>
              </View>
              <Text style={[styles.langDesc, { color: theme.colors.text.tertiary, fontFamily: 'Outfit_500Medium' }]}>
                {t('settings.language.description')}
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setShowLangModal(true)}
                style={[styles.langButton, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', borderColor: theme.colors.accent.primary + '40' }]}
              >
                <View>
                  <Text style={[styles.langBtnLabel, { color: theme.colors.text.tertiary, fontFamily: 'Outfit_700Bold' }]}>{t('settings.language.current')}</Text>
                  <Text style={[styles.langBtnValue, { color: theme.colors.text.primary, fontFamily: 'Outfit_800ExtraBold' }]}>
                    {i18n.language === 'tr' ? 'TÜRKÇE (TR)' : 'ENGLISH (EN)'}
                  </Text>
                </View>
                <ChevronDown size={16} color={theme.colors.accent.primary} />
              </TouchableOpacity>
            </View>
          </GlowCard>
        </CollapsibleSection>

        <CollapsibleSection title={t('settings.sections.palette')} isOpen={sections.palette} onToggle={() => toggleSection('palette')} theme={theme}>
          {paletteGridContent}
        </CollapsibleSection>

        <CollapsibleSection title={t('settings.sections.appearance')} isOpen={sections.appearance} onToggle={() => toggleSection('appearance')} theme={theme}>
          <View style={styles.themeGrid}>
            <View style={{ flex: 1 }}>
              <GlowCard palette={Palettes[accent]} isDark={isDark} borderRadius={20} onPress={() => setMode('light')}>
                <View style={[styles.themeOption, { borderColor: mode === 'light' ? theme.colors.accent.primary : 'transparent', borderWidth: mode === 'light' ? 2 : 0 }]}>
                  <Sun size={20} color={mode === 'light' ? theme.colors.accent.primary : theme.colors.text.tertiary} />
                  <Text style={[styles.themeOptionLabel, { color: mode === 'light' ? theme.colors.text.primary : theme.colors.text.tertiary }]}>{t('settings.appearance.light')}</Text>
                </View>
              </GlowCard>
            </View>
            <View style={{ flex: 1 }}>
              <GlowCard palette={Palettes[accent]} isDark={isDark} borderRadius={20} onPress={() => setMode('dark')}>
                <View style={[styles.themeOption, { borderColor: mode === 'dark' ? theme.colors.accent.primary : 'transparent', borderWidth: mode === 'dark' ? 2 : 0 }]}>
                  <Moon size={20} color={mode === 'dark' ? theme.colors.accent.primary : theme.colors.text.tertiary} />
                  <Text style={[styles.themeOptionLabel, { color: mode === 'dark' ? theme.colors.text.primary : theme.colors.text.tertiary }]}>{t('settings.appearance.dark')}</Text>
                </View>
              </GlowCard>
            </View>
            <View style={{ flex: 1 }}>
              <GlowCard palette={Palettes[accent]} isDark={isDark} borderRadius={20} onPress={() => setMode('system')}>
                <View style={[styles.themeOption, { borderColor: mode === 'system' ? theme.colors.accent.primary : 'transparent', borderWidth: mode === 'system' ? 2 : 0 }]}>
                  <Monitor size={20} color={mode === 'system' ? theme.colors.accent.primary : theme.colors.text.tertiary} />
                  <Text style={[styles.themeOptionLabel, { color: mode === 'system' ? theme.colors.text.primary : theme.colors.text.tertiary }]}>{t('settings.appearance.system')}</Text>
                </View>
              </GlowCard>
            </View>
          </View>
        </CollapsibleSection>

        <CollapsibleSection title={t('settings.sections.network')} isOpen={sections.network} onToggle={() => toggleSection('network')} theme={theme}>
          <GlowCard palette={Palettes[accent]} isDark={isDark} borderRadius={28}>
            <View style={styles.aiConfigCard}>
              <Text style={[styles.aiDescription, { color: theme.colors.text.tertiary, fontFamily: 'Outfit_500Medium' }]}>
                {t('settings.network.description')}
              </Text>
              <View style={{ gap: 16 }}>
                <View style={{ gap: 8 }}>
                  <Text style={[styles.inputLabel, { color: theme.colors.accent.primary, fontFamily: 'Outfit_800ExtraBold' }]}>{t('settings.network.label')}</Text>
                  <TextInput
                    value={localIp}
                    onChangeText={setLocalIp}
                    placeholder={t('settings.network.placeholder')}
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    style={[styles.textInput, {
                      backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                      borderColor: theme.colors.accent.primary + '30',
                      color: theme.colors.text.primary,
                      fontFamily: 'Outfit_600SemiBold'
                    }]}
                  />
                </View>

                <View style={styles.inputRow}>
                  <View style={{ flex: 1, gap: 8 }}>
                    <Text style={[styles.inputLabel, { color: theme.colors.text.tertiary, fontFamily: 'Outfit_800ExtraBold' }]}>{t('settings.network.ups_model')}</Text>
                    <TextInput
                      value={localUpsModel}
                      onChangeText={setLocalUpsModel}
                      placeholder="CHAMP 1K 1/1"
                      placeholderTextColor="rgba(255,255,255,0.2)"
                      style={[styles.textInput, {
                        backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                        borderColor: theme.colors.border,
                        color: theme.colors.text.primary,
                        fontFamily: 'Outfit_600SemiBold'
                      }]}
                    />
                  </View>
                  <View style={{ flex: 1, gap: 8 }}>
                    <Text style={[styles.inputLabel, { color: theme.colors.text.tertiary, fontFamily: 'Outfit_800ExtraBold' }]}>{t('settings.network.ups_topology')}</Text>
                    <TextInput
                      value={localUpsTopology}
                      onChangeText={setLocalUpsTopology}
                      placeholder="ONLINE TOWER"
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
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={saveConfig}
                style={[styles.saveButton, { backgroundColor: theme.colors.accent.primary }]}
              >
                <Save size={16} color="#000" />
                <Text style={[styles.saveButtonText, { color: theme.colors.text.inverse, fontFamily: 'Outfit_900Black' }]}>{t('settings.network.button')}</Text>
              </TouchableOpacity>
            </View>
          </GlowCard>
        </CollapsibleSection>

        <CollapsibleSection title={t('settings.sections.neural')} isOpen={sections.neural} onToggle={() => toggleSection('neural')} theme={theme}>
          <GlowCard palette={Palettes[accent]} isDark={isDark} borderRadius={28}>
            <View style={styles.aiConfigCard}>
              <Text style={[styles.aiDescription, { color: theme.colors.text.tertiary, fontFamily: 'Outfit_500Medium' }]}>
                {t('settings.neural.description')}
              </Text>

              <View style={styles.inputRow}>
                <View style={{ flex: 1.5, gap: 8 }}>
                  <Text style={[styles.inputLabel, { color: theme.colors.accent.primary, fontFamily: 'Outfit_800ExtraBold' }]}>{t('settings.neural.key_label')}</Text>
                  <TextInput
                    value={localKey}
                    onChangeText={setLocalKey}
                    placeholder={t('settings.neural.key_placeholder')}
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
                  <Text style={[styles.inputLabel, { color: theme.colors.text.tertiary, fontFamily: 'Outfit_800ExtraBold' }]}>{t('settings.neural.model_label')}</Text>
                  <TextInput
                    value={localModel}
                    onChangeText={setLocalModel}
                    placeholder={t('settings.neural.model_placeholder')}
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
                <Text style={[styles.saveButtonText, { color: theme.colors.text.inverse, fontFamily: 'Outfit_900Black' }]}>{t('settings.neural.button')}</Text>
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
                <Text style={[styles.systemLabel, { color: theme.colors.text.tertiary }]}>{t('settings.system.core_engine')}:</Text>
                <Text style={[styles.systemValue, { color: theme.colors.accent.success, fontFamily: 'Outfit_700Bold' }]}>{t('settings.system.stable')}</Text>
              </View>
              <View style={styles.systemRow}>
                <Cpu size={16} color={theme.colors.accent.primary} />
                <Text style={[styles.systemLabel, { color: theme.colors.text.tertiary }]}>{t('settings.system.active_atmosphere')}:</Text>
                <Text style={[styles.systemValue, { color: theme.colors.accent.primary, fontFamily: 'Outfit_700Bold' }]}>{accent.toUpperCase()}</Text>
              </View>
            </View>
          </GlowCard>
        </Animated.View>
      </ScrollView>

      {/* Persistent Alert Layer */}
      <NeuralToast visible={showToast} palette={Palettes[accent]} isDark={isDark} />

      {/* Language Selection Modal */}
      <Modal
        visible={showLangModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLangModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setShowLangModal(false)}
        >
          <Animated.View 
            entering={FadeInUp}
            style={[styles.modalContent, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text.primary, fontFamily: 'Outfit_800ExtraBold' }]}>
                {t('settings.language.selector')}
              </Text>
              <TouchableOpacity onPress={() => setShowLangModal(false)}>
                <X size={20} color={theme.colors.text.tertiary} />
              </TouchableOpacity>
            </View>

            <View style={styles.langOptions}>
              {[
                { id: 'en', label: 'ENGLISH', sub: 'UNITED STATES' },
                { id: 'tr', label: 'TÜRKÇE', sub: 'TÜRKİYE' }
              ].map((lang) => (
                <TouchableOpacity
                  key={lang.id}
                  activeOpacity={0.7}
                  onPress={() => {
                    i18n.changeLanguage(lang.id);
                    setShowLangModal(false);
                  }}
                  style={[
                    styles.langOption,
                    { 
                      backgroundColor: i18n.language === lang.id ? theme.colors.accent.primary + '15' : 'transparent',
                      borderColor: i18n.language === lang.id ? theme.colors.accent.primary : theme.colors.border
                    }
                  ]}
                >
                  <View>
                    <Text style={[styles.langOptionLabel, { color: i18n.language === lang.id ? theme.colors.accent.primary : theme.colors.text.primary, fontFamily: 'Outfit_700Bold' }]}>
                      {lang.label}
                    </Text>
                    <Text style={[styles.langOptionSub, { color: theme.colors.text.tertiary, fontFamily: 'Outfit_500Medium' }]}>
                      {lang.sub}
                    </Text>
                  </View>
                  {i18n.language === lang.id && (
                    <View style={[styles.checkCircle, { backgroundColor: theme.colors.accent.primary }]}>
                      <Check size={12} color="#000" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </Pressable>
      </Modal>
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
  langSelectorCard: { padding: 20, gap: 12 },
  langHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  langTitle: { fontSize: 11, letterSpacing: 1 },
  langDesc: { fontSize: 9, lineHeight: 14, letterSpacing: 0.5, opacity: 0.7 },
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 8
  },
  langBtnLabel: { fontSize: 8, letterSpacing: 1, marginBottom: 2 },
  langBtnValue: { fontSize: 12, letterSpacing: 0.5 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24
  },
  modalContent: {
    width: '100%',
    borderRadius: 32,
    borderWidth: 1.5,
    padding: 24,
    gap: 24
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  modalTitle: { fontSize: 12, letterSpacing: 2 },
  langOptions: { gap: 12 },
  langOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1.5
  },
  langOptionLabel: { fontSize: 13, letterSpacing: 1 },
  langOptionSub: { fontSize: 9, letterSpacing: 0.5, marginTop: 2 },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
