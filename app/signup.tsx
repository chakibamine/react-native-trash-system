import React, { useState } from 'react';
import { View, TouchableOpacity, Platform, Alert } from 'react-native';
import { useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { Theme, lightTheme, darkTheme } from '@/assets/style/theme';
import { BlurView } from 'expo-blur';
import {
  PlatformContainer,
  PlatformInput,
  PlatformButton,
  PlatformTitle,
  PlatformText,
} from './components/PlatformStyles';
import styled from 'styled-components/native';
import { register } from '../api/auth';

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
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'NORMAL_USER'
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSignUp = async () => {
    try {
      setLoading(true);
      await register(formData);
      Alert.alert('Success', 'Registration successful!');
      router.push('/otp');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
              placeholder="Enter your username here..."
              placeholderTextColor={theme.colors.text.secondary}
              theme={theme}
              value={formData.username}
              onChangeText={(text: string) => handleInputChange('username', text)}
            />
            <PlatformInput
              placeholder="Enter your email here..."
              placeholderTextColor={theme.colors.text.secondary}
              theme={theme}
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text: string) => handleInputChange('email', text)}
            />
            <PlatformInput
              placeholder="Enter your Password here..."
              placeholderTextColor={theme.colors.text.secondary}
              theme={theme}
              secureTextEntry
              value={formData.password}
              onChangeText={(text: string) => handleInputChange('password', text)}
            />
          </InputContainer>

          <ButtonContainer>
            <PlatformButton 
              theme={theme} 
              onPress={handleSignUp}
              disabled={loading}
            >
              <PlatformText style={{ color: '#FFFFFF' }}>
                {loading ? 'Signing Up...' : 'Sign Up'}
              </PlatformText>
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