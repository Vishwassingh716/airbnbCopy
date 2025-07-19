import React, { useState , useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Icon } from 'leaflet';
const Mylocation = () => { 
  
  const [position, setPosition] = useState(null);

  // Listen for map events to trigger geolocation
  useMapEvents({
    click() {
      navigator.geolocation.getCurrentPosition(
        (location) => {
          const { latitude, longitude } = location.coords;
          setPosition([latitude, longitude]);
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    }
  });
 

  const customIcon = new Icon({
    iconUrl:"https://cdn-icons-png.flaticon.com/128/684/684908.png",
    iconSize: [38,38]
  })
  return position ? (
    <Marker position={position} icon={customIcon}>
      <Popup>You are here!</Popup>
    </Marker>
  ) : null;
}

export default Mylocation
