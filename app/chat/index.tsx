import React, { useState } from 'react';
import { View, FlatList, Platform, Animated } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '@/assets/style/ThemeProvider';
import { Theme } from '@/assets/style/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  PlatformContainer,
  PlatformHeader,
  PlatformBlurHeader,
  PlatformSearchContainer,
  PlatformInput,
  PlatformListItem,
  PlatformAvatar,
  PlatformText,
  PlatformTitle,
  PlatformButton,
} from '../components/PlatformStyles';

interface ThemeProps {
  theme: Theme;
}

const SearchContainer = styled.View<ThemeProps>`
  margin: 16px;
  background-color: ${({ theme }: ThemeProps) => theme.colors.surface};
  border-radius: 12px;
  padding: 0 12px;
  flex-direction: row;
  align-items: center;
  elevation: 2;
  shadow-color: ${({ theme }: ThemeProps) => theme.colors.shadow.color};
  shadow-offset: 0px 2px;
  shadow-opacity: ${({ theme }: ThemeProps) => theme.colors.shadow.opacity};
  shadow-radius: 4px;
`;

const SearchInput = styled.TextInput<ThemeProps>`
  flex: 1;
  height: 44px;
  color: ${({ theme }: ThemeProps) => theme.colors.text.primary};
  font-size: 16px;
  margin-left: 8px;
`;

const MenuButton = styled.TouchableOpacity<ThemeProps>`
  padding: 12px;
  margin-right: 8px;
  background-color: ${({ theme }: ThemeProps) => theme.colors.surface};
  border-radius: 12px;
`;

const NewChatButton = styled.TouchableOpacity<ThemeProps>`
  position: absolute;
  bottom: 24px;
  right: 24px;
  width: 60px;
  height: 60px;
  background-color: ${({ theme }: ThemeProps) => theme.colors.primary};
  border-radius: 30px;
  justify-content: center;
  align-items: center;
  elevation: 5;
  shadow-color: ${({ theme }: ThemeProps) => theme.colors.shadow.color};
  shadow-offset: 0px 3px;
  shadow-opacity: 0.3;
  shadow-radius: 6px;
`;

const ChatListContainer = styled.View<ThemeProps>`
  flex: 1;
  background-color: ${({ theme }: ThemeProps) => theme.colors.background};
`;

const ChatItem = styled.TouchableOpacity<ThemeProps>`
  flex-direction: row;
  padding: 16px;
  margin: 8px 16px;
  background-color: ${({ theme }: ThemeProps) => theme.colors.surface};
  border-radius: 16px;
  align-items: center;
  elevation: 2;
  shadow-color: ${({ theme }: ThemeProps) => theme.colors.shadow.color};
  shadow-offset: 0px 2px;
  shadow-opacity: ${({ theme }: ThemeProps) => theme.colors.shadow.opacity};
  shadow-radius: 4px;
`;

const Avatar = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  margin-right: 12px;
`;

const ChatInfo = styled.View`
  flex: 1;
`;

const ChatName = styled.Text<ThemeProps>`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }: ThemeProps) => theme.colors.text.primary};
  margin-bottom: 4px;
`;

const LastMessage = styled.Text<ThemeProps>`
  font-size: 14px;
  color: ${({ theme }: ThemeProps) => theme.colors.text.secondary};
`;

const TimeContainer = styled.View`
  align-items: flex-end;
`;

const TimeText = styled.Text<ThemeProps>`
  font-size: 12px;
  color: ${({ theme }: ThemeProps) => theme.colors.text.secondary};
  margin-bottom: 4px;
`;

const UnreadBadge = styled.View<ThemeProps>`
  background-color: ${({ theme }: ThemeProps) => theme.colors.primary};
  border-radius: 10px;
  min-width: 20px;
  height: 20px;
  justify-content: center;
  align-items: center;
  padding: 0 6px;
`;

const UnreadText = styled.Text`
  color: white;
  font-size: 12px;
  font-weight: bold;
`;

const EmptyListContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 32px;
`;

const EmptyListText = styled.Text<ThemeProps>`
  font-size: 16px;
  color: ${({ theme }: ThemeProps) => theme.colors.text.secondary};
  text-align: center;
  margin-top: 16px;
`;

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar: string;
  unreadCount: number;
}

const initialChats: Chat[] = [
  {
    id: '1',
    name: 'John Doe',
    lastMessage: 'Hey, how are you doing?',
    time: '10:30 AM',
    avatar: 'https://i.pravatar.cc/150?img=1',
    unreadCount: 2,
  },
  {
    id: '2',
    name: 'Jane Smith',
    lastMessage: 'We\'ll meet tomorrow at 9',
    time: 'Yesterday',
    avatar: 'https://i.pravatar.cc/150?img=2',
    unreadCount: 0,
  },
  {
    id: '3',
    name: 'Team Chat',
    lastMessage: 'New project updates available',
    time: 'Yesterday',
    avatar: 'https://i.pravatar.cc/150?img=3',
    unreadCount: 5,
  },
];

export default function ChatListScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [chats] = useState<Chat[]>(initialChats);

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderEmptyList = () => (
    <EmptyListContainer>
      <Ionicons name="chatbubbles-outline" size={64} color={theme.colors.text.secondary} />
      <EmptyListText>No chats yet. Start a new conversation!</EmptyListText>
    </EmptyListContainer>
  );

  return (
    <PlatformContainer>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surface]}
        style={{ flex: 1 }}
      >
        {Platform.OS === 'ios' && <PlatformBlurHeader />}
        <PlatformHeader>
          <MenuButton onPress={() => router.push('/admin/settings')}>
            <Ionicons name="menu" size={24} color={theme.colors.text.primary} />
          </MenuButton>
          <PlatformTitle>Messages</PlatformTitle>
        </PlatformHeader>

        <SearchContainer>
          <Ionicons name="search" size={20} color={theme.colors.text.secondary} />
          <SearchInput
            placeholder="Search conversations..."
            placeholderTextColor={theme.colors.text.secondary}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
          />
        </SearchContainer>

        <ChatListContainer>
          <FlatList
            data={filteredChats}
            renderItem={({ item }) => (
              <ChatItem
                onPress={() => router.push(`/chat/${item.id}`)}
                activeOpacity={0.7}
              >
                <Avatar source={{ uri: item.avatar }} />
                <ChatInfo>
                  <ChatName>{item.name}</ChatName>
                  <LastMessage numberOfLines={1}>{item.lastMessage}</LastMessage>
                </ChatInfo>
                <TimeContainer>
                  <TimeText>{item.time}</TimeText>
                  {item.unreadCount > 0 && (
                    <UnreadBadge>
                      <UnreadText>{item.unreadCount}</UnreadText>
                    </UnreadBadge>
                  )}
                </TimeContainer>
              </ChatItem>
            )}
            keyExtractor={item => item.id}
            contentContainerStyle={{ 
              paddingVertical: 8,
              flexGrow: 1,
              paddingBottom: 100 // Add padding to avoid FAB overlap
            }}
            ListEmptyComponent={renderEmptyList}
          />
          <NewChatButton onPress={() => router.push('/chat/new')}>
            <Ionicons name="chatbubble-ellipses" size={28} color="#FFFFFF" />
          </NewChatButton>
        </ChatListContainer>
      </LinearGradient>
    </PlatformContainer>
  );
}
