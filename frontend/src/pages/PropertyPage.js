import React, { useContext, useEffect, useState, useMemo } from 'react';
import { Grid, Paper, Container ,Typography, IconButton, Box, Dialog, Button ,  Tooltip , Modal, Accordion, AccordionSummary, AccordionDetails , TextField , mo} from '@mui/material';
import { ChevronLeft, ChevronRight, Close } from '@mui/icons-material';

import AcUnitTwoToneIcon from '@mui/icons-material/AcUnitTwoTone';
import GppBadTwoToneIcon from '@mui/icons-material/GppBadTwoTone';
import GppGoodTwoToneIcon from '@mui/icons-material/GppGoodTwoTone';
import WifiIcon from '@mui/icons-material/Wifi';
import DeviceThermostatTwoToneIcon from '@mui/icons-material/DeviceThermostatTwoTone';
import FireExtinguisherTwoToneIcon from '@mui/icons-material/FireExtinguisherTwoTone';
import RoomServiceTwoToneIcon from '@mui/icons-material/RoomServiceTwoTone';
import EmojiTransportationTwoToneIcon from '@mui/icons-material/EmojiTransportationTwoTone';
import SmokeFreeTwoToneIcon from '@mui/icons-material/SmokeFreeTwoTone';
import VideocamTwoToneIcon from '@mui/icons-material/VideocamTwoTone';
import KitchenTwoToneIcon from '@mui/icons-material/KitchenTwoTone';
import MicrowaveTwoToneIcon from '@mui/icons-material/MicrowaveTwoTone';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';

import BookingCard from '../component/BookingCard';


import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  addMonths,
  subMonths
} from 'date-fns';
import { useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import HomeContext from '../context/HomeContext';

import Rev from '../component/Rev';
import Ownercard from '../component/Ownercard';

import { MapContainer, TileLayer , Marker , Popup} from "react-leaflet";

import { Icon } from 'leaflet';


import DateSelectorModal from '../component/DateSelectorModal';


const PropertyPage = () => {

  const [home , setHome] = useState(null);
  const [book, setBook] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const { user , authToken } = useContext(AuthContext); 

  const [editflag , setEditflag] = useState(false);

  const { getBookingsData } = useContext(HomeContext); 



  const { id } = useParams();
  const [img, setImg] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const[entities , setEntities] = useState([]);

  const [expanded, setExpanded] = useState(false);

  const[ownerid , setOwnerid] = useState(null);

  const [locations, setLocations] = useState(null);


  const [open, setOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState(null);

  const [homebookings,setHomeBookings] = useState(null);

  const [bookingsData , setBookingsData] = useState(null);


  const handleChange = () => {
    setExpanded(!expanded);
  };





      const paginationsettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3, // 3 cards per scroll
    slidesToScroll: 3,
    arrows: true,
    responsive: [
      {
        breakpoint: 960, // md
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      },
      {
        breakpoint: 600, // sm
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };




  
  const [formData, setFormData] = useState({
    name: home?.name ||'',
    base_price:home?.base_price||'',
    description:home?.description||'',
    total_number_of_guest: home?.total_number_of_guest||'',
    
  });


    const patchHome = async () => {

    // Create FormData object for uploading data and file
    const uploadData = new FormData();
    
    
    
    uploadData.append("name", formData.name);
    uploadData.append("base_price", formData.base_price);
    uploadData.append("description", formData.description);
    uploadData.append("total_number_of_guest", formData.total_number_of_guest);

    try {
      const response = await fetch(`http://localhost:8000/api/updhomes/${id}`, {
        method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + String(authToken.access)
            },
        body: uploadData, // Send FormData object
      });

      if (response.status === 200) {
        
        setFormData({}); // Reset form
        const updated = await response.json();
        // console.log('Updated user:', updated);
        setEditflag(!editflag);
        handleClose(); // Close modal after successful update
        // window.location.reload();

      } else {
        const errorData = await response.json();
        alert(`Error: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      alert("An error occurred while posting data.");
    }
  };


  const handleChangepatch = (e) => {
    
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };


  const postImage = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('images', file); // same key your backend expects

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/createhomeimages/${id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken.access}`, // Replace with actual auth token
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    console.log('Upload success:', data);
    // Optionally refresh image list or show toast
  } catch (error) {
    console.error('Upload failed:', error);
  }
};




  const customIcon = new Icon({
    iconUrl:"https://cdn-icons-png.flaticon.com/128/3203/3203071.png",
    iconSize: [38,38]
  })



  const getHomeImgData = async () => {
    let response = await fetch(`http://localhost:8000/api/createhomeimages/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(authToken.access)
      }
    });
    let data = await response.json();
    setImg(data);
  };


  const getHomeData = async () => {
    let response = await fetch(`http://localhost:8000/api/homes/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + String(authToken.access)
      }
    });
    let data = await response.json();
    setHome(data.properties);
    const points = data.geometry.match(/POINT \(([^)]+)\)/);
    const [longitude, latitude]= points[1].split(" ").map(Number);
    const extract =  {properties:{longitude,latitude } }

    setLocations(extract);
    
    setEntities(data.properties.entities);
    console.log("homesdata");
    console.log(data.properties);
    console.log(data.geometry.match(/POINT \(([^)]+)\)/));
    console.log(entities);
    setOwnerid(data.properties.owner);
    console.log(ownerid);
    setFormData({
      name : data.properties.name || '',
      base_price : data.properties.base_price || '',
      description:data.properties.description||'',
      total_number_of_guest: data.properties.total_number_of_guest||'',
    
    })
  };



  useEffect(() => {
    // getBookingsData();
    getHomeImgData();
    getHomeData();
  }, [editflag]);


  useEffect(() => {
    if (home && home.owner===user.user_id) {
      const fetchData = async () => {
  
        const bookings = await getBookingsData(id);
        console.log(bookings);  // logs array of bookings
        setBookingsData(bookings);
  
      };
  
      fetchData();
    }
  }, [home]);
  

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

const [openedit, setOpenedit] = useState(false);
const handleOpen = () => setOpenedit(true);
const handleClose = () => setOpenedit(false);

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

 useEffect(() => {
  if (id) {
    getBookingsData(id).then(data => setHomeBookings(data));
  }
}, [id]);
  return (
    <Box
      sx={{
        top:60,
        position: 'relative',
        // width: '100vw',
        // height: '100vh',
        overflowX: 'hidden',   // prevent horizontal scroll globally
        overflowY: 'auto',     // allow vertical scroll if needed
        // boxSizing: 'border-box',
        // padding: 2,
        backgroundColor:'white'
        
      }}
    >

      

    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 4, mt: 5 }}>
  
  {/* Image Slider Section */}
  <Box sx={{
    width: '82%',
    height:'25%',
  
    overflow: 'visible',         // allow dots to show
    // boxShadow: 1,
    paddingBottom: 4, 
  }}>
   

    <Slider {...sliderSettings}>
      {img.map((item, index) => (
        <Box
          key={index}
          sx={{
            position: 'relative',
            width: '100%',
            height: 300,
            borderRadius: 5,
            overflow: 'hidden',
            cursor: 'pointer'
          }}
        >
          <Box
            component="img"
            src={`${item.images}`}
            alt={`Slide ${index}`}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onClick={() => handleImageClick(item.images)}
          />
        {home && home.owner===user.user_id ? 
        
        
          (<Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              zIndex: 2,
            }}
          >
            <input
              id={`upload-button`} // ensure uniqueness if inside loop
              type="file"
              accept="image/png, image/jpeg"
              onChange={postImage}
              style={{ display: 'none' }}
            />

            <label htmlFor={`upload-button`}>
              <Button
                component="span"
                variant="contained"
                sx={{
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                  borderRadius: '50%',
                  minWidth: 'auto',
                  padding: '6px',
                  color: '#fff',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <AddPhotoAlternateOutlinedIcon />
              </Button>
            </label>
          </Box>
          ):null }
        </Box> 
      ))}
    </Slider>
  </Box>

  

</Box>
      {/* Property Details Section */}
<Box
  sx={{

    // borderTop: '1px solid',
    borderBottom: '1px solid',
    borderColor: 'black',
    width: '80%',
    // borderRadius: 2,
    // backgroundColor: 'white',
    mx: 'auto',
    p: 2,
    display: 'flex',
    flexDirection: 'column',
  }}
>
  {home && (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 3,
        justifyContent: 'space-between',
      }}
    >
      {/* Left Column */}
      <Box sx={{ flex: 1, minWidth: '250px' }}>
        <Typography variant="h4" gutterBottom>{home.name}</Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          Location: {home.address}, {home.city}, {home.country}
        </Typography>

        <Typography variant="h5" sx = {{mt:2}}color="primary">Price: ₹{home.base_price}</Typography>
      </Box>

      {/* Right Column */}
      <Box sx={{ flex: 'end', minWidth: '250px' }}>
        <Typography variant="h6" color="textSecondary">{home.types_of_property}</Typography>

        <Typography variant="body1" sx={{ mt: 2 }}> Maximum {home.total_number_of_guest} guests allowed</Typography>
        {(user.user_id !== home.owner) ? (<Button variant="contained"  sx={{ mt: 2 , backgroundColor:"#4B0082" , borderRadius:'40%'}} onClick={() => setOpen(true)}>
          Book Now
        </Button>):(<><Button variant="contained"  sx={{ mt: 2 , backgroundColor:"#4B0082" , borderRadius:'30%'}} onClick={handleOpen} >
          Edit
        </Button> 
         <Modal open={openedit} onClose={handleClose}>
            <Box sx={{
              mt : 5,
              
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 450,
            maxHeight: '70vh',         // limits height to 90% of viewport
            overflowY: 'auto',         // enables scroll when content overflows
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}>
               
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChangepatch}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Base Price"
                name="base_price"
                value={formData.base_price}
                onChange={handleChangepatch}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChangepatch}
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                label="Guest Limit"
                name="total_number_of_guest"
                value={formData.total_number_of_guest}
                onChange={handleChangepatch}
                sx={{ mb: 3 }}
              />
              
              <Button variant="contained" onClick={patchHome}>
                Save Changes
              </Button>
            </Box>
          </Modal> </>

      )
        }



      <DateSelectorModal
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(dates) => setSelectedDates(dates)}
        bookings={homebookings}
         bookingD={{
          homeId: id,
          // start_date: selectedDates.start_date,
          // end_date: selectedDates.end_date,
          number_of_guests: 2,
          amount: home.base_price
        }}
      />
      </Box>

      
    </Box>
  )}
</Box>
      <Grid
      container
      spacing={2}
        sx = {{
          width : '85%',
          mx : 'auto',
          display:'flex',
          flexDirection:'row',
          
        }}>
      <Grid item xs={12} md={4}>
        <Ownercard ownerid={ownerid} />
      </Grid>
      <Grid item xs={12} md={8}>
      <Box
        sx={{
          mt: 3,
          ml: 1,
          width: '92%',
          height: 'auto', // let it grow based on content
          zIndex: 10,
          overflow: 'hidden',
          borderRadius: 2,
          backgroundColor: 'whitesmoke',
          color: '#000',
          p: 2,
          // border :'1px solid'
        }}
>

  

  {/* Section Title */}
  <Typography
    sx={{
      backgroundColor: '#e0e0e0',
      p: 1,
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'normal',
      fontSize: '1rem',
      fontStyle: 'italic',
      borderRadius: 1,
    }}
  >
    Entities
  </Typography>

  {/* Grid of Icons */}
  <Grid container spacing={2} sx={{ mt: 1 }}>
    {/* Air Conditioner */}
    <Grid item xs={12} sm={6} md={3}>
      <Tooltip title="Air Conditioner">
        <Box display="flex" alignItems="center" gap={1}>
          <AcUnitTwoToneIcon />
          {entities.airconditioner ? (
            <GppGoodTwoToneIcon color="success" />
          ) : (
            <GppBadTwoToneIcon color="error" />
          )}
        </Box>
      </Tooltip>
    </Grid>

    {/* WiFi */}
    <Grid item xs={12} sm={6} md={3}>
      <Tooltip title="WiFi">
        <Box display="flex" alignItems="center" gap={1}>
          <WifiIcon />
          {entities.wifi ? (
            <GppGoodTwoToneIcon color="success" />
          ) : (
            <GppBadTwoToneIcon color="error" />
          )}
        </Box>
      </Tooltip>
    </Grid>

    {/* Heater */}
    <Grid item xs={12} sm={6} md={3}>
      <Tooltip title="Heater">
        <Box display="flex" alignItems="center" gap={1}>
          <DeviceThermostatTwoToneIcon />
          {entities.heating ? (
            <GppGoodTwoToneIcon color="success" />
          ) : (
            <GppBadTwoToneIcon color="error" />
          )}
        </Box>
      </Tooltip>
    </Grid>

    {/* Fire Extinguisher */}
    <Grid item xs={12} sm={6} md={3}>
      <Tooltip title="Fire Extinguisher">
        <Box display="flex" alignItems="center" gap={1}>
          <FireExtinguisherTwoToneIcon />
          {entities.fireext ? (
            <GppGoodTwoToneIcon color="success" />
          ) : (
            <GppBadTwoToneIcon color="error" />
          )}
        </Box>
      </Tooltip>
    </Grid>

    {/* Room Services */}
    <Grid item xs={12} sm={6} md={3}>
      <Tooltip title="Room Services">
        <Box display="flex" alignItems="center" gap={1}>
          <RoomServiceTwoToneIcon />
          {entities.roomservices ? (
            <GppGoodTwoToneIcon color="success" />
          ) : (
            <GppBadTwoToneIcon color="error" />
          )}
        </Box>
      </Tooltip>
    </Grid>

    {/* Vehicle Parking */}
    <Grid item xs={12} sm={6} md={3}>
      <Tooltip title="Vehicle Parking">
        <Box display="flex" alignItems="center" gap={1}>
          <EmojiTransportationTwoToneIcon />
          {entities.freeparking ? (
            <GppGoodTwoToneIcon color="success" />
          ) : (
            <GppBadTwoToneIcon color="error" />
          )}
        </Box>
      </Tooltip>
    </Grid>

    {/* Smoke Alarm */}
    <Grid item xs={12} sm={6} md={3}>
      <Tooltip title="Smoke Alarm">
        <Box display="flex" alignItems="center" gap={1}>
          <SmokeFreeTwoToneIcon />
          {entities.smokealarm ? (
            <GppGoodTwoToneIcon color="success" />
          ) : (
            <GppBadTwoToneIcon color="error" />
          )}
        </Box>
      </Tooltip>
    </Grid>

    {/* Exterior Camera */}
    <Grid item xs={12} sm={6} md={3}>
      <Tooltip title="Exterior Camera">
        <Box display="flex" alignItems="center" gap={1}>
          <VideocamTwoToneIcon />
          {entities.exteriorcam ? (
            <GppGoodTwoToneIcon color="success" />
          ) : (
            <GppBadTwoToneIcon color="error" />
          )}
        </Box>
      </Tooltip>
    </Grid>

    {/* Fridge */}
    <Grid item xs={12} sm={6} md={3}>
      <Tooltip title="Fridge">
        <Box display="flex" alignItems="center" gap={1}>
          <KitchenTwoToneIcon />
          {entities.fridge ? (
            <GppGoodTwoToneIcon color="success" />
          ) : (
            <GppBadTwoToneIcon color="error" />
          )}
        </Box>
      </Tooltip>
    </Grid>

    {/* Microwave */}
    <Grid item xs={12} sm={6} md={3}>
      <Tooltip title="Microwave">
        <Box display="flex" alignItems="center" gap={1}>
          <MicrowaveTwoToneIcon />
          {entities.microwave ? (
            <GppGoodTwoToneIcon color="success" />
          ) : (
            <GppBadTwoToneIcon color="error" />
          )}
        </Box>
      </Tooltip>
    </Grid>
  </Grid>


      </Box>
      </Grid>

      </Grid>

      <Box 
        sx = {{
              width: '86%',
              borderRadius: 2,
              // backgroundColor: 'white',
              mx: 'auto',
              mt: 3,
              p: 2,
              }}  >
                {home ? <Box sx = {{mx: 5, display:'flex' , flexDirection:'column', borderTop:'1px solid'}}>
                  <Typography variant="h5" sx={{ mt: 4 }}>
                  Where you'll be
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 2 }}>
                  {home.address}, {home.city}, {home.country}
                  </Typography></Box>:null}
          <Container maxWidth="lg" style={{ marginTop: "20px" , width : '100%' }}>
          {/* Add a styled Paper component for map container */}
          <Paper
            elevation={1}
            style={{
              padding: "10px",
              backgroundColor: "#f9f9f9",
              // height: "90vh",
            }}
          >
            {locations?
            <MapContainer
              center={[locations.properties.latitude,locations.properties.longitude]} // Default center
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
              <Marker  position={[locations.properties.latitude, locations.properties.longitude]} icon={customIcon}>
                
              </Marker>
              
                      
                    </MapContainer>: null}
                  </Paper>
        </Container>

      </Box>

        {home && (
    <Box
      sx={{
        mt:5,
        p:2,
        mx:15,
        width:'40%',
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        gap: 3,
        justifyContent: 'space-between',
        borderTop:'1px solid',
        borderBottom:'1px solid',
      }}
    >
        <Box> <Typography variant='h5'>About this place</Typography></Box>
        <Box sx = {{mx: 5}}> <Typography variant='body'>{home.description}</Typography></Box>

      
      
    </Box>
  )}

      {/* Modal to Show Enlarged Image */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="xl" fullWidth>
        <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
          <IconButton 
            onClick={handleCloseModal} 
            sx={{ 
              position: 'absolute', 
              top: 10, 
              right: 10, 
              color: 'white', 
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' }
            }}>
            <Close />
          </IconButton>

          <Box 
            component="img" 
            src={`${selectedImage}`} 
            alt="Enlarged" 
            sx={{ 
              width: '100%', 
              height: '100vh', 
              objectFit: 'contain', 
              backgroundColor: 'black' 
            }} 
          />
        </Box>
      </Dialog>

      {bookingsData && bookingsData.length > 0 ? (
      <Slider {...paginationsettings}>
        {bookingsData.map((h) => (
          <Box key={h.id} sx={{ px: 1, boxSizing: 'border-box' }}>
            <BookingCard bookingData={h} />
          </Box>
        ))}
      </Slider>
    ) : (
      <></>
    )}
      
    


      
     <Rev id = {id}/>

     
    </Box>

        
    
  );
};

export default PropertyPage;





















































