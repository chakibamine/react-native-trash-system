import React from 'react';
import { useColorScheme } from 'react-native';
import { themes } from '@/assets/style/theme';
import { Nav, NavItem, NavText, ActiveDot } from '@/assets/style/Components';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? themes.dark : themes.light;

  return (
    <Nav theme={theme}>
      <NavItem onPress={() => setActiveTab('Home')}>
        <NavText isActive={activeTab === 'Home'}>Home</NavText>
        <ActiveDot isActive={activeTab === 'Home'} />
      </NavItem>
      <NavItem onPress={() => setActiveTab('Map')}>
        <NavText isActive={activeTab === 'Map'}>Map</NavText>
        <ActiveDot isActive={activeTab === 'Map'} />
      </NavItem>
      <NavItem onPress={() => setActiveTab('Chat')}>
        <NavText isActive={activeTab === 'Chat'}>Chat</NavText>
        <ActiveDot isActive={activeTab === 'Chat'} />
      </NavItem>
      <NavItem onPress={() => setActiveTab('Profile')}>
        <NavText isActive={activeTab === 'Profile'}>Profile</NavText>
        <ActiveDot isActive={activeTab === 'Profile'} />
      </NavItem>
    </Nav>
  );
}