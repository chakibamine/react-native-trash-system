// MapComponent
import React, { useEffect, useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import styled from 'styled-components/native';
import { Theme } from '@/assets/style/theme';
import * as Location from 'expo-location';
import { Alert, Platform, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Location {
  location: string;
  status: string;
  coordinates: [number, number];
}

interface MapComponentProps {
  selectedLocation: Location | null;
  defaultCenter: [number, number];
  trashLocations: Location[];
  isDarkMode: boolean;
  isSelectingLocation?: boolean;
  onLocationSelect?: (coordinates: [number, number]) => void;
}

const MapContainer = styled.View<{ theme: Theme }>`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const SelectionMessage = styled.View<{ theme: Theme }>`
  position: absolute;
  top: 16px;
  left: 16px;
  right: 16px;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 12px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  flex-direction: row;
  align-items: center;
  elevation: 4;
  shadow-color: ${({ theme }) => theme.colors.shadow.color};
  shadow-offset: 0px 2px;
  shadow-opacity: ${({ theme }) => theme.colors.shadow.opacity};
  shadow-radius: 4px;
`;

const SelectionText = styled.Text<{ theme: Theme }>`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.body.fontSize}px;
  margin-left: 8px;
  flex: 1;
`;

const LocationButton = styled.TouchableOpacity<{ theme: Theme }>`
  position: absolute;
  bottom: 100px;
  right: 16px;
  background-color: ${({ theme }) => theme.colors.background};
  width: 44px;
  height: 44px;
  border-radius: 22px;
  justify-content: center;
  align-items: center;
  elevation: 4;
  shadow-color: ${({ theme }) => theme.colors.shadow.color};
  shadow-offset: 0px 2px;
  shadow-opacity: ${({ theme }) => theme.colors.shadow.opacity};
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

const MapComponent: React.FC<MapComponentProps> = ({
  selectedLocation,
  defaultCenter,
  trashLocations,
  isDarkMode,
  isSelectingLocation = false,
  onLocationSelect,
}) => {
  const webViewRef = useRef<WebView | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isGpsEnabled, setIsGpsEnabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const locationCheckInterval = useRef<NodeJS.Timeout | null>(null);

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
    locationCheckInterval.current = setInterval(async () => {
      const isEnabled = await checkLocationServices();
      if (isEnabled) {
        clearInterval(locationCheckInterval.current!);
        setIsLoading(false);
        initializeLocationTracking();
      }
    }, 1000);
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
        android:
          'Please swipe down to access Quick Settings and tap the Location icon to enable GPS.',
      }),
      [
        {
          text: 'OK, I\'ll Enable',
          onPress: () => {
            startLocationCheck();
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => setIsLoading(false),
        },
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
      const locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10000,
          distanceInterval: 10,
        },
        (location) => {
          const newLocation: [number, number] = [
            location.coords.latitude,
            location.coords.longitude,
          ];
          setUserLocation(newLocation);
          if (webViewRef.current) {
            webViewRef.current.postMessage(
              JSON.stringify({
                type: 'updateUserLocation',
                location: newLocation,
              })
            );
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
    if (userLocation && webViewRef.current) {
      webViewRef.current.postMessage(
        JSON.stringify({
          type: 'centerOnUserLocation',
          location: userLocation,
        })
      );
    }
  };

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;
    (async () => {
      const isEnabled = await checkLocationServices();
      if (isEnabled) {
        locationSubscription = await initializeLocationTracking();
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
    if (webViewRef.current && selectedLocation) {
      webViewRef.current.postMessage(
        JSON.stringify({
          type: 'navigateToLocation',
          location: selectedLocation,
        })
      );
    }
  }, [selectedLocation]);

  const darkMapStyle = `
    filter: brightness(0.8) invert(1) contrast(3) hue-rotate(200deg) saturate(0.3) brightness(0.7);
  `;

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'mapClick' && isSelectingLocation && onLocationSelect) {
        onLocationSelect([data.lat, data.lng]);
      }
    } catch (error) {
      console.error('Error handling message:', error);
    }
  };

  return (
    <MapContainer>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        onMessage={handleMessage}
        source={{
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Map</title>
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
                <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
                <style>
                  body {
                    margin: 0;
                    padding: 0;
                    background-color: ${isDarkMode ? '#121212' : '#FFFFFF'};
                  }
                  #map { 
                    width: 100vw; 
                    height: 100vh;
                    z-index: 1;
                    ${isDarkMode ? darkMapStyle : ''}
                  }
                  .custom-popup .leaflet-popup-content-wrapper {
                    background: ${isDarkMode ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, ${isDarkMode ? '0.3' : '0.1'});
                  }
                  .custom-popup .leaflet-popup-content {
                    margin: 12px;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                  }
                  .popup-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: ${isDarkMode ? '#FFFFFF' : '#1a1a1a'};
                    margin-bottom: 4px;
                  }
                  .popup-status {
                    font-size: 12px;
                    padding: 4px 8px;
                    border-radius: 12px;
                    display: inline-block;
                    margin-top: 4px;
                  }
                  .status-empty {
                    background: ${isDarkMode ? '#1B3329' : '#e6f4ea'};
                    color: ${isDarkMode ? '#4CAF50' : '#1e8e3e'};
                  }
                  .status-full {
                    background: ${isDarkMode ? '#3B1F1F' : '#fce8e6'};
                    color: ${isDarkMode ? '#F44336' : '#d93025'};
                  }
                  .leaflet-control-zoom {
                    border: none !important;
                    background-color: ${isDarkMode ? '#1E1E1E' : '#FFFFFF'} !important;
                  }
                  .leaflet-control-zoom a {
                    color: ${isDarkMode ? '#FFFFFF' : '#1a1a1a'} !important;
                    background-color: ${isDarkMode ? '#1E1E1E' : '#FFFFFF'} !important;
                  }
                  .leaflet-control-attribution {
                    background-color: ${isDarkMode ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)'} !important;
                    color: ${isDarkMode ? '#B3B3B3' : '#666666'} !important;
                  }
                  .user-location-pulse {
                    border-radius: 50%;
                    height: 16px;
                    width: 16px;
                    background: ${isDarkMode ? '#4285F4' : '#1A73E8'};
                    box-shadow: 0 0 0 rgba(26, 115, 232, 0.4);
                    animation: pulse 2s infinite;
                  }
                  @keyframes pulse {
                    0% {
                      box-shadow: 0 0 0 0 rgba(26, 115, 232, 0.4);
                    }
                    70% {
                      box-shadow: 0 0 0 20px rgba(26, 115, 232, 0);
                    }
                    100% {
                      box-shadow: 0 0 0 0 rgba(26, 115, 232, 0);
                    }
                  }
                  .user-location-button {
                    transition: transform 0.2s ease;
                  }
                  .user-location-button:active {
                    transform: scale(0.95);
                  }
                  .map-selecting {
                    cursor: crosshair !important;
                  }
                  .map-selecting * {
                    cursor: crosshair !important;
                  }
                  .temp-marker-icon {
                    animation: bounce 0.5s infinite alternate;
                  }
                  @keyframes bounce {
                    from {
                      transform: translateY(0);
                    }
                    to {
                      transform: translateY(-10px);
                    }
                  }
                </style>
              </head>
              <body>
                <div id="map"></div>
                <script>
                  const defaultCenter = ${JSON.stringify(defaultCenter)};
                  const map = L.map('map', {
                    zoomControl: true,
                    scrollWheelZoom: true,
                  }).setView(defaultCenter, 14);
                  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/${
                    isDarkMode ? 'dark_all' : 'voyager'
                  }/{z}/{x}/{y}{r}.png', {
                    maxZoom: 19,
                    attribution: '&copy; OpenStreetMap contributors'
                  }).addTo(map);
                  let userMarker = null;
                  let userAccuracyCircle = null;
                  let tempMarker = null;
                  function updateUserLocation(coords) {
                    const latlng = L.latLng(coords[0], coords[1]);
                    if (!userMarker) {
                      userMarker = L.divIcon({
                        className: 'user-location-pulse',
                        iconSize: [16, 16],
                      });
                      L.marker(latlng, {
                        icon: userMarker,
                        zIndexOffset: 1000
                      }).addTo(map);
                    } else {
                      userMarker.setLatLng(latlng);
                    }
                  }
                  const createCustomIcon = (status) => {
                    const colors = {
                      empty: {
                        fill: '${isDarkMode ? '#4CAF50' : '#34A853'}',
                        fillOpacity: ${isDarkMode ? '0.3' : '0.2'}
                      },
                      full: {
                        fill: '${isDarkMode ? '#F44336' : '#EA4335'}',
                        fillOpacity: ${isDarkMode ? '0.3' : '0.2'}
                      }
                    };
                    return L.divIcon({
                      className: 'custom-marker',
                      html: \`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="16" cy="16" r="14" fill="\${colors[status].fill}" fill-opacity="\${colors[status].fillOpacity}"/>
                        <circle cx="16" cy="16" r="8" fill="\${colors[status].fill}"/>
                      </svg>\`,
                      iconSize: [32, 32],
                      iconAnchor: [16, 16]
                    });
                  };
                  const markers = [];
                  const locations = ${JSON.stringify(trashLocations)};
                  locations.forEach(loc => {
                    const marker = L.marker([loc.coordinates[0], loc.coordinates[1]], {
                      icon: createCustomIcon(loc.status)
                    }).addTo(map);
                    const popupContent = \`
                      <div class="popup-title">\${loc.location}</div>
                      <div class="popup-status \${loc.status === 'empty' ? 'status-empty' : 'status-full'}">
                        \${loc.status.charAt(0).toUpperCase() + loc.status.slice(1)}
                      </div>
                    \`;
                    marker.bindPopup(popupContent, {
                      className: 'custom-popup',
                      closeButton: false,
                      offset: [0, -8]
                    });
                    marker.coordinates = loc.coordinates;
                    markers.push(marker);
                  });
                  map.on('click', function(e) {
                    if (${isSelectingLocation}) {
                      if (tempMarker) {
                        map.removeLayer(tempMarker);
                      }
                      const tempIcon = L.divIcon({
                        className: 'temp-marker-icon',
                        html: \`<svg width="32" height="48" viewBox="0 0 32 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M16 0C7.16 0 0 7.16 0 16C0 28 16 48 16 48C16 48 32 28 32 16C32 7.16 24.84 0 16 0ZM16 22C12.68 22 10 19.32 10 16C10 12.68 12.68 10 16 10C19.32 10 22 12.68 22 16C22 19.32 19.32 22 16 22Z" 
                          fill="${isDarkMode ? '#4CAF50' : '#34A853'}"
                          fill-opacity="0.9"/>
                        </svg>\`,
                        iconSize: [32, 48],
                        iconAnchor: [16, 48]
                      });
                      tempMarker = L.marker([e.latlng.lat, e.latlng.lng], {
                        icon: tempIcon
                      }).addTo(map);
                      window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'mapClick',
                        lat: e.latlng.lat,
                        lng: e.latlng.lng
                      }));
                    }
                  });
                  document.addEventListener('message', (event) => {
                    const message = JSON.parse(event.data);
                    if (message.type === 'navigateToLocation') {
                      const selectedCoordinates = message.location.coordinates;
                      const marker = markers.find(m => 
                        m.coordinates[0] === selectedCoordinates[0] && 
                        m.coordinates[1] === selectedCoordinates[1]
                      );
                      if (marker) {
                        map.flyTo(selectedCoordinates, 16, {
                          duration: 1,
                          easeLinearity: 0.25
                        });
                        marker.openPopup();
                      }
                    } else if (message.type === 'updateUserLocation') {
                      updateUserLocation(message.location);
                    } else if (message.type === 'centerOnUserLocation') {
                      const coords = message.location;
                      map.flyTo(coords, 17, {
                        duration: 1,
                        easeLinearity: 0.25
                      });
                    }
                  });
                </script>
              </body>
            </html>
          `,
        }}
      />
      {isSelectingLocation && (
        <SelectionMessage>
          <Ionicons
            name="location"
            size={24}
            color={isDarkMode ? '#4CAF50' : '#34A853'}
          />
          <SelectionText>
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
    </MapContainer>
  );
};

export default MapComponent;