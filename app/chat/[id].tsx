import React, { useState, useRef, useEffect } from 'react';
import { Platform, KeyboardAvoidingView, FlatList, Keyboard, TextInput as RNTextInput } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '@/assets/style/ThemeProvider';
import { Theme } from '@/assets/style/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';

// Define prop types for styled components
type ThemeProps = {
  theme: Theme;
};

type MessageBubbleProps = ThemeProps & {
  isUser: boolean;
};

// Styled components
const Container = styled.View<ThemeProps>`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
`;

const Header = styled.View<ThemeProps>`
  flex-direction: row;
  align-items: center;
  padding: 8px 16px;
  background-color: ${(props) => props.theme.colors.surface};
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.colors.border};
`;

const BackButton = styled.TouchableOpacity`
  padding: 8px;
  margin-right: 8px;
`;

const Avatar = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 12px;
`;

const HeaderInfo = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
`;

const Title = styled.Text<ThemeProps>`
  font-size: 17px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text.primary};
`;

const Subtitle = styled.Text<ThemeProps>`
  font-size: 13px;
  color: ${(props) => props.theme.colors.text.secondary};
  margin-top: 2px;
`;

const ChatContainer = styled.View`
  flex: 1;
  padding: 16px;
`;

const MessageBubble = styled.View<MessageBubbleProps>`
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 16px;
  margin-bottom: 8px;
  align-self: ${(props) => (props.isUser ? 'flex-end' : 'flex-start')};
  background-color: ${(props) =>
    props.isUser ? props.theme.colors.primary : props.theme.colors.surface};
`;

const MessageText = styled.Text<MessageBubbleProps>`
  font-size: 16px;
  color: ${(props) =>
    props.isUser ? '#FFFFFF' : props.theme.colors.text.primary};
`;

const TimeText = styled.Text<ThemeProps>`
  font-size: 11px;
  color: ${(props) => props.theme.colors.text.secondary};
  align-self: flex-end;
  margin-top: 4px;
`;

const InputContainer = styled.View<ThemeProps>`
  flex-direction: row;
  align-items: flex-end;
  padding: 8px 16px;
  background-color: ${(props) => props.theme.colors.surface};
  border-top-width: 1px;
  border-top-color: ${(props) => props.theme.colors.border};
`;

const Input = styled.TextInput<ThemeProps>`
  flex: 1;
  min-height: 40px;
  max-height: 100px;
  margin-right: 8px;
  padding: 8px 12px;
  border-radius: 20px;
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text.primary};
  font-size: 16px;
`;

const SendButton = styled.TouchableOpacity<ThemeProps & { hasContent: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${(props) =>
    props.hasContent ? props.theme.colors.primary : props.theme.colors.surface};
  justify-content: center;
  align-items: center;
`;

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
}

export default function ChatConversationScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const inputRef = useRef<RNTextInput>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! How can I help you with trash management today?',
      isUser: false,
      timestamp: new Date(Date.now() - 3600000),
      status: 'read'
    },
    {
      id: '2',
      text: 'I noticed a full bin at Central Park',
      isUser: true,
      timestamp: new Date(Date.now() - 1800000),
      status: 'read'
    },
    {
      id: '3',
      text: 'Thank you for reporting. Our team will handle it within the next hour.',
      isUser: false,
      timestamp: new Date(Date.now() - 1700000),
      status: 'read'
    }
  ]);

  const [conversation, setConversation] = useState({
    name: 'City Center Cleanup Team',
    avatar: 'https://ui-avatars.com/api/?name=City+Center&background=random',
    status: 'Online'
  });

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSend = () => {
    if (message.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: message.trim(),
        isUser: true,
        timestamp: new Date(),
        status: 'sent'
      };
      setMessages(prev => [...prev, newMessage]);
      setMessage('');

      // Simulate response
      setTimeout(() => {
        const response: Message = {
          id: (Date.now() + 1).toString(),
          text: "I've notified the cleanup team. They will update you once the bin has been emptied.",
          isUser: false,
          timestamp: new Date(),
          status: 'sent'
        };
        setMessages(prev => [...prev, response]);
      }, 1000);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <MessageBubble isUser={item.isUser}>
      <MessageText isUser={item.isUser}>{item.text}</MessageText>
      <TimeText>{formatTime(item.timestamp)}</TimeText>
    </MessageBubble>
  );

  return (
    <Container style={{ paddingTop: insets.top }}>
      <Header>
        <BackButton onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.colors.text.primary}
          />
        </BackButton>
        <Avatar source={{ uri: conversation.avatar }} />
        <HeaderInfo>
          <Title>{conversation.name}</Title>
          <Subtitle>{conversation.status}</Subtitle>
        </HeaderInfo>
        <BackButton>
          <Ionicons
            name="ellipsis-vertical"
            size={24}
            color={theme.colors.text.primary}
          />
        </BackButton>
      </Header>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ChatContainer>
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
          />
        </ChatContainer>

        <InputContainer>
          <Input
            ref={inputRef}
            placeholder="Type a message"
            placeholderTextColor={theme.colors.text.secondary}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
          />
          <SendButton
            onPress={handleSend}
            hasContent={message.trim().length > 0}
            activeOpacity={0.8}
          >
            <Ionicons
              name="send"
              size={20}
              color={message.trim().length > 0 ? '#FFFFFF' : theme.colors.text.secondary}
            />
          </SendButton>
        </InputContainer>
      </KeyboardAvoidingView>
    </Container>
  );
} 