import MapComponent from '@/components/MapComponent';
import TrashList from '@/components/ui/TrashList';
import React, { useState } from 'react';
import styled from 'styled-components/native';
import { useTheme } from '@/assets/style/ThemeProvider';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

interface Location {
  location: string;
  status: string;
  coordinates: [number, number];
}

export default function MapScreen() {
  const { theme } = useTheme();
  
  // List of trash locations with coordinates
  const trashLocations: Location[] = [
    { location: "AV HASSAN 2", status: "empty", coordinates: [31.6295, -7.9811] },
    { location: "AV Mohamed V", status: "full", coordinates: [31.6305, -7.9821] },
    { location: "AV HASSAN 2", status: "empty", coordinates: [31.6285, -7.9801] },
  ];

  // State to track the selected trash location
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  // Define default center coordinates
  const defaultCenter: [number, number] = [31.6295, -7.9811];

  return (
    <Container>
      <MapComponent
        selectedLocation={selectedLocation}
        defaultCenter={defaultCenter}
        trashLocations={trashLocations}
        isDarkMode={theme.isDark}
      />
      <TrashList
        trashLocations={trashLocations}
        setSelectedLocation={setSelectedLocation}
      />
    </Container>
  );
}