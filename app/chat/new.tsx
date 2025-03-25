import React, { useState } from 'react';
import { FlatList, Animated } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '@/assets/style/ThemeProvider';
import { Theme } from '@/assets/style/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, Href } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

// Define prop types for styled components
interface ThemeProps {
  theme: Theme;
}

// Styled components
const Container = styled.View<ThemeProps>`
  flex: 1;
  background-color: ${(props: ThemeProps) => props.theme.colors.background};
`;

const Header = styled.View<ThemeProps>`
  padding: 16px;
  background-color: ${(props: ThemeProps) => props.theme.colors.surface};
  border-bottom-width: 1px;
  border-bottom-color: ${(props: ThemeProps) => props.theme.colors.border};
`;

const HeaderTop = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

const BackButton = styled.TouchableOpacity`
  padding: 12px;
  margin-right: 8px;
  background-color: ${(props: ThemeProps) => props.theme.colors.background};
  border-radius: 12px;
`;

const Title = styled.Text<ThemeProps>`
  font-size: 24px;
  font-weight: bold;
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
`;

const SearchContainer = styled.View<ThemeProps>`
  flex-direction: row;
  align-items: center;
  padding: 0 16px;
  height: 48px;
  background-color: ${(props: ThemeProps) => props.theme.colors.background};
  border-radius: ${(props: ThemeProps) => props.theme.borderRadius.md}px;
  elevation: 2;
  shadow-color: ${(props) => props.theme.colors.shadow.color};
  shadow-offset: 0px 2px;
  shadow-opacity: ${(props) => props.theme.colors.shadow.opacity};
  shadow-radius: 4px;
`;

const SearchInput = styled.TextInput<ThemeProps>`
  flex: 1;
  margin-left: 12px;
  font-size: 16px;
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
`;

const ContactList = styled.FlatList`
  flex: 1;
  padding: 16px;
`;

const ContactItem = styled.TouchableOpacity<ThemeProps>`
  flex-direction: row;
  padding: 16px;
  margin-bottom: 12px;
  background-color: ${(props: ThemeProps) => props.theme.colors.surface};
  border-radius: 16px;
  elevation: 2;
  shadow-color: ${(props) => props.theme.colors.shadow.color};
  shadow-offset: 0px 2px;
  shadow-opacity: ${(props) => props.theme.colors.shadow.opacity};
  shadow-radius: 4px;
`;

const Avatar = styled.Image`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  margin-right: 16px;
`;

const ContactInfo = styled.View`
  flex: 1;
  justify-content: center;
`;

const ContactName = styled.Text<ThemeProps>`
  font-size: 17px;
  font-weight: 600;
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
  margin-bottom: 4px;
`;

const ContactRole = styled.Text<ThemeProps>`
  font-size: 14px;
  color: ${(props: ThemeProps) => props.theme.colors.text.secondary};
`;

const EmptyListContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 32px;
`;

const EmptyListText = styled.Text<ThemeProps>`
  font-size: 16px;
  color: ${(props: ThemeProps) => props.theme.colors.text.secondary};
  text-align: center;
  margin-top: 16px;
`;

interface Contact {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export default function NewChatScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [contacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'City Center Team',
      role: 'Cleanup Coordination',
      avatar: 'https://ui-avatars.com/api/?name=City+Center&background=0366d6&color=fff'
    },
    {
      id: '2',
      name: 'Park Rangers',
      role: 'Park Maintenance',
      avatar: 'https://ui-avatars.com/api/?name=Park+Rangers&background=28a745&color=fff'
    },
    {
      id: '3',
      name: 'Beach Cleanup',
      role: 'Volunteer Coordination',
      avatar: 'https://ui-avatars.com/api/?name=Beach+Cleanup&background=dc3545&color=fff'
    },
    {
      id: '4',
      name: 'Residential Team',
      role: 'Neighborhood Management',
      avatar: 'https://ui-avatars.com/api/?name=Residential+Team&background=6f42c1&color=fff'
    },
    {
      id: '5',
      name: 'Recycling Center',
      role: 'Waste Management',
      avatar: 'https://ui-avatars.com/api/?name=Recycling+Center&background=fd7e14&color=fff'
    }
  ]);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(search.toLowerCase()) ||
    contact.role.toLowerCase().includes(search.toLowerCase())
  );

  const renderEmptyList = () => (
    <EmptyListContainer>
      <Ionicons name="people-outline" size={64} color={theme.colors.text.secondary} />
      <EmptyListText>No contacts found matching your search</EmptyListText>
    </EmptyListContainer>
  );

  return (
    <Container style={{ paddingTop: insets.top }}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surface]}
        style={{ flex: 1 }}
      >
        <Header>
          <HeaderTop>
            <BackButton onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
            </BackButton>
            <Title>New Chat</Title>
          </HeaderTop>
          <SearchContainer>
            <Ionicons name="search" size={20} color={theme.colors.text.secondary} />
            <SearchInput
              placeholder="Search contacts..."
              placeholderTextColor={theme.colors.text.secondary}
              value={search}
              onChangeText={setSearch}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </SearchContainer>
        </Header>

        <FlatList
          data={filteredContacts}
          renderItem={({ item }) => (
            <ContactItem
              onPress={() => router.push(`/chat/${item.id}` as Href)}
              activeOpacity={0.7}
            >
              <Avatar source={{ uri: item.avatar }} />
              <ContactInfo>
                <ContactName>{item.name}</ContactName>
                <ContactRole>{item.role}</ContactRole>
              </ContactInfo>
            </ContactItem>
          )}
          keyExtractor={(item: Contact) => item.id}
          contentContainerStyle={{ 
            padding: 16,
            flexGrow: 1
          }}
          ListEmptyComponent={renderEmptyList}
        />
      </LinearGradient>
    </Container>
  );
} 