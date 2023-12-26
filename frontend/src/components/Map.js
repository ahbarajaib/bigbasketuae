import React, { useState, useCallback } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const mapStyle = {
  height: "300px",
  width: "100%",
};

const MapComponent = () => {
  const DEFAULT_ZOOM = 10;
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
  });

  const [map, setMap] = React.useState(null);
  const [markerPosition, setMarkerPosition] = useState({
    lat: 25.2048,
    lng: 55.2708,
  });

  const [defaultLocation, setDefaultLocation] = useState({
    lat: 25.2048,
    lng: 55.2708,
  });

  const onLoad = useCallback((map) => {
    const bounds = new window.google.maps.LatLngBounds({
      lat: 25.2048,
      lng: 55.2708,
    });
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handelClickOnMap = () => {};

  const mapContainerStyle = {
    border: "2px solid #eee", // Add border styling here
    borderRadius: "10px", // Optional: Add border-radius for rounded corners
  };

  return (
    <div style={mapContainerStyle}>
      {isLoaded ? (
        <GoogleMap
          onLoad={onLoad}
          center={defaultLocation}
          zoom={DEFAULT_ZOOM}
          mapContainerStyle={mapStyle}
          onClick={handelClickOnMap}
          onUnmount={onUnmount}
        >
          <Marker position={markerPosition} />
        </GoogleMap>
      ) : (
        <></>
      )}
    </div>
  );
};

export default MapComponent;
