import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  BackHandler,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import {
  Brain,
  Send,
  User,
  ChevronLeft,
  Wifi,
  WifiOff,
  Trash2,
  ChevronDown as ChevronDownIcon,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme, Palettes } from '../../contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlowCard } from '../../components/GlowCard';
import { useUPSData } from '../../services/upsService';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Constants ───────────────────────────────────────────────────────────────

const CHAT_STORAGE_KEY = '@ups_chat_history';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

type MessageRole = 'ai' | 'user';

interface Message {
  id: string;
  text: string;
  role: MessageRole;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
}

interface GroqMessage {
  role: 'system' | 'assistant' | 'user';
  content: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const DEFAULT_MODEL = 'llama-3.3-70b-versatile';
const MAX_HISTORY = 6;
const REQUEST_TIMEOUT = 10_000;
const INITIAL_MESSAGE_TEXT = {
  en: 'Operator, I am the UPS Core Intelligence. How can I assist with your hardware diagnostics today?',
  tr: 'Operatör, ben UPS Çekirdek Zekası. Bugün donanım teşhislerinizde size nasıl yardımcı olabilirim?'
};

const getInitialMessage = (lng: string): Message => ({
  id: 'init-1',
  text: lng === 'tr' ? INITIAL_MESSAGE_TEXT.tr : INITIAL_MESSAGE_TEXT.en,
  role: 'ai',
  timestamp: new Date(),
  status: 'sent',
});

// ─── Typing Indicator ─────────────────────────────────────────────────────────

function TypingIndicator({ color }: { color: string }) {
  const { t } = useTranslation();
  return (
    <View style={styles.typingRow}>
      <Brain size={10} color={color} />
      <Text style={[styles.typingLabel, { color }]}>{t('chat.status.processing')}</Text>
      <View style={styles.dotsRow}>
        <View style={styles.dot} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </View>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

interface BubbleProps {
  message: Message;
  palette: typeof Palettes.slate;
  isDark: boolean;
  textColor: string;
  tertiaryColor: string;
}

const MessageBubble = React.memo(function MessageBubble({
  message,
  palette,
  isDark,
  textColor,
  tertiaryColor,
}: BubbleProps) {
  const { t } = useTranslation();
  const isAI = message.role === 'ai';

  return (
    <View
      style={[
        styles.messageWrapper,
        isAI ? styles.aiWrapper : styles.userWrapper,
      ]}
    >
      <View style={[styles.authorRow, isAI ? styles.rowLeft : styles.rowRight]}>
        {isAI ? (
          <Brain size={10} color={palette.primary} />
        ) : (
          <User size={10} color={tertiaryColor} />
        )}
        <Text
          style={[
            styles.authorText,
            { color: isAI ? palette.primary : tertiaryColor },
          ]}
        >
          {isAI ? t('chat.status.system_core') : t('chat.status.operator')}
        </Text>
        {message.status === 'error' && (
          <WifiOff size={9} color="#ef4444" style={{ marginLeft: 4 }} />
        )}
      </View>

      <GlowCard
        palette={isAI ? palette : Palettes.slate}
        isDark={isDark}
        borderRadius={18}
        style={isAI ? undefined : { opacity: 0.9 }}
      >
        <View
          style={[
            styles.bubble,
            {
              backgroundColor: isAI
                ? 'transparent'
                : isDark
                  ? 'rgba(255,255,255,0.03)'
                  : 'rgba(0,0,0,0.03)',
            },
          ]}
        >
          <Text style={[styles.bubbleText, { color: textColor }]}>
            {message.text}
          </Text>
        </View>
      </GlowCard>

      <Text style={[styles.timestamp, { color: tertiaryColor }]}>
        {message.timestamp.toLocaleTimeString('tr-TR', {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </View>
  );
}, (prev, next) => {
  // Custom comparison - only re-render if message or theme changes
  return (
    prev.message.id === next.message.id &&
    prev.message.text === next.message.text &&
    prev.palette === next.palette &&
    prev.isDark === next.isDark &&
    prev.textColor === next.textColor &&
    prev.tertiaryColor === next.tertiaryColor
  );
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function AIChatScreen() {
  const { theme, isDark, palette, apiKey, modelId, serverIp } = useTheme();
  const { data } = useUPSData(serverIp);
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t, i18n } = useTranslation();

  const [messages, setMessages] = useState<Message[]>([getInitialMessage(i18n.language)]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  const flashListRef = useRef<any>(null);

  // ── Load History ──
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const saved = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          // Convert back to Date objects
          const formatted = parsed.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          }));
          setMessages(formatted);
        }
      } catch (e) {
        console.error('Failed to load chat history', e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadHistory();
  }, []);

  // ── Save History ──
  useEffect(() => {
    if (isLoaded) {
      AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages)).catch(
        (e) => console.error('Failed to save chat history', e)
      );
    }
  }, [messages, isLoaded]);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  const listData: (Message | 'typing')[] = isTyping
    ? [...messages, 'typing']
    : messages;

  // ── Scroll Handling ──
  const handleScroll = useCallback((event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const distanceToBottom = contentSize.height - layoutMeasurement.height - contentOffset.y;
    // Show button if more than 200px away from the bottom (user scrolled up)
    setShowScrollToBottom(distanceToBottom > 200);
  }, []);

  // Android hardware back button
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      router.push('/two');
      return true;
    });
    return () => sub.remove();
  }, [router]);

  const scrollToBottom = useCallback((animated = true) => {
    setTimeout(() => {
      flashListRef.current?.scrollToEnd({ animated });
    }, 50);
  }, []);

  // Only scroll to bottom when new messages arrive AND user is near bottom
  useEffect(() => {
    // Only auto-scroll if user hasn't scrolled up (showScrollToBottom is false)
    if (!showScrollToBottom) {
      scrollToBottom(false); // No animation to prevent overshoot
    }
  }, [messages.length, showScrollToBottom]);

  const clearMessages = useCallback(() => {
    setMessages([getInitialMessage(i18n.language)]);
  }, [i18n.language]);

  const sendMessage = useCallback(async () => {
    const text = inputText.trim();
    if (!text || isTyping) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      text,
      role: 'user',
      timestamp: new Date(),
      status: 'sent',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    if (!apiKey) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            text: 'ERROR: NO_CORE_IDENTITY_FOUND. Please go to Control Panel and insert your Groq API Key.',
            role: 'ai',
            timestamp: new Date(),
            status: 'error',
          },
        ]);
        setIsTyping(false);
        setIsConnected(false);
      }, 500);
      return;
    }

    try {
      const workInfo = data?.workInfo;
      const history: GroqMessage[] = messages.slice(-MAX_HISTORY).map((m) => ({
        role: m.role === 'ai' ? 'assistant' : 'user',
        content: m.text,
      }));

      const response = await axios.post<{
        choices: Array<{ message: { content: string } }>;
      }>(
        GROQ_API_URL,
        {
          model: modelId || DEFAULT_MODEL,
          messages: [
            {
              role: 'system',
              content: i18n.language === 'tr'
                ? `Sen FSP CHAMP 1kVA Tower Online UPS için SİSTEM ÇEKİRDEK ZEKSASI'sın. Teknik, kesin ve donanım odaklısın. Kullanıcıya 'Operatör' diye hitap et.
                   Mevcut Donanım Durumu: Maks Kapasite 1000VA, Batarya %${workInfo?.batteryCapacity ?? 0} (${workInfo?.batteryVoltage ?? 0}V), Çalışma Süresi ${workInfo?.batteryRemainTime ?? 0} dk, Şebeke ${workInfo?.inputVoltage ?? 0}V @ ${workInfo?.inputFrequency ?? 0}Hz, Çıkış ${workInfo?.outputVoltage ?? 0}V @ ${workInfo?.outputCurrent ?? 0}A, Yük %${workInfo?.outputLoadPercent ?? 0}, Sıcaklık ${workInfo?.temperatureView ?? 0}°C, Mod ${workInfo?.workMode ?? 'Online'}.
                   Sistem Konfigürasyonu: EcoMod ${workInfo?.ecomode ?? 'N/A'}, AutoReboot ${workInfo?.autoReboot ?? 'N/A'}, ConverterMod ${workInfo?.converterMode ?? 'N/A'}.
                   Aktif Uyarılar: ${workInfo?.warnings?.length ? workInfo.warnings.join(', ') : 'Yok'}.
                   Kısa ama profesyonel ol.`
                : `You are the UPS Core Intelligence for the FSP CHAMP 1kVA Tower Online UPS. Technical, precise, hardware-focused. Address user as 'Operator'.
                   Current Hardware State: Max Capacity 1000VA, Battery ${workInfo?.batteryCapacity ?? 0}% (${workInfo?.batteryVoltage ?? 0}V), Runtime ${workInfo?.batteryRemainTime ?? 0} mins, Grid ${workInfo?.inputVoltage ?? 0}V @ ${workInfo?.inputFrequency ?? 0}Hz, Output ${workInfo?.outputVoltage ?? 0}V @ ${workInfo?.outputCurrent ?? 0}A, Load ${workInfo?.outputLoadPercent ?? 0}%, Temp ${workInfo?.temperatureView ?? 0}°C, Mode ${workInfo?.workMode ?? 'Online'}.
                   System Config: EcoMode ${workInfo?.ecomode ?? 'N/A'}, AutoReboot ${workInfo?.autoReboot ?? 'N/A'}, ConverterMode ${workInfo?.converterMode ?? 'N/A'}.
                   Active Warnings: ${workInfo?.warnings?.length ? workInfo.warnings.join(', ') : 'None'}.
                   Be extremely concise but professional.`
            },
            ...history,
            { role: 'user', content: text },
          ],
          temperature: 0.7,
          max_tokens: 1024,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: REQUEST_TIMEOUT,
        }
      );

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          text: response.data.choices[0].message.content,
          role: 'ai',
          timestamp: new Date(),
          status: 'sent',
        },
      ]);
      setIsConnected(true);
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { error?: { message?: string } } };
        message?: string;
      };
      const errText =
        axiosErr?.response?.data?.error?.message ??
        axiosErr?.message ??
        'Unknown error.';

      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          text: `COMMUNICATION ERROR: ${errText}`,
          role: 'ai',
          timestamp: new Date(),
          status: 'error',
        },
      ]);
      setIsConnected(false);
    } finally {
      setIsTyping(false);
    }
  }, [inputText, isTyping, apiKey, modelId, messages, data]);

  const renderItem = useCallback(
    ({ item }: { item: Message | 'typing' }) => {
      if (item === 'typing') {
        return (
          <View style={styles.typingWrapper}>
            <TypingIndicator color={palette.primary} />
          </View>
        );
      }
      return (
        <MessageBubble
          message={item}
          palette={palette}
          isDark={isDark}
          textColor={theme.colors.text.primary}
          tertiaryColor={theme.colors.text.tertiary}
        />
      );
    },
    [palette, isDark, theme]
  );

  const keyExtractor = useCallback(
    (item: Message | 'typing') =>
      item === 'typing' ? 'typing-indicator' : item.id,
    []
  );

  const getItemType = useCallback(
    (item: Message | 'typing') => (item === 'typing' ? 'typing' : item.role),
    []
  );

  const canSend = inputText.trim().length > 0 && !isTyping;

  return (
    <KeyboardAvoidingView
      style={[styles.root, { backgroundColor: theme.colors.background }]}
      behavior="padding"
      keyboardVerticalOffset={0}
    >
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor="transparent"
        translucent
      />
      {/* ── Header ── */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 8,
            backgroundColor: theme.colors.background,
            borderBottomColor: isDark
              ? 'rgba(255,255,255,0.06)'
              : 'rgba(0,0,0,0.06)',
          },
        ]}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.push('/two')}
            activeOpacity={0.7}
            style={[
              styles.backBtn,
              {
                backgroundColor: isDark
                  ? 'rgba(255,255,255,0.06)'
                  : 'rgba(0,0,0,0.06)',
              },
            ]}
          >
            <ChevronLeft size={20} color={theme.colors.text.primary} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <View
              style={[styles.badge, { backgroundColor: palette.primary + '1A' }]}
            >
              <Brain size={13} color={palette.primary} />
              <Text style={[styles.badgeText, { color: palette.primary }]}>
                {t('chat.badge')}
              </Text>
              {isConnected ? (
                <Wifi size={9} color={palette.primary} />
              ) : (
                <WifiOff size={9} color="#ef4444" />
              )}
            </View>
            <Text
              style={[styles.headerTitle, { color: theme.colors.text.primary }]}
            >
              {t('chat.header')}
            </Text>
          </View>

          <TouchableOpacity
            onPress={clearMessages}
            activeOpacity={0.7}
            disabled={messages.length <= 1}
            style={[
              styles.backBtn,
              {
                backgroundColor: isDark
                  ? 'rgba(255,255,255,0.06)'
                  : 'rgba(0,0,0,0.06)',
                opacity: messages.length <= 1 ? 0.3 : 1,
              },
            ]}
          >
            <Trash2 size={18} color={messages.length <= 1 ? theme.colors.text.tertiary : "#ef4444"} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Body ── */}
      <View style={{ flex: 1 }}>
        <FlashList
          ref={flashListRef}
          data={listData}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemType={getItemType}
          // @ts-ignore
          estimatedItemSize={90}
          contentContainerStyle={styles.listContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="none"
          keyboardShouldPersistTaps="handled"
        />

        {showScrollToBottom && (
          <View
            style={styles.scrollToBottomContainer}
          >
            <TouchableOpacity
              onPress={() => scrollToBottom(true)}
              activeOpacity={0.9}
              style={[
                styles.scrollToBottomBtn,
                {
                  backgroundColor: isDark
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(0,0,0,0.05)',
                  borderColor: isDark
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(0,0,0,0.1)',
                },
              ]}
            >
              <ChevronDownIcon size={18} color={palette.primary} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* ── Input Bar ── */}
      <View
        style={[
          styles.inputContainer,
          {
            borderTopColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
            backgroundColor: theme.colors.background,
            paddingBottom: 12,
          }
        ]}
      >
        <View style={[styles.inputWrapper, { backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
          <TextInput
            style={[styles.input, { color: theme.colors.text.primary }]}
            placeholder="Query the system core..."
            placeholderTextColor={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={2000}
          />
          <TouchableOpacity
            onPress={sendMessage}
            disabled={!canSend}
            style={[
              styles.sendButton,
              { backgroundColor: canSend ? palette.primary : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }
            ]}
          >
            {isTyping ? (
              <ActivityIndicator size={16} color={isDark ? '#000' : '#fff'} />
            ) : (
              <Send size={18} color={canSend ? (isDark ? '#000' : '#fff') : isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1 },

  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: { alignItems: 'center', gap: 4 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 8,
    letterSpacing: 1.2,
    fontFamily: 'Outfit_800ExtraBold',
  },
  headerTitle: {
    fontSize: 22,
    letterSpacing: -0.5,
    fontFamily: 'Outfit_900Black',
  },

  body: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 10 },

  messageWrapper: { maxWidth: '85%', marginBottom: 18, gap: 4 },
  aiWrapper: { alignSelf: 'flex-start' },
  userWrapper: { alignSelf: 'flex-end' },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 3,
  },
  rowLeft: { justifyContent: 'flex-start' },
  rowRight: { justifyContent: 'flex-end' },
  authorText: { fontSize: 8, letterSpacing: 1.5, fontFamily: 'Outfit_800ExtraBold' },
  bubble: { padding: 14, borderRadius: 18 },
  bubbleText: { fontSize: 14, lineHeight: 22, fontFamily: 'Outfit_500Medium' },
  timestamp: {
    fontSize: 9,
    fontFamily: 'Outfit_400Regular',
    opacity: 0.5,
    alignSelf: 'flex-end',
  },

  typingWrapper: { alignSelf: 'flex-start', marginBottom: 18, paddingLeft: 4 },
  typingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  typingLabel: { fontSize: 8, letterSpacing: 1.5, fontFamily: 'Outfit_700Bold' },
  dotsRow: { flexDirection: 'row', gap: 3, alignItems: 'center' },
  dot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#6b7280' },

  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  input: {
    flex: 1,
    maxHeight: 120,
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 8,
    fontSize: 15,
    fontFamily: 'Outfit_600SemiBold',
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    marginBottom: 2,
  },

  scrollToBottomContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 99,
  },
  scrollToBottomBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});
