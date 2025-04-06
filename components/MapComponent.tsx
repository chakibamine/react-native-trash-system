import React, { useEffect, useRef, useState, useMemo } from 'react';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import styled from 'styled-components/native';
import { Theme, DefaultTheme } from 'styled-components';
import * as Location from 'expo-location';
import { Alert, Platform, TouchableOpacity, ActivityIndicator, TextInput, Keyboard, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import debounce from 'lodash/debounce';

interface Location {
  location: string;
  status: string;
  coordinates: [number, number];
}

interface SearchResult {
  display_name: string;
  lat: number;
  lon: number;
}

interface MapComponentProps {
  selectedLocation: Location | null;
  defaultCenter: [number, number];
  trashLocations: Location[];
  isDarkMode: boolean;
  isSelectingLocation?: boolean;
  onLocationSelect?: (coordinates: [number, number]) => void;
  theme: Theme;
  onTrashSelect?: (location: Location) => void;
}

interface CustomTheme extends DefaultTheme {
  colors: {
    background: string;
    surface: string;
    text: {
      primary: string;
      secondary: string;
    };
  };
}

interface StyledProps {
  theme: Theme;
}

const MapContainer = styled.View<StyledProps>`
  flex: 1;
  background-color: ${({ theme }: StyledProps) => theme.colors.background};
  position: relative;
  width: 100%;
  height: 100%;
`;

const SelectionMessage = styled.View<StyledProps>`
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  background-color: ${({ theme }: StyledProps) => theme.colors.surface};
  padding: 12px;
  border-radius: 12px;
  flex-direction: row;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
`;

const SelectionText = styled.Text<StyledProps>`
  margin-left: 8px;
  font-size: 14px;
  color: ${({ theme }: StyledProps) => theme.colors.text.primary};
`;

const LocationButton = styled.TouchableOpacity<StyledProps>`
  position: absolute;
  bottom: 100px;
  right: 16px;
  background-color: ${({ theme }: StyledProps) => theme.colors.background};
  width: 44px;
  height: 44px;
  border-radius: 22px;
  justify-content: center;
  align-items: center;
  elevation: 4;
  shadow-color: ${({ theme }: StyledProps) => theme.colors.shadow?.color || '#000'};
  shadow-offset: 0px 2px;
  shadow-opacity: ${({ theme }: StyledProps) => theme.colors.shadow?.opacity || 0.25};
  shadow-radius: 4px;
`;

const LoadingContainer = styled.View`
  position: absolute;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
`;

const SearchContainer = styled.View<StyledProps>`
  position: absolute;
  top: 16px;
  left: 16px;
  right: 16px;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }: StyledProps) => theme.colors.background};
  padding: 0 12px;
  border-radius: 8px;
  border-width: 1px;
  border-color: ${({ theme }: StyledProps) => theme.colors.border || '#ccc'};
  elevation: 4;
  shadow-color: ${({ theme }: StyledProps) => theme.colors.shadow?.color || '#000'};
  shadow-offset: 0px 2px;
  shadow-opacity: ${({ theme }: StyledProps) => theme.colors.shadow?.opacity || 0.25};
  shadow-radius: 4px;
  z-index: 1000;
`;

const SearchInput = styled.TextInput<StyledProps>`
  flex: 1;
  height: 40px;
  color: ${({ theme }: StyledProps) => theme.colors.text.primary};
  font-size: 16px;
  padding: 0 8px;
`;

const ClearButton = styled.TouchableOpacity`
  padding: 8px;
`;

const SearchResultsContainer = styled.ScrollView.attrs<StyledProps>(({ theme }: StyledProps) => ({
  contentContainerStyle: {
    padding: 0
  }
}))<StyledProps>`
  position: absolute;
  top: 64px;
  left: 16px;
  right: 16px;
  max-height: 200px;
  background-color: ${({ theme }: StyledProps) => theme.colors.background};
  border-radius: 8px;
  border-width: 1px;
  border-color: ${({ theme }: StyledProps) => theme.colors.border || '#ccc'};
  elevation: 4;
  shadow-color: ${({ theme }: StyledProps) => theme.colors.shadow?.color || '#000'};
  shadow-offset: 0px 2px;
  shadow-opacity: ${({ theme }: StyledProps) => theme.colors.shadow?.opacity || 0.25};
  shadow-radius: 4px;
  z-index: 1000;
`;

const SearchResultItem = styled.TouchableOpacity<StyledProps>`
  padding: 12px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }: StyledProps) => theme.colors.border || '#ccc'};
`;

const SearchResultText = styled.Text<StyledProps>`
  color: ${({ theme }: StyledProps) => theme.colors.text.primary};
  font-size: 14px;
`;

const LoadingIndicatorContainer = styled.View`
  padding: 12px;
  align-items: center;
  justify-content: center;
`;

const MapComponent: React.FC<MapComponentProps> = ({ 
  selectedLocation, 
  defaultCenter, 
  trashLocations,
  isDarkMode,
  isSelectingLocation = false,
  onLocationSelect,
  theme,
  onTrashSelect
}) => {
  const webViewRef = useRef<WebView>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isGpsEnabled, setIsGpsEnabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [mapError, setMapError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLocations, setFilteredLocations] = useState(trashLocations);
  const locationCheckInterval = useRef<NodeJS.Timeout | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  const checkLocationServices = async () => {
    try {
      const providerStatus = await Location.getProviderStatusAsync();
      setIsGpsEnabled(providerStatus.locationServicesEnabled);
      return providerStatus.locationServicesEnabled;
    } catch (error) {
      console.error('Error checking location services:', error);
      return false;
    }
  };

  const startLocationCheck = () => {
    setIsLoading(true);
    // Check every second if location has been enabled
    locationCheckInterval.current = setInterval(async () => {
      const isEnabled = await checkLocationServices();
      if (isEnabled) {
        clearInterval(locationCheckInterval.current!);
        initializeLocationTracking();
      }
    }, 1000);

    // Stop checking after 30 seconds
    setTimeout(() => {
      if (locationCheckInterval.current) {
        clearInterval(locationCheckInterval.current);
        setIsLoading(false);
      }
    }, 30000);
  };

  const handleLocationError = () => {
    Alert.alert(
      'Enable Location Services',
      Platform.select({
        ios: 'Please swipe up to access Control Center and tap the Location icon to enable GPS.',
        android: 'Please swipe down to access Quick Settings and tap the Location icon to enable GPS.',
      }),
      [
        { 
          text: 'OK, I\'ll Enable',
          onPress: () => {
            startLocationCheck();
          }
        },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => setIsLoading(false)
        }
      ]
    );
  };

  const initializeLocationTracking = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Needed',
          'Location permission is required to show your position on the map.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Start watching position
      const locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000,
          distanceInterval: 10,
        },
        (location) => {
          const newLocation: [number, number] = [
            location.coords.latitude,
            location.coords.longitude
          ];
          setUserLocation(newLocation);
          
          if (webViewRef && webViewRef.current) {
            webViewRef.current.postMessage(JSON.stringify({
              type: 'updateUserLocation',
              location: newLocation
            }));
          }
        }
      );

      return locationSubscription;
    } catch (error) {
      console.error('Error initializing location tracking:', error);
      return null;
    }
  };

  const centerOnUserLocation = async () => {
    const isEnabled = await checkLocationServices();
    
    if (!isEnabled) {
      handleLocationError();
      return;
    }

    if (userLocation && webViewRef && webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify({
        type: 'centerOnUserLocation',
        location: userLocation
      }));
    }
  };

  const searchLocations = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}+Marrakech&format=json&limit=5&accept-language=en&addressdetails=1`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'TrashBinApp/1.0' // Required by Nominatim's usage policy
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      try {
        const data = JSON.parse(text);
        setSearchResults(data);
      } catch (parseError) {
        console.error('Error parsing response:', text);
        throw parseError;
      }
    } catch (error) {
      console.error('Error searching locations:', error);
      Alert.alert(
        'Search Error',
        'Unable to search locations at this time. Please try again later.'
      );
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const debouncedSearch = debounce(searchLocations, 500);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    debouncedSearch(text);
  };

  const handleLocationSelect = (location: SearchResult) => {
    // Clear search results and query when an item is selected
    setSearchResults([]);
    setSearchQuery('');
    
    // Hide the TrashList by setting filteredLocations to empty
    setFilteredLocations([]);
    
    if (webViewRef && webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify({
        type: 'navigateToLocation',
        location: {
          coordinates: [location.lat.toString(), location.lon.toString()]
        }
      }));
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setFilteredLocations(trashLocations);
  };

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;

    (async () => {
      const isEnabled = await checkLocationServices();
      if (isEnabled) {
        const subscription = await initializeLocationTracking();
        if (subscription) {
          locationSubscription = subscription;
        }
      }
    })();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
      if (locationCheckInterval.current) {
        clearInterval(locationCheckInterval.current);
      }
    };
  }, []);

  useEffect(() => {
    if (webViewRef && webViewRef.current && selectedLocation) {
      webViewRef.current.postMessage(
        JSON.stringify({
          type: 'navigateToLocation',
          location: selectedLocation,
        })
      );
    }
  }, [selectedLocation]);

  useEffect(() => {
    setFilteredLocations(trashLocations);
    if (webViewRef && webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify({
        type: 'updateLocations',
        locations: trashLocations
      }));
    }
  }, [trashLocations]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredLocations(trashLocations);
      if (webViewRef && webViewRef.current) {
        webViewRef.current.postMessage(JSON.stringify({
          type: 'updateLocations',
          locations: trashLocations
        }));
      }
      return;
    }

    const filtered = trashLocations.filter(location =>
      location.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredLocations(filtered);

    if (webViewRef && webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify({
        type: 'updateLocations',
        locations: filtered
      }));
    }

    // If we have matches, center the map on the first result
    if (filtered.length > 0 && webViewRef && webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify({
        type: 'navigateToLocation',
        location: filtered[0],
      }));
    }
  }, [searchQuery, trashLocations]);

  const darkMapStyle = `
    filter: brightness(0.8) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7);
  `;

  // Memoize the map HTML to prevent unnecessary reloads
  const mapHtml = useMemo(() => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>Map</title>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          #map {
            width: 100%;
            height: 100%;
            background: #f8f9fa;
          }
          .navigation-marker {
            animation: pulse 1.5s infinite;
          }
          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.7; }
            100% { transform: scale(1); opacity: 1; }
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          let map;
          let markers = [];
          let userMarker = null;
          let userAccuracyCircle = null;
          let navigationMarker = null;

          function initMap() {
            map = L.map('map', {
              zoomControl: true,
              scrollWheelZoom: true,
            }).setView(${JSON.stringify(defaultCenter)}, 14);

            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/${
              isDarkMode ? 'dark_all' : 'voyager'
            }/{z}/{x}/{y}{r}.png', {
              maxZoom: 19,
              attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);

            // Add click handler for the map
            map.on('click', function(e) {
              if (${isSelectingLocation}) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'mapClick',
                  lat: e.latlng.lat,
                  lng: e.latlng.lng
                }));
              }
            });

            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'mapReady'
            }));
          }

          function updateMarkers(locations) {
            // Remove existing markers
            markers.forEach(marker => map.removeLayer(marker));
            markers = [];

            // Add new markers
            locations.forEach(loc => {
              const marker = L.marker([loc.coordinates[0], loc.coordinates[1]], {
                icon: L.divIcon({
                  className: 'trash-bin-marker',
                  html: \`<div style="
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: \${loc.status === 'empty' ? '#4CAF50' : '#F44336'};
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                  "></div>\`,
                  iconSize: [24, 24],
                  iconAnchor: [12, 12]
                })
              });

              marker.bindPopup(\`
                <div style="min-width: 150px; padding: 8px;">
                  <div style="font-weight: bold; margin-bottom: 4px;">\${loc.location}</div>
                  <div style="
                    display: inline-block;
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: 12px;
                    background: \${loc.status === 'empty' ? '#E8F5E9' : '#FFEBEE'};
                    color: \${loc.status === 'empty' ? '#2E7D32' : '#C62828'};
                  ">
                    \${loc.status.charAt(0).toUpperCase() + loc.status.slice(1)}
                  </div>
                </div>
              \`);

              marker.on('click', function() {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'trashClick',
                  lat: loc.coordinates[0],
                  lng: loc.coordinates[1]
                }));
              });

              marker.addTo(map);
              markers.push(marker);
            });
          }

          function updateUserLocation(coords) {
            const latlng = L.latLng(coords[0], coords[1]);
            
            if (!userMarker) {
              userMarker = L.marker(latlng, {
                icon: L.divIcon({
                  className: 'user-location-marker',
                  html: '<div style="background: #4285F4; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white;"></div>',
                  iconSize: [16, 16],
                  iconAnchor: [8, 8]
                })
              }).addTo(map);
            } else {
              userMarker.setLatLng(latlng);
            }

            if (!userAccuracyCircle) {
              userAccuracyCircle = L.circle(latlng, {
                radius: 50,
                color: '#4285F4',
                fillColor: '#4285F4',
                fillOpacity: 0.2
              }).addTo(map);
            } else {
              userAccuracyCircle.setLatLng(latlng);
            }
          }

          function navigateToLocation(location) {
            const coords = location.coordinates;
            
            // Remove existing navigation marker if any
            if (navigationMarker) {
              map.removeLayer(navigationMarker);
            }

            // Create and add new navigation marker
            navigationMarker = L.marker([coords[0], coords[1]], {
              icon: L.divIcon({
                className: 'navigation-marker',
                html: '<div style="background: #FF9800; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
              })
            }).addTo(map);

            // Center map on the location
            map.setView([coords[0], coords[1]], 16);

            // Add a popup with the location name
            navigationMarker.bindPopup(\`
              <div style="min-width: 150px; padding: 8px;">
                <div style="font-weight: bold; margin-bottom: 4px;">\${location.location || 'Selected Location'}</div>
                <div style="color: #666; font-size: 12px;">
                  \${coords[0].toFixed(6)}, \${coords[1].toFixed(6)}
                </div>
              </div>
            \`).openPopup();
          }

          document.addEventListener('DOMContentLoaded', initMap);

          document.addEventListener('message', function(event) {
            try {
              const message = JSON.parse(event.data);
              
              if (message.type === 'updateLocations') {
                updateMarkers(message.locations);
              } else if (message.type === 'updateUserLocation') {
                updateUserLocation(message.location);
              } else if (message.type === 'navigateToLocation') {
                navigateToLocation(message.location);
              }
            } catch (error) {
              console.error('Error handling message:', error);
            }
          });
        </script>
      </body>
    </html>
  `, [defaultCenter, isDarkMode, isSelectingLocation]);

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'mapReady') {
        setMapReady(true);
        setIsLoading(false);
        setMapError(null);
      } else if (data.type === 'error') {
        setMapError(data.message);
        setIsLoading(false);
      } else if (data.type === 'mapClick' && isSelectingLocation && onLocationSelect) {
        onLocationSelect([data.lat, data.lng]);
      } else if (data.type === 'trashClick' && onTrashSelect) {
        const clickedLocation = trashLocations.find(
          loc => loc.coordinates[0] === data.lat && loc.coordinates[1] === data.lng
        );
        if (clickedLocation) {
          onTrashSelect(clickedLocation);
        }
      }
    } catch (error) {
      console.error('Error handling message:', error);
      setMapError('Error processing map data');
    }
  };

  // Update locations only when map is ready
  useEffect(() => {
    if (mapReady && webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify({
        type: 'updateLocations',
        locations: filteredLocations
      }));
    }
  }, [filteredLocations, mapReady]);

  // Update user location only when map is ready
  useEffect(() => {
    if (mapReady && userLocation && webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify({
        type: 'updateUserLocation',
        location: userLocation
      }));
    }
  }, [userLocation, mapReady]);

  // Navigate to selected location only when map is ready
  useEffect(() => {
    if (mapReady && selectedLocation && webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify({
        type: 'navigateToLocation',
        location: selectedLocation
      }));
    }
  }, [selectedLocation, mapReady]);

  return (
    <MapContainer theme={theme}>
      <SearchContainer theme={theme}>
        <Ionicons
          name="search"
          size={20}
          color={isDarkMode ? '#FFFFFF' : '#000000'}
        />
        <SearchInput
          theme={theme}
          placeholder="Search any location in Marrakech..."
          placeholderTextColor={isDarkMode ? '#999999' : '#666666'}
          value={searchQuery}
          onChangeText={handleSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery ? (
          <ClearButton onPress={clearSearch}>
            <Ionicons
              name="close-circle"
              size={20}
              color={isDarkMode ? '#FFFFFF' : '#000000'}
            />
          </ClearButton>
        ) : null}
      </SearchContainer>

      {searchResults.length > 0 && (
        <SearchResultsContainer theme={theme}>
          {searchResults.map((result, index) => (
            <SearchResultItem
              key={`${result.lat}-${result.lon}`}
              theme={theme}
              onPress={() => handleLocationSelect(result)}
              style={index === searchResults.length - 1 ? { borderBottomWidth: 0 } : {}}
            >
              <SearchResultText theme={theme}>
                {result.display_name}
              </SearchResultText>
            </SearchResultItem>
          ))}
        </SearchResultsContainer>
      )}

      {isSearching && (
        <SearchResultsContainer theme={theme}>
          <LoadingIndicatorContainer>
            <ActivityIndicator color={theme.colors.text.primary} />
          </LoadingIndicatorContainer>
        </SearchResultsContainer>
      )}

      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        onMessage={handleMessage}
        source={{ html: mapHtml }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          setMapError(`WebView error: ${nativeEvent.description}`);
        }}
      />
      {isSelectingLocation && (
        <SelectionMessage theme={theme}>
          <Ionicons 
            name="location" 
            size={24} 
            color={isDarkMode ? '#4CAF50' : '#34A853'} 
          />
          <SelectionText theme={theme}>
            Tap anywhere on the map to select a location
          </SelectionText>
        </SelectionMessage>
      )}
      <LocationButton
        onPress={centerOnUserLocation}
        activeOpacity={0.8}
        disabled={isLoading}
      >
        <Ionicons 
          name="locate" 
          size={24} 
          color={isDarkMode ? '#FFFFFF' : '#000000'} 
        />
      </LocationButton>
      {isLoading && (
        <LoadingContainer>
          <ActivityIndicator size="large" color={isDarkMode ? '#FFFFFF' : '#000000'} />
        </LoadingContainer>
      )}
      {mapError && (
        <LoadingContainer>
          <Text style={{ color: isDarkMode ? '#FFFFFF' : '#000000', textAlign: 'center', margin: 20 }}>
            {mapError}
            {'\n'}
            <Text onPress={() => window.location.reload()} style={{ textDecorationLine: 'underline' }}>
              Tap to retry
            </Text>
          </Text>
        </LoadingContainer>
      )}
    </MapContainer>
  );
};

MapComponent.displayName = 'MapComponent';

export default MapComponent;