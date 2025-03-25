import React, { useState } from 'react';
import styled from 'styled-components/native';
import { useTheme } from '@/assets/style/ThemeProvider';
import { Theme } from '@/assets/style/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import MapComponent from '@/components/MapComponent';
import TrashList from '@/components/ui/TrashList';
import AdminLayout from '../../components/AdminLayout';

// Define prop types for styled components
type ThemeProps = {
  theme: Theme;
};

// Styled components
const Container = styled.View<ThemeProps>`
  flex: 1;
  background-color: ${(props: ThemeProps) => props.theme.colors.background};
`;

const Header = styled.View<ThemeProps>`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  background-color: ${(props: ThemeProps) => props.theme.colors.surface};
  border-bottom-width: 1px;
  border-bottom-color: ${(props: ThemeProps) => props.theme.colors.border};
`;

const MenuButton = styled.TouchableOpacity`
  padding: 8px;
  margin-right: 8px;
`;

const Title = styled.Text<ThemeProps>`
  font-size: 20px;
  font-weight: bold;
  color: ${(props: ThemeProps) => props.theme.colors.text.primary};
  flex: 1;
`;

const MapContainer = styled.View`
  flex: 1;
`;

interface Location {
  location: string;
  status: string;
  coordinates: [number, number];
}

export default function TrashBinsScreen() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // List of trash locations with coordinates - Real locations in Morocco
  const [trashLocations, setTrashLocations] = useState<Location[]>([
    { 
      location: "Jamaa el-Fnaa",
      status: "empty",
      coordinates: [31.6258, -7.9891]
    },
    { 
      location: "Marrakech Train Station",
      status: "full",
      coordinates: [31.6294, -8.0108]
    },
    { 
      location: "Menara Mall",
      status: "empty",
      coordinates: [31.6177, -8.0129]
    },
    { 
      location: "Koutoubia Mosque",
      status: "full",
      coordinates: [31.6242, -7.9892]
    },
    { 
      location: "Majorelle Garden",
      status: "empty",
      coordinates: [31.6417, -7.9889]
    }
  ]);

  // State to track the selected trash location
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);

  // Define default center coordinates (Centered on Marrakech city center)
  const defaultCenter: [number, number] = [31.6295, -7.9811];

  const handleAddTrash = (newTrash: Location) => {
    setTrashLocations(prevLocations => [...prevLocations, newTrash]);
  };

  const handleStartLocationSelect = (updateFormCoordinates: (coordinates: [number, number]) => void) => {
    setIsSelectingLocation(true);
  };

  const handleLocationSelect = (coordinates: [number, number]) => {
    setIsSelectingLocation(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  return (
    <AdminLayout 
      currentRoute="/admin/trash-bins"
      isOpen={isMenuOpen}
      onToggleMenu={toggleMenu}
    >
      <Container style={{ paddingTop: insets.top }}>
        <Header>
          <MenuButton onPress={toggleMenu}>
            <Ionicons
              name="menu"
              size={24}
              color={theme.colors.text.primary}
            />
          </MenuButton>
          <Title>Manage Trash Bins</Title>
        </Header>

        <MapContainer>
          <MapComponent
            selectedLocation={selectedLocation}
            defaultCenter={defaultCenter}
            trashLocations={trashLocations}
            isDarkMode={theme.colors.background === '#121212'}
            isSelectingLocation={isSelectingLocation}
            onLocationSelect={handleLocationSelect}
            theme={theme}
          />
          <TrashList
            trashLocations={trashLocations}
            setSelectedLocation={setSelectedLocation}
            onAddTrash={handleAddTrash}
            isSelectingLocation={isSelectingLocation}
            onStartLocationSelect={handleStartLocationSelect}
            onLocationSelect={handleLocationSelect}
          />
        </MapContainer>
      </Container>
    </AdminLayout>
  );
} 