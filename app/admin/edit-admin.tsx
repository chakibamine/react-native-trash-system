import React, { useState, useEffect } from 'react';
import { View, ScrollView, Alert, ActivityIndicator, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styled from 'styled-components/native';
import { useTheme } from '@/assets/style/ThemeProvider';
import { Theme } from '@/assets/style/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

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

const SelectContainer = styled.View<ThemeProps>`
  height: 48px;
  border-radius: ${(props: ThemeProps) => props.theme.borderRadius.md}px;
  background-color: ${(props: ThemeProps) => props.theme.colors.surface};
  overflow: hidden;
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
  name: string;
  email: string;
  role: 'super_admin' | 'admin';
  status: 'active' | 'inactive';
}

export default function EditAdminScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    role: 'admin',
    status: 'active',
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, [id]);

  const fetchAdminData = async () => {
    try {
      // Here you would make an API call to fetch the admin data
      // For now, we'll simulate it with mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockData: FormData = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'super_admin',
        status: 'active',
      };
      setForm(mockData);
      setIsLoading(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch admin data');
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      // Here you would make an API call to update the admin
      // For now, we'll simulate it
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('Success', 'Admin updated successfully');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to update admin');
    }
  };

  if (isLoading) {
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
          <Title>Edit Admin</Title>
        </Header>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </Container>
    );
  }

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
        <Title>Edit Admin</Title>
      </Header>

      <FormContainer>
        <InputContainer>
          <Label>Name</Label>
          <Input
            value={form.name}
            onChangeText={(text: string) => setForm(prev => ({ ...prev, name: text }))}
            placeholder="Enter name"
            placeholderTextColor={theme.colors.text.secondary}
          />
        </InputContainer>

        <InputContainer>
          <Label>Email</Label>
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
          <Label>Role</Label>
          <SelectContainer>
            <Picker
              selectedValue={form.role}
              onValueChange={(value: 'super_admin' | 'admin') => setForm(prev => ({ ...prev, role: value }))}
              style={{ color: theme.colors.text.primary }}
            >
              <Picker.Item label="Super Admin" value="super_admin" />
              <Picker.Item label="Admin" value="admin" />
            </Picker>
          </SelectContainer>
        </InputContainer>

        <SwitchContainer>
          <SwitchLabel>Active Status</SwitchLabel>
          <Switch
            value={form.status === 'active'}
            onValueChange={(value: boolean) => setForm(prev => ({ ...prev, status: value ? 'active' : 'inactive' }))}
          />
        </SwitchContainer>

        <SubmitButton onPress={handleSubmit}>
          <SubmitButtonText>Update Admin</SubmitButtonText>
        </SubmitButton>
      </FormContainer>
    </Container>
  );
} 