import React, { useState } from 'react';
import { ScrollView, Alert, Switch } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '@/assets/style/ThemeProvider';
import { Theme } from '@/assets/style/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Role } from '@/types/user';

// Define prop types for styled components
type ThemeProps = {
  theme: Theme;
};

// Styled components
const Container = styled.View<ThemeProps>`
  flex: 1;
  background-color: ${(props: ThemeProps) => props.theme.colors.background};
`;

const Header = styled.View<ThemeProps>`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  background-color: ${(props: ThemeProps) => props.theme.colors.surface};
  border-bottom-width: 1px;
  border-bottom-color: ${(props: ThemeProps) => props.theme.colors.border};
`;

const BackButton = styled.TouchableOpacity`
  padding: 8px;
  margin-right: 8px;
`;

const Title = styled.Text<ThemeProps>`
  font-size: 20px;
  font-weight: bold;
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
  flex: 1;
`;

const FormContainer = styled.ScrollView<ThemeProps>`
  flex: 1;
  padding: 16px;
`;

const InputContainer = styled.View<ThemeProps>`
  margin-bottom: 16px;
`;

const Label = styled.Text<ThemeProps>`
  font-size: 16px;
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
  margin-bottom: 8px;
`;

const Input = styled.TextInput<ThemeProps>`
  height: 48px;
  padding: 12px;
  border-radius: ${(props: ThemeProps) => props.theme.borderRadius.md}px;
  background-color: ${(props: ThemeProps) => props.theme.colors.surface};
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
  font-size: 16px;
`;

const SwitchContainer = styled.View<ThemeProps>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: ${(props: ThemeProps) => props.theme.colors.surface};
  border-radius: ${(props: ThemeProps) => props.theme.borderRadius.md}px;
  margin-bottom: 16px;
`;

const SwitchLabel = styled.Text<ThemeProps>`
  font-size: 16px;
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
`;

const SubmitButton = styled.TouchableOpacity<ThemeProps>`
  height: 48px;
  background-color: ${(props: ThemeProps) => props.theme.colors.primary};
  border-radius: ${(props: ThemeProps) => props.theme.borderRadius.md}px;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
`;

const SubmitButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: 600;
`;

interface FormData {
  username: string;
  email: string;
  password: string;
  role: Role;
  isActive: boolean;
  address: string;
  phoneNumber: string;
  hasPendingReports: boolean;
  licenseNumber: string;
  isAvailable: boolean;
}

export default function AddUserScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    role: Role.NORMAL_USER,
    isActive: true,
    address: '',
    phoneNumber: '',
    hasPendingReports: false,
    licenseNumber: '',
    isAvailable: true,
  });

  const handleSubmit = async () => {
    try {
      // Validate form
      if (!form.username || !form.email || !form.password) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

      // Here you would make an API call to create the user
      // For now, we'll simulate it
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('Success', 'User created successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to create user');
    }
  };

  return (
    <Container style={{ paddingTop: insets.top }}>
      <Header>
        <BackButton onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.colors.text.primary}
          />
        </BackButton>
        <Title>Add New User</Title>
      </Header>

      <FormContainer>
        <InputContainer>
          <Label>Username *</Label>
          <Input
            value={form.username}
            onChangeText={(text: string) => setForm(prev => ({ ...prev, username: text }))}
            placeholder="Enter username"
            placeholderTextColor={theme.colors.text.secondary}
          />
        </InputContainer>

        <InputContainer>
          <Label>Email *</Label>
          <Input
            value={form.email}
            onChangeText={(text: string) => setForm(prev => ({ ...prev, email: text }))}
            placeholder="Enter email"
            placeholderTextColor={theme.colors.text.secondary}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </InputContainer>

        <InputContainer>
          <Label>Password *</Label>
          <Input
            value={form.password}
            onChangeText={(text: string) => setForm(prev => ({ ...prev, password: text }))}
            placeholder="Enter password"
            placeholderTextColor={theme.colors.text.secondary}
            secureTextEntry
          />
        </InputContainer>

        <InputContainer>
          <Label>Phone Number</Label>
          <Input
            value={form.phoneNumber}
            onChangeText={(text: string) => setForm(prev => ({ ...prev, phoneNumber: text }))}
            placeholder="Enter phone number"
            placeholderTextColor={theme.colors.text.secondary}
            keyboardType="phone-pad"
          />
        </InputContainer>

        <InputContainer>
          <Label>Address</Label>
          <Input
            value={form.address}
            onChangeText={(text: string) => setForm(prev => ({ ...prev, address: text }))}
            placeholder="Enter address"
            placeholderTextColor={theme.colors.text.secondary}
          />
        </InputContainer>

        <SwitchContainer>
          <SwitchLabel>Active Status</SwitchLabel>
          <Switch
            value={form.isActive}
            onValueChange={(value: boolean) => setForm(prev => ({ ...prev, isActive: value }))}
          />
        </SwitchContainer>

        <SwitchContainer>
          <SwitchLabel>Available</SwitchLabel>
          <Switch
            value={form.isAvailable}
            onValueChange={(value: boolean) => setForm(prev => ({ ...prev, isAvailable: value }))}
          />
        </SwitchContainer>

        <SwitchContainer>
          <SwitchLabel>Has Pending Reports</SwitchLabel>
          <Switch
            value={form.hasPendingReports}
            onValueChange={(value: boolean) => setForm(prev => ({ ...prev, hasPendingReports: value }))}
          />
        </SwitchContainer>

        <SubmitButton onPress={handleSubmit}>
          <SubmitButtonText>Create User</SubmitButtonText>
        </SubmitButton>
      </FormContainer>
    </Container>
  );
} 