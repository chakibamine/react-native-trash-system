import MapComponent from '@/components/MapComponent';
import TrashList from '@/components/ui/TrashList';
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';


export default function ExploreScreen() {
  // List of trash locations with coordinates
  const trashLocations = [
    { location: "AV HASSAN 2", status: "empty", coordinates: [31.6295, -7.9811] },
    { location: "AV Mohamed V", status: "full", coordinates: [31.6305, -7.9821] },
    { location: "AV HASSAN 2", status: "empty", coordinates: [31.6285, -7.9801] },
  ];

  // State to track the selected trash location
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Define default center coordinates
  const defaultCenter = [31.6295, -7.9811];

  return (
    <View style={styles.container}>
      {/* Map View */}
      <MapComponent
        selectedLocation={selectedLocation} 
        defaultCenter={defaultCenter} 
        trashLocations={trashLocations} 
      />

      {/* Trash List at the Bottom */}
      <TrashList
        trashLocations={trashLocations} 
        setSelectedLocation={setSelectedLocation} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});