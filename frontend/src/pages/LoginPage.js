import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'
// import { Link } from 'react-router-dom'
import { TextField, Button, Box , Typography , Link } from '@mui/material';
import backgroundImage from '../assets/backgroundair.png';
const LoginPage = () => {
  let {loginUser} = useContext(AuthContext)
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
      backgroundColor: 'grey',
    }}
    >
      <Typography variant='h5'
      sx={{
        fontWeight: 'bold',
        fontStyle: 'italic', 
        textAlign: 'center', 
        color: 'black',
        
      }}
      > airbnb</Typography>
    <form onSubmit={loginUser}>
        <TextField 
          type="text" 
          name="email" 
          label="Email" 
          variant="filled" 
          fullWidth 
          required 

          sx={{ marginTop: 2,
            backgroundColor: 'white',
            borderRadius: 2
           }}
        />
        <TextField 
          type="password" 
          name="password" 
          label="Password" 
          variant="filled" 
          fullWidth 
          required 
          sx={{ marginTop: 2,
            backgroundColor: 'white',
            borderRadius: 2
           }}
        />
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          fullWidth
          sx={{ marginTop: 2,
            backgroundColor: 'black',
            color: 'white',
            borderRadius: 20
           }}
        >
          Login
        </Button>
      </form>
      <Link 
        href="/register" 
        variant="body2" 
        sx={{ textAlign: 'center', color:'white' }}
      >
        Create an account
      </Link>
      </Box>
      </Box>
  )
}

export default LoginPage
