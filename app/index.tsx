import React, { useState } from 'react';
import { View } from 'react-native';
import { useTheme } from '@/assets/style/ThemeProvider';
import {
  Background,
  Container,
  HelloText,
  TitleText,
  Input,
  ButtonText,
  FooterText,
  SignUpText,
  Button,
  InfoText,
  ErrorText,
} from '@/assets/style/Components';
import { router } from 'expo-router';

export default function SignIn() {
  const { theme } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSignIn = () => {
    // For demo purposes, using a simple admin check
    if (username === 'admin' && password === 'admin123') {
      router.push('/admin/dashboard');
    } else if (username === 'driver' && password === 'driver123') {
      router.push('/(tabs)');
    } else {
      setError('Invalid username or password');
    }
  };
  
  return (
    <Background source={require('../assets/images/recycle-bin.png')} theme={theme}>
      <HelloText theme={theme}>Hello</HelloText>
      <TitleText theme={theme}>Sign In</TitleText>

      <Container theme={theme}>
        <InfoText theme={theme}>Enter your username and password</InfoText>
        <Input
          placeholder="Enter your username here..."
          placeholderTextColor={theme.colors.text.secondary}
          theme={theme}
          value={username}
          onChangeText={setUsername}
        />
        <Input
          placeholder="Enter your Password here..."
          placeholderTextColor={theme.colors.text.secondary}
          secureTextEntry
          theme={theme}
          value={password}
          onChangeText={setPassword}
        />
        {error ? <ErrorText theme={theme} visible={true}>{error}</ErrorText> : null}

        <Button theme={theme} onPress={handleSignIn}>
          <ButtonText>Sign In</ButtonText>
        </Button>

        <FooterText theme={theme}>
          Don't have an account? <SignUpText theme={theme} onPress={()=>{router.push('/signup');}}>Sign up</SignUpText>
        </FooterText>
      </Container>
    </Background>
  );
}