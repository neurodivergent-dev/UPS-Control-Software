import React from 'react';
import { Modal, StyleSheet, View, Text, TouchableOpacity, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { AlertTriangle, X } from 'lucide-react-native';
import { GlowCard } from './GlowCard';
import { Palettes } from '../contexts/ThemeContext';
import Animated, { FadeIn, FadeOut, ZoomIn, ZoomOut } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';

interface CustomAlertProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDark: boolean;
}

export const CustomAlert = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  isDark
}: CustomAlertProps) => {
  const { t } = useTranslation();
  
  if (!visible) return null;

  return (
    <Modal transparent visible={visible} animationType="none" statusBarTranslucent>
      <View style={styles.fullScreen}>
        <Animated.View entering={FadeIn} exiting={FadeOut} style={StyleSheet.absoluteFill}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
            <BlurView intensity={30} style={StyleSheet.absoluteFill} tint={isDark ? 'dark' : 'light'} />
          </Pressable>
        </Animated.View>
        
        <Animated.View 
          entering={ZoomIn.springify()} 
          exiting={ZoomOut}
          style={styles.modalContainer}
        >
          <GlowCard palette={Palettes.slate} isDark={isDark} borderRadius={24}>
            <View style={[styles.content, { backgroundColor: isDark ? 'rgba(10,20,35,0.98)' : '#fff' }]}>
              <View style={styles.header}>
                <View style={styles.iconContainer}>
                  <AlertTriangle color="#ef4444" size={24} />
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <X size={20} color={isDark ? '#fff' : '#000'} opacity={0.5} />
                </TouchableOpacity>
              </View>

              <View style={styles.textContainer}>
                <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>{title}</Text>
                <Text style={[styles.message, { color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }]}>
                  {message}
                </Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={styles.cancelBtn}>
                  <Text style={[styles.cancelText, { color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }]}>
                    {cancelText || t('chat.abort')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onConfirm} activeOpacity={0.8} style={styles.confirmBtn}>
                  <Text style={styles.confirmBtnText}>
                    {confirmText || t('chat.purge')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </GlowCard>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullScreen: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContainer: { width: '100%', maxWidth: 340 },
  content: { padding: 24, gap: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  iconContainer: { width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(239, 68, 68, 0.15)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)' },
  closeBtn: { padding: 4 },
  textContainer: { gap: 8 },
  title: { fontSize: 20, fontFamily: 'Outfit_800ExtraBold', letterSpacing: -0.5 },
  message: { fontSize: 13, fontFamily: 'Outfit_500Medium', lineHeight: 20 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 4 },
  cancelBtn: { flex: 1, height: 50, justifyContent: 'center', alignItems: 'center' },
  cancelText: { fontFamily: 'Outfit_700Bold', fontSize: 12, letterSpacing: 1, textAlign: 'center' },
  confirmBtn: { flex: 1.5, height: 50, backgroundColor: '#ef4444', justifyContent: 'center', alignItems: 'center', borderRadius: 12, shadowColor: '#ef4444', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  confirmBtnText: { color: '#fff', fontFamily: 'Outfit_800ExtraBold', fontSize: 12, letterSpacing: 1, textAlign: 'center' },
});
