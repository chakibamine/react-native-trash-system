import React, { useState } from 'react';
import { ScrollView, Dimensions, Animated, TouchableOpacity, StyleSheet, View } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '@/assets/style/ThemeProvider';
import { Theme } from '@/assets/style/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { format } from 'date-fns';

// Define prop types for styled components
type ThemeProps = {
  theme: Theme;
};

const SIDENAV_WIDTH = 280;
const { width: WINDOW_WIDTH } = Dimensions.get('window');

// Styled components
const Container = styled.View<ThemeProps>`
  flex: 1;
  background-color: ${(props: ThemeProps) => props.theme.colors.background};
`;

const MainContent = styled.View`
  flex: 1;
  background-color: ${(props: ThemeProps) => props.theme.colors.background};
`;

const SideNav = styled(Animated.View)<ThemeProps>`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: ${SIDENAV_WIDTH}px;
  background-color: ${(props: ThemeProps) => props.theme.colors.surface};
  z-index: 1000;
  elevation: 5;
  shadow-color: #000;
  shadow-offset: 0px 0px;
  shadow-opacity: 0.5;
  shadow-radius: 5px;
`;

const OverlayBackdrop = styled.View`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const Header = styled.View<ThemeProps>`
  padding: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const MenuButton = styled.TouchableOpacity`
  padding: 8px;
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

const SideNavHeader = styled.View<ThemeProps>`
  padding: 24px 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props: ThemeProps) => props.theme.colors.border};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const HeaderTitleContainer = styled.View`
  flex: 1;
`;

const CloseButton = styled.TouchableOpacity`
  padding: 8px;
  margin-left: 8px;
`;

const SideNavTitle = styled.Text<ThemeProps>`
  font-size: 20px;
  font-weight: bold;
  color: ${(props: ThemeProps) => props.theme.colors.primary};
  margin-bottom: 4px;
`;

const SideNavSubtitle = styled.Text<ThemeProps>`
  font-size: 14px;
  color: ${(props: ThemeProps) => props.theme.colors.text.secondary};
`;

const MenuItem = styled.TouchableOpacity<ThemeProps & { active?: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  background-color: ${(props: ThemeProps & { active?: boolean }) => 
    props.active ? `${props.theme.colors.primary}15` : 'transparent'};
`;

const MenuItemText = styled.Text<ThemeProps & { active?: boolean }>`
  font-size: 16px;
  color: ${(props: ThemeProps & { active?: boolean }) => 
    props.active ? props.theme.colors.primary : props.theme.colors.text.primary};
  margin-left: 12px;
  font-weight: ${(props: ThemeProps & { active?: boolean }) => 
    props.active ? 'bold' : 'normal'};
  flex: 1;
`;

const MenuItemCount = styled.View<ThemeProps>`
  background-color: ${(props: ThemeProps) => props.theme.colors.primary};
  border-radius: 12px;
  padding: 2px 8px;
  margin-left: 8px;
`;

const CountText = styled.Text`
  color: white;
  font-size: 12px;
  font-weight: bold;
`;

const ChartContainer = styled.View<ThemeProps>`
  margin: 16px;
  padding: 16px;
  background-color: ${(props: ThemeProps) => props.theme.colors.surface};
  border-radius: ${(props: ThemeProps) => props.theme.borderRadius.md}px;
  elevation: 2;
  shadow-color: ${(props: ThemeProps) => props.theme.colors.shadow.color};
  shadow-offset: 0px 2px;
  shadow-opacity: ${(props: ThemeProps) => props.theme.colors.shadow.opacity};
  shadow-radius: 4px;
`;

const ChartTitle = styled.Text<ThemeProps>`
  font-size: 18px;
  font-weight: bold;
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
  margin-bottom: 16px;
`;

const StatGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  padding: 8px;
  justify-content: space-between;
`;

const StatCardNew = styled.View<ThemeProps>`
  width: 48%;
  background-color: ${(props: ThemeProps) => props.theme.colors.surface};
  border-radius: ${(props: ThemeProps) => props.theme.borderRadius.md}px;
  padding: 16px;
  margin-bottom: 16px;
  elevation: 2;
  shadow-color: ${(props: ThemeProps) => props.theme.colors.shadow.color};
  shadow-offset: 0px 2px;
  shadow-opacity: ${(props: ThemeProps) => props.theme.colors.shadow.opacity};
  shadow-radius: 4px;
`;

const StatIcon = styled.View<ThemeProps>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${(props: ThemeProps) => `${props.theme.colors.primary}15`};
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
`;

const StatValueContainer = styled.View`
  flex-direction: row;
  align-items: flex-end;
  margin-bottom: 4px;
`;

const StatValueNew = styled.Text<ThemeProps>`
  font-size: 24px;
  font-weight: bold;
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
`;

const StatChange = styled.Text<{ isPositive: boolean }>`
  font-size: 14px;
  color: ${(props: { isPositive: boolean }) => props.isPositive ? '#4CAF50' : '#F44336'};
  margin-left: 8px;
  margin-bottom: 4px;
`;

const StatLabelNew = styled.Text<ThemeProps>`
  font-size: 14px;
  color: ${(props: ThemeProps) => props.theme.colors.text.secondary};
`;

const ProgressBar = styled.View<ThemeProps & { width: number }>`
  height: 8px;
  width: ${(props: ThemeProps & { width: number }) => props.width}%;
  background-color: ${(props: ThemeProps & { width: number }) => props.theme.colors.primary};
  border-radius: 4px;
`;

const ProgressBarContainer = styled.View<ThemeProps>`
  height: 8px;
  width: 100%;
  background-color: ${(props: ThemeProps) => `${props.theme.colors.primary}15`};
  border-radius: 4px;
  margin-vertical: 8px;
`;

const ChartLegend = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 16px;
`;

const LegendItem = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: 16px;
  margin-bottom: 8px;
`;

const LegendColor = styled.View<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: ${(props: { color: string }) => props.color};
  margin-right: 8px;
`;

const LegendText = styled.Text<ThemeProps>`
  color: ${(props: ThemeProps) => props.theme.colors.text.secondary};
  font-size: 12px;
`;

const BarChart = styled.View`
  flex-direction: row;
  align-items: flex-end;
  height: 200px;
  justify-content: space-between;
  padding-bottom: 20px;
`;

const Bar = styled.View<{ height: number; color: string }>`
  width: 30px;
  height: ${(props: { height: number; color: string }) => props.height}%;
  background-color: ${(props: { height: number; color: string }) => props.color};
  border-radius: 4px;
`;

const BarLabel = styled.Text<ThemeProps>`
  color: ${(props: ThemeProps) => props.theme.colors.text.secondary};
  font-size: 12px;
  margin-top: 8px;
  text-align: center;
`;

export default function AdminDashboard() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [isOpen, setIsOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState('/admin/dashboard');
  const screenWidth = Dimensions.get('window').width;
  
  const slideAnim = React.useRef(new Animated.Value(-SIDENAV_WIDTH)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  // Enhanced statistics with growth indicators
  const stats = {
    users: {
      total: 1250,
      growth: 12.5,
      active: 876,
      newToday: 24
    },
    drivers: {
      total: 45,
      active: 38,
      growth: 8.3,
      completedTrips: 156
    },
    trashBins: {
      total: 156,
      full: 45,
      needsMaintenance: 12,
      collectedToday: 78
    },
    collections: {
      total: 1876,
      thisMonth: 246,
      growth: 15.7,
      efficiency: 92
    }
  };

  // Chart data
  const userGrowthData = [
    { x: 'Jan', y: 850 },
    { x: 'Feb', y: 920 },
    { x: 'Mar', y: 1000 },
    { x: 'Apr', y: 1120 },
    { x: 'May', y: 1180 },
    { x: 'Jun', y: 1250 }
  ];

  const weeklyData = [
    { day: 'Mon', value: 65 },
    { day: 'Tue', value: 78 },
    { day: 'Wed', value: 82 },
    { day: 'Thu', value: 75 },
    { day: 'Fri', value: 68 },
    { day: 'Sat', value: 55 },
    { day: 'Sun', value: 42 }
  ];

  const maxValue = Math.max(...weeklyData.map(d => d.value));

  const chartTheme = {
    axis: {
      style: {
        grid: {
          stroke: 'transparent'
        },
        tickLabels: {
          fill: theme.colors.text.primary
        }
      }
    }
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: 'grid',
      route: '/admin/dashboard'
    },
    {
      title: 'Manage Admins',
      icon: 'people',
      count: 8,
      route: '/admin/manage-admins'
    },
    {
      title: 'Manage Drivers',
      icon: 'car',
      count: stats.drivers.total,
      route: '/admin/manage-drivers'
    },
    {
      title: 'Manage Users',
      icon: 'person',
      count: stats.users.total,
      route: '/admin/manage-users'
    },
    {
      title: 'Trash Bins',
      icon: 'trash',
      count: stats.trashBins.total,
      route: '/admin/trash-bins'
    },
    {
      title: 'Reports',
      icon: 'bar-chart',
      route: '/admin/reports'
    },
    {
      title: 'Chat',
      icon: 'chatbubble-ellipses',
      route: '/chat'
    },
    {
      title: 'Settings',
      icon: 'settings',
      route: '/admin/settings'
    },
  ];

  const toggleMenu = () => {
    if (isOpen) {
      // Close menu
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -SIDENAV_WIDTH,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => setIsOpen(false));
    } else {
      // Open menu
      setIsOpen(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleNavigation = (route: string) => {
    setActiveRoute(route);
    router.push(route as any);
    toggleMenu();
  };

  const handleNotificationPress = () => {
    router.push('/admin/notifications');
  };

  return (
    <Container style={{ paddingTop: insets.top }} theme={theme}>
      {isOpen && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={toggleMenu}
          style={StyleSheet.absoluteFill}
        >
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 999,
                opacity: fadeAnim,
              },
            ]}
          />
        </TouchableOpacity>
      )}

      <SideNav
        theme={theme}
        style={[
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <SideNavHeader theme={theme}>
          <HeaderTitleContainer>
            <SideNavTitle theme={theme}>Admin Panel</SideNavTitle>
            <SideNavSubtitle theme={theme}>Manage your application</SideNavSubtitle>
          </HeaderTitleContainer>
          <CloseButton onPress={toggleMenu}>
            <Ionicons name="close" size={24} color={theme.colors.text.primary} />
          </CloseButton>
        </SideNavHeader>
        <ScrollView>
          {menuItems.map((item) => (
            <MenuItem
              key={item.route}
              onPress={() => handleNavigation(item.route)}
              active={activeRoute === item.route}
              theme={theme}
            >
              <Ionicons
                name={item.icon as any}
                size={24}
                color={activeRoute === item.route ? theme.colors.primary : theme.colors.text.primary}
              />
              <MenuItemText active={activeRoute === item.route} theme={theme}>
                {item.title}
              </MenuItemText>
              {item.count !== undefined && (
                <MenuItemCount theme={theme}>
                  <CountText>{item.count}</CountText>
                </MenuItemCount>
              )}
            </MenuItem>
          ))}
        </ScrollView>
      </SideNav>

      <MainContent theme={theme}>
        <Header theme={theme}>
          <MenuButton onPress={toggleMenu}>
            <Ionicons name="menu" size={24} color={theme.colors.text.primary} />
          </MenuButton>
          <TitleContainer>
            <WelcomeText theme={theme}>Welcome</WelcomeText>
            <AdminText theme={theme}>Admin</AdminText>
          </TitleContainer>
          <NotificationButton onPress={handleNotificationPress}>
            <Ionicons name="notifications-outline" size={24} color={theme.colors.text.primary} />
          </NotificationButton>
        </Header>

        <ScrollView>
          <StatGrid>
            <StatCardNew theme={theme}>
              <StatIcon theme={theme}>
                <Ionicons name="people" size={24} color={theme.colors.primary} />
              </StatIcon>
              <StatValueContainer>
                <StatValueNew theme={theme}>{stats.users.total}</StatValueNew>
                <StatChange isPositive={stats.users.growth > 0}>
                  {stats.users.growth > 0 ? '+' : ''}{stats.users.growth}%
                </StatChange>
              </StatValueContainer>
              <StatLabelNew theme={theme}>Total Users</StatLabelNew>
              <ProgressBarContainer theme={theme}>
                <ProgressBar theme={theme} width={(stats.users.active / stats.users.total) * 100} />
              </ProgressBarContainer>
            </StatCardNew>

            <StatCardNew theme={theme}>
              <StatIcon theme={theme}>
                <Ionicons name="car" size={24} color={theme.colors.primary} />
              </StatIcon>
              <StatValueContainer>
                <StatValueNew theme={theme}>{stats.drivers.active}</StatValueNew>
                <StatChange isPositive={true}>
                  {Math.round((stats.drivers.active / stats.drivers.total) * 100)}%
                </StatChange>
              </StatValueContainer>
              <StatLabelNew theme={theme}>Active Drivers</StatLabelNew>
              <ProgressBarContainer theme={theme}>
                <ProgressBar theme={theme} width={(stats.drivers.active / stats.drivers.total) * 100} />
              </ProgressBarContainer>
            </StatCardNew>

            <StatCardNew theme={theme}>
              <StatIcon theme={theme}>
                <Ionicons name="trash" size={24} color={theme.colors.primary} />
              </StatIcon>
              <StatValueContainer>
                <StatValueNew theme={theme}>{stats.collections.thisMonth}</StatValueNew>
                <StatChange isPositive={stats.collections.growth > 0}>
                  {stats.collections.growth > 0 ? '+' : ''}{stats.collections.growth}%
                </StatChange>
              </StatValueContainer>
              <StatLabelNew theme={theme}>Collections This Month</StatLabelNew>
              <ProgressBarContainer theme={theme}>
                <ProgressBar 
                  theme={theme} 
                  width={(stats.collections.thisMonth / (stats.collections.total / 12)) * 100} 
                />
              </ProgressBarContainer>
            </StatCardNew>

            <StatCardNew theme={theme}>
              <StatIcon theme={theme}>
                <Ionicons name="analytics" size={24} color={theme.colors.primary} />
              </StatIcon>
              <StatValueContainer>
                <StatValueNew theme={theme}>{stats.collections.efficiency}%</StatValueNew>
                <StatChange isPositive={true}>
                  Efficient
                </StatChange>
              </StatValueContainer>
              <StatLabelNew theme={theme}>Collection Efficiency</StatLabelNew>
              <ProgressBarContainer theme={theme}>
                <ProgressBar theme={theme} width={stats.collections.efficiency} />
              </ProgressBarContainer>
            </StatCardNew>
          </StatGrid>

          <ChartContainer theme={theme}>
            <ChartTitle theme={theme}>Weekly Collections</ChartTitle>
            <BarChart>
              {weeklyData.map((item, index) => (
                <View key={item.day} style={{ alignItems: 'center' }}>
                  <Bar 
                    height={(item.value / maxValue) * 80} 
                    color={theme.colors.primary} 
                  />
                  <BarLabel theme={theme}>{item.day}</BarLabel>
                </View>
              ))}
            </BarChart>
          </ChartContainer>

          <ChartContainer theme={theme}>
            <ChartTitle theme={theme}>Bin Status Distribution</ChartTitle>
            <View style={{ padding: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                <LegendText theme={theme}>Empty Bins</LegendText>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <StatValueNew theme={theme}>
                    {stats.trashBins.total - stats.trashBins.full - stats.trashBins.needsMaintenance}
                  </StatValueNew>
                  <LegendText theme={theme}> / {stats.trashBins.total}</LegendText>
                </View>
              </View>
              <ProgressBarContainer theme={theme}>
                <ProgressBar 
                  theme={theme} 
                  width={((stats.trashBins.total - stats.trashBins.full - stats.trashBins.needsMaintenance) / stats.trashBins.total) * 100} 
                />
              </ProgressBarContainer>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 12 }}>
                <LegendText theme={theme}>Full Bins</LegendText>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <StatValueNew theme={theme}>{stats.trashBins.full}</StatValueNew>
                  <LegendText theme={theme}> / {stats.trashBins.total}</LegendText>
                </View>
              </View>
              <ProgressBarContainer theme={theme}>
                <ProgressBar 
                  theme={theme} 
                  width={(stats.trashBins.full / stats.trashBins.total) * 100} 
                />
              </ProgressBarContainer>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 12 }}>
                <LegendText theme={theme}>Needs Maintenance</LegendText>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <StatValueNew theme={theme}>{stats.trashBins.needsMaintenance}</StatValueNew>
                  <LegendText theme={theme}> / {stats.trashBins.total}</LegendText>
                </View>
              </View>
              <ProgressBarContainer theme={theme}>
                <ProgressBar 
                  theme={theme} 
                  width={(stats.trashBins.needsMaintenance / stats.trashBins.total) * 100} 
                />
              </ProgressBarContainer>
            </View>
          </ChartContainer>
        </ScrollView>
      </MainContent>
    </Container>
  );
}