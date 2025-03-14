import React from 'react';
import { View } from 'react-native';
import { useColorScheme } from 'react-native';
import { themes } from '@/assets/style/theme';
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
} from '@/assets/style/Components';
import { router } from 'expo-router';

export default function SignIn() {
  const colorScheme = useColorScheme(); 
  const theme = colorScheme === 'dark' ? themes.dark : themes.light;
  return (
    <Background source={require('../assets/images/recycle-bin.png')} theme={theme}>
      <HelloText theme={theme}>Hello</HelloText>
      <TitleText theme={theme}>Sign In</TitleText>

      <Container theme={theme}>
        <InfoText theme={theme}>Enter your number and password</InfoText>
        <Input
          placeholder="Enter your username here..."
          placeholderTextColor={theme.secondary}
          theme={theme}
        />
        <Input
          placeholder="Enter your Password here..."
          placeholderTextColor={theme.secondary}
          secureTextEntry
          theme={theme}
        />

        <Button theme={theme}>
          <ButtonText onPress={()=>{router.push('/(tabs)');}}>Sign In</ButtonText>
        </Button>

        <FooterText theme={theme}>
          Don't have an account? <SignUpText theme={theme} onPress={()=>{router.push('/signup');}}>Sign up</SignUpText>
        </FooterText>
      </Container>
    </Background>
  );
}