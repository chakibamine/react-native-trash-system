import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, Slot } from 'expo-router';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '@/assets/style/ThemeProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Onboarding from '@/components/Onboarding';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    async function prepare() {
      try {
        const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
        setIsFirstLaunch(hasSeenOnboarding !== 'true');
      } catch (e) {
        console.warn('Error reading onboarding status:', e);
        setIsFirstLaunch(true);
      } finally {
        if (loaded) {
          await SplashScreen.hideAsync();
        }
      }
    }

    prepare();
  }, [loaded]);

  if (!loaded || isFirstLaunch === null) {
    return <Slot />;
  }

  if (isFirstLaunch) {
    return (
      <ThemeProvider>
        <Onboarding setIsFirstLaunch={setIsFirstLaunch} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="admin" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            {/* Root route: SignIn screen */}
            <Stack.Screen name="index" />
            
            {/* Tabs route */}
            <Stack.Screen name="(tabs)" />
            
            {/* Admin routes */}
            <Stack.Screen name="admin/dashboard" options={{ headerShown: false }} />
            <Stack.Screen name="admin/profile" options={{ headerShown: false }} />
            <Stack.Screen name="admin/change-password" options={{ headerShown: false }} />
            <Stack.Screen name="admin/settings" options={{ headerShown: false }} />
            <Stack.Screen name="admin/notifications" options={{ headerShown: false }} />
            
            {/* Not-found route */}
            <Stack.Screen name="+not-found" />
            
            {/* Modal route */}
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </Stack>
        </NavigationThemeProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}