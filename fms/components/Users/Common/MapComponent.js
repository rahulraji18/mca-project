import React, { useEffect, useState } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";

const center = { lat: 8.5241, lng: 76.9366 }; // Default location - Trivandrum, Kerala

const MapComponent = ({ onMapClick, lat, lon }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCWED24ut0NZVXBKwkiynWByxmjj__fVcw", // Use your actual Google Maps API key
  });

  const [marker, setMarker] = useState({
    lat: lat || center.lat,
    lng: lon || center.lng,
  });

  useEffect(() => {
    // Update marker when lat/lon from input fields change
    if (lat && lon) {
      setMarker({ lat: parseFloat(lat), lng: parseFloat(lon) });
    } else {
      // Reset to default location if lat/lon is not set
      setMarker(center);
    }
  }, [lat, lon]);

  const handleMapClick = (event) => {
    const latitude = event.latLng.lat();
    const longitude = event.latLng.lng();
  
    // Update marker state
    setMarker({ lat: latitude, lng: longitude });
  
    // Propagate the click event to the parent component to update formData
    onMapClick({
      target: {
        name: "location", // Use a single name for location update
        value: { lat: latitude, lon: longitude }, // Send both lat and lon
      },
    });
  };
  

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      center={marker}
      zoom={12}
      mapContainerStyle={{ width: "100%", height: "400px" }}
      onClick={handleMapClick}
    >
      <Marker position={marker} />
    </GoogleMap>
  );
};

export default MapComponent;
