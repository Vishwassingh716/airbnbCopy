import React, { useEffect, useContext, useState } from 'react';
import AuthContext from '../context/AuthContext';
import {
  Card,
  CardContent,
  Avatar,
  Typography,
  Box,
  CircularProgress,
  Stack
} from '@mui/material';

const Ownercard = ({ ownerid }) => {
  const { authToken } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [profileimg, setProfileimg] = useState(null);

  const profileData = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/profile/${ownerid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(authToken.access)
        }
      });
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const profileimgData = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/profileimages/${ownerid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(authToken.access)
        }
      });
      const data = await response.json();
      setProfileimg(data);
    } catch (error) {
      console.error('Error fetching profile image:', error);
    }
  };

  useEffect(() => {
    if(ownerid){
    profileData();
    profileimgData();
    }
  }, [ownerid]);

  if (!profile || !profileimg) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card
      sx={{
        mt : 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 2,
        boxShadow: 0,
        p: 1.5,
        maxWidth: 600,
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'scale(1.01)',
          boxShadow: 6,
        },
      }}
    >
        <Typography
          variant="subtitle1"
          sx={{
            mt: 1,
            px: 2,
            py: 0.5,

            color: '#4B0000',
            borderRadius: 1,
            fontWeight: 'bold',
            fontSize: '1rem',
            fontFamily: 'Arial, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: 1,
            // boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)',
          }}
        >
          Hosted By
        </Typography>
      <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center', mt: 2 , mb:1}}>

      <Avatar
        alt={profile.name}
        src={`http://127.0.0.1:8000${profile?.img}`}
        sx={{ width: 100, height: 100, mr: 3 }}
      />
        
      
      <CardContent sx={{ p: 0 }}>
        <Typography variant="h6" fontWeight="bold">
          {profile.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          {profile.phone_number}
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          {profile.description}
        </Typography>
      </CardContent>
      </Box>
    </Card>
  );
};

export default Ownercard;


