import { ImageBackground, Text, TextInput, TouchableOpacity, View } from 'react-native';

import styled from 'styled-components';
export const Button = styled(TouchableOpacity)`
  background-color: ${(props:any) => props.theme.primary};
  padding-vertical: 15px;
  border-radius: 5px;
  width: 100%;
  align-items: center;
`;

export const Background = styled(ImageBackground)`
  flex: 1;
  justify-content: center;
  padding: 20px;
  background-color: ${(props:any) => props.theme.background};
`;

export const Container = styled(View)`
  background-color: ${(props:any) => props.theme.container};
  border-radius: 10px;
  padding: 20px;
`;

export const HelloText = styled(Text)`
  font-size: 30px;
  font-weight: bold;
  text-align: left;
  margin-bottom: 15px;
  margin-top: 100px;
  color: ${(props:any) => props.theme.text};
`;
export const CreateAccont = styled(Text)`
  font-size: 30px;
  font-weight: bold;
  text-align: left;
  margin-bottom: 15px;
  color: ${(props:any) => props.theme.text};
`;

export const TitleText = styled(Text)`
  font-size: 32px;
  font-weight: bold;
  color: ${(props:any) => props.theme.primary};
  text-align: left;
  margin-bottom: 20px;
`;

export const InfoText = styled(Text)`
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  color: ${(props:any) => props.theme.text};
`;

export const Input = styled(TextInput)`
  width: 100%;
  height: 50px;
  border-color: ${(props:any) => props.theme.secondary};
  border-width: 1px;
  border-radius: 5px;
  padding-horizontal: 10px;
  margin-bottom: 15px;
  color: ${(props:any) => props.theme.text};
`;


export const OTPInput = styled(TextInput)`
  width: 60px; /* Adjust the width as needed */
  height: 50px;
  border-color: ${(props) => props.theme.secondary};
  border-width: 1px;
  border-radius: 5px;
  padding-horizontal: 10px;
  margin-bottom: 15px;
  color: ${(props) => props.theme.text};
  text-align: center; /* Center the text within the input field */
  font-size: 24px; /* Increase font size for better visibility */
`;

export const ButtonText = styled(Text)`
  color: #FFFFFF;
  font-weight: bold;
`;

export const FooterText = styled(Text)`
  margin-top: 20px;
  color: ${(props:any) => props.theme.secondary};
  text-align: center;
`;

export const SignUpText = styled(Text)`
  color: ${(props:any) => props.theme.primary};
  font-weight: bold;
`;

export const Nav = styled(View)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px 0;
  background-color: ${(props) => props.theme.container};
  border-top-color: ${(props) => props.theme.secondary};
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

export const NavText = styled(Text)<{ isActive: boolean }>`
  color: ${(props) =>
    props.isActive ? props.theme.primary : props.theme.text};
  font-size: 18px;
  font-weight: ${(props) => (props.isActive ? 'bold' : 'normal')};
`;

export const ActiveDot = styled(View)<{ isActive: boolean }>`
  width: 5px;
  height: 5px;
  background-color: ${(props) =>
    props.isActive ? props.theme.primary : 'transparent'};
  border-radius: 50%;
  margin-top: 5px;
`;