import React, { useEffect, useRef } from 'react';
import { WebView } from 'react-native-webview';
import styled from 'styled-components/native';
import { Theme } from '@/assets/style/theme';

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
}

const MapContainer = styled.View<{ theme: Theme }>`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const MapComponent: React.FC<MapComponentProps> = ({ 
  selectedLocation, 
  defaultCenter, 
  trashLocations,
  isDarkMode 
}) => {
  const webViewRef = useRef<WebView | null>(null);

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

  return (
    <MapContainer>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        javaScriptEnabled={true}
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
                    }
                  });
                </script>
              </body>
            </html>
          `,
        }}
      />
    </MapContainer>
  );
};

export default MapComponent;