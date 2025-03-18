import { ImageBackground, Text, TextInput, TouchableOpacity, View, ActivityIndicator, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { Theme } from './theme';

interface StyledProps {
  theme: Theme;
}

interface NavTextProps extends StyledProps {
  isActive: boolean;
}

interface InputProps extends StyledProps {
  placeholder?: string;
}

interface TextAreaProps extends StyledProps {
  placeholder?: string;
}

interface OTPInputProps extends StyledProps {
  placeholder?: string;
}

interface ErrorTextProps extends StyledProps {
  visible?: boolean;
}

interface LoadingSpinnerProps extends StyledProps {
  size?: 'small' | 'large';
}

export const Button = styled(TouchableOpacity)<StyledProps>`
  background-color: ${(props: StyledProps) => props.theme.colors.primary};
  padding: 10px 20px;
  border-radius: 5px;
  align-items: center;
`;

export const Background = styled(ImageBackground)<StyledProps>`
  flex: 1;
  justify-content: center;
  padding: 20px;
  background-color: ${(props: StyledProps) => props.theme.colors.background};
`;

export const Container = styled(View)<StyledProps>`
  background-color: ${(props: StyledProps) => props.theme.colors.surface};
  border-radius: 10px;
  padding: 20px;
`;

export const HelloText = styled(Text)<StyledProps>`
  font-size: 30px;
  font-weight: bold;
  text-align: left;
  margin-bottom: 15px;
  margin-top: 100px;
  color: ${(props: StyledProps) => props.theme.colors.text.primary};
`;

export const CreateAccont = styled(Text)<StyledProps>`
  font-size: 30px;
  font-weight: bold;
  text-align: left;
  margin-bottom: 15px;
  color: ${(props: StyledProps) => props.theme.colors.text.primary};
`;

export const TitleText = styled(Text)<StyledProps>`
  font-size: 32px;
  font-weight: bold;
  color: ${(props: StyledProps) => props.theme.colors.primary};
  text-align: left;
  margin-bottom: 20px;
`;

export const InfoText = styled(Text)<StyledProps>`
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  color: ${(props: StyledProps) => props.theme.colors.text.primary};
`;

export const Input = styled(TextInput)<InputProps>`
  background-color: ${(props: StyledProps) => props.theme.colors.surface};
  color: ${(props: StyledProps) => props.theme.colors.text.primary};
  padding: 10px;
  border-radius: 5px;
  border-width: 1px;
  border-color: ${(props: StyledProps) => props.theme.colors.border};
`;

export const TextArea = styled(TextInput)<TextAreaProps>`
  background-color: ${(props: StyledProps) => props.theme.colors.surface};
  color: ${(props: StyledProps) => props.theme.colors.text.primary};
  padding: 10px;
  border-radius: 5px;
  border-width: 1px;
  border-color: ${(props: StyledProps) => props.theme.colors.border};
  height: 100px;
  text-align-vertical: top;
`;

export const OTPInput = styled(TextInput)<OTPInputProps>`
  width: 50px;
  height: 50px;
  border-width: 1px;
  border-radius: 5px;
  text-align: center;
  font-size: 20px;
  background-color: ${(props: StyledProps) => props.theme.colors.surface};
  color: ${(props: StyledProps) => props.theme.colors.text.primary};
  border-color: ${(props: StyledProps) => props.theme.colors.border};
`;

export const ButtonText = styled(Text)`
  color: #FFFFFF;
  font-weight: bold;
`;

export const FooterText = styled(Text)<StyledProps>`
  margin-top: 20px;
  color: ${(props: StyledProps) => props.theme.colors.text.secondary};
  text-align: center;
`;

export const SignUpText = styled(Text)<StyledProps>`
  color: ${(props: StyledProps) => props.theme.colors.primary};
  font-weight: bold;
`;

export const Nav = styled(View)<StyledProps>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px 0;
  background-color: ${(props: StyledProps) => props.theme.colors.surface};
  border-top-color: ${(props: StyledProps) => props.theme.colors.border};
  border-top-width: 1px;
  border-radius: 20px;
  justify-content: space-around;
  flex-direction: row;
`;

export const NavItem = styled(TouchableOpacity)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const NavText = styled(Text)<NavTextProps>`
  color: ${(props: NavTextProps) =>
    props.isActive ? props.theme.colors.primary : props.theme.colors.text.primary};
  font-size: 18px;
  font-weight: ${(props: NavTextProps) => (props.isActive ? 'bold' : 'normal')};
`;

export const ActiveDot = styled(View)<{ isActive: boolean } & StyledProps>`
  width: 5px;
  height: 5px;
  background-color: ${(props: { isActive: boolean } & StyledProps) =>
    props.isActive ? props.theme.colors.primary : 'transparent'};
  border-radius: 50%;
  margin-top: 5px;
`;

export const ErrorText = styled(Text)<ErrorTextProps>`
  color: ${(props: StyledProps) => props.theme.colors.secondary};
  font-size: 12px;
  margin-top: 5px;
  display: ${(props: ErrorTextProps) => (props.visible ? 'flex' : 'none')};
`;

export const LoadingSpinner = styled(ActivityIndicator)<LoadingSpinnerProps>`
  color: ${(props: StyledProps) => props.theme.colors.primary};
  size: ${(props: LoadingSpinnerProps) => props.size || 'small'};
`;

export const Header = styled(View)<StyledProps>`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props: StyledProps) => props.theme.colors.border};
`;

export const Title = styled(Text)<StyledProps>`
  font-size: 20px;
  font-weight: bold;
  color: ${(props: StyledProps) => props.theme.colors.text.primary};
  margin-left: 16px;
`;

export const UserCard = styled(View)<StyledProps>`
  background-color: ${(props: StyledProps) => props.theme.colors.surface};
  border-radius: 8px;
  padding: 16px;
  border-width: 1px;
  border-color: ${(props: StyledProps) => props.theme.colors.border};
`;

export const UserInfo = styled(View)`
  gap: 4px;
`;

export const Username = styled(Text)<StyledProps>`
  font-size: 18px;
  font-weight: bold;
  color: ${(props: StyledProps) => props.theme.colors.text.primary};
`;

export const Email = styled(Text)<StyledProps>`
  font-size: 14px;
  color: ${(props: StyledProps) => props.theme.colors.text.secondary};
`;

export const PhoneNumber = styled(Text)<StyledProps>`
  font-size: 14px;
  color: ${(props: StyledProps) => props.theme.colors.text.secondary};
`;

export const StatusBadge = styled(View)<{ isActive: boolean } & StyledProps>`
  background-color: ${(props: { isActive: boolean } & StyledProps) =>
    props.isActive ? props.theme.colors.primary : props.theme.colors.surface};
  padding: 4px 8px;
  border-radius: 4px;
  border-width: 1px;
  border-color: ${(props: { isActive: boolean } & StyledProps) =>
    props.isActive ? props.theme.colors.primary : props.theme.colors.border};
`;

export const StatusText = styled(Text)<{ isActive: boolean } & StyledProps>`
  color: ${(props: { isActive: boolean } & StyledProps) =>
    props.isActive ? '#FFFFFF' : props.theme.colors.text.primary};
  font-size: 12px;
  font-weight: bold;
`;

export const ActionButton = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  border-radius: 4px;
  background-color: ${(props: StyledProps) => props.theme.colors.surface};
  border-width: 1px;
  border-color: ${(props: StyledProps) => props.theme.colors.border};
`;

export const ActionButtonText = styled(Text)<StyledProps>`
  color: ${(props: StyledProps) => props.theme.colors.primary};
  font-size: 14px;
  font-weight: bold;
`;

export const FormContainer = styled(ScrollView)<StyledProps>`
  padding: 16px;
`;

export const SwitchContainer = styled(View)<StyledProps>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
`;

export const Label = styled(Text)<StyledProps>`
  font-size: 16px;
  color: ${(props: StyledProps) => props.theme.colors.text.primary};
`;

export const SubmitButton = styled(TouchableOpacity)<StyledProps>`
  background-color: ${(props: StyledProps) => props.theme.colors.primary};
  padding: 16px;
  border-radius: 8px;
  align-items: center;
  margin-top: 24px;
`;

export const SubmitButtonText = styled(Text)<StyledProps>`
  color: #FFFFFF;
  font-size: 16px;
  font-weight: bold;
`;