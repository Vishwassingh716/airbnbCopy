import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import Mylocation from "./Mylocation";
import HomeMap from "./HomeMap";
import { Container, Paper, Typography } from "@mui/material";

const Yourmap = () => {
  return (
    <Container maxWidth="lg" style={{ marginTop: "20px" }}>
      {/* Add a styled Paper component for map container */}
      <Paper
        elevation={3}
        style={{
          padding: "10px",
          backgroundColor: "#f9f9f9",
          height: "90vh",
        }}
      >
        
        <MapContainer
          center={[51.505, -0.09]} // Default center
          zoom={13}
          style={{
            height: "80vh",
            width: "100%",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          {/* Add a tile layer */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Add LocationMarker and HomeMap */}
          <Mylocation />
          <HomeMap />
        </MapContainer>
      </Paper>
    </Container>
  );
};

export default Yourmap;
















// import { MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';


// import React from 'react'
// import Mylocation from './Mylocation';
// import HomeMap from './HomeMap';

// const Yourmap = () => {


//     return (
//         <MapContainer
//           center={[51.505, -0.09]} // Default center
//           zoom={13}
//           style={{ height: "100vh", width: "100%" }}
//         >
//           {/* Add a tile layer */}
//           <TileLayer
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           />
    
//           {/* Add LocationMarker */}
//           <Mylocation />
//           <HomeMap/>
//         </MapContainer>
//       );
// }

// export default Yourmap
