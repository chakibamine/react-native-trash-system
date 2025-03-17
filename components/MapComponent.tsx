import React, { useEffect, useRef } from 'react';
import { WebView } from 'react-native-webview';

interface Location {
  location: string;
  status: string;
  coordinates: [number, number];
}

interface MapComponentProps {
  selectedLocation: Location | null;
  defaultCenter: [number, number];
  trashLocations: Location[];
}

const MapComponent: React.FC<MapComponentProps> = ({ selectedLocation, defaultCenter, trashLocations }) => {
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

  return (
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
                #map { 
                  width: 100vw; 
                  height: 100vh;
                  z-index: 1;
                }
                .custom-popup .leaflet-popup-content-wrapper {
                  background: rgba(255, 255, 255, 0.95);
                  border-radius: 12px;
                  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                }
                .custom-popup .leaflet-popup-content {
                  margin: 12px;
                  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                }
                .popup-title {
                  font-size: 14px;
                  font-weight: 600;
                  color: #1a1a1a;
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
                  background: #e6f4ea;
                  color: #1e8e3e;
                }
                .status-full {
                  background: #fce8e6;
                  color: #d93025;
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

                L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                  maxZoom: 19,
                  attribution: '&copy; OpenStreetMap contributors'
                }).addTo(map);

                const createCustomIcon = (status) => {
                  return L.divIcon({
                    className: 'custom-marker',
                    html: \`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="16" cy="16" r="14" fill="\${status === 'empty' ? '#34A853' : '#EA4335'}" fill-opacity="0.2"/>
                      <circle cx="16" cy="16" r="8" fill="\${status === 'empty' ? '#34A853' : '#EA4335'}"/>
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
  );
};

export default MapComponent;