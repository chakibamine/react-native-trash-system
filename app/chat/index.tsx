import React, { useState } from 'react';
import { View, FlatList, Platform } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '@react-navigation/native';
import { Theme } from '@/assets/style/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
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
  padding: 8px 0;
  background-color: ${(props: ThemeProps) => props.theme.colors.background};
`;

const MenuButton = styled.TouchableOpacity`
  padding: 8px;
  margin-right: 8px;
`;

const NewChatButton = styled.TouchableOpacity`
  padding: 8px;
`;

const ChatInfo = styled.View`
  flex: 1;
  margin-left: 12px;
`;

const ChatName = styled(PlatformText)<ThemeProps>`
  font-size: 16px;
  font-weight: 600;
  color: ${(props: ThemeProps) => props.theme.colors.text};
`;

const LastMessage = styled(PlatformText)<ThemeProps>`
  font-size: 14px;
  color: ${(props: ThemeProps) => props.theme.colors.text};
  opacity: 0.7;
`;

const TimeText = styled(PlatformText)<ThemeProps>`
  font-size: 12px;
  color: ${(props: ThemeProps) => props.theme.colors.text};
  opacity: 0.5;
`;

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar: string;
  unreadCount: number;
}

export default function ChatListScreen() {
  const theme = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [chats] = useState<Chat[]>([
    {
      id: '1',
      name: 'John Doe',
      lastMessage: 'Hey, how are you?',
      time: '2m ago',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random',
      unreadCount: 2
    },
    {
      id: '2',
      name: 'Jane Smith',
      lastMessage: 'See you tomorrow!',
      time: '1h ago',
      avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=random',
      unreadCount: 0
    },
    {
      id: '3',
      name: 'Mike Johnson',
      lastMessage: 'Thanks for your help',
      time: '2h ago',
      avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=random',
      unreadCount: 1
    }
  ]);

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleChatPress = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };

  const handleNewChat = () => {
    router.push('/chat/new');
  };

  const renderChat = ({ item }: { item: Chat }) => (
    <PlatformListItem onPress={() => handleChatPress(item.id)}>
      <PlatformAvatar source={{ uri: item.avatar }} />
      <ChatInfo>
        <ChatName>{item.name}</ChatName>
        <LastMessage>{item.lastMessage}</LastMessage>
      </ChatInfo>
      <TimeText>{item.time}</TimeText>
      {item.unreadCount > 0 && (
        <View style={{
          backgroundColor: theme.colors.primary,
          borderRadius: Platform.OS === 'ios' ? 10 : 12,
          minWidth: Platform.OS === 'ios' ? 20 : 24,
          height: Platform.OS === 'ios' ? 20 : 24,
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 8
        }}>
          <PlatformText style={{ color: '#FFFFFF', fontSize: Platform.OS === 'ios' ? 12 : 13 }}>
            {item.unreadCount}
          </PlatformText>
        </View>
      )}
    </PlatformListItem>
  );

  return (
    <PlatformContainer>
      {Platform.OS === 'ios' && <PlatformBlurHeader />}
      <PlatformHeader>
        <MenuButton onPress={() => router.push('/admin/settings')}>
          <Ionicons name="menu" size={24} color={theme.colors.text} />
        </MenuButton>
        <PlatformTitle>Chats</PlatformTitle>
        <PlatformButton
          onPress={() => router.push('/chat/new')}
          style={{ padding: 8 }}
        >
          <Ionicons name="add-circle" size={24} color={theme.colors.text} />
        </PlatformButton>
      </PlatformHeader>

      <SearchContainer>
        <PlatformInput
          placeholder="Search chats..."
          value={search}
          onChangeText={setSearch}
          style={{ marginHorizontal: 16 }}
        />
      </SearchContainer>

      <FlatList
        data={filteredChats}
        renderItem={renderChat}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16 }}
      />
    </PlatformContainer>
  );
}
