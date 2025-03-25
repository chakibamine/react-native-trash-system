import React, { useState, useRef, useEffect } from 'react';
import { Platform, KeyboardAvoidingView, FlatList, Keyboard, TextInput as RNTextInput, Animated } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '@/assets/style/ThemeProvider';
import { Theme } from '@/assets/style/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

// Define prop types for styled components
type ThemeProps = {
  theme: Theme;
};

type MessageBubbleProps = ThemeProps & {
  isUser: boolean;
};

type SendButtonProps = ThemeProps & {
  hasContent: boolean;
};

// Styled components with enhanced design
const Container = styled.View<ThemeProps>`
  flex: 1;
  background-color: ${({ theme }: ThemeProps) => theme.colors.background};
`;

const Header = styled.View<ThemeProps>`
  flex-direction: row;
  align-items: center;
  padding: 12px 16px;
  background-color: ${({ theme }: ThemeProps) => theme.colors.surface};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }: ThemeProps) => theme.colors.border};
`;

const BackButton = styled.TouchableOpacity<ThemeProps>`
  padding: 8px;
  margin-right: 8px;
  background-color: ${({ theme }: ThemeProps) => theme.colors.background};
  border-radius: 12px;
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
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }: ThemeProps) => theme.colors.text.primary};
`;

const Subtitle = styled.Text<ThemeProps>`
  font-size: 13px;
  color: ${({ theme }: ThemeProps) => theme.colors.text.secondary};
  margin-top: 2px;
`;

const ChatContainer = styled.View`
  flex: 1;
  padding: 16px;
`;

const MessageBubble = styled.View<MessageBubbleProps>`
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 20px;
  margin-bottom: 12px;
  align-self: ${({ isUser }: MessageBubbleProps) => (isUser ? 'flex-end' : 'flex-start')};
  background-color: ${({ isUser, theme }: MessageBubbleProps) =>
    isUser ? theme.colors.primary : theme.colors.surface};
  elevation: 1;
  shadow-color: ${({ theme }: MessageBubbleProps) => theme.colors.shadow.color};
  shadow-offset: 0px 1px;
  shadow-opacity: ${({ theme }: MessageBubbleProps) => theme.colors.shadow.opacity};
  shadow-radius: 2px;
`;

const MessageText = styled.Text<MessageBubbleProps>`
  font-size: 16px;
  color: ${({ isUser, theme }: MessageBubbleProps) =>
    isUser ? '#FFFFFF' : theme.colors.text.primary};
  line-height: 22px;
`;

const TimeText = styled.Text<ThemeProps>`
  font-size: 11px;
  color: ${({ theme }: ThemeProps) => theme.colors.text.secondary};
  align-self: flex-end;
  margin-top: 4px;
  opacity: 0.8;
`;

const InputContainer = styled.View<ThemeProps>`
  flex-direction: row;
  align-items: flex-end;
  padding: 12px 16px;
  background-color: ${({ theme }: ThemeProps) => theme.colors.surface};
  border-top-width: 1px;
  border-top-color: ${({ theme }: ThemeProps) => theme.colors.border};
`;

const Input = styled.TextInput<ThemeProps>`
  flex: 1;
  min-height: 40px;
  max-height: 100px;
  margin-right: 12px;
  padding: 10px 16px;
  border-radius: 20px;
  background-color: ${({ theme }: ThemeProps) => theme.colors.background};
  color: ${({ theme }: ThemeProps) => theme.colors.text.primary};
  font-size: 16px;
`;

const SendButton = styled.TouchableOpacity<SendButtonProps>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${({ hasContent, theme }: SendButtonProps) =>
    hasContent ? theme.colors.primary : theme.colors.surface};
  justify-content: center;
  align-items: center;
  elevation: ${({ hasContent }: SendButtonProps) => (hasContent ? 2 : 0)};
  shadow-color: ${({ theme }: SendButtonProps) => theme.colors.shadow.color};
  shadow-offset: 0px 2px;
  shadow-opacity: ${({ hasContent, theme }: SendButtonProps) => (hasContent ? theme.colors.shadow.opacity : 0)};
  shadow-radius: 4px;
`;

const DateSeparator = styled.View`
  align-items: center;
  margin-vertical: 16px;
`;

const DateText = styled.Text<ThemeProps>`
  font-size: 12px;
  color: ${({ theme }: ThemeProps) => theme.colors.text.secondary};
  background-color: ${({ theme }: ThemeProps) => theme.colors.background};
  padding: 4px 12px;
  border-radius: 12px;
`;

const MessageStatus = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
`;

const StatusIcon = styled(Ionicons)`
  margin-left: 4px;
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
      text: 'Hello! How can I help you with waste management today?',
      isUser: false,
      timestamp: new Date(Date.now() - 3600000),
      status: 'read'
    },
    {
      id: '2',
      text: 'I noticed a full bin at Central Park near the main entrance. It needs immediate attention.',
      isUser: true,
      timestamp: new Date(Date.now() - 1800000),
      status: 'read'
    },
    {
      id: '3',
      text: 'Thank you for reporting. Our team will handle it within the next hour. I will update you once it is done.',
      isUser: false,
      timestamp: new Date(Date.now() - 1700000),
      status: 'read'
    }
  ]);

  const [conversation, setConversation] = useState({
    name: 'City Center Cleanup Team',
    avatar: 'https://ui-avatars.com/api/?name=City+Center&background=0366d6&color=fff',
    status: 'Online'
  });

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString();
  };

  const renderMessageStatus = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return <StatusIcon name="checkmark" size={16} color={theme.colors.text.secondary} />;
      case 'delivered':
        return <StatusIcon name="checkmark-done" size={16} color={theme.colors.text.secondary} />;
      case 'read':
        return <StatusIcon name="checkmark-done" size={16} color={theme.colors.primary} />;
      default:
        return null;
    }
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const showDate = index === 0 || 
      formatDate(item.timestamp) !== formatDate(messages[index - 1].timestamp);

    return (
      <>
        {showDate && (
          <DateSeparator>
            <DateText>{formatDate(item.timestamp)}</DateText>
          </DateSeparator>
        )}
        <MessageBubble isUser={item.isUser}>
          <MessageText isUser={item.isUser}>{item.text}</MessageText>
          <TimeText>
            {formatTime(item.timestamp)}
            {item.isUser && renderMessageStatus(item.status)}
          </TimeText>
        </MessageBubble>
      </>
    );
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

  return (
    <Container style={{ paddingTop: insets.top }}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.surface]}
        style={{ flex: 1 }}
      >
        <Header>
          <BackButton onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
          </BackButton>
          <Avatar source={{ uri: conversation.avatar }} />
          <HeaderInfo>
            <Title>{conversation.name}</Title>
            <Subtitle>{conversation.status}</Subtitle>
          </HeaderInfo>
        </Header>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
        >
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            contentContainerStyle={{ padding: 16, flexGrow: 1 }}
            inverted={false}
          />

          <InputContainer>
            <Input
              ref={inputRef}
              placeholder="Type a message..."
              placeholderTextColor={theme.colors.text.secondary}
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={500}
            />
            <SendButton
              onPress={handleSend}
              hasContent={message.trim().length > 0}
              disabled={message.trim().length === 0}
            >
              <Ionicons
                name="send"
                size={20}
                color={message.trim().length > 0 ? '#FFFFFF' : theme.colors.text.secondary}
              />
            </SendButton>
          </InputContainer>
        </KeyboardAvoidingView>
      </LinearGradient>
    </Container>
  );
} 