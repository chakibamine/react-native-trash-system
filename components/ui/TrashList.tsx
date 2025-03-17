import React, { useCallback } from 'react';
import { Dimensions, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import styled from 'styled-components/native';
import { useTheme } from '@/assets/style/ThemeProvider';

interface Location {
  location: string;
  status: string;
  coordinates: [number, number];
}

interface TrashListProps {
  trashLocations: Location[];
  setSelectedLocation: (location: Location) => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;
const MIN_TRANSLATE_Y = -SCREEN_HEIGHT * 0.2;

const Container = styled(Animated.View)`
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

const HandleContainer = styled.View`
  width: 100%;
  height: 20px;
  align-items: center;
  justify-content: center;
`;

const Handle = styled.View`
  width: 40px;
  height: 4px;
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  background-color: ${({ theme }) => theme.colors.border};
  margin-top: ${({ theme }) => theme.spacing.sm}px;
`;

const Header = styled.View`
  padding: ${({ theme }) => theme.spacing.lg}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

const Title = styled.Text`
  font-size: ${({ theme }) => theme.typography.title.fontSize}px;
  font-weight: ${({ theme }) => theme.typography.title.fontWeight};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const Subtitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.subtitle.fontSize}px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ListContainer = styled(Animated.ScrollView)`
  flex: 1;
  padding-horizontal: ${({ theme }) => theme.spacing.lg}px;
`;

const TrashItem = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding-vertical: ${({ theme }) => theme.spacing.md}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

const IconContainer = styled.View`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.surface};
  justify-content: center;
  align-items: center;
  margin-right: ${({ theme }) => theme.spacing.md}px;
`;

const ContentContainer = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-right: ${({ theme }) => theme.spacing.sm}px;
`;

const LocationText = styled.Text`
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  font-weight: ${({ theme }) => theme.typography.body.fontWeight};
  color: ${({ theme }) => theme.colors.text.primary};
  flex: 1;
  margin-right: ${({ theme }) => theme.spacing.sm}px;
`;

const StatusBadge = styled.View<{ status: string }>`
  padding-horizontal: ${({ theme }) => theme.spacing.sm}px;
  padding-vertical: ${({ theme }) => theme.spacing.xs}px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  background-color: ${({ theme, status }) =>
    status === 'empty'
      ? theme.colors.status.empty.background
      : theme.colors.status.full.background};
`;

const StatusText = styled.Text<{ status: string }>`
  font-size: ${({ theme }) => theme.typography.caption.fontSize}px;
  font-weight: ${({ theme }) => theme.typography.caption.fontWeight};
  color: ${({ theme, status }) =>
    status === 'empty'
      ? theme.colors.status.empty.text
      : theme.colors.status.full.text};
`;

const BottomSpacing = styled.View`
  height: ${({ theme }) => theme.spacing.xl}px;
`;

const TrashList: React.FC<TrashListProps> = ({ trashLocations, setSelectedLocation }) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const translateY = useSharedValue(MIN_TRANSLATE_Y);
  const active = useSharedValue(false);

  const scrollTo = useCallback((destination: number) => {
    'worklet';
    active.value = destination !== MIN_TRANSLATE_Y;
    translateY.value = withSpring(destination, { damping: 50 });
  }, []);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      const newTranslateY = ctx.startY + event.translationY;
      translateY.value = Math.max(MAX_TRANSLATE_Y, Math.min(MIN_TRANSLATE_Y, newTranslateY));
    },
    onEnd: (event) => {
      if (event.velocityY < -500) {
        scrollTo(MAX_TRANSLATE_Y);
      } else if (event.velocityY > 500) {
        scrollTo(MIN_TRANSLATE_Y);
      } else {
        const shouldExpand = translateY.value < (MAX_TRANSLATE_Y + MIN_TRANSLATE_Y) / 2;
        if (shouldExpand) {
          scrollTo(MAX_TRANSLATE_Y);
        } else {
          scrollTo(MIN_TRANSLATE_Y);
        }
      }
    },
  });

  const rBottomSheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Container style={rBottomSheetStyle}>
        <HandleContainer>
          <Handle />
        </HandleContainer>

        <Header>
          <Title>Trash Locations</Title>
          <Subtitle>{trashLocations.length} locations found</Subtitle>
        </Header>

        <ListContainer
          showsVerticalScrollIndicator={true}
          bounces={true}
          scrollEventThrottle={16}
        >
          {trashLocations.map((item, index) => (
            <TrashItem
              key={index}
              onPress={() => setSelectedLocation(item)}
              activeOpacity={0.7}
            >
              <IconContainer>
                <Ionicons 
                  name={item.status === "empty" ? "trash-outline" : "trash"} 
                  size={24} 
                  color={item.status === "empty" ? theme.colors.primary : theme.colors.secondary}
                />
              </IconContainer>
              
              <ContentContainer>
                <LocationText>{item.location}</LocationText>
                <StatusBadge status={item.status}>
                  <StatusText status={item.status}>
                    {item.status.toUpperCase()}
                  </StatusText>
                </StatusBadge>
              </ContentContainer>

              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={theme.colors.text.secondary} 
              />
            </TrashItem>
          ))}
          <BottomSpacing />
        </ListContainer>
      </Container>
    </PanGestureHandler>
  );
};

export default TrashList;