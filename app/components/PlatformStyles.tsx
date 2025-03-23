import { Platform } from 'react-native';
import styled from 'styled-components/native';
import { BlurView } from 'expo-blur';
import { Theme } from '@/assets/style/theme';

type ThemeProps = {
  theme: Theme;
};

// Platform-specific container
export const PlatformContainer = styled.View<ThemeProps>`
  flex: 1;
  background-color: ${(props: ThemeProps) => props.theme.colors.background};
`;

// Platform-specific header
export const PlatformHeader = styled.View<ThemeProps>`
  flex-direction: row;
  align-items: center;
  padding: ${Platform.OS === 'ios' ? '12px 16px' : '16px'};
  background-color: ${(props: ThemeProps) => 
    Platform.OS === 'ios' ? 'transparent' : props.theme.colors.surface};
  border-bottom-width: ${Platform.OS === 'ios' ? '0' : '1px'};
  border-bottom-color: ${(props: ThemeProps) => props.theme.colors.border};
`;

// Platform-specific blur header for iOS
export const PlatformBlurHeader = styled(BlurView)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
`;

// Platform-specific input
export const PlatformInput = styled.TextInput<ThemeProps>`
  height: ${Platform.OS === 'ios' ? '44px' : '48px'};
  padding: ${Platform.OS === 'ios' ? '8px 12px' : '8px 16px'};
  border-radius: ${(props: ThemeProps) => 
    Platform.OS === 'ios' ? '10' : props.theme.borderRadius.md}px;
  background-color: ${(props: ThemeProps) => 
    Platform.OS === 'ios' ? props.theme.colors.background + '80' : props.theme.colors.background};
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
  font-size: ${Platform.OS === 'ios' ? '15' : '16'}px;
`;

// Platform-specific button
export const PlatformButton = styled.TouchableOpacity<ThemeProps>`
  height: ${Platform.OS === 'ios' ? '44px' : '48px'};
  border-radius: ${(props: ThemeProps) => 
    Platform.OS === 'ios' ? '10' : props.theme.borderRadius.md}px;
  background-color: ${(props: ThemeProps) => props.theme.colors.primary};
  justify-content: center;
  align-items: center;
  padding: ${Platform.OS === 'ios' ? '0 16px' : '0 20px'};
`;

// Platform-specific text
export const PlatformText = styled.Text<ThemeProps>`
  font-size: ${Platform.OS === 'ios' ? '15' : '16'}px;
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
`;

// Platform-specific title
export const PlatformTitle = styled.Text<ThemeProps>`
  font-size: ${Platform.OS === 'ios' ? '20' : '22'}px;
  font-weight: ${Platform.OS === 'ios' ? '600' : 'bold'};
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
`;

// Platform-specific list item
export const PlatformListItem = styled.View<ThemeProps>`
  flex-direction: row;
  align-items: center;
  padding: ${Platform.OS === 'ios' ? '12px 16px' : '16px'};
  background-color: ${(props: ThemeProps) => props.theme.colors.surface};
  border-bottom-width: ${Platform.OS === 'ios' ? '0.5' : '1'}px;
  border-bottom-color: ${(props: ThemeProps) => 
    Platform.OS === 'ios' ? props.theme.colors.border + '80' : props.theme.colors.border};
`;

// Platform-specific avatar
export const PlatformAvatar = styled.Image`
  width: ${Platform.OS === 'ios' ? '40px' : '50px'};
  height: ${Platform.OS === 'ios' ? '40px' : '50px'};
  border-radius: ${Platform.OS === 'ios' ? '20' : '25'}px;
  margin-right: ${Platform.OS === 'ios' ? '10px' : '12px'};
`;

// Platform-specific search container
export const PlatformSearchContainer = styled.View<ThemeProps>`
  flex-direction: row;
  align-items: center;
  padding: ${Platform.OS === 'ios' ? '8px 16px' : '8px 16px'};
  background-color: ${(props: ThemeProps) => 
    Platform.OS === 'ios' ? 'transparent' : props.theme.colors.surface};
  border-bottom-width: ${Platform.OS === 'ios' ? '0' : '1px'};
  border-bottom-color: ${(props: ThemeProps) => props.theme.colors.border};
`;

// Platform-specific card
export const PlatformCard = styled.View<ThemeProps>`
  background-color: ${(props: ThemeProps) => props.theme.colors.surface};
  border-radius: ${(props: ThemeProps) => 
    Platform.OS === 'ios' ? '12' : props.theme.borderRadius.md}px;
  padding: ${Platform.OS === 'ios' ? '16px' : '20px'};
  margin: ${Platform.OS === 'ios' ? '8px 16px' : '10px 20px'};
  shadow-color: ${(props: ThemeProps) => props.theme.colors.text.primary};
  shadow-offset: ${Platform.OS === 'ios' ? '0 2px' : '0 4px'};
  shadow-opacity: ${Platform.OS === 'ios' ? '0.1' : '0.2'};
  shadow-radius: ${Platform.OS === 'ios' ? '4' : '8'}px;
  elevation: ${Platform.OS === 'ios' ? '0' : '4'};
`; 