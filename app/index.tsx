import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import { useTheme } from '@/assets/style/ThemeProvider';
import * as LocalAuthentication from 'expo-local-authentication';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);

  useEffect(() => {
    checkBiometricSupport();
    checkBiometricEnabled();
  }, []);

  const checkBiometricSupport = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    setIsBiometricSupported(compatible);
  };

  const checkBiometricEnabled = async () => {
    try {
      const enabled = await AsyncStorage.getItem('biometricEnabled');
      setIsBiometricEnabled(enabled === 'true');
    } catch (error) {
      console.error('Error checking biometric status:', error);
    }
  };

  const handleBiometricAuth = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to sign in',
        fallbackLabel: 'Use password',
      });

      if (result.success) {
        // Get stored credentials
        const storedUsername = await AsyncStorage.getItem('lastUsername');
        const storedPassword = await AsyncStorage.getItem('lastPassword');
        
        if (storedUsername && storedPassword) {
          setUsername(storedUsername);
          setPassword(storedPassword);
          // Automatically sign in with stored credentials
          if (storedUsername === 'admin' && storedPassword === 'admin123') {
            router.push('/admin/dashboard');
          } else if (storedUsername === 'driver' && storedPassword === 'driver123') {
            router.push('/(tabs)');
          }
        } else {
          setError('No stored credentials found. Please sign in with password first.');
        }
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
      setError('Biometric authentication failed');
    }
  };
  
  const handleSignIn = async () => {
    // For demo purposes, using a simple admin check
    if (username === 'admin' && password === 'admin123') {
      // Store credentials for biometric login
      try {
        await AsyncStorage.setItem('lastUsername', username);
        await AsyncStorage.setItem('lastPassword', password);
        await AsyncStorage.setItem('biometricEnabled', 'true');
        setIsBiometricEnabled(true);
      } catch (error) {
        console.error('Error storing credentials:', error);
      }
      router.push('/admin/dashboard');
    } else if (username === 'driver' && password === 'driver123') {
      // Store credentials for biometric login
      try {
        await AsyncStorage.setItem('lastUsername', username);
        await AsyncStorage.setItem('lastPassword', password);
        await AsyncStorage.setItem('biometricEnabled', 'true');
        setIsBiometricEnabled(true);
      } catch (error) {
        console.error('Error storing credentials:', error);
      }
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

        {isBiometricSupported && (
          <TouchableOpacity
            onPress={handleBiometricAuth}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 16,
              padding: 12,
              backgroundColor: theme.colors.primary + '20',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: theme.colors.primary + '40',
            }}
          >
            <Ionicons
              name="finger-print"
              size={28}
              color={theme.colors.primary}
              style={{ marginRight: 8 }}
            />
            <ButtonText style={{ color: theme.colors.primary }}>
              Sign in with Fingerprint
            </ButtonText>
          </TouchableOpacity>
        )}

        <FooterText theme={theme}>
          Don't have an account? <SignUpText theme={theme} onPress={()=>{router.push('/signup');}}>Sign up</SignUpText>
        </FooterText>
      </Container>
    </Background>
  );
}