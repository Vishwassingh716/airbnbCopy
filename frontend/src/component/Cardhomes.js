import React, { useState, useContext , useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HomeContext from '../context/HomeContext';
import { Card, CardMedia, Typography, Button, Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import IconButton from '@mui/material/IconButton';
import AuthContext from '../context/AuthContext';

import FavoriteBorderTwoToneIcon from '@mui/icons-material/FavoriteBorderTwoTone';

const Cardhomes = ({ homes }) => {
  const navigate = useNavigate();
  let { favhouseData } = useContext(HomeContext);

  let {user , authToken} = useContext(AuthContext);

  
  const [favhouse , setFavHouse] = useState(favhouseData);

  

  const [liked, setLiked] = useState(favhouse.some(fav => fav.home === homes.id));

    useEffect(()=>{
        const isLiked = favhouse.some(fav => fav.home === homes.id);
        setLiked(isLiked);
    },[favhouse])
 

  const proper = () => {
    navigate(`/property/${homes.id}`);
  };

    const [formData, setFormData] = useState({
      guest: user.user_id,
      home : homes.id
    });

    const postData = async () => {
      if (liked) {
        try {
        const response = await fetch(`http://localhost:8000/api/favhousedelete/${user.user_id}/${homes.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authToken.access}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 204) {
          // alert("Favorite deleted successfully.");
          setFavHouse(prev => prev.filter(item => item.home !== homes.id));
          // setLiked(false)
        } else if (response.status === 404) {
          alert("Favorite not found.");
        } else if (response.status === 403) {
          alert("Not authorized to delete this favorite.");
        } else {
          alert("Error deleting favorite.");
        }
        } catch (error) {
          console.error("Delete error:", error);
          alert("Something went wrong.");
        }
        return;
      }

      try {
      const response = await fetch(`http://localhost:8000/api/favhouse/${user.user_id}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken.access}`,// Include the token
        },
        body: JSON.stringify({
          guest: formData.guest,
          home: formData.home,
          
        }), // Send FormData object
      });

      if (response.status === 201) {
        const savedFeature = await response.json();
        setFavHouse(prev => [...prev, {
          guest: formData.guest,
          home: formData.home,
        }]);
        // alert("fav added successfully!");
        // setLiked(true);
      } else {
        const errorData = await response.json();
        alert(`Error: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      console.error(user);
      alert("An error occurred while posting data.");
    }
    return;
    }
  return (
    <Box>
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: 600,
        margin: '1rem auto',
        boxShadow: 0,
        
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Image with overlay details and button */}
      <Box sx={{ position: 'relative', flex: 1 , boxShadow: 3}}>
        <CardMedia
          component={Link}
          to={`/property/${homes.id}`}
          onClick={proper}
          variant="contained"
          // component="img"
          image={homes.properties.images}
          alt={homes.properties.name}
          sx={{ width: '100%', height: 175, objectFit: 'cover' , borderRadius: 2, }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 120,
            width: '100%',
            background: 'rgba(0, 0, 0, 0.0)',
            color: 'white',
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textShadow: `
              -1px -1px 0 black,
              1px -1px 0 black,
              -1px  1px 0 black,
              1px  1px 0 black,
              -2px  0px 0 black,
              2px  0px 0 black,
              0px -2px 0 black,
              0px  2px 0 black
            `
          }}
        >
          <Box>
            <IconButton
      onClick={postData}
      disableRipple
      sx={{
          position: 'absolute',
            top: -20,
            right:15,
          zIndex: 1,
          backgroundColor: 'transparent',
          '&:hover': { backgroundColor: 'transparent' },
      }}
    >
      {liked? <FavoriteIcon
        sx={{
          color: 'red',
          textShadow: '0px 2px 6px rgba(0, 0, 0, 0.9)',
          
          
        }}
        
      /> : <FavoriteIcon
        sx={{
          color: 'grey.999',
          textShadow: '0px 2px 6px rgba(0, 0, 0, 0.9)',
          
        }}
        
      />}

    </IconButton>
            
            {/* <Typography variant="h6" gutterBottom  sx={{ color: 'white',
    fontSize: '14px' }}>
              {homes.properties.name}
            </Typography>
            <Typography variant="body2">{homes.properties.types_of_property}</Typography>
            <Typography variant="h6" sx={{ color: 'lightgray', fontSize: '12px' }}>
              ${homes.properties.base_price}
            </Typography> */}
          </Box>
          {/* <Button
            component={Link}
            to={`/property/${homes.id}`}
            onClick={proper}
            variant="contained"
            sx={{ backgroundColor: 'black', color: 'white', fontSize: '10px' }}
          >
            View Details
          </Button> */}
        </Box>
      </Box>
  <Box sx={{ px: 0.5, py: 0.5 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
        {homes.properties.name}
      </Typography>
      {/* {/* Fake rating * */}
      {/* <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', fontWeight: 500 }}>
        ⭐ 4.93&nbsp;
        <Typography variant="caption" color="text.secondary">(67)</Typography>
      </Typography> */}
      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', fontWeight: 500 }}>
        ₹{homes.properties.base_price}
        <Typography variant="caption" color="text.secondary">(INR)</Typography>
      </Typography>
    </Box>

    <Typography
      variant="body2"
      sx={{
        color: 'text.secondary',
        mt: 0.5,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {homes.properties.types_of_property}
    </Typography>

    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
      Free cancellation
    </Typography>

  </Box>
    </Card>
    </Box>
  );
};

export default Cardhomes;































// import React, { useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import HomeContext from '../context/HomeContext';
// import { Card, CardMedia, CardContent, Typography, Button, Box } from '@mui/material';

// const Cardhomes = ({ homes }) => {
//   const navigate = useNavigate();
//   let { bookingsData } = useContext(HomeContext);

//   const proper = () => {
//     navigate(`/property/${homes.id}`);
//   };

//   return (
//     <Card
//       sx={{
//         maxWidth: 345,
//         margin: '1rem auto',
//         boxShadow: 3,
//         borderRadius: 2,
//         overflow: 'hidden',
//         position: 'relative',
//       }}
//     >
//       {/* Image with overlay details */}
//       <Box sx={{ position: 'relative' }}>
//         <CardMedia
//           component="img"
//           image={homes.properties.images}
//           alt={homes.properties.name}
//           sx={{ height: 250, objectFit: 'cover' }}
//         />
//         <Box
//           sx={{
//             position: 'absolute',
//             bottom: 0,
//             width: '100%',
//             background: 'rgba(0, 0, 0, 0.3)',
//             color: 'white',
//             padding: '10px',
//           }}
//         >
//           <Typography variant="h6" gutterBottom>
//             {homes.properties.name}
//           </Typography>
//           <Typography variant="body2">{homes.properties.types_of_property}</Typography>
//           <Typography variant="h6" sx={{ color: 'lightgray' }}>
//             ${homes.properties.base_price}
//           </Typography>
//         </Box>
//       </Box>

//       {/* Button */}
//       <CardContent>
//         <Box sx={{ display: 'flex', justifyContent: 'center' }}>
//           <Button
//             component={Link}
//             to={`/property/${homes.id}`}
//             onClick={proper}
//             variant="contained"
//             sx={{ backgroundColor: 'black', color: 'white' }}
//           >
//             View Details
//           </Button>
//         </Box>
//       </CardContent>
//     </Card>
//   );
// };

// export default Cardhomes;

























































// import PropertyPage from '../pages/PropertyPage'
// import React, { useContext, useState } from 'react';
// import { Link , useNavigate} from 'react-router-dom';
// import HomeContext from '../context/HomeContext';
// import {
//   Card,
//   CardMedia,
//   CardContent,
//   Typography,
//   Button,
//   Box,
// } from '@mui/material';



// const Cardhomes = ({homes}) => {
//     console.log(homes)
    
//     let {bookingsData , setBookingsData} = useContext(HomeContext)
//     const [bookin, setBookin] = useState([])
//     const navigate = useNavigate();


//     const proper = () =>{
//       // Filter bookings for the specific home ID
//     const filteredBookings = bookingsData.filter((booking) => booking.home === homes.id);

    
//     navigate('/property');
//     }

//     return (
//       <Card
//         sx={{
//           maxWidth: 345,
//           margin: '1rem auto',
//           boxShadow: 3,
//           borderRadius: 2,
//           overflow: 'hidden',
//         }}
//       >
//         {/* Image */}
//         <CardMedia
//           component="img"
//           image={homes.properties.images}
//           alt={homes.properties.name}
//           sx={{ height: 200, objectFit: 'cover' }}
//         />
  
//         {/* Content */}
//         <CardContent>
//           <Typography variant="h6" gutterBottom>
//             {homes.properties.name}
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             {homes.properties.types_of_property}
//           </Typography>
//           <Typography variant="h6" color="primary" sx={{ marginTop: 1 , color:'grey' }}>
//             ${homes.properties.base_price}
//           </Typography>
//           <Typography variant="body2" color="text.secondary">
//             ID: {homes.id}
//           </Typography>
  
//           {/* Button */}
//           <Box sx={{ marginTop: 2 }}>
//             <Button
//               component={Link}
//               to={`/property/${homes.id}`}
//               onClick={proper}
//               variant="contained"
//               color="secondary"
//               fullWidth
//               sx = {{
//                 backgroundColor:'black'

//               }}
//             >
//               View Details
//             </Button>
//           </Box>
//         </CardContent>
//       </Card>
//     );
//   };
  
//   export default Cardhomes;
































    //   return (
    
//     <div>
//         <img src = {homes.images} ></img>
//         <p>{homes.name} </p>
//         <p>{homes.types_of_property}</p>
//         <p>${homes.base_price}</p>
//         <p>{homes.ids}</p>
        
//         <Link onClick = {proper} to ="/property"><p onClick={proper}>click</p></Link>
        
        
  
//       </div>
//    )
// }

// export default Cardhomes
