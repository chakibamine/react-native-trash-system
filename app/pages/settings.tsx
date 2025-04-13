import React, { useState } from 'react';
import { ScrollView, Switch, TouchableOpacity, View, Text } from 'react-native';
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

const Section = styled.View<ThemeProps>`
  margin: 16px;
  background-color: ${(props: ThemeProps) => props.theme.colors.surface};
  border-radius: ${(props: ThemeProps) => props.theme.borderRadius.md}px;
  overflow: hidden;
`;

const SectionHeader = styled.View<ThemeProps>`
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props: ThemeProps) => props.theme.colors.border};
`;

const SectionTitle = styled.Text<ThemeProps>`
  font-size: 16px;
  font-weight: bold;
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
`;

const SettingItem = styled.TouchableOpacity<ThemeProps>`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props: ThemeProps) => props.theme.colors.border};
`;

const SettingItemLast = styled(SettingItem)`
  border-bottom-width: 0;
`;

const SettingIcon = styled.View<ThemeProps>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${(props: ThemeProps) => `${props.theme.colors.primary}15`};
  justify-content: center;
  align-items: center;
  margin-right: 16px;
`;

const SettingContent = styled.View`
  flex: 1;
`;

const SettingTitle = styled.Text<ThemeProps>`
  font-size: 16px;
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
  margin-bottom: 4px;
`;

const SettingDescription = styled.Text<ThemeProps>`
  font-size: 14px;
  color: ${(props: ThemeProps) => props.theme.colors.text.secondary};
`;

const SettingValue = styled.Text<ThemeProps>`
  font-size: 14px;
  color: ${(props: ThemeProps) => props.theme.colors.text.secondary};
  margin-right: 8px;
`;

const Divider = styled.View<ThemeProps>`
  height: 1px;
  background-color: ${(props: ThemeProps) => props.theme.colors.border};
  margin: 16px;
`;

export default function SettingsScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(true);

  const handleBack = () => {
    router.back();
  };

  const handleProfilePress = () => {
    router.push('/admin/profile');
  };

  const handleChangePasswordPress = () => {
    router.push('/admin/change-password');
  };

  return (
    <Container style={{ paddingTop: insets.top }} theme={theme}>
      <Header theme={theme}>
        <BackButton onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </BackButton>
        <HeaderTitle theme={theme}>Settings</HeaderTitle>
      </Header>

      <ScrollView>
        <Section theme={theme}>
          <SectionHeader theme={theme}>
            <SectionTitle theme={theme}>Account Settings</SectionTitle>
          </SectionHeader>
          <SettingItem theme={theme} onPress={handleProfilePress}>
            <SettingIcon theme={theme}>
              <Ionicons name="person" size={24} color={theme.colors.primary} />
            </SettingIcon>
            <SettingContent>
              <SettingTitle theme={theme}>Profile Information</SettingTitle>
              <SettingDescription theme={theme}>Update your personal details</SettingDescription>
            </SettingContent>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.text.secondary} />
          </SettingItem>
          <SettingItem theme={theme} onPress={handleChangePasswordPress}>
            <SettingIcon theme={theme}>
              <Ionicons name="key" size={24} color={theme.colors.primary} />
            </SettingIcon>
            <SettingContent>
              <SettingTitle theme={theme}>Change Password</SettingTitle>
              <SettingDescription theme={theme}>Update your security settings</SettingDescription>
            </SettingContent>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.text.secondary} />
          </SettingItem>
        </Section>

        <Section theme={theme}>
          <SectionHeader theme={theme}>
            <SectionTitle theme={theme}>Preferences</SectionTitle>
          </SectionHeader>
          <SettingItem theme={theme}>
            <SettingIcon theme={theme}>
              <Ionicons name="notifications" size={24} color={theme.colors.primary} />
            </SettingIcon>
            <SettingContent>
              <SettingTitle theme={theme}>Push Notifications</SettingTitle>
              <SettingDescription theme={theme}>Receive updates and alerts</SettingDescription>
            </SettingContent>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: theme.colors.border, true: `${theme.colors.primary}50` }}
              thumbColor={notifications ? theme.colors.primary : '#f4f3f4'}
            />
          </SettingItem>
          <SettingItem theme={theme}>
            <SettingIcon theme={theme}>
              <Ionicons name="moon" size={24} color={theme.colors.primary} />
            </SettingIcon>
            <SettingContent>
              <SettingTitle theme={theme}>Dark Mode</SettingTitle>
              <SettingDescription theme={theme}>Toggle dark/light theme</SettingDescription>
            </SettingContent>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: theme.colors.border, true: `${theme.colors.primary}50` }}
              thumbColor={darkMode ? theme.colors.primary : '#f4f3f4'}
            />
          </SettingItem>
          <SettingItemLast theme={theme}>
            <SettingIcon theme={theme}>
              <Ionicons name="mail" size={24} color={theme.colors.primary} />
            </SettingIcon>
            <SettingContent>
              <SettingTitle theme={theme}>Email Updates</SettingTitle>
              <SettingDescription theme={theme}>Receive email notifications</SettingDescription>
            </SettingContent>
            <Switch
              value={emailUpdates}
              onValueChange={setEmailUpdates}
              trackColor={{ false: theme.colors.border, true: `${theme.colors.primary}50` }}
              thumbColor={emailUpdates ? theme.colors.primary : '#f4f3f4'}
            />
          </SettingItemLast>
        </Section>

        <Section theme={theme}>
          <SectionHeader theme={theme}>
            <SectionTitle theme={theme}>App Settings</SectionTitle>
          </SectionHeader>
          <SettingItem theme={theme} onPress={() => {}}>
            <SettingIcon theme={theme}>
              <Ionicons name="language" size={24} color={theme.colors.primary} />
            </SettingIcon>
            <SettingContent>
              <SettingTitle theme={theme}>Language</SettingTitle>
              <SettingValue theme={theme}>English</SettingValue>
            </SettingContent>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.text.secondary} />
          </SettingItem>
          <SettingItemLast theme={theme} onPress={() => {}}>
            <SettingIcon theme={theme}>
              <Ionicons name="information-circle" size={24} color={theme.colors.primary} />
            </SettingIcon>
            <SettingContent>
              <SettingTitle theme={theme}>About</SettingTitle>
              <SettingValue theme={theme}>Version 1.0.0</SettingValue>
            </SettingContent>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.text.secondary} />
          </SettingItemLast>
        </Section>

        <Divider theme={theme} />

        <TouchableOpacity
          style={{
            margin: 16,
            padding: 16,
            backgroundColor: '#FF3B30',
            borderRadius: theme.borderRadius.md,
            alignItems: 'center',
          }}
          onPress={() => {}}
        >
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
            Sign Out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </Container>
  );
} 