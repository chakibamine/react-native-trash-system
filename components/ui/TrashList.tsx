import React, { useCallback, useEffect } from 'react';
import { Dimensions, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useTheme } from '@/assets/style/ThemeProvider';
import { BottomSpacing, Container, ContentContainer, Handle, HandleContainer, Header, IconContainer, ListContainer, LocationText, StatusBadge, StatusText, Subtitle, Title, TrashItem } from '@/assets/style/TrashList';

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
const INITIAL_POSITION = (MAX_TRANSLATE_Y + MIN_TRANSLATE_Y) / 2;

const TrashList: React.FC<TrashListProps> = ({ trashLocations, setSelectedLocation }) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const translateY = useSharedValue(INITIAL_POSITION);
  const active = useSharedValue(true);

  const scrollTo = useCallback((destination: number) => {
    'worklet';
    active.value = destination !== MIN_TRANSLATE_Y;
    translateY.value = withSpring(destination, { damping: 50 });
  }, []);

  useEffect(() => {
    // Set initial position when component mounts
    scrollTo(INITIAL_POSITION);
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