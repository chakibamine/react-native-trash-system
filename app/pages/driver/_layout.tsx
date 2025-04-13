import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import { BlurView } from 'expo-blur';

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : '#FFFFFF',
        },
      }}
    >
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="change-password" />
    </Stack>
  );
} 