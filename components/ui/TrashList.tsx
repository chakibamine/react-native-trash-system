// TrashList Component
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, Platform, StatusBar, TextInput, View, TouchableOpacity } from 'react-native';
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
import { Theme } from '@/assets/style/theme';
import { BottomSpacing, Container, ContentContainer, Handle, HandleContainer, Header, IconContainer, ListContainer, LocationText, StatusBadge, StatusText, Subtitle, Title, TrashItem } from '@/assets/style/TrashList';
import styled from 'styled-components/native';

const HeaderContent = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;
const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;
const AddButton = styled.TouchableOpacity`
  padding: 8px;
  margin-left: 12px;
`;
const FormContainer = styled.View<{ theme: Theme }>`
  padding: 20px;
`;
const FormText = styled.Text<{ theme: Theme }>`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  margin-bottom: 8px;
`;
const LocationDisplay = styled.View<{ theme: Theme }>`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 12px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  margin-bottom: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
const LocationCoordinates = styled.Text<{ theme: Theme }>`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
`;
const Input = styled.TextInput<{ theme: Theme }>`
  background-color: ${({ theme }) => theme.colors.surface};
  padding: 12px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
`;
const ButtonContainer = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
`;
const Button = styled.TouchableOpacity<{ theme: Theme; variant?: 'primary' | 'secondary' }>`
  padding: 12px 20px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  background-color: ${({ theme, variant }) => 
    variant === 'primary' ? theme.colors.primary : 'transparent'};
`;
const ButtonText = styled.Text<{ theme: Theme; variant?: 'primary' | 'secondary' }>`
  color: ${({ theme, variant }) => 
    variant === 'primary' ? '#FFFFFF' : theme.colors.text.primary};
  font-weight: 600;
`;
const StatusSelector = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 16px;
`;

interface Location {
  location: string;
  status: string;
  coordinates: [number, number];
}

interface TrashListProps {
  trashLocations: Location[];
  setSelectedLocation: (location: Location) => void;
  onAddTrash?: (newTrash: Location) => void;
  isSelectingLocation?: boolean;
  onStartLocationSelect?: (updateFormCoordinates: (coordinates: [number, number]) => void) => void;
  onLocationSelect?: (coordinates: [number, number]) => void;
  onScrollTo?: (destination: number) => void; 
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;
const MIN_TRANSLATE_Y = -SCREEN_HEIGHT * 0.2;
const INITIAL_POSITION = (MAX_TRANSLATE_Y + MIN_TRANSLATE_Y) / 2;

const TrashList: React.FC<TrashListProps> = ({
  trashLocations,
  setSelectedLocation,
  onAddTrash,
  isSelectingLocation,
  onStartLocationSelect,
  onLocationSelect,
  onScrollTo, // Destructure the new prop
}) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const translateY = useSharedValue(INITIAL_POSITION);
  const active = useSharedValue(true);
  const [isAddingTrash, setIsAddingTrash] = useState(false);
  const [formData, setFormData] = useState({
    location: '',
    status: 'empty',
    coordinates: [31.6295, -7.9811] as [number, number],
  });

  const scrollTo = useCallback((destination: number) => {
    'worklet';
    active.value = destination !== MIN_TRANSLATE_Y;
    translateY.value = withSpring(destination, { damping: 50 });
  }, []);

  useEffect(() => {
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

  const handleAddTrash = () => {
    if (formData.location.trim() && onAddTrash) {
      onAddTrash(formData);
      setIsAddingTrash(false);
      setFormData({
        location: '',
        status: 'empty',
        coordinates: [31.6295, -7.9811],
      });
      scrollTo(MIN_TRANSLATE_Y);
    }

  };

  const handleCancel = () => {
    setIsAddingTrash(false);
    setFormData({
      location: '',
      status: 'empty',
      coordinates: [31.6295, -7.9811],
    });
  };

  const updateFormCoordinates = (coordinates: [number, number]) => {
    setFormData((prev) => ({ ...prev, coordinates }));
  };

  const handleStartLocationSelection = () => {
    if (onStartLocationSelect) {
      onStartLocationSelect(updateFormCoordinates);
    }
  };

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Container style={rBottomSheetStyle}>
        <HandleContainer>
          <Handle />
        </HandleContainer>
        <Header>
          <HeaderContent>
            <TitleContainer>
              <Title>Trash Locations</Title>
            </TitleContainer>
            <AddButton onPress={() => setIsAddingTrash(true)}>
              <Ionicons
                name="add-circle"
                size={32}
                color={theme.colors.primary}
                style={{ opacity: 0.9 }}
              />
            </AddButton>
          </HeaderContent>
          {!isAddingTrash && <Subtitle>{trashLocations.length} locations found</Subtitle>}
        </Header>
        {isAddingTrash ? (
          <FormContainer>
            <Input
              placeholder="Location Name"
              value={formData.location}
              onChangeText={(text: string) => setFormData({ ...formData, location: text })}
              placeholderTextColor={theme.colors.text.secondary}
            />
            <FormText>Location</FormText>
            <LocationDisplay>
              <LocationCoordinates>
                {formData.coordinates[0].toFixed(4)}, {formData.coordinates[1].toFixed(4)}
              </LocationCoordinates>
              <Button onPress={() => {handleStartLocationSelection(), scrollTo(MIN_TRANSLATE_Y)}}>
                <ButtonText>Select on Map</ButtonText>
              </Button>
            </LocationDisplay>
            <StatusSelector>
              <Button
                variant={formData.status === 'empty' ? 'primary' : 'secondary'}
                onPress={() => setFormData({ ...formData, status: 'empty' })}
              >
                <ButtonText variant={formData.status === 'empty' ? 'primary' : 'secondary'}>
                  Empty
                </ButtonText>
              </Button>
              <Button
                variant={formData.status === 'full' ? 'primary' : 'secondary'}
                onPress={() => setFormData({ ...formData, status: 'full' })}
              >
                <ButtonText variant={formData.status === 'full' ? 'primary' : 'secondary'}>
                  Full
                </ButtonText>
              </Button>
            </StatusSelector>
            <ButtonContainer>
              <Button onPress={handleCancel}>
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button variant="primary" onPress={() => {handleAddTrash(), scrollTo(MIN_TRANSLATE_Y)}}>
                <ButtonText variant="primary">Add</ButtonText>
              </Button>
            </ButtonContainer>
          </FormContainer>
        ) : (
          <ListContainer
            showsVerticalScrollIndicator={true}
            bounces={true}
            scrollEventThrottle={16}
          >
            {trashLocations.map((item, index) => (
              <TrashItem
                key={index}
                onPress={() => {setSelectedLocation(item), scrollTo(MIN_TRANSLATE_Y)}}
                activeOpacity={0.7}
              >
                <IconContainer>
                  <Ionicons
                    name={item.status === 'empty' ? 'trash-outline' : 'trash'}
                    size={24}
                    color={item.status === 'empty' ? theme.colors.primary : theme.colors.secondary}
                  />
                </IconContainer>
                <ContentContainer>
                  <LocationText>{item.location}</LocationText>
                  <StatusBadge status={item.status}>
                    <StatusText status={item.status}>{item.status.toUpperCase()}</StatusText>
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
        )}
      </Container>
    </PanGestureHandler>
  );
};

export default TrashList;