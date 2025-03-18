import { Dimensions, Platform, StatusBar } from "react-native";
import Animated from "react-native-reanimated";
import styled from "styled-components/native";
import { Theme } from "./theme";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;
const MIN_TRANSLATE_Y = -SCREEN_HEIGHT * 0.2;

interface StyledProps {
  theme: Theme;
}

interface StatusProps extends StyledProps {
  status: string;
}

export const Container = styled(Animated.View)<StyledProps>`
  height: ${SCREEN_HEIGHT}px;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background};
  position: absolute;
  top: ${SCREEN_HEIGHT}px;
  border-top-left-radius: ${({ theme }) => theme.borderRadius.xl}px;
  border-top-right-radius: ${({ theme }) => theme.borderRadius.xl}px;
  elevation: 8;
  shadow-color: ${({ theme }) => theme.colors.shadow.color};
  shadow-offset: 0px -4px;
  shadow-opacity: ${({ theme }) => theme.colors.shadow.opacity};
  shadow-radius: 8px;
  padding-top: ${Platform.OS === 'android' ? StatusBar.currentHeight : 0}px;
`;

export const HandleContainer = styled.View<StyledProps>`
  width: 100%;
  height: 20px;
  align-items: center;
  justify-content: center;
`;

export const Handle = styled.View<StyledProps>`
  width: 40px;
  height: 4px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  background-color: ${({ theme }) => theme.colors.border};
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

export const Header = styled.View<StyledProps>`
  padding: ${({ theme }) => theme.spacing.lg}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

export const Title = styled.Text<StyledProps>`
  font-size: ${({ theme }) => theme.typography.title.fontSize}px;
  font-weight: ${({ theme }) => theme.typography.title.fontWeight};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

export const Subtitle = styled.Text<StyledProps>`
  font-size: ${({ theme }) => theme.typography.subtitle.fontSize}px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const ListContainer = styled(Animated.ScrollView)<StyledProps>`
  flex: 1;
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;
`;

export const TrashItem = styled.TouchableOpacity<StyledProps>`
  flex-direction: row;
  align-items: center;
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

export const IconContainer = styled.View<StyledProps>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.surface};
  justify-content: center;
  align-items: center;
  margin-right: ${({ theme }) => theme.spacing.md}px;
`;

export const ContentContainer = styled.View<StyledProps>`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-right: ${({ theme }) => theme.spacing.sm}px;
`;

export const LocationText = styled.Text<StyledProps>`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  font-weight: ${({ theme }) => theme.typography.body.fontWeight};
  color: ${({ theme }) => theme.colors.text.primary};
  flex: 1;
  margin-right: ${({ theme }) => theme.spacing.sm}px;
`;

export const StatusBadge = styled.View<StatusProps>`
  padding-horizontal: ${({ theme }) => theme.spacing.sm}px;
  padding-vertical: ${({ theme }) => theme.spacing.xs}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  background-color: ${({ theme, status }) =>
    status === 'empty'
      ? theme.colors.status.empty.background
      : theme.colors.status.full.background};
`;

export const StatusText = styled.Text<StatusProps>`
  font-size: ${({ theme }) => theme.typography.caption.fontSize}px;
  font-weight: ${({ theme }) => theme.typography.caption.fontWeight};
  color: ${({ theme, status }) =>
    status === 'empty'
      ? theme.colors.status.empty.text
      : theme.colors.status.full.text};
`;

export const BottomSpacing = styled.View<StyledProps>`
  height: ${({ theme }) => theme.spacing.xl}px;
`;