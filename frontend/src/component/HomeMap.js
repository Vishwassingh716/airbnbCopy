import React , {useContext , useState , useEffect} from 'react'
import HomeContext from '../context/HomeContext'
import { useMapEvents , Marker , Popup } from 'react-leaflet'
import { Icon } from 'leaflet';
import Cardhomes from './Cardhomes';
import { Paper, Box} from "@mui/material";

const HomeMap = () => {
  let {homeData} = useContext(HomeContext)
  let {getBookingsData} = useContext(HomeContext)

  const [locations, setLocations] = useState(null);

  useMapEvents({
    click() {
    const extractloc  = homeData.map((feature) => {
      // Extract POINT coordinates
      const pointData = feature.geometry.match(/POINT \(([^)]+)\)/)
      if (pointData) {
        const base_price = feature.properties.base_price
        const types_of_property = feature.properties.types_of_property
        const name = feature.properties.name
        const images = feature.properties.images
        const id = feature.id
        console.log(id)
        const [longitude, latitude]= pointData[1].split(" ").map(Number)
        return {properties:{longitude,latitude, base_price , types_of_property , name , images  } , id}
      }
      console.log(locations)
      return null;
    });
    setLocations(extractloc.filter(Boolean));
    // Filter out null values (if any) and update state
    
    
  },
});
  console.log(locations)
  
  const customIcon = new Icon({
    iconUrl:"https://cdn-icons-png.flaticon.com/128/3203/3203071.png",
    iconSize: [38,38]
  })
  return locations?(
    locations.map((index) => (
      <Marker key={index} position={[index.properties.latitude, index.properties.longitude]} icon={customIcon}>
        <Popup>
          <Paper
        elevation={3} // Adds shadow
        sx={{
          padding: "10px",
          width: "300px",
          borderRadius: "10px",
          backgroundColor: "white",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Cardhomes homes={index} />
        </Box>
      </Paper>
        </Popup>
      </Marker>
    ))
    
  ): null;
}

export default HomeMap
