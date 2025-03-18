import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="manage-admins" />
      <Stack.Screen name="manage-drivers" />
      <Stack.Screen name="manage-users" />
      <Stack.Screen name="trash-bins" />
      <Stack.Screen name="reports" />
      <Stack.Screen name="settings" />
    </Stack>
  );
} 