import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '@/assets/style/ThemeProvider';
import { Theme } from '@/assets/style/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

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

const FormContainer = styled.ScrollView`
  flex: 1;
  padding: 16px;
`;

const FormGroup = styled.View`
  margin-bottom: 16px;
`;

const Label = styled.Text<ThemeProps>`
  font-size: 14px;
  font-weight: 600;
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
  margin-bottom: 8px;
`;

const Input = styled.TextInput<ThemeProps>`
  height: 48px;
  padding: 0 16px;
  border-radius: ${(props: ThemeProps) => props.theme.borderRadius.md}px;
  background-color: ${(props: ThemeProps) => props.theme.colors.surface};
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
  font-size: 16px;
`;

const SelectContainer = styled.TouchableOpacity<ThemeProps>`
  height: 48px;
  padding: 0 16px;
  border-radius: ${(props: ThemeProps) => props.theme.borderRadius.md}px;
  background-color: ${(props: ThemeProps) => props.theme.colors.surface};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const SelectText = styled.Text<ThemeProps>`
  font-size: 16px;
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
`;

const SubmitButton = styled.TouchableOpacity<ThemeProps>`
  height: 48px;
  border-radius: ${(props: ThemeProps) => props.theme.borderRadius.md}px;
  background-color: ${(props: ThemeProps) => props.theme.colors.primary};
  justify-content: center;
  align-items: center;
  margin-top: 24px;
`;

const SubmitButtonText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #FFFFFF;
`;

interface AdminForm {
  name: string;
  email: string;
  password: string;
  role: 'super_admin' | 'admin';
  status: 'active' | 'inactive';
}

export default function AddAdminScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState<AdminForm>({
    name: '',
    email: '',
    password: '',
    role: 'admin',
    status: 'active'
  });
  const [showRolePicker, setShowRolePicker] = useState(false);
  const [showStatusPicker, setShowStatusPicker] = useState(false);

  const handleSubmit = () => {
    // Validate form
    if (!form.name || !form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Here you would typically make an API call to create the admin
    Alert.alert(
      'Success',
      'Admin created successfully',
      [
        {
          text: 'OK',
          onPress: () => router.back()
        }
      ]
    );
  };

  const roleOptions = [
    { label: 'Admin', value: 'admin' },
    { label: 'Super Admin', value: 'super_admin' }
  ];

  const statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' }
  ];

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
        <Title>Add New Admin</Title>
      </Header>

      <FormContainer>
        <FormGroup>
          <Label>Full Name *</Label>
          <Input
            placeholder="Enter full name"
            placeholderTextColor={theme.colors.text.secondary}
            value={form.name}
            onChangeText={(text: string) => setForm(prev => ({ ...prev, name: text }))}
          />
        </FormGroup>

        <FormGroup>
          <Label>Email *</Label>
          <Input
            placeholder="Enter email address"
            placeholderTextColor={theme.colors.text.secondary}
            value={form.email}
            onChangeText={(text: string) => setForm(prev => ({ ...prev, email: text }))}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </FormGroup>

        <FormGroup>
          <Label>Password *</Label>
          <Input
            placeholder="Enter password"
            placeholderTextColor={theme.colors.text.secondary}
            value={form.password}
            onChangeText={(text: string) => setForm(prev => ({ ...prev, password: text }))}
            secureTextEntry
          />
        </FormGroup>

        <FormGroup>
          <Label>Role</Label>
          <SelectContainer onPress={() => setShowRolePicker(true)}>
            <SelectText>
              {roleOptions.find(option => option.value === form.role)?.label}
            </SelectText>
            <Ionicons
              name="chevron-down"
              size={20}
              color={theme.colors.text.secondary}
            />
          </SelectContainer>
        </FormGroup>

        <FormGroup>
          <Label>Status</Label>
          <SelectContainer onPress={() => setShowStatusPicker(true)}>
            <SelectText>
              {statusOptions.find(option => option.value === form.status)?.label}
            </SelectText>
            <Ionicons
              name="chevron-down"
              size={20}
              color={theme.colors.text.secondary}
            />
          </SelectContainer>
        </FormGroup>

        <SubmitButton onPress={handleSubmit}>
          <SubmitButtonText>Create Admin</SubmitButtonText>
        </SubmitButton>
      </FormContainer>
    </Container>
  );
} 