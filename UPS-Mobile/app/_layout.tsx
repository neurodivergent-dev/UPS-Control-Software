import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts, Outfit_400Regular, Outfit_500Medium, Outfit_600SemiBold, Outfit_700Bold, Outfit_800ExtraBold, Outfit_900Black } from '@expo-google-fonts/outfit';
import { Stack, router, useRootNavigationState } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View } from 'react-native';

import '../services/i18n';
import { ThemeProvider } from '../contexts/ThemeContext';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Create a client for React Query
const queryClient = new QueryClient();

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
    Outfit_900Black,
    ...FontAwesome.font,
  });

  const navigationState = useRootNavigationState();
  const [onboardingChecked, setOnboardingChecked] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    async function checkOnboarding() {
      try {
        const completed = await AsyncStorage.getItem('HAS_COMPLETED_ONBOARDING');
        if (completed !== 'true') {
          setShowOnboarding(true);
        }
      } catch (e) {
        console.error('Failed to check onboarding:', e);
      } finally {
        setOnboardingChecked(true);
      }
    }
    checkOnboarding();
  }, []);

  useEffect(() => {
    if (!navigationState?.key || !loaded || !onboardingChecked) return;

    const performNavigation = async () => {
      // Small delay to ensure layout is ready
      setTimeout(async () => {
        await SplashScreen.hideAsync();
        if (showOnboarding) {
          router.replace('/onboarding');
        }
      }, 100);
    };

    performNavigation();
  }, [loaded, onboardingChecked, showOnboarding, navigationState?.key]);

  // If fonts or onboarding check isn't ready, don't render anything yet
  // but keep the SplashScreen visible via the preventAutoHideAsync call above.
  if (!loaded || !onboardingChecked || !navigationState?.key) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
