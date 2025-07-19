import React, { useState, useEffect } from 'react';
import Yourmap from './Yourmap';
import Homelist from './Homelist';
import { Box, Button , TextField, InputAdornment} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import ExploreRoundedIcon from '@mui/icons-material/ExploreRounded';
import FormatListBulletedRoundedIcon from '@mui/icons-material/FormatListBulletedRounded';

const AllHomes = () => {
  const [map, setMap] = useState(false);

  const [searchHome, setSearchHome] = useState('');
  const [searchcity, setSearchCity] = useState('');

  useEffect(() => {
    console.log(searchHome);
    
  }, [searchHome]);

  const toggleView = () => {
    setMap((prev) => !prev);
  };

  return (
    <Box sx={{top:65 , position : 'relative'}}>
      {/* Static Button Container */}
      {/* <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          backgroundColor: 'white',
          padding: 2,
          textAlign: 'center'
        }}
      >
        
        <Button
          onClick={toggleView}
          variant="contained"
          color="primary"
          sx={{
            textTransform: 'none',
            borderRadius: 20,
            width: '200px',
            textAlign:'center'
          }}
        >
          {map ? <FormatListBulletedRoundedIcon/> : <ExploreRoundedIcon/>}
        </Button>
      </Box> */}

<Box
  sx={{
    position: 'sticky',
    top: 0,
    py:100,
    zIndex: 1210,
    // backgroundColor: 'white',
    padding: 2,
    // position: 'relative', // key for positioning children
    height: 50,
    marginLeft : '10%',
    marginRight : '10%',
  }}
>
  {/* Search Input on the Left */}
  {/* <Box display="flex" justifyContent="center" alignItems="center" sx={{ position: 'sticky', left: 16, top: '40%', transform: 'translateY(-50%)' , marginTop:2}}>
    <TextField
      variant="outlined"
      placeholder="Search by country...."
      onChange={(e) => setSearchHome(e.target.value)}
      // sx={{
      //   width: 300,
      //   backgroundColor: '#f1f1f1',
      //   borderRadius: '999px',
      //   '& .MuiOutlinedInput-root': {
      //     height: 36,
      //     borderRadius: '999px',
      //     fontSize: 14,
      //   },
      // }}

      sx={{
      width: 300,
      backgroundColor: '#f9f9f9',
      borderRadius: '999px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      '& .MuiOutlinedInput-root': {
        height: 40,
        borderRadius: '999px',
        paddingLeft: 1,
        fontSize: 14,
        '& fieldset': {
          borderColor: '#ccc',
        },
        '&:hover fieldset': {
          borderColor: '#999',
          // backgroundColor : 'grey.300',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#1976d2',
          boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
        },
      },
    }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx = {{color:'#4B0082'}}fontSize="small" />
          </InputAdornment>
        ),
      }}
    />

    <TextField
      variant="outlined"
      placeholder="Search by country...."
      onChange={(e) => setSearchCity(e.target.value)}
      // sx={{
      //   width: 300,
      //   backgroundColor: '#f1f1f1',
      //   borderRadius: '999px',
      //   '& .MuiOutlinedInput-root': {
      //     height: 36,
      //     borderRadius: '999px',
      //     fontSize: 14,
      //   },
      // }}

      sx={{
      width: 300,
      backgroundColor: '#f9f9f9',
      borderRadius: '999px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      '& .MuiOutlinedInput-root': {
        height: 40,
        borderRadius: '999px',
        paddingLeft: 1,
        fontSize: 14,
        '& fieldset': {
          borderColor: '#ccc',
        },
        '&:hover fieldset': {
          borderColor: '#999',
          // backgroundColor : 'grey.300',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#1976d2',
          boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
        },
      },
    }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon sx = {{color:'#4B0082'}}fontSize="small" />
          </InputAdornment>
        ),
      }}
    />


  </Box> */}

  <Box
  display="flex"
  justifyContent="center"
  alignItems="center"
  gap={2}
  sx={{
    position: 'sticky',
    top: 26,
    zIndex: 10,
    mt: '64px',
    backgroundColor: 'white',
    padding: 1,
    borderRadius: '999px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    maxWidth: 700,
    margin: 'auto'
  }}
>
  <TextField
    variant="outlined"
    placeholder="Country"
    onChange={(e) => setSearchHome(e.target.value)}
    sx={{
      flex: 1,
      backgroundColor: '#f9f9f9',
      borderRadius: '999px',
      '& .MuiOutlinedInput-root': {
        height: 35,
        borderRadius: '999px',
        paddingLeft: 1,
        fontSize: 14,
        '& fieldset': {
          border: 'none',
        },
        '&:hover': {
          backgroundColor: '#f1f1f1',
        },
        '&.Mui-focused': {
          backgroundColor: '#fff',
          boxShadow: '0 0 0 2px rgba(25,118,210,0.2)',
        },
      },
    }}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon sx={{ color: '#4B0082' }} fontSize="small" />
        </InputAdornment>
      ),
    }}
  />

  <TextField
    variant="outlined"
    placeholder="City"
    onChange={(e) => setSearchCity(e.target.value)}
    sx={{
      flex: 1,
      backgroundColor: '#f9f9f9',
      borderRadius: '999px',
      '& .MuiOutlinedInput-root': {
        height: 35,
        borderRadius: '999px',
        paddingLeft: 1,
        fontSize: 14,
        '& fieldset': {
          border: 'none',
        },
        '&:hover': {
          backgroundColor: '#f1f1f1',
        },
        '&.Mui-focused': {
          backgroundColor: '#fff',
          boxShadow: '0 0 0 2px rgba(25,118,210,0.2)',
        },
      },
    }}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon sx={{ color: '#4B0082' }} fontSize="small" />
        </InputAdornment>
      ),
    }}
  />
</Box>

  {/* Toggle Button at Center */}
  <Box sx={{ display: 'flex', justifyContent: 'center', top:0}}>
    <Button
      onClick={toggleView}
      variant="contained"
      color="primary"
      sx={{
        marginTop:3,
        textTransform: 'none',
        borderRadius: 20,
        width: '200px',
        height: 36,
        backgroundColor: '#4B0082',
        color: 'white',
        '&:hover': {
          backgroundColor: 'grey.800',  // or keep black if you prefer
        }
      }}
    >
      {map ? <FormatListBulletedRoundedIcon /> : <ExploreRoundedIcon />}
    </Button>
  </Box>
</Box>



      {/* Conditional Rendering */}
      <Box sx={{ marginTop: 9, padding: 0 }}>
        {map ? <Yourmap /> : <Homelist searhome={searchHome} searchcity = {searchcity}/>}
      </Box>
    </Box>
  );
};

export default AllHomes;





// <div>
    //   <button onClick={convert}> {map? (<h>Search on List</h>): <h>Search on Map</h>}</button>
    //     {map? (<Yourmap/>) : (<Homelist/>)}
    // </div>