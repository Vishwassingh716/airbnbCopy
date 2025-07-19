import React from 'react'
import AuthContext from '../context/AuthContext'
import { useContext } from 'react'
import backgroundImage from '../assets/backgroundair.png';
import { TextField, Button, Box, Typography , Link } from '@mui/material';

const RegisterPage = () => {
  let {registerUser} = useContext(AuthContext)
  return (
    <Box
  sx={{
    minHeight: '100vh',
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }}
>
    <Box
      sx={{
        backgroundImage: `url(${backgroundImage})`,
        width: 300,
        margin: '0 auto',
        padding: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        border: '1px solid #ccc',
        borderRadius: 2,
        boxShadow: 3,
  
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 'bold',
          fontStyle: 'italic',
          textAlign: 'center',
          color: 'black',
          
        }}
      >
        airbnb
      </Typography>
      <form onSubmit={registerUser}>
        <TextField
          type="text"
          name="email"
          label="Email"
          variant="filled"
          fullWidth
          required
          sx={{
            marginTop: 2,
            backgroundColor: 'white',
            borderRadius: 2,
          }}
        />
        <TextField
          type="password"
          name="password"
          label="Password"
          variant="filled"
          fullWidth
          required
          sx={{
            marginTop: 2,
            backgroundColor: 'white',
            borderRadius: 2,
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            marginTop: 2,
            backgroundColor: 'black',
            color: 'white',
            borderRadius: 20,
          }}
        >
          Register
        </Button>
      </form>
      <Link 
        href="/login" 
        variant="body2" 
        sx={{ textAlign: 'center', color:'white' }}
      >
        Already have an account
      </Link>
    </Box>
</Box>
  )
}

export default RegisterPage






