import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { themes } from '@/assets/style/theme';
import {
  Background,
  Container,
  TitleText,
  Input,
  ButtonText,
  FooterText,
  SignUpText,
  Button,
  InfoText,
  HelloText,
  CreateAccont,
} from '@/assets/style/Components';

export default function SignUp() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? themes.dark : themes.light;

  // Function to handle sign up
  const handleSignUp = () => {
    // Add your sign-up logic here
    console.log('Sign Up');
    router.push('/otp');
  };

  // Function to navigate back to the Sign In screen
 

  return (
    <Background source={require('../assets/images/recycle-bin.png')} theme={theme}>
        <CreateAccont theme={theme}>Create Your</CreateAccont>
        <TitleText theme={theme}>Account</TitleText>
      <Container theme={theme}>
        <InfoText theme={theme}>Enter your details below</InfoText>
        
        <Input
          placeholder="Enter your firstname here..."
          placeholderTextColor={theme.secondary}
          theme={theme}
        />
        <Input
          placeholder="Enter your lastname here..."
          placeholderTextColor={theme.secondary}
          theme={theme}
        />
        <Input
          placeholder="Enter your email here..."
          placeholderTextColor={theme.secondary}
          theme={theme}
        />
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

        <Button theme={theme} onPress={handleSignUp}>
          <ButtonText>Sign Up</ButtonText>
        </Button>

        <FooterText theme={theme}>
          Already have an account?{' '}
          <TouchableOpacity onPress={() => {router.push('/');}}>
            <SignUpText theme={theme}>Sign in</SignUpText>
          </TouchableOpacity>
        </FooterText>
      </Container>
    </Background>
  );
}