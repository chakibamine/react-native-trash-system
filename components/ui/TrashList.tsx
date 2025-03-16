import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

const TrashList = ({ trashLocations, setSelectedLocation }) => {
  return (
    <View style={styles.listContainer}>
      {trashLocations.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => setSelectedLocation(item)}
          style={styles.trashItem}
        >
          <Text style={styles.locationText}>{item.location}</Text>
          <Text style={[styles.statusText, item.status === "empty" ? styles.emptyStatus : styles.fullStatus]}>
            {item.status}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    elevation: 5, // For Android shadow
    shadowColor: '#000', // For iOS shadow
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  trashItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  locationText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2024',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'normal',
  },
  emptyStatus: {
    color: '#2DCE17',
  },
  fullStatus: {
    color: '#CE1717',
  },
});

export default TrashList;