import React , {useState,useContext,useEffect , useRef} from 'react'

import HomeContext from '../context/HomeContext'

import Cardhomes from './Cardhomes'
import HolidayVillageRoundedIcon from '@mui/icons-material/HolidayVillageRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';

import FavoriteIcon from '@mui/icons-material/Favorite';

import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import CancelIcon from '@mui/icons-material/Cancel';

import IconButton from '@mui/material/IconButton';


import { Grid, Typography, Box , Slider , Modal , Button , Stack , TextField , Checkbox, FormControlLabel} from '@mui/material';
import { grey } from '@mui/material/colors';
const Homelist = ({ searhome  , searchcity}) => {

    const [open, setOpen] = useState(false);

    let {homeData , favhouseData , getFavHomeData}= useContext(HomeContext)

    const [wishlist , setWishlist]  = useState(false)


    // const filteredHome = homeData.filter(home =>
    // home.properties.country.toLowerCase().startsWith(searhome.toLowerCase()));

      const filteredHome = homeData.filter(home => {
      const countryMatch = searhome
        ? home.properties.country.toLowerCase().startsWith(searhome.toLowerCase())
        : true; // If no search input, don't filter by country

      const cityMatch = searchcity
        ? home.properties.city.toLowerCase().startsWith(searchcity.toLowerCase())
        : true; // If no search input, don't filter by city

      return countryMatch && cityMatch;
    });

    // const homeToShowtemp = searhome ? filteredHome : homeData; 

    
    const homeToShowtemp = (searhome || searchcity) ? filteredHome : homeData;
    const [homeToShow , setHomeToShow] = useState(homeToShowtemp);

    

    const[minRange , setMinRange] = useState(0);
    const[maxRange , setMaxRange] = useState(0);
    const [value, setValue] = useState([null,null]);
    const typeRef = useRef(new Set()); 
    const [typeofprop , setTypeofprop] = useState(new Set());
    const [version, setVersion] = useState(0);

    const [guests , setGuests] = useState(null);

    const [filterVersion, setFilterVersion] = useState(0);

    const handleType = (item) => (event) => {
    if (event.target.checked) {
      typeRef.current.add(item);  // O(1)
    } else {
      typeRef.current.delete(item);  // O(1)
    }

    setVersion(v => v + 1);
  };





    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    const updateMinRange = (newMin) => {
      setMinRange(newMin);
    }
    const updateMaxRange = (newMax) => {
      setMinRange(newMax);
    }

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const SubmitType = () => {
    // snapshot the current set for useEffect trigger

    if(typeRef.current.size > 0){
      setTypeofprop(new Set(typeRef.current));

      const filteredType = homeData.filter(home =>
        typeRef.current.has(home.properties.types_of_property)
      );

      const filteredsearHome = filteredType.filter(home => {
        const countryMatch = searhome
          ? home.properties.country.toLowerCase().startsWith(searhome.toLowerCase())
          : true; // If no search input, don't filter by country

        const cityMatch = searchcity
          ? home.properties.city.toLowerCase().startsWith(searchcity.toLowerCase())
          : true; // If no search input, don't filter by city

        return countryMatch && cityMatch;
      });
      

      const searfilter = (searhome || searchcity) ? filteredsearHome : filteredType;
      const filterprice = searfilter.filter(home => 
        (value[0]!==null && value[1]!=null) ? (home.properties.base_price >= value[0] && home.properties.base_price <= value[1]) : true)

      const filterguest = filterprice.filter(home => 
      (guests!==null) ? (home.properties.total_number_of_guest<=guests): true
      )
      setHomeToShow(filterguest)
      // setHomeToShow(filteredType);
      console.log(filteredType);
      console.log(typeofprop);
    }
    else{
      const filterprice = homeToShowtemp.filter(home => 
      (value[0]!==null && value[1]!=null) ? (home.properties.base_price >= value[0] && home.properties.base_price <= value[1]) : true)
      const filterguest = filterprice.filter(home => 
      (guests!==null) ? (home.properties.total_number_of_guest<=guests): true
      )
      setHomeToShow(filterguest)
      // setHomeToShow(filterprice);
    }
    handleClose();
    };

    const clearAllfilter = () =>{
      setGuests(null);
      setTypeofprop(new Set());
      setMinRange(0);
      setMaxRange(0);
      setValue([null,null]);
      typeRef.current.clear();
      SubmitType();

      setFilterVersion(prev => prev + 1);
    }


    useEffect(() => {
      SubmitType();
    }, [filterVersion]);


    useEffect(() => {
      if(wishlist){
        const favIds = favhouseData.map(f => f.home);
        setHomeToShow(homeData.filter(home => favIds.includes(home.id)));
      }
      else{
        // window.location.reload();
        // getFavHomeData();
        // setHomeToShow(searhome ? filteredHome : homeData);
        setHomeToShow((searhome || searchcity) ? filteredHome : homeData);
      }
    }, [searhome, favhouseData,wishlist , searchcity]);
    return (
      <Box sx={{background : 'white',padding: 3 , borderRadius:1, boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}>
        {/* Title */}
        {/* <Typography 
          variant="h5" 
          gutterBottom 
          sx={{ textAlign: 'center', fontWeight: 'bold' , fontStyle:'italic' }}
        >
          <HolidayVillageRoundedIcon/>
          <TuneRoundedIcon sx={{ marginLeft :'50px'}}/>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <FavoriteIcon fontSize="medium" color="black" />
            <Typography variant="caption" color="textSecondary">
              Like
            </Typography>
          </Box>
        </Typography> */}

        <Box textAlign="center">
      

      <Box display="flex" justifyContent="center" alignItems="center" gap={6}>

        <Box display="flex" flexDirection="column" alignItems="center" onClick={() => {getFavHomeData();setWishlist(false);}}>
        <HolidayVillageRoundedIcon fontSize="medium" sx={{cursor: 'pointer','&:hover': {color: '#4B0082'}}}/>
        <Typography variant="caption" color="textSecondary">
            All Homes
        </Typography>
        </Box>

      <Box display="flex" flexDirection="column" alignItems="center">
          <TuneRoundedIcon
            fontSize="medium"
            sx={{
              cursor: 'pointer',
              '&:hover': { color: '#4B0082' }
            }}
            onClick={handleOpen}
          />

          <Modal open={open} onClose={handleClose}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 300,
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 24,
                px: 2,
                pb : 2,
                maxHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',        // limit height
              
              }}
            >

              <Box display="flex" justifyContent="flex-end">
                <IconButton onClick={handleClose}    
                sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      color: 'red'
                    }
                  }} >
                  <CancelIcon/>
                </IconButton>
              </Box>
              <Box>
                <Typography  gutterBottom sx={{ fontSize: '1.5rem', fontWeight: 'bold'}}>
                Filter
              </Typography>
              </Box>
              <Box sx={{ overflowY: 'auto', maxHeight: 'calc(80vh - 60px)' }}>
              

              <Typography gutterBottom sx={{ fontWeight: 'bold'}}>
                Price per Guest
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center" sx = {{ padding : 2}}>
                <TextField
                  label="Min"
                  type="number"
                  value={minRange}
                  onChange={(e) => setMinRange(Number(e.target.value))}
                  size="small"
                />
                <TextField
                  label="Max"
                  type="number"
                  value={maxRange}
                  onChange={(e) => setMaxRange(Number(e.target.value))}
                  size="small"
                />
              </Stack>
              
              

              <Slider
                value={value}
                onChange={(e, newValue) => setValue(newValue)}
                valueLabelDisplay="auto"
                min={minRange}
                max={maxRange}
                sx={{
                  color: '#4B0082',
                  height: 4,

                  width : 200,
                  marginLeft:7,
                  
                  '& .MuiSlider-thumb': {
                    width: 8,
                    height: 12,
                  },
                  '& .MuiSlider-rail': {
                    opacity: 0.5,
                  },
                }}
              />

              
              <Typography gutterBottom sx={{ fontWeight: 'bold'}}>Type of Property</Typography>
              
              
                <Box sx = {{ padding : 3}}>
                  <Grid container spacing={1}>
                    {[
                      { value: "cabins", label: "Cabins" },
                      { value: "icons", label: "Icons" },
                      { value: "amazing views", label: "Amazing views" },
                      { value: "beachfront", label: "Beachfront" },
                      { value: "skiing", label: "Skiing" },
                      { value: "container", label: "Containers" },
                      { value: "treehouses", label: "Treehouses" },
                      { value: "mansions", label: "Mansions" },
                      { value: "tiny homes", label: "Tiny Homes" },
                      { value: "amazing pools", label: "Amazing pools" },
                      { value: "play", label: "Play" },
                      { value: "countryside", label: "Countryside" },
                      { value: "farms", label: "Farms" },
                      { value: "camping", label: "Camping" },
                      { value: "rooms", label: "Rooms" }
                    ].map(option => (
                      <Grid item xs={6} key={option.value} container spacing={2.5} sx = {{}}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              size="small"  // reduces checkbox size
                              checked={typeRef.current.has(option.value)}
                              onChange={handleType(option.value)}
                            />
                          }
                          label={
                            <Box sx={{ fontSize: 12 }}>  {/* adjust text size */}
                              {option.label}
                            </Box>
                          }
                        />
                      </Grid>
                    ))}
                  </Grid>
                  </Box>
                  <Box>
                  <Typography gutterBottom sx={{ fontWeight: 'bold'}}>no.of guests</Typography>
                  <TextField
                  sx = {{
                    width:100,
                    marginTop:2
                  }}
                  label="Guests"
                  type="number"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  size="small"
                />
                </Box>
                  </Box>
                  <Box display="flex" flexDirection="column" alignItems="center">
                    <Grid container spacing={2} sx={{ marginTop: 4 }}  justifyContent="flex-end">
                      <Grid item>
                        <Button
                          variant="contained"
                          onClick={clearAllfilter}
                          sx={{ borderRadius: 2, backgroundColor: '#4B0000' }}
                        >
                          Clear All
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          onClick={SubmitType}
                          sx={{ borderRadius: 2, backgroundColor: '#4B0082' }}
                        >
                          Show
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                
              

              
            </Box>
          </Modal>

          <Typography variant="caption" color="textSecondary">
            filter
          </Typography>
        </Box>
        
        <Box display="flex" flexDirection="column" alignItems="center" onClick={() => {getFavHomeData();setWishlist(true);}}>
          <FavoriteIcon fontSize="medium" sx={{cursor: 'pointer','&:hover': {color: '#4B0082'}}} />
          <Typography variant="caption" color="textSecondary">
            Wishlist
          </Typography>
        </Box>
      </Box>
    </Box>
    
        {/* Home List */}
        <Grid container spacing={3} sx = {{marginTop:1}}>
          {homeToShow && homeToShow.length > 0 ? (
            homeToShow.map((h) => (
              <Grid item xs={12} sm={6} md={4} 
              // lg={2}
               key={h.id}
               sx={{ 
                flexBasis: { lg: '20%' }, 
                maxWidth: { lg: '20%' } 
              }}>
                <Cardhomes homes={h} />
              </Grid>
            ))
          ) : (
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ textAlign: 'center', width: '100%' }}
            >
              No homes available.
            </Typography>
          )}
        </Grid>
      </Box>
    );
    
  }

export default Homelist;



// return (
    //   <div>
    //     <ul>
    //       {homeData ? homeData.map(h =>(
    //         <li key={h.id}>
    //           <Cardhomes homes={h.properties} />
    //         </li>
    //       )) : null}
    //     </ul>
  
    //   </div>
    // )
