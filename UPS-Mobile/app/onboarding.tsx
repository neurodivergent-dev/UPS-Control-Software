import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  FadeOut, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withTiming,
  Layout,
  SlideInRight,
  SlideOutLeft
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Battery, Zap, Brain, ChevronRight, ShieldCheck, Server, Key, Terminal } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

const Onboarding = () => {
  const { theme, palette, setServerIp, setApiKey, serverIp, apiKey } = useTheme();
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  
  // Local state for setup inputs
  const [localIp, setLocalIp] = useState(serverIp);
  const [localKey, setLocalKey] = useState(apiKey);

  const totalSteps = 4;

  const handleNext = async () => {
    if (step < totalSteps - 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setStep(step + 1);
    } else {
      // Finalize setup
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setServerIp(localIp);
      setApiKey(localKey);
      await AsyncStorage.setItem('HAS_COMPLETED_ONBOARDING', 'true');
      router.replace('/(tabs)');
    }
  };

  const handleBack = () => {
    if (step > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setStep(step - 1);
    }
  };

  const renderStep = () => {
    switch(step) {
      case 0:
        return (
          <Animated.View 
            entering={FadeInDown.duration(800)} 
            exiting={FadeOut.duration(400)}
            style={styles.stepContainer}
          >
            <View style={[styles.iconContainer, { backgroundColor: palette.muted }]}>
              <Zap size={48} color={palette.primary} strokeWidth={2.5} />
            </View>
            <Text style={[styles.subtitle, { color: palette.primary }]}>{t('onboarding.welcome.subtitle')}</Text>
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>{t('onboarding.welcome.title')}</Text>
            <Text style={[styles.description, { color: theme.colors.text.secondary }]}>{t('onboarding.welcome.description')}</Text>
          </Animated.View>
        );
      case 1:
        return (
          <Animated.View 
            entering={SlideInRight.duration(600)} 
            exiting={SlideOutLeft.duration(600)}
            style={styles.stepContainer}
          >
            <View style={[styles.iconContainer, { backgroundColor: palette.muted }]}>
              <Battery size={48} color={palette.primary} strokeWidth={2.5} />
            </View>
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>{t('onboarding.features.title')}</Text>
            <Text style={[styles.description, { color: theme.colors.text.secondary }]}>{t('onboarding.features.description')}</Text>
            
            {/* Mini Visual Simulation */}
            <View style={styles.visualBox}>
               <View style={styles.visualRow}>
                  <Text style={styles.visualLabel}>GRID_INPUT</Text>
                  <Text style={[styles.visualValue, { color: palette.primary }]}>224.5V</Text>
               </View>
               <View style={styles.visualRow}>
                  <Text style={styles.visualLabel}>LOAD_FACTOR</Text>
                  <Text style={[styles.visualValue, { color: palette.primary }]}>18%</Text>
               </View>
            </View>
          </Animated.View>
        );
      case 2:
        return (
          <Animated.View 
             entering={SlideInRight.duration(600)} 
             exiting={SlideOutLeft.duration(600)}
             style={styles.stepContainer}
          >
            <View style={[styles.iconContainer, { backgroundColor: palette.muted }]}>
              <Brain size={48} color={palette.primary} strokeWidth={2.5} />
            </View>
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>{t('onboarding.neural.title')}</Text>
            <Text style={[styles.description, { color: theme.colors.text.secondary }]}>{t('onboarding.neural.description')}</Text>
            
            <View style={styles.terminalBox}>
              <Terminal size={14} color={palette.primary} />
              <Text style={styles.terminalText}>Initializing neural logic... OK</Text>
              <Text style={styles.terminalText}>Analyzing grid harmonics... OK</Text>
            </View>
          </Animated.View>
        );
      case 3:
        return (
          <Animated.View 
            entering={FadeIn.duration(800)}
            style={styles.stepContainer}
          >
            <View style={[styles.iconContainer, { backgroundColor: palette.muted }]}>
              <ShieldCheck size={48} color={palette.primary} strokeWidth={2.5} />
            </View>
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>{t('onboarding.setup.title')}</Text>
            <Text style={[styles.description, { color: theme.colors.text.secondary }]}>{t('onboarding.setup.description')}</Text>
            
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <View style={styles.inputLabelContainer}>
                  <Server size={14} color={theme.colors.text.tertiary} />
                  <Text style={styles.inputLabel}>{t('onboarding.setup.server_label')}</Text>
                </View>
                <TextInput
                  style={[styles.input, { color: theme.colors.text.primary, borderColor: theme.colors.border }]}
                  placeholder="192.168.1.XXX"
                  placeholderTextColor={theme.colors.text.tertiary}
                  value={localIp}
                  onChangeText={setLocalIp}
                />
              </View>

              <View style={styles.inputGroup}>
                <View style={styles.inputLabelContainer}>
                  <Key size={14} color={theme.colors.text.tertiary} />
                  <Text style={styles.inputLabel}>{t('onboarding.setup.api_label')}</Text>
                </View>
                <TextInput
                  style={[styles.input, { color: theme.colors.text.primary, borderColor: theme.colors.border }]}
                  placeholder="gsk_..."
                  placeholderTextColor={theme.colors.text.tertiary}
                  value={localKey}
                  onChangeText={setLocalKey}
                  secureTextEntry
                />
              </View>
            </View>
          </Animated.View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LinearGradient
        colors={[palette.primary + '15', 'transparent']}
        style={styles.backgroundGradient}
      />
      
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header / Progress Bar */}
            <View style={styles.progressContainer}>
              {[...Array(totalSteps)].map((_, i) => (
                <View 
                  key={i} 
                  style={[
                    styles.progressDot, 
                    { 
                      backgroundColor: i <= step ? palette.primary : theme.colors.border,
                      width: i === step ? 30 : 8
                    }
                  ]} 
                />
              ))}
            </View>

            {/* Content Area */}
            <View style={styles.content}>
               {renderStep()}
            </View>

            {/* Footer / Buttons */}
            <View style={styles.footer}>
              {step > 0 && (
                <TouchableOpacity 
                   onPress={handleBack}
                   style={[styles.backButton, { borderColor: theme.colors.border }]}
                >
                  <Text style={[styles.backButtonText, { color: theme.colors.text.primary }]}>
                    {t('onboarding.buttons.back')}
                  </Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                onPress={handleNext}
                activeOpacity={0.8}
                style={[styles.nextButton, { backgroundColor: palette.primary }]}
              >
                <Text style={styles.nextButtonText}>
                  {step === totalSteps - 1 ? t('onboarding.buttons.start') : t('onboarding.buttons.next')}
                </Text>
                {step < totalSteps - 1 && <ChevronRight size={20} color="white" />}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 40,
  },
  progressDot: {
    height: 8,
    borderRadius: 4,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  stepContainer: {
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  subtitle: {
    fontFamily: 'Outfit_900Black',
    fontSize: 12,
    letterSpacing: 4,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 40,
    lineHeight: 48,
    letterSpacing: -1,
    marginBottom: 16,
  },
  description: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
  },
  visualBox: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 24,
    padding: 20,
    marginTop: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  visualRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  visualLabel: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 10,
    letterSpacing: 2,
    color: 'rgba(255,255,255,0.3)',
  },
  visualValue: {
    fontFamily: 'Outfit_800ExtraBold',
    fontSize: 14,
  },
  terminalBox: {
    width: '100%',
    backgroundColor: '#000',
    borderRadius: 16,
    padding: 16,
    marginTop: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  terminalText: {
    color: '#0f0',
    fontFamily: 'SpaceMono',
    fontSize: 11,
    marginBottom: 4,
  },
  form: {
    width: '100%',
    marginTop: 32,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  inputLabel: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    opacity: 0.6,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 20,
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 16,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 40,
    paddingBottom: 20,
  },
  backButton: {
    height: 60,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  nextButton: {
    flex: 1,
    height: 64,
    borderRadius: 22,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  nextButtonText: {
    fontFamily: 'Outfit_900Black',
    fontSize: 16,
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
});

export default Onboarding;
