import React from 'react';
import { ScrollView } from 'react-native';
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
  padding: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const WelcomeText = styled.Text<ThemeProps>`
  font-size: 24px;
  font-weight: normal;
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
`;

const AdminText = styled.Text<ThemeProps>`
  font-size: 24px;
  font-weight: bold;
  color: ${(props: ThemeProps) => props.theme.colors.primary};
  margin-left: 8px;
`;

const NotificationButton = styled.TouchableOpacity`
  padding: 8px;
`;

const StatsContainer = styled.ScrollView`
  padding: 16px;
`;

const StatsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const StatCard = styled.TouchableOpacity<ThemeProps>`
  flex: 1;
  background-color: ${(props: ThemeProps) => props.theme.colors.surface};
  border-radius: ${(props: ThemeProps) => props.theme.borderRadius.md}px;
  padding: 16px;
  margin: 0 8px;
  elevation: 2;
  shadow-color: ${(props: ThemeProps) => props.theme.colors.shadow.color};
  shadow-offset: 0px 2px;
  shadow-opacity: ${(props: ThemeProps) => props.theme.colors.shadow.opacity};
  shadow-radius: 4px;
`;

const StatValue = styled.Text<ThemeProps>`
  font-size: 24px;
  font-weight: bold;
  color: ${(props: ThemeProps) => props.theme.colors.primary};
  margin-bottom: 4px;
`;

const StatLabel = styled.Text<ThemeProps>`
  font-size: 14px;
  color: ${(props: ThemeProps) => props.theme.colors.text.secondary};
`;

const Section = styled.View<ThemeProps>`
  margin: 16px;
  background-color: ${(props: ThemeProps) => props.theme.colors.surface};
  border-radius: ${(props: ThemeProps) => props.theme.borderRadius.md}px;
  overflow: hidden;
`;

const SectionHeader = styled.View<ThemeProps>`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  background-color: ${(props: ThemeProps) => props.theme.colors.surface};
  border-bottom-width: 1px;
  border-bottom-color: ${(props: ThemeProps) => props.theme.colors.border};
`;

const SectionTitle = styled.Text<ThemeProps>`
  font-size: 18px;
  font-weight: 600;
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
  margin-left: 12px;
`;

const MenuItem = styled.TouchableOpacity<ThemeProps>`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props: ThemeProps) => props.theme.colors.border};
`;

const MenuItemText = styled.Text<ThemeProps>`
  font-size: 16px;
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
  margin-left: 12px;
  flex: 1;
`;

const MenuItemCount = styled.Text<ThemeProps>`
  font-size: 14px;
  color: ${(props: ThemeProps) => props.theme.colors.text.secondary};
  margin-right: 8px;
`;

type MenuScreen = 'admins' | 'drivers' | 'users' | 'trash-bins' | 'reports' | 'settings';

export default function AdminDashboard() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  const stats = {
    totalUsers: 1250,
    activeDrivers: 45,
    totalAdmins: 8,
    activeTrashBins: 156
  };

  const menuItems = [
    {
      title: 'Manage Admins',
      icon: 'people',
      count: stats.totalAdmins,
      route: '/admin/manage-admins' as const
    },
    {
      title: 'Manage Drivers',
      icon: 'car',
      count: stats.activeDrivers,
      route: '/admin/manage-drivers' as const
    },
    {
      title: 'Manage Users',
      icon: 'person',
      count: stats.totalUsers,
      route: '/admin/manage-users' as const
    },
    {
      title: 'Trash Bins',
      icon: 'trash',
      count: stats.activeTrashBins,
      route: '/admin/trash-bins' as const
    },
    {
      title: 'Reports',
      icon: 'bar-chart',
      route: '/admin/reports' as const
    },
    {
      title: 'Settings',
      icon: 'settings',
      route: '/admin/settings' as const
    }
  ];

  const handleMenuPress = (screen: MenuScreen) => {
    switch (screen) {
      case 'admins':
        router.push('/admin/manage-admins' as any);
        break;
      case 'drivers':
        router.push('/admin/manage-drivers' as any);
        break;
      case 'users':
        router.push('/admin/manage-users' as any);
        break;
      case 'trash-bins':
        router.push('/admin/trash-bins' as any);
        break;
      case 'reports':
        router.push('/admin/reports' as any);
        break;
      case 'settings':
        router.push('/admin/settings' as any);
        break;
    }
  };

  return (
    <Container style={{ paddingTop: insets.top }}>
      <Header>
        <TitleContainer>
          <WelcomeText theme={theme}>Welcome</WelcomeText>
          <AdminText theme={theme}>Admin</AdminText>
        </TitleContainer>
        <NotificationButton>
          <Ionicons name="notifications-outline" size={24} color={theme.colors.text.primary} />
        </NotificationButton>
      </Header>

      <ScrollView>
        <StatsContainer>
          <StatsRow>
            <StatCard>
              <StatValue>{stats.totalUsers}</StatValue>
              <StatLabel>Total Users</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{stats.activeDrivers}</StatValue>
              <StatLabel>Active Drivers</StatLabel>
            </StatCard>
          </StatsRow>
          <StatsRow>
            <StatCard>
              <StatValue>{stats.totalAdmins}</StatValue>
              <StatLabel>Total Admins</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>{stats.activeTrashBins}</StatValue>
              <StatLabel>Active Bins</StatLabel>
            </StatCard>
          </StatsRow>
        </StatsContainer>

        <Section>
          <SectionHeader>
            <Ionicons name="grid" size={24} color={theme.colors.primary} />
            <SectionTitle>Management</SectionTitle>
          </SectionHeader>
          {menuItems.map((item, index) => (
            <MenuItem
              key={item.title}
              onPress={() => router.push(item.route as any)}
              style={index === menuItems.length - 1 ? { borderBottomWidth: 0 } : undefined}
            >
              <Ionicons name={item.icon as any} size={24} color={theme.colors.primary} />
              <MenuItemText>{item.title}</MenuItemText>
              {item.count !== undefined && <MenuItemCount>{item.count}</MenuItemCount>}
              <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
            </MenuItem>
          ))}
        </Section>
      </ScrollView>
    </Container>
  );
} 