import React from 'react';
import { WebView } from 'react-native-webview';

const MapComponent = ({ selectedLocation, defaultCenter, trashLocations }) => {
  return (
    <WebView
      originWhitelist={['*']}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      source={{
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
              <title>Marrakech Trash Map</title>
              <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
              <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
              <style>
                body { margin: 0; padding: 0; }
                #map { width: 100vw; height: 100vh; }
              </style>
            </head>
            <body>
              <div id="map"></div>
              <script>
                // Initialize map
                const defaultCenter = ${JSON.stringify(defaultCenter)};
                const selectedCenter = ${JSON.stringify(selectedLocation ? selectedLocation.coordinates : defaultCenter)};

                const map = L.map('map').setView(selectedCenter, 13);

                // Add OpenStreetMap tiles
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  maxZoom: 19,
                  attribution: '© OpenStreetMap contributors'
                }).addTo(map);

                // Add markers for all trash locations
                const locations = ${JSON.stringify(trashLocations)};
                locations.forEach(location => {
                  L.marker([location.coordinates[0], location.coordinates[1]])
                    .addTo(map)
                    .bindPopup(\`<b>\${location.location}</b><br>Status: \${location.status}\`);
                });

                // If a specific location is selected, zoom to it
                if (${!!selectedLocation}) {
                  map.setView([${selectedLocation?.coordinates[0]}, ${selectedLocation?.coordinates[1]}], 15);
                }
              </script>
            </body>
          </html>
        `,
      }}
    />
  );
};

export default MapComponent;