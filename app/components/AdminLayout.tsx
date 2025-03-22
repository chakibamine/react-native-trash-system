import React, { useState } from 'react';
import { Animated, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '@/assets/style/ThemeProvider';
import { Theme } from '@/assets/style/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ThemeProps = {
  theme: Theme;
};

const SIDENAV_WIDTH = 280;

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

interface AdminLayoutProps {
  children: React.ReactNode;
  currentRoute: string;
  isOpen: boolean;
  onToggleMenu: () => void;
}

export default function AdminLayout({ 
  children, 
  currentRoute, 
  isOpen,
  onToggleMenu 
}: AdminLayoutProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const slideAnim = React.useRef(new Animated.Value(-SIDENAV_WIDTH)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (isOpen) {
      // Open menu
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
    } else {
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
      ]).start();
    }
  }, [isOpen]);

  const stats = {
    totalUsers: 1250,
    activeDrivers: 45,
    totalAdmins: 8,
    activeTrashBins: 156
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
      count: stats.totalAdmins,
      route: '/admin/manage-admins'
    },
    {
      title: 'Manage Drivers',
      icon: 'car',
      count: stats.activeDrivers,
      route: '/admin/manage-drivers'
    },
    {
      title: 'Manage Users',
      icon: 'person',
      count: stats.totalUsers,
      route: '/admin/manage-users'
    },
    {
      title: 'Trash Bins',
      icon: 'trash',
      count: stats.activeTrashBins,
      route: '/admin/trash-bins'
    },
    {
      title: 'Reports',
      icon: 'bar-chart',
      route: '/admin/reports'
    },
    {
      title: 'Settings',
      icon: 'settings',
      route: '/admin/settings'
    }
  ];

  const handleNavigation = (route: string) => {
    router.push(route as any);
    onToggleMenu();
  };

  return (
    <Container style={{ paddingTop: insets.top }} theme={theme}>
      {isOpen && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={onToggleMenu}
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
          <CloseButton onPress={onToggleMenu}>
            <Ionicons name="close" size={24} color={theme.colors.text.primary} />
          </CloseButton>
        </SideNavHeader>
        <ScrollView>
          {menuItems.map((item) => (
            <MenuItem
              key={item.route}
              onPress={() => handleNavigation(item.route)}
              active={currentRoute === item.route}
              theme={theme}
            >
              <Ionicons
                name={item.icon as any}
                size={24}
                color={currentRoute === item.route ? theme.colors.primary : theme.colors.text.primary}
              />
              <MenuItemText active={currentRoute === item.route} theme={theme}>
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
        {children}
      </MainContent>
    </Container>
  );
} 