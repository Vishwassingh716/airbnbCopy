import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';

import AuthContext from '../context/AuthContext';
import ProfileContext from '../context/ProfileContext';
import { Box, Typography, Paper, Button , Tooltip , Modal , TextField , Grid } from '@mui/material';

import HomeContext from '../context/HomeContext';

import Slider from 'react-slick';


import Cardhomes from '../component/Cardhomes';
import EditNoteIcon from '@mui/icons-material/EditNote';

import HolidayVillageIcon from '@mui/icons-material/HolidayVillage';

import FmdGoodTwoToneIcon from '@mui/icons-material/FmdGoodTwoTone';
import BookingCard from '../component/BookingCard';

const ProfilePage = () => {
  const { user, authToken } = useContext(AuthContext);
  const { getUserBookingsData } = useContext(HomeContext);
  const { profilestate, setProfilestate, profilephotostate, setProfilephotostate } = useContext(ProfileContext);

  const [image, setImage] = useState(null);

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [editflag , setEditflag] = useState(false);
  const [hosted , setHosted] = useState(false);

  const [bookingsData , setBookingsData] = useState(false);
  const [bookingCheck , setBookingsCheck] = useState(true);
  const [propertyCheck , setPropertyCheck] = useState(false);





  const [formData, setFormData] = useState({
    name: profilestate?.name ||'',
    city:profilestate?.city||'',
    country:profilestate?.country||'',
    phone_number: profilestate?.phone_number||'',
    description:profilestate?.description||'',
    
  });


const sliderSettings = {
  dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    width: 330,
    height: 330,

    top:45,
      right: 50,
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



  const getHomeData = async()=>{
          let response = await fetch(`http://localhost:8000/api/hostedhouse/${profilestate.user}`,{
              method:'GET',
              headers:{
                  'Content-Type':'application/json',
                  'Authorization': 'Bearer ' + String(authToken.access)

              }
          })
          let data = await response.json()
          setHosted(data.features)
          console.log(data.features)
          
      }



  const handleChange = (e) => {
    
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Save the selected file
  };


  const postData = async () => {

    // Create FormData object for uploading data and file
    const uploadData = new FormData();
    
    
    
    uploadData.append("name", formData.name);
    uploadData.append("phone_number", formData.phone_number);
    uploadData.append("description", formData.description);
    uploadData.append("city", formData.city);
    uploadData.append("country", formData.country);

    uploadData.append("img", image);
    try {
      const response = await fetch(`http://localhost:8000/api/profile/${profilestate.user}`, {
        method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + String(authToken.access)
            },
        body: uploadData, // Send FormData object
      });

      if (response.status === 200) {
        
        setFormData({}); // Reset form
        const updated = await response.json();
        console.log('Updated user:', updated);
        setEditflag(!editflag);
        handleClose(); // Close modal after successful update
        window.location.reload();

      } else {
        const errorData = await response.json();
        alert(`Error: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      alert("An error occurred while posting data.");
    }
  };





useEffect(() => {
  if (profilestate && profilestate.user) {
    const fetchData = async () => {
      getHomeData();  // await if it's async

      const bookings = await getUserBookingsData(profilestate.user);
      console.log(bookings);  // logs array of bookings
      setBookingsData(bookings);

      setFormData({
        name: profilestate?.name || '',
        city: profilestate?.city || '',
        country: profilestate?.country || '',
        phone_number: profilestate?.phone_number || '',
        description: profilestate?.description || '',
      });
    };

    fetchData();
  }
}, [profilestate]);












  





return(
  <Box sx = {{backgroundColor:'grey.100'}}>
  <Box sx = {{top:65 , position : 'relative' }}> 
    <Box sx = {{ m :2 , display:'flex' , justifyContent:'center' , pb:2 , borderBottom:'1px solid black'}}>
      <Box sx = {{display:'flex' , flexDirection: 'column'}}>
          <Box
          component="img"
          src={`http://127.0.0.1:8000${profilestate.img}`}
          alt="Profile Image"
          sx={{
            width: 150,
            height: 150,
            borderRadius: '50%',
            objectFit: 'cover',
            border: '3px solid #000000ff',
            mb: 2,
            mx : 'auto'
          }}
        />
        <Typography
          variant="h6"
          sx={{
            color: '#333',
            fontWeight: 'bold',
            mb: 1,
            mx : 'auto'
          }}
        > {profilestate.name}
        </Typography>
        <Typography
            variant="h6"
            sx={{
              color: '#333',
              fontSize: '1rem',
              mb: 1,
              mx: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.5,
            }}
          >
            <FmdGoodTwoToneIcon fontSize="small" />
            <span>{profilestate.city}</span>, <span>{profilestate.country}</span>
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: '#555',
              mx : 'auto'
            }}
          >
              <span style={{ fontWeight: 500 }}>{profilestate.description}</span>
          </Typography>

          <Tooltip title = 'Edit'><Button  onClick={handleOpen}><EditNoteIcon/></Button></Tooltip>
  
            <Modal open={open} onClose={handleClose}>
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
                  <Box
          component="img"
          src={`http://127.0.0.1:8000${profilestate.img}`}
          alt="Profile Image"
          sx={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            objectFit: 'cover',
            border: '3px solid #1976d2',
            mb: 2,
          }}
        />

              <Typography variant="h6" mb={2}>
                <Tooltip title = 'Edit'><Button>
                  <Grid item xs={12}>
                          <input
                            type="file"
                            name="img"
                            onChange={handleImageChange}
                            accept="image/png, image/jpeg"
                            required
                          />
                        </Grid>
                  <EditNoteIcon/></Button></Tooltip>
              </Typography>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              
              <TextField
                fullWidth
                label="Phone Number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                label="City/State"
                name="city"
                value={formData.city}
                onChange={handleChange}
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                sx={{ mb: 3 }}
              />
              <Button variant="contained" onClick={postData}>
                Save Changes
              </Button>
            </Box>
          </Modal>

      </Box>
      
         
    </Box>
  </Box>
  <Box sx = {{p : 2,  my : 8 ,boxShadow: '0 2px 6px rgba(0,0,0,0.2)', backgroundColor : 'white',display:'flex' , flexDirection:'column'}}>
    <Box sx = {{  display:'flex' , flexDirection:'row' , justifyContent:'space-between'}}>
      <Button onClick = {()=>{setBookingsCheck(true)}} sx = {{ borderRadius:'30%' , mx : 'auto',backgroundColor:'#4B0082' , color : 'white'}} >Bookings</Button>
      <Button onClick = {()=>{setBookingsCheck(false)}} sx = {{ borderRadius:'30%' ,mx : 'auto',backgroundColor:'#4B0000' , color : 'white'}}>Properties</Button>
    </Box>

    <Box sx={{ p: 2 }}>
  {bookingCheck ? (
    bookingsData && bookingsData.length > 0 ? (
      <Slider {...paginationsettings}>
        {bookingsData.map((h) => (
          <Box key={h.id} sx={{ px: 1, boxSizing: 'border-box' }}>
            <BookingCard bookingData={h} />
          </Box>
        ))}
      </Slider>
    ) : (
      <Typography sx={{ height: '100%' }}>No bookings</Typography>
    )
  ) : (
    <Box sx={{ p:2 }}>
      <Slider {...paginationsettings}>
        {hosted.map((h) => (
          <Box key={h.id} sx={{ px: 1, boxSizing: 'border-box' }}>
            <Cardhomes homes={h} />
          </Box>
        ))}
      </Slider>
    </Box>
  )}
</Box>

  </Box>
  </Box>
);
};

export default ProfilePage;

