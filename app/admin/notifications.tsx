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

const NotificationSection = styled.View<ThemeProps>`
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

const NotificationItem = styled.TouchableOpacity<ThemeProps & { unread?: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props: ThemeProps) => props.theme.colors.border};
  background-color: ${(props: ThemeProps & { unread?: boolean }) => 
    props.unread ? `${props.theme.colors.primary}10` : 'transparent'};
`;

const NotificationItemLast = styled(NotificationItem)`
  border-bottom-width: 0;
`;

const NotificationIcon = styled.View<ThemeProps & { type: 'info' | 'warning' | 'success' | 'error' }>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${(props: ThemeProps & { type: 'info' | 'warning' | 'success' | 'error' }) => {
    switch (props.type) {
      case 'info':
        return `${props.theme.colors.primary}15`;
      case 'warning':
        return '#FFA50015';
      case 'success':
        return '#4CAF5015';
      case 'error':
        return '#F4433615';
      default:
        return `${props.theme.colors.primary}15`;
    }
  }};
  justify-content: center;
  align-items: center;
  margin-right: 16px;
`;

const NotificationContent = styled.View`
  flex: 1;
`;

const NotificationTitle = styled.Text<ThemeProps>`
  font-size: 16px;
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
  margin-bottom: 4px;
`;

const NotificationMessage = styled.Text<ThemeProps>`
  font-size: 14px;
  color: ${(props: ThemeProps) => props.theme.colors.text.secondary};
  margin-bottom: 4px;
`;

const NotificationTime = styled.Text<ThemeProps>`
  font-size: 12px;
  color: ${(props: ThemeProps) => props.theme.colors.text.secondary};
`;

const UnreadDot = styled.View<ThemeProps>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${(props: ThemeProps) => props.theme.colors.primary};
  margin-left: 8px;
`;

export default function NotificationsScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [notifications] = useState([
    {
      id: 1,
      type: 'info',
      title: 'New User Registration',
      message: 'John Doe has registered as a new user',
      time: '2 minutes ago',
      unread: true
    },
    {
      id: 2,
      type: 'warning',
      title: 'Bin Maintenance Required',
      message: 'Trash bin #123 needs maintenance',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 3,
      type: 'success',
      title: 'Collection Completed',
      message: 'Route #45 collection completed successfully',
      time: '2 hours ago',
      unread: false
    },
    {
      id: 4,
      type: 'error',
      title: 'Driver Offline',
      message: 'Driver Sarah Smith is currently offline',
      time: '3 hours ago',
      unread: false
    }
  ]);

  const handleBack = () => {
    router.back();
  };

  const getNotificationIcon = (type: 'info' | 'warning' | 'success' | 'error') => {
    switch (type) {
      case 'info':
        return 'information-circle';
      case 'warning':
        return 'warning';
      case 'success':
        return 'checkmark-circle';
      case 'error':
        return 'alert-circle';
      default:
        return 'information-circle';
    }
  };

  return (
    <Container style={{ paddingTop: insets.top }} theme={theme}>
      <Header theme={theme}>
        <BackButton onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </BackButton>
        <HeaderTitle theme={theme}>Notifications</HeaderTitle>
      </Header>

      <Content>
        <NotificationSection theme={theme}>
          <SectionHeader theme={theme}>
            <SectionTitle theme={theme}>Recent Notifications</SectionTitle>
          </SectionHeader>
          {notifications.map((notification, index) => (
            <NotificationItem
              key={notification.id}
              theme={theme}
              unread={notification.unread}
            >
              <NotificationIcon theme={theme} type={notification.type}>
                <Ionicons
                  name={getNotificationIcon(notification.type)}
                  size={24}
                  color={
                    notification.type === 'info'
                      ? theme.colors.primary
                      : notification.type === 'warning'
                      ? '#FFA500'
                      : notification.type === 'success'
                      ? '#4CAF50'
                      : '#F44336'
                  }
                />
              </NotificationIcon>
              <NotificationContent>
                <NotificationTitle theme={theme}>{notification.title}</NotificationTitle>
                <NotificationMessage theme={theme}>{notification.message}</NotificationMessage>
                <NotificationTime theme={theme}>{notification.time}</NotificationTime>
              </NotificationContent>
              {notification.unread && <UnreadDot theme={theme} />}
            </NotificationItem>
          ))}
        </NotificationSection>
      </Content>
    </Container>
  );
} 