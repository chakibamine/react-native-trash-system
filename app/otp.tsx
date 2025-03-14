import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useColorScheme } from 'react-native';
import { themes } from '@/assets/style/theme';
import {
  Background,
  Container,
  InfoText,
  ButtonText,
  FooterText,
  Button,
  OTPInput,
} from '@/assets/style/Components';

export default function OTP() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? themes.dark : themes.light;
  const [code, setCode] = useState<string[]>(['', '', '', '']);

  // Function to handle code input
  const handleCodeInput = (index: number, value: string) => {
    const newCode = [...code];
    newCode[index] = value;

    if (value && index < 3) {
      const currentInput = document.activeElement as HTMLInputElement | null;
      currentInput?.blur();

      setTimeout(() => {
        const nextInput = document.querySelector(`input[data-index="${index + 1}"]`) as HTMLInputElement | null;
        nextInput?.focus();
      }, 100);
    }

    setCode(newCode);
  };

  // Function to handle continue button press
  const handleContinue = () => {
    // Add your OTP verification logic here
    console.log('OTP:', code.join(''));
    router.push('/'); // Navigate back to the Sign In screen after verification
  };

  // Function to resend the code
  const handleResendCode = () => {
    // Add your resend code logic here
    console.log('Resend Code');
  };

  return (
    <Background source={require('../assets/images/recycle-bin.png')} theme={theme}>
      <Container theme={theme}>
        <InfoText theme={theme}>Enter confirmation code</InfoText>
        <Text style={{ color: theme.text, marginBottom: 10 }}>
          A 4-digit code was sent to test@email.com
        </Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
          {[0, 1, 2, 3].map((index) => (
            <OTPInput
              key={index}
              keyboardType="numeric"
              maxLength={1}
              data-index={index}
              onChangeText={(value) => handleCodeInput(index, value)}
              value={code[index]}
            />
          ))}
        </View>

        <Button theme={theme} onPress={handleContinue}>
          <ButtonText>Continue</ButtonText>
        </Button>

        <FooterText theme={theme}>
          <TouchableOpacity onPress={handleResendCode}>
            <ButtonText>Resend Code</ButtonText>
          </TouchableOpacity>
        </FooterText>
      </Container>
    </Background>
  );
}