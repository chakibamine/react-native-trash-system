import React from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import { useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { Theme } from '@/assets/style/theme';
import { BlurView } from 'expo-blur';
import {
  PlatformContainer,
  PlatformInput,
  PlatformButton,
  PlatformTitle,
  PlatformText,
} from './components/PlatformStyles';
import styled from 'styled-components/native';

type ThemeProps = {
  theme: Theme;
};

const BackgroundContainer = styled.View<ThemeProps>`
  flex: 1;
  background-color: ${(props: ThemeProps) => props.theme.colors.background};
`;

const BackgroundImage = styled.ImageBackground`
  flex: 1;
  width: 100%;
`;

const ContentContainer = styled.View<ThemeProps>`
  flex: 1;
  padding: ${Platform.OS === 'ios' ? '20px' : '24px'};
  background-color: ${(props: ThemeProps) => props.theme.colors.background + 'CC'};
`;

const InputContainer = styled.View`
  margin-top: ${Platform.OS === 'ios' ? '20px' : '24px'};
  gap: ${Platform.OS === 'ios' ? '12px' : '16px'};
`;

const ButtonContainer = styled.View`
  margin-top: ${Platform.OS === 'ios' ? '24px' : '32px'};
`;

const FooterContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  margin-top: ${Platform.OS === 'ios' ? '16px' : '20px'};
`;

const SignInText = styled(PlatformText)`
  color: ${(props: ThemeProps) => props.theme.colors.primary};
`;

export default function SignUp() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? {
    colors: {
      background: '#000000',
      surface: '#1C1C1E',
      text: {
        primary: '#FFFFFF',
        secondary: '#8E8E93'
      },
      primary: '#0A84FF',
      border: '#38383A'
    }
  } : {
    colors: {
      background: '#FFFFFF',
      surface: '#F2F2F7',
      text: {
        primary: '#000000',
        secondary: '#8E8E93'
      },
      primary: '#007AFF',
      border: '#C6C6C8'
    }
  };

  // Function to handle sign up
  const handleSignUp = () => {
    // Add your sign-up logic here
    console.log('Sign Up');
    router.push('/otp');
  };

  // Function to navigate back to the Sign In screen
 

  return (
    <BackgroundContainer theme={theme}>
      <BackgroundImage source={require('../assets/images/recycle-bin.png')}>
        {Platform.OS === 'ios' && (
          <BlurView intensity={80} tint={colorScheme === 'dark' ? 'dark' : 'light'} />
        )}
        <ContentContainer theme={theme}>
          <PlatformTitle theme={theme}>Create Your Account</PlatformTitle>
          <PlatformText theme={theme}>Enter your details below</PlatformText>
          
          <InputContainer>
            <PlatformInput
              placeholder="Enter your firstname here..."
              placeholderTextColor={theme.colors.text.secondary}
              theme={theme}
            />
            <PlatformInput
              placeholder="Enter your lastname here..."
              placeholderTextColor={theme.colors.text.secondary}
              theme={theme}
            />
            <PlatformInput
              placeholder="Enter your email here..."
              placeholderTextColor={theme.colors.text.secondary}
              theme={theme}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <PlatformInput
              placeholder="Enter your username here..."
              placeholderTextColor={theme.colors.text.secondary}
              theme={theme}
            />
            <PlatformInput
              placeholder="Enter your Password here..."
              placeholderTextColor={theme.colors.text.secondary}
              theme={theme}
              secureTextEntry
            />
          </InputContainer>

          <ButtonContainer>
            <PlatformButton theme={theme} onPress={handleSignUp}>
              <PlatformText style={{ color: '#FFFFFF' }}>Sign Up</PlatformText>
            </PlatformButton>
          </ButtonContainer>

          <FooterContainer>
            <PlatformText theme={theme}>Already have an account? </PlatformText>
            <TouchableOpacity onPress={() => router.push('/')}>
              <SignInText theme={theme}>Sign in</SignInText>
            </TouchableOpacity>
          </FooterContainer>
        </ContentContainer>
      </BackgroundImage>
    </BackgroundContainer>
  );
}