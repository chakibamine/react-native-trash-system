import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Location {
  location: string;
  status: string;
  coordinates: [number, number];
}

interface TrashListProps {
  trashLocations: Location[];
  setSelectedLocation: (location: Location) => void;
}

const TrashList: React.FC<TrashListProps> = ({ trashLocations, setSelectedLocation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Trash Locations</Text>
        <Text style={styles.subtitle}>{trashLocations.length} locations found</Text>
      </View>
      
      <ScrollView style={styles.listContainer} showsVerticalScrollIndicator={false}>
        {trashLocations.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedLocation(item)}
            style={styles.trashItem}
          >
            <View style={styles.iconContainer}>
              <Ionicons 
                name={item.status === "empty" ? "trash-outline" : "trash"} 
                size={24} 
                color={item.status === "empty" ? "#34A853" : "#EA4335"}
              />
            </View>
            
            <View style={styles.contentContainer}>
              <Text style={styles.locationText}>{item.location}</Text>
              <View style={[
                styles.statusBadge,
                item.status === "empty" ? styles.emptyStatus : styles.fullStatus
              ]}>
                <Text style={[
                  styles.statusText,
                  item.status === "empty" ? styles.emptyStatusText : styles.fullStatusText
                ]}>
                  {item.status.toUpperCase()}
                </Text>
              </View>
            </View>

            <Ionicons name="chevron-forward" size={20} color="#A0A0A0" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '40%',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2024',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#666666',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  trashItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 8,
  },
  locationText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2024',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  emptyStatus: {
    backgroundColor: '#E6F4EA',
  },
  fullStatus: {
    backgroundColor: '#FCE8E6',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  emptyStatusText: {
    color: '#34A853',
  },
  fullStatusText: {
    color: '#EA4335',
  },
});

export default TrashList;