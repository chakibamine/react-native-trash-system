import React, { useState, useRef } from 'react';
import styled from 'styled-components/native';
import { useTheme } from '@/assets/style/ThemeProvider';
import { Theme } from '@/assets/style/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

  // State for menu toggle
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // State for trash locations
  const [trashLocations, setTrashLocations] = useState<Location[]>([
    { location: "City Center", status: "empty", coordinates: [31.6295, -7.9811] },
    { location: "Train Station", status: "full", coordinates: [31.6295, -7.9821] },
  ]);

  // State for selected location and location selection
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);
  const formUpdateRef = useRef<((coordinates: [number, number]) => void) | null>(null);

  // Default map center coordinates
  const defaultCenter: [number, number] = [31.6295, -7.9811];

  // Function to add a new trash location
  const handleAddTrash = (newTrash: Location) => {
    setTrashLocations((prevLocations) => [...prevLocations, newTrash]);
    
  };

  // Function to start location selection
  const handleStartLocationSelect = (updateFormCoordinates: (coordinates: [number, number]) => void) => {
    formUpdateRef.current = updateFormCoordinates;
    setIsSelectingLocation(true);
  };

  // Function to handle location selection
  const handleLocationSelect = (coordinates: [number, number]) => {
    if (formUpdateRef.current) {
      formUpdateRef.current(coordinates);
      formUpdateRef.current = null;
    }
    setIsSelectingLocation(false);
  };

  // Toggle menu function
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <AdminLayout
      currentRoute="/admin/trash-bins"
      isOpen={isMenuOpen}
      onToggleMenu={toggleMenu}
    >
      <Container style={{ paddingTop: insets.top }}>
        {/* Header */}
        <Header>
          <MenuButton onPress={toggleMenu} accessibilityLabel="Open Menu">
            <Ionicons
              name="menu"
              size={24}
              color={theme.colors.text.primary}
            />
          </MenuButton>
          <Title>Manage Trash Bins</Title>
        </Header>

        {/* Map and Trash List */}
        <MapContainer>
          <MapWithTrashList
            selectedLocation={selectedLocation}
            defaultCenter={defaultCenter}
            trashLocations={trashLocations}
            isDarkMode={theme.colors.background === '#121212'}
            isSelectingLocation={isSelectingLocation}
            onLocationSelect={handleLocationSelect}
            onAddTrash={handleAddTrash}
            onStartLocationSelect={handleStartLocationSelect}
            setSelectedLocation={setSelectedLocation}
          />
        </MapContainer>
      </Container>
    </AdminLayout>
  );
}

// Reusable MapWithTrashList Component
interface MapWithTrashListProps {
  selectedLocation: Location | null;
  defaultCenter: [number, number];
  trashLocations: Location[];
  isDarkMode: boolean;
  isSelectingLocation: boolean;
  onLocationSelect: (coordinates: [number, number]) => void;
  onAddTrash: (newTrash: Location) => void;
  onStartLocationSelect: (updateFormCoordinates: (coordinates: [number, number]) => void) => void;
  setSelectedLocation: (location: Location | null) => void;
}

const MapWithTrashList: React.FC<MapWithTrashListProps> = ({
  selectedLocation,
  defaultCenter,
  trashLocations,
  isDarkMode,
  isSelectingLocation,
  onLocationSelect,
  onAddTrash,
  onStartLocationSelect,
  setSelectedLocation,
}) => {
  return (
    <>
      <MapComponent
        selectedLocation={selectedLocation}
        defaultCenter={defaultCenter}
        trashLocations={trashLocations}
        isDarkMode={isDarkMode}
        isSelectingLocation={isSelectingLocation}
        onLocationSelect={onLocationSelect}
      />
      <TrashList
        trashLocations={trashLocations}
        setSelectedLocation={setSelectedLocation}
        onAddTrash={onAddTrash}
        isSelectingLocation={isSelectingLocation}
        onStartLocationSelect={onStartLocationSelect}
        onLocationSelect={onLocationSelect}
      />
    </>
  );
};