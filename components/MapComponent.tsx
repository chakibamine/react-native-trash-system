import React, { useEffect, useRef } from 'react';
import { WebView } from 'react-native-webview';

const MapComponent = ({ selectedLocation, defaultCenter, trashLocations }) => {
  const webViewRef = useRef(null);

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
                #map { width: 100vw; height: 100vh; }
              </style>
            </head>
            <body>
              <div id="map"></div>
              <script>
                const defaultCenter = ${JSON.stringify(defaultCenter)};
                const map = L.map('map').setView(defaultCenter, 13);

                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  maxZoom: 19,
                }).addTo(map);

                // Store markers with their coordinates
                const markers = [];
                const locations = ${JSON.stringify(trashLocations)};
                locations.forEach(loc => {
                  const marker = L.marker([loc.coordinates[0], loc.coordinates[1]])
                    .addTo(map)
                    .bindPopup(\`<b>\${loc.location}</b><br>Status: \${loc.status}\`);
                  marker.coordinates = loc.coordinates; // Add coordinates as a property
                  markers.push(marker);
                });

                // Listen for messages from React Native
                document.addEventListener('message', (event) => {
                  const message = JSON.parse(event.data);
                  if (message.type === 'navigateToLocation') {
                    const selectedCoordinates = message.location.coordinates;
                    // Find the matching marker
                    const marker = markers.find(m => 
                      m.coordinates[0] === selectedCoordinates[0] && 
                      m.coordinates[1] === selectedCoordinates[1]
                    );
                    if (marker) {
                      marker.openPopup(); // Open the popup
                      map.setView(selectedCoordinates, 15); // Pan and zoom
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