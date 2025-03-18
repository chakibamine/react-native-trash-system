import React, { useState } from 'react';
import { StyleSheet, Platform, TouchableOpacity, Image, ListRenderItem } from 'react-native';
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

// Styled components with proper typing
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
  justify-content: space-between;
  margin-bottom: 16px;
`;

const Title = styled.Text<ThemeProps>`
  font-size: 24px;
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

const ConversationList = styled.FlatList`
  flex: 1;
`;

const ConversationItem = styled.TouchableOpacity<ThemeProps>`
  flex-direction: row;
  padding: 12px 16px;
  background-color: ${(props: ThemeProps) => props.theme.colors.background};
  border-bottom-width: 1px;
  border-bottom-color: ${(props: ThemeProps) => props.theme.colors.border};
`;

const Avatar = styled.View<ThemeProps>`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: ${(props: ThemeProps) => props.theme.colors.primary};
  justify-content: center;
  align-items: center;
  margin-right: 12px;
`;

const AvatarImage = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
`;

const ConversationContent = styled.View`
  flex: 1;
  justify-content: center;
`;

const ConversationHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const ContactName = styled.Text<ThemeProps>`
  font-size: 16px;
  font-weight: 600;
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
`;

const TimeText = styled.Text<ThemeProps>`
  font-size: 12px;
  color: ${(props: ThemeProps) => props.theme.colors.text.secondary};
`;

const LastMessage = styled.Text<ThemeProps>`
  font-size: 14px;
  color: ${(props: ThemeProps) => props.theme.colors.text.secondary};
  margin-right: 24px;
`;

const UnreadBadge = styled.View<ThemeProps>`
  position: absolute;
  right: 16px;
  bottom: 16px;
  min-width: 20px;
  height: 20px;
  border-radius: 10px;
  background-color: ${(props: ThemeProps) => props.theme.colors.primary};
  justify-content: center;
  align-items: center;
  padding: 0 6px;
`;

const UnreadText = styled.Text`
  font-size: 12px;
  font-weight: bold;
  color: #FFFFFF;
`;

const FAB = styled.TouchableOpacity<ThemeProps>`
  position: absolute;
  right: 16px;
  bottom: 16px;
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: ${(props: ThemeProps) => props.theme.colors.primary};
  justify-content: center;
  align-items: center;
  elevation: 4;
  shadow-color: ${(props: ThemeProps) => props.theme.colors.shadow.color};
  shadow-offset: 0px 2px;
  shadow-opacity: ${(props: ThemeProps) => props.theme.colors.shadow.opacity};
  shadow-radius: 4px;
`;

interface Conversation {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount?: number;
}

export default function ChatScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      name: 'City Center Cleanup Team',
      lastMessage: 'The trash bin at location A is almost full',
      timestamp: new Date(),
      unreadCount: 3,
      avatar: 'https://ui-avatars.com/api/?name=City+Center&background=random'
    },
    {
      id: '2',
      name: 'Park Maintenance',
      lastMessage: 'New bin installed at the entrance',
      timestamp: new Date(Date.now() - 3600000),
      avatar: 'https://ui-avatars.com/api/?name=Park+Maintenance&background=random'
    },
    {
      id: '3',
      name: 'Residential Area Team',
      lastMessage: 'Schedule updated for next week',
      timestamp: new Date(Date.now() - 7200000),
      unreadCount: 1,
      avatar: 'https://ui-avatars.com/api/?name=Residential+Area&background=random'
    },
    {
      id: '4',
      name: 'Beach Cleanup Volunteers',
      lastMessage: 'Great job everyone! See you next weekend',
      timestamp: new Date(Date.now() - 86400000),
      avatar: 'https://ui-avatars.com/api/?name=Beach+Cleanup&background=random'
    }
  ]);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const handleConversationPress = (conversation: Conversation) => {
    // Navigate to individual chat screen
    router.push(`/chat/${conversation.id}` as Href);
  };

  const renderConversation: ListRenderItem<Conversation> = ({ item }) => (
    <ConversationItem onPress={() => handleConversationPress(item)}>
      {item.avatar ? (
        <AvatarImage source={{ uri: item.avatar }} />
      ) : (
        <Avatar>
          <Ionicons name="people" size={24} color="#FFFFFF" />
        </Avatar>
      )}
      <ConversationContent>
        <ConversationHeader>
          <ContactName>{item.name}</ContactName>
          <TimeText>{formatTime(item.timestamp)}</TimeText>
        </ConversationHeader>
        <LastMessage numberOfLines={1}>{item.lastMessage}</LastMessage>
      </ConversationContent>
      {item.unreadCount ? (
        <UnreadBadge>
          <UnreadText>{item.unreadCount}</UnreadText>
        </UnreadBadge>
      ) : null}
    </ConversationItem>
  );

  return (
    <Container style={{ paddingTop: insets.top }}>
      <Header>
        <HeaderTop>
          <Title>Chats</Title>
          <TouchableOpacity>
            <Ionicons 
              name="ellipsis-vertical" 
              size={24} 
              color={theme.colors.text.primary} 
            />
          </TouchableOpacity>
        </HeaderTop>
        <SearchContainer>
          <Ionicons 
            name="search" 
            size={20} 
            color={theme.colors.text.secondary} 
          />
          <SearchInput
            placeholder="Search"
            placeholderTextColor={theme.colors.text.secondary}
            value={search}
            onChangeText={setSearch}
          />
        </SearchContainer>
      </Header>

      <ConversationList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={item => item.id}
      />

      <FAB onPress={() => router.push('/chat/new' as Href)}>
        <Ionicons name="chatbubble-outline" size={24} color="#FFFFFF" />
      </FAB>
    </Container>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
