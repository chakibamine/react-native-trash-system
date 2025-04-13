import React, { useState } from 'react';
import { ScrollView, TouchableOpacity, View, Text, TextInput } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '@/assets/style/ThemeProvider';
import { Theme } from '@/assets/style/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

// Define prop types for styled components
type ThemeProps = {
  theme: Theme;
};

const Container = styled.View<ThemeProps>`
  flex: 1;
  background-color: ${(props: ThemeProps) => props.theme.colors.background};
`;

const Header = styled.View<ThemeProps>`
  padding: 16px;
  flex-direction: row;
  align-items: center;
  background-color: ${(props: ThemeProps) => props.theme.colors.surface};
  border-bottom-width: 1px;
  border-bottom-color: ${(props: ThemeProps) => props.theme.colors.border};
`;

const BackButton = styled.TouchableOpacity`
  padding: 8px;
  margin-right: 8px;
`;

const HeaderTitle = styled.Text<ThemeProps>`
  font-size: 20px;
  font-weight: bold;
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
`;

const Content = styled.ScrollView`
  flex: 1;
`;

const FormSection = styled.View<ThemeProps>`
  margin: 16px;
  padding: 16px;
  background-color: ${(props: ThemeProps) => props.theme.colors.surface};
  border-radius: ${(props: ThemeProps) => props.theme.borderRadius.md}px;
`;

const FormTitle = styled.Text<ThemeProps>`
  font-size: 16px;
  font-weight: bold;
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
  margin-bottom: 16px;
`;

const InputGroup = styled.View`
  margin-bottom: 16px;
`;

const Label = styled.Text<ThemeProps>`
  font-size: 14px;
  color: ${(props: ThemeProps) => props.theme.colors.text.secondary};
  margin-bottom: 8px;
`;

const InputContainer = styled.View<ThemeProps>`
  flex-direction: row;
  align-items: center;
  border-width: 1px;
  border-color: ${(props: ThemeProps) => props.theme.colors.border};
  border-radius: ${(props: ThemeProps) => props.theme.borderRadius.sm}px;
  height: 48px;
  padding: 0 16px;
`;

const Input = styled.TextInput<ThemeProps>`
  flex: 1;
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
  font-size: 16px;
`;

const AvatarContainer = styled.View<ThemeProps>`
  align-items: center;
  margin-bottom: 24px;
`;

const Avatar = styled.View<ThemeProps>`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  background-color: ${(props: ThemeProps) => `${props.theme.colors.primary}15`};
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
`;

const AvatarText = styled.Text<ThemeProps>`
  font-size: 40px;
  color: ${(props: ThemeProps) => props.theme.colors.primary};
`;

const ChangePhotoButton = styled.TouchableOpacity<ThemeProps>`
  padding: 8px 16px;
  background-color: ${(props: ThemeProps) => props.theme.colors.primary};
  border-radius: ${(props: ThemeProps) => props.theme.borderRadius.sm}px;
`;

const ChangePhotoText = styled.Text`
  color: white;
  font-size: 14px;
  font-weight: bold;
`;

const SaveButton = styled.TouchableOpacity<ThemeProps>`
  margin: 16px;
  padding: 16px;
  background-color: ${(props: ThemeProps) => props.theme.colors.primary};
  border-radius: ${(props: ThemeProps) => props.theme.borderRadius.md}px;
  align-items: center;
`;

const SaveButtonText = styled.Text`
  color: white;
  font-size: 16px;
  font-weight: bold;
`;

export default function ProfileScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    address: '123 Main St, City, Country',
    bio: 'Experienced administrator with a passion for environmental sustainability.'
  });

  const handleBack = () => {
    router.back();
  };

  const handleSave = () => {
    // Handle save logic here
    console.log('Saving profile:', profile);
  };

  return (
    <Container style={{ paddingTop: insets.top }} theme={theme}>
      <Header theme={theme}>
        <BackButton onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </BackButton>
        <HeaderTitle theme={theme}>Profile Information</HeaderTitle>
      </Header>

      <Content>
        <FormSection theme={theme}>
          <AvatarContainer theme={theme}>
            <Avatar theme={theme}>
              <AvatarText theme={theme}>JD</AvatarText>
            </Avatar>
            <ChangePhotoButton theme={theme}>
              <ChangePhotoText>Change Photo</ChangePhotoText>
            </ChangePhotoButton>
          </AvatarContainer>

          <FormTitle theme={theme}>Personal Information</FormTitle>
          <InputGroup>
            <Label theme={theme}>First Name</Label>
            <InputContainer theme={theme}>
              <Input
                theme={theme}
                value={profile.firstName}
                onChangeText={(text: string) => setProfile({ ...profile, firstName: text })}
                placeholder="Enter your first name"
                placeholderTextColor={theme.colors.text.secondary}
              />
            </InputContainer>
          </InputGroup>

          <InputGroup>
            <Label theme={theme}>Last Name</Label>
            <InputContainer theme={theme}>
              <Input
                theme={theme}
                value={profile.lastName}
                onChangeText={(text: string) => setProfile({ ...profile, lastName: text })}
                placeholder="Enter your last name"
                placeholderTextColor={theme.colors.text.secondary}
              />
            </InputContainer>
          </InputGroup>

          <InputGroup>
            <Label theme={theme}>Email</Label>
            <InputContainer theme={theme}>
              <Input
                theme={theme}
                value={profile.email}
                onChangeText={(text: string) => setProfile({ ...profile, email: text })}
                placeholder="Enter your email"
                placeholderTextColor={theme.colors.text.secondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </InputContainer>
          </InputGroup>

          <InputGroup>
            <Label theme={theme}>Phone Number</Label>
            <InputContainer theme={theme}>
              <Input
                theme={theme}
                value={profile.phone}
                onChangeText={(text: string) => setProfile({ ...profile, phone: text })}
                placeholder="Enter your phone number"
                placeholderTextColor={theme.colors.text.secondary}
                keyboardType="phone-pad"
              />
            </InputContainer>
          </InputGroup>

          <InputGroup>
            <Label theme={theme}>Address</Label>
            <InputContainer theme={theme}>
              <Input
                theme={theme}
                value={profile.address}
                onChangeText={(text: string) => setProfile({ ...profile, address: text })}
                placeholder="Enter your address"
                placeholderTextColor={theme.colors.text.secondary}
              />
            </InputContainer>
          </InputGroup>

          <InputGroup>
            <Label theme={theme}>Bio</Label>
            <InputContainer theme={theme}>
              <Input
                theme={theme}
                value={profile.bio}
                onChangeText={(text: string) => setProfile({ ...profile, bio: text })}
                placeholder="Enter your bio"
                placeholderTextColor={theme.colors.text.secondary}
                multiline
                numberOfLines={4}
              />
            </InputContainer>
          </InputGroup>
        </FormSection>

        <SaveButton theme={theme} onPress={handleSave}>
          <SaveButtonText>Save Changes</SaveButtonText>
        </SaveButton>
      </Content>
    </Container>
  );
} 