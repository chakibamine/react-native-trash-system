import React, { useState, useRef } from 'react';
import { View, FlatList, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '@/assets/style/ThemeProvider';
import { Theme } from '@/assets/style/theme';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

type ThemeProps = {
  theme: Theme;
};

interface OnboardingProps {
  setIsFirstLaunch: (value: boolean) => void;
}

const Container = styled.View<ThemeProps>`
  flex: 1;
  background-color: ${(props: ThemeProps) => props.theme.colors.background};
`;

const Slide = styled.View`
  width: ${width}px;
  padding: 24px;
  align-items: center;
  justify-content: center;
`;

const Image = styled.Image`
  width: ${width * 0.8}px;
  height: ${width * 0.8}px;
  margin-bottom: 40px;
`;

const Title = styled.Text<ThemeProps>`
  font-size: 24px;
  font-weight: bold;
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
  text-align: center;
  margin-bottom: 16px;
`;

const Description = styled.Text<ThemeProps>`
  font-size: 16px;
  color: ${(props: ThemeProps) => props.theme.colors.text.secondary};
  text-align: center;
  line-height: 24px;
`;

const PaginationContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
`;

const PaginationDot = styled.View<ThemeProps & { active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  margin: 0 4px;
  background-color: ${(props: ThemeProps & { active: boolean }) => 
    props.active ? props.theme.colors.primary : props.theme.colors.text.secondary + '40'};
`;

const ButtonContainer = styled.View`
  padding: 24px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Button = styled.TouchableOpacity<ThemeProps>`
  padding: 16px 32px;
  border-radius: 8px;
  background-color: ${(props: ThemeProps) => props.theme.colors.primary};
`;

const ButtonText = styled.Text`
  color: #FFFFFF;
  font-size: 16px;
  font-weight: bold;
`;

const SkipButton = styled.TouchableOpacity`
  padding: 16px;
`;

const SkipText = styled.Text<ThemeProps>`
  color: ${(props: ThemeProps) => props.theme.colors.text.secondary};
  font-size: 16px;
`;

const slides = [
  {
    id: '1',
    image: require('../assets/images/onboarding-1.png'),
    title: 'Smart Waste Management',
    description: 'Welcome to the future of waste collection. Manage your entire fleet and operations from one place.'
  },
  {
    id: '2',
    image: require('../assets/images/onboarding-2.png'),
    title: 'Optimize Collection Routes',
    description: 'Plan efficient routes, track trucks in real-time, and ensure timely waste collection across all locations.'
  },
  {
    id: '3',
    image: require('../assets/images/onboarding-3.png'),
    title: 'Real-time Monitoring',
    description: 'Track bin levels, driver activities, and collection status. Make data-driven decisions for better efficiency.'
  }
];

export default function Onboarding({ setIsFirstLaunch }: OnboardingProps) {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true
      });
    } else {
      handleFinish();
    }
  };

  const handleSkip = () => {
    handleFinish();
  };

  const handleFinish = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      setIsFirstLaunch(false);
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  const renderItem = ({ item }: { item: typeof slides[0] }) => (
    <Slide>
      <Image source={item.image} resizeMode="contain" />
      <Title theme={theme}>{item.title}</Title>
      <Description theme={theme}>{item.description}</Description>
    </Slide>
  );

  return (
    <Container theme={theme}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={event => {
          const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(newIndex);
        }}
      />

      <PaginationContainer>
        {slides.map((_, index) => (
          <PaginationDot
            key={index}
            active={currentIndex === index}
            theme={theme}
          />
        ))}
      </PaginationContainer>

      <ButtonContainer>
        {currentIndex < slides.length - 1 ? (
          <>
            <SkipButton onPress={handleSkip}>
              <SkipText theme={theme}>Skip</SkipText>
            </SkipButton>
            <Button theme={theme} onPress={handleNext}>
              <ButtonText>Next</ButtonText>
            </Button>
          </>
        ) : (
          <>
            <View style={{ width: 80 }} />
            <Button theme={theme} onPress={handleFinish}>
              <ButtonText>Get Started</ButtonText>
            </Button>
          </>
        )}
      </ButtonContainer>
    </Container>
  );
} 