import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View, Text } from 'react-native';
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

const Container = styled.View<ThemeProps>`
  flex: 1;
  background-color: ${(props: ThemeProps) => props.theme.colors.background};
`;

const Header = styled.View<ThemeProps>`
  padding: 16px;
  flex-direction: row;
  align-items: center;
  background-color: ${(props: ThemeProps) => props.theme.colors.surface};
  border-bottom-width: 1px;
  border-bottom-color: ${(props: ThemeProps) => props.theme.colors.border};
`;

const BackButton = styled.TouchableOpacity`
  padding: 8px;
  margin-right: 8px;
`;

const HeaderTitle = styled.Text<ThemeProps>`
  font-size: 20px;
  font-weight: bold;
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
`;

const Content = styled.ScrollView`
  flex: 1;
`;

const FormSection = styled.View<ThemeProps>`
  margin: 16px;
  padding: 16px;
  background-color: ${(props: ThemeProps) => props.theme.colors.surface};
  border-radius: ${(props: ThemeProps) => props.theme.borderRadius.md}px;
`;

const FormTitle = styled.Text<ThemeProps>`
  font-size: 16px;
  font-weight: bold;
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
  margin-bottom: 16px;
`;

const InputGroup = styled.View`
  margin-bottom: 16px;
`;

const Label = styled.Text<ThemeProps>`
  font-size: 14px;
  color: ${(props: ThemeProps) => props.theme.colors.text.secondary};
  margin-bottom: 8px;
`;

const InputContainer = styled.View<ThemeProps>`
  flex-direction: row;
  align-items: center;
  border-width: 1px;
  border-color: ${(props: ThemeProps) => props.theme.colors.border};
  border-radius: ${(props: ThemeProps) => props.theme.borderRadius.sm}px;
  height: 48px;
  padding: 0 16px;
`;

const Input = styled.TextInput<ThemeProps>`
  flex: 1;
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
  font-size: 16px;
`;

const ToggleButton = styled.TouchableOpacity`
  padding: 8px;
`;

const RequirementsList = styled.View`
  margin-top: 8px;
`;

const RequirementItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 4px;
`;

const RequirementText = styled.Text<ThemeProps & { met: boolean }>`
  font-size: 12px;
  color: ${(props: ThemeProps & { met: boolean }) => 
    props.met ? props.theme.colors.primary : props.theme.colors.text.secondary};
  margin-left: 8px;
`;

const SaveButton = styled.TouchableOpacity<ThemeProps>`
  margin: 16px;
  padding: 16px;
  background-color: ${(props: ThemeProps) => props.theme.colors.primary};
  border-radius: ${(props: ThemeProps) => props.theme.borderRadius.md}px;
  align-items: center;
`;

const SaveButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

const InfoText = styled.Text<ThemeProps>`
  font-size: 14px;
  color: ${(props: ThemeProps) => props.theme.colors.text.secondary};
  margin-bottom: 16px;
  line-height: 20px;
`;

export default function ChangePasswordScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handleBack = () => {
    router.back();
  };

  const handleSave = () => {
    // Handle save logic here
    console.log('Saving password:', passwords);
  };

  const checkPasswordStrength = (password: string) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    return requirements;
  };

  const requirements = checkPasswordStrength(passwords.new);

  return (
    <Container style={{ paddingTop: insets.top }} theme={theme}>
      <Header theme={theme}>
        <BackButton onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </BackButton>
        <HeaderTitle theme={theme}>Change Password</HeaderTitle>
      </Header>

      <Content>
        <FormSection theme={theme}>
          <FormTitle theme={theme}>Password Settings</FormTitle>
          <InfoText theme={theme}>
            Please enter your current password and set a new password. Make sure to use a strong password that you haven't used before.
          </InfoText>

          <InputGroup>
            <Label theme={theme}>Current Password</Label>
            <InputContainer theme={theme}>
              <Input
                theme={theme}
                value={passwords.current}
                onChangeText={(text: string) => setPasswords({ ...passwords, current: text })}
                placeholder="Enter your current password"
                placeholderTextColor={theme.colors.text.secondary}
                secureTextEntry={!showCurrentPassword}
              />
              <ToggleButton onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                <Ionicons
                  name={showCurrentPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color={theme.colors.text.secondary}
                />
              </ToggleButton>
            </InputContainer>
          </InputGroup>

          <InputGroup>
            <Label theme={theme}>New Password</Label>
            <InputContainer theme={theme}>
              <Input
                theme={theme}
                value={passwords.new}
                onChangeText={(text: string) => setPasswords({ ...passwords, new: text })}
                placeholder="Enter your new password"
                placeholderTextColor={theme.colors.text.secondary}
                secureTextEntry={!showNewPassword}
              />
              <ToggleButton onPress={() => setShowNewPassword(!showNewPassword)}>
                <Ionicons
                  name={showNewPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color={theme.colors.text.secondary}
                />
              </ToggleButton>
            </InputContainer>
            <RequirementsList>
              <RequirementItem>
                <Ionicons
                  name={requirements.length ? 'checkmark-circle' : 'ellipse-outline'}
                  size={16}
                  color={requirements.length ? theme.colors.primary : theme.colors.text.secondary}
                />
                <RequirementText theme={theme} met={requirements.length}>
                  At least 8 characters long
                </RequirementText>
              </RequirementItem>
              <RequirementItem>
                <Ionicons
                  name={requirements.uppercase ? 'checkmark-circle' : 'ellipse-outline'}
                  size={16}
                  color={requirements.uppercase ? theme.colors.primary : theme.colors.text.secondary}
                />
                <RequirementText theme={theme} met={requirements.uppercase}>
                  Contains uppercase letter
                </RequirementText>
              </RequirementItem>
              <RequirementItem>
                <Ionicons
                  name={requirements.lowercase ? 'checkmark-circle' : 'ellipse-outline'}
                  size={16}
                  color={requirements.lowercase ? theme.colors.primary : theme.colors.text.secondary}
                />
                <RequirementText theme={theme} met={requirements.lowercase}>
                  Contains lowercase letter
                </RequirementText>
              </RequirementItem>
              <RequirementItem>
                <Ionicons
                  name={requirements.number ? 'checkmark-circle' : 'ellipse-outline'}
                  size={16}
                  color={requirements.number ? theme.colors.primary : theme.colors.text.secondary}
                />
                <RequirementText theme={theme} met={requirements.number}>
                  Contains number
                </RequirementText>
              </RequirementItem>
              <RequirementItem>
                <Ionicons
                  name={requirements.special ? 'checkmark-circle' : 'ellipse-outline'}
                  size={16}
                  color={requirements.special ? theme.colors.primary : theme.colors.text.secondary}
                />
                <RequirementText theme={theme} met={requirements.special}>
                  Contains special character
                </RequirementText>
              </RequirementItem>
            </RequirementsList>
          </InputGroup>

          <InputGroup>
            <Label theme={theme}>Confirm New Password</Label>
            <InputContainer theme={theme}>
              <Input
                theme={theme}
                value={passwords.confirm}
                onChangeText={(text: string) => setPasswords({ ...passwords, confirm: text })}
                placeholder="Confirm your new password"
                placeholderTextColor={theme.colors.text.secondary}
                secureTextEntry={!showConfirmPassword}
              />
              <ToggleButton onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons
                  name={showConfirmPassword ? 'eye-off' : 'eye'}
                  size={24}
                  color={theme.colors.text.secondary}
                />
              </ToggleButton>
            </InputContainer>
          </InputGroup>
        </FormSection>

        <SaveButton theme={theme} onPress={handleSave}>
          <SaveButtonText>Update Password</SaveButtonText>
        </SaveButton>
      </Content>
    </Container>
  );
} 