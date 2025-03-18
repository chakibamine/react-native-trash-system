import React, { useState } from 'react';
import { FlatList } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '@/assets/style/ThemeProvider';
import { Theme } from '@/assets/style/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, Href } from 'expo-router';

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
  padding: 8px;
  margin-right: 8px;
`;

const Title = styled.Text<ThemeProps>`
  font-size: 20px;
  font-weight: bold;
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
`;

const SearchContainer = styled.View<ThemeProps>`
  flex-direction: row;
  align-items: center;
  padding: 8px 12px;
  background-color: ${(props: ThemeProps) => props.theme.colors.background};
  border-radius: ${(props: ThemeProps) => props.theme.borderRadius.md}px;
`;

const SearchInput = styled.TextInput<ThemeProps>`
  flex: 1;
  margin-left: 8px;
  font-size: 16px;
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
`;

const ContactList = styled.FlatList`
  flex: 1;
`;

const ContactItem = styled.TouchableOpacity<ThemeProps>`
  flex-direction: row;
  padding: 12px 16px;
  background-color: ${(props: ThemeProps) => props.theme.colors.background};
  border-bottom-width: 1px;
  border-bottom-color: ${(props: ThemeProps) => props.theme.colors.border};
`;

const Avatar = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 12px;
`;

const ContactInfo = styled.View`
  flex: 1;
  justify-content: center;
`;

const ContactName = styled.Text<ThemeProps>`
  font-size: 16px;
  font-weight: 600;
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
`;

const ContactRole = styled.Text<ThemeProps>`
  font-size: 14px;
  color: ${(props: ThemeProps) => props.theme.colors.text.secondary};
  margin-top: 2px;
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
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'City Center Team',
      role: 'Cleanup Coordination',
      avatar: 'https://ui-avatars.com/api/?name=City+Center&background=random'
    },
    {
      id: '2',
      name: 'Park Rangers',
      role: 'Park Maintenance',
      avatar: 'https://ui-avatars.com/api/?name=Park+Rangers&background=random'
    },
    {
      id: '3',
      name: 'Beach Cleanup',
      role: 'Volunteer Coordination',
      avatar: 'https://ui-avatars.com/api/?name=Beach+Cleanup&background=random'
    },
    {
      id: '4',
      name: 'Residential Team',
      role: 'Neighborhood Management',
      avatar: 'https://ui-avatars.com/api/?name=Residential+Team&background=random'
    },
    {
      id: '5',
      name: 'Recycling Center',
      role: 'Waste Management',
      avatar: 'https://ui-avatars.com/api/?name=Recycling+Center&background=random'
    }
  ]);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(search.toLowerCase()) ||
    contact.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleContactPress = (contact: Contact) => {
    // Create new conversation and navigate to it
    router.push(`/chat/${contact.id}` as Href);
  };

  const renderContact = ({ item }: { item: Contact }) => (
    <ContactItem onPress={() => handleContactPress(item)}>
      <Avatar source={{ uri: item.avatar }} />
      <ContactInfo>
        <ContactName>{item.name}</ContactName>
        <ContactRole>{item.role}</ContactRole>
      </ContactInfo>
    </ContactItem>
  );

  return (
    <Container style={{ paddingTop: insets.top }}>
      <Header>
        <HeaderTop>
          <BackButton onPress={() => router.back()}>
            <Ionicons
              name="arrow-back"
              size={24}
              color={theme.colors.text.primary}
            />
          </BackButton>
          <Title>New Chat</Title>
        </HeaderTop>
        <SearchContainer>
          <Ionicons
            name="search"
            size={20}
            color={theme.colors.text.secondary}
          />
          <SearchInput
            placeholder="Search contacts"
            placeholderTextColor={theme.colors.text.secondary}
            value={search}
            onChangeText={setSearch}
          />
        </SearchContainer>
      </Header>

      <ContactList
        data={filteredContacts}
        renderItem={renderContact}
        keyExtractor={(item: Contact) => item.id}
      />
    </Container>
  );
} 