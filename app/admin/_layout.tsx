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
      <Stack.Screen name="manage-admins" />
      <Stack.Screen name="manage-users" />
      <Stack.Screen name="manage-drivers" />
      <Stack.Screen name="manage-trucks" />
      <Stack.Screen name="manage-routes" />
      <Stack.Screen name="trash-bins" />
      <Stack.Screen name="add-admin" />
      <Stack.Screen name="edit-admin" />
      <Stack.Screen name="add-user" />
      <Stack.Screen name="edit-user" />
      <Stack.Screen name="add-driver" />
      <Stack.Screen name="edit-driver" />
      <Stack.Screen name="add-truck" />
      <Stack.Screen name="edit-truck" />
      <Stack.Screen name="add-route" />
      <Stack.Screen name="edit-route" />
    </Stack>
  );
} 