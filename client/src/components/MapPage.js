import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, HeatmapLayer } from '@react-google-maps/api';

const mapContainerStyle = {
  height: '400px',
  width: '800px'
};

const center = {
  lat: -34.397,
  lng: 150.644
};

const libraries = ['visualization'];
const SIZE_OF_FILE = 304401;

function MapPage() {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [center, setCenter] = useState({ lat: -34.397, lng: 150.644 });
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const data = [
    { lat: -34.397, lng: 150.644, weight: 0.5 },
    { lat: -34.392, lng: 150.644, weight: 1 },
    { lat: -34.398, lng: 150.64, weight: 0.3 }
  ];

  const heatmapData = {
    positions: data,
    options: {
      radius: 20,
      opacity: 0.6
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      () => alert('Unable to retrieve your location')
    );
  }, []);

  useEffect(() => {
    if (latitude !== 0 && longitude !== 0) {
      measureAndSendNetworkData();
    }
  }, [latitude, longitude]);

  function measureAndSendNetworkData() {
    const startTime = new Date().getTime();
    const endpoint = 'http://localhost:5000/static/test.pdf'; // Path to a small binary file to measure download speed

    axios
      .get(endpoint, { responseType: 'blob', crossDomain: true })
      .then((response) => {
        const endTime = new Date().getTime();
        const duration = (endTime - startTime) / 1000; // Total time taken for the request in seconds
        const bitsLoaded = SIZE_OF_FILE * 8; // Convert loaded bytes into bits
        const speedBps = (bitsLoaded / duration).toFixed(2); // Speed in bits per second
        const speedKbps = (speedBps / 1024).toFixed(2); // Speed in kilobits per second
        const speedMbps = (speedKbps / 1024).toFixed(2); // Speed in megabits per second

        console.log(`Network Speed: ${speedMbps} Mbps`);

        // Send calculated speed data to your backend
        console.log('Latitude:', latitude, 'Longitude: ', longitude);
        axios
          .post('http://localhost:5000/api/network', {
            location: {
              type: 'Point',
              coordinates: [longitude, latitude]
            },
            speed: speedMbps,
            timestamp: new Date()
          })
          .then((response) => console.log('Network speed data sent'))
          .catch((error) =>
            console.error('Failed to send network data', error)
          );
      })
      .catch((error) =>
        console.error('Failed to download file for speed test', error)
      );
  }

  const createHeatmapData = () => {
    return heatmapData.positions.map((pos) => ({
      location: new window.google.maps.LatLng(pos.lat, pos.lng),
      weight: pos.weight
    }));
  };

  return (
    <LoadScript
      googleMapsApiKey='AIzaSyAf3mPgz4fxt39EwD5LnKIqgg96QGx8UUw'
      libraries={libraries}
      onLoad={() => setIsMapLoaded(true)}
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={16}
      >
        {isMapLoaded && (
          <HeatmapLayer
            data={createHeatmapData()}
            options={heatmapData.options}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
}

export default MapPage;
