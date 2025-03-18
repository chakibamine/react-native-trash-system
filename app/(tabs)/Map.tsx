import MapComponent from '@/components/MapComponent';
import TrashList from '@/components/ui/TrashList';
import React, { useState, useRef } from 'react';
import styled from 'styled-components/native';
import { useTheme } from '@/assets/style/ThemeProvider';
import { Theme } from '@/assets/style/theme';

const Container = styled.View<{ theme: Theme }>`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

interface Location {
  location: string;
  status: string;
  coordinates: [number, number];
}

export default function MapScreen() {
  const { theme, isDarkMode } = useTheme();
  
  // List of trash locations with coordinates
  const [trashLocations, setTrashLocations] = useState<Location[]>([
    { location: "City Center", status: "empty", coordinates: [31.6295, -7.9811] },
    { location: "Train Station", status: "full", coordinates: [31.6295, -7.9821] },
  ]);

  // State to track the selected trash location
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isSelectingLocation, setIsSelectingLocation] = useState(false);

  // Define default center coordinates
  const defaultCenter: [number, number] = [31.6295, -7.9811];

  const formUpdateRef = useRef<((coordinates: [number, number]) => void) | null>(null);

  const handleAddTrash = (newTrash: Location) => {
    setTrashLocations(prevLocations => [...prevLocations, newTrash]);
  };

  const handleStartLocationSelect = (updateFormCoordinates: (coordinates: [number, number]) => void) => {
    formUpdateRef.current = updateFormCoordinates;
    setIsSelectingLocation(true);
  };

  const handleLocationSelect = (coordinates: [number, number]) => {
    if (formUpdateRef.current) {
      formUpdateRef.current(coordinates);
      formUpdateRef.current = null;
    }
    setIsSelectingLocation(false);
  };

  return (
    <Container>
      <MapComponent
        selectedLocation={selectedLocation}
        defaultCenter={defaultCenter}
        trashLocations={trashLocations}
        isDarkMode={isDarkMode}
        isSelectingLocation={isSelectingLocation}
        onLocationSelect={handleLocationSelect}
      />
      <TrashList
        trashLocations={trashLocations}
        setSelectedLocation={setSelectedLocation}
        onAddTrash={handleAddTrash}
        isSelectingLocation={isSelectingLocation}
        onStartLocationSelect={handleStartLocationSelect}
        onLocationSelect={handleLocationSelect}
      />
    </Container>
  );
}