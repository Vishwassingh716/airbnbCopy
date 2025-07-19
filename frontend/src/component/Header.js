import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Avatar,
  Menu
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import LogoutIcon from '@mui/icons-material/Logout';
import AddHomeIcon from '@mui/icons-material/AddHome';
import ProfileContext from '../context/ProfileContext';

import PermIdentityRoundedIcon from '@mui/icons-material/PermIdentityRounded';

const Header = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const {profilestate} = useContext(ProfileContext)

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const opener = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  return (
    <AppBar position="fixed" sx={{  padding : 0, backgroundColor: 'black' }}>
      <Toolbar>
        {/* Logo / Home Link */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          airbnb
        </Typography>

        {isMobile ? (
          <>
            {/* Hamburger Menu for Mobile */}
            <IconButton
              color="inherit"
              edge="end"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
            >
              {/* <Box
                sx={{
                  width: 250,
                  display: 'flex',
                  flexDirection: 'column',
                  padding: 2,
                }}
              >
                <List>
                  {user ? (
                    <>
                      <ListItem>
                        <ListItemText primary={`Hello, ${user.email}`} />
                      </ListItem>
                      <ListItem
                        button
                        component={Link}
                        to="/becomehost"
                        onClick={toggleDrawer(false)}
                      >
                        <ListItemText primary="Become a Host" />
                      </ListItem>
                      <ListItem
                        button
                        onClick={() => {
                          toggleDrawer(false)();
                          logoutUser();
                        }}
                      >
                        <ListItemText primary="Logout" />
                      </ListItem>
                    </>
                  ) : (
                    <ListItem
                      button
                      component={Link}
                      to="/login"
                      onClick={toggleDrawer(false)}
                    >
                      <ListItemText primary="Login" />
                    </ListItem>
                  )}
                </List>
              </Box> */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {user ? (
              <>
              <IconButton onClick={handleClick}>
                <Avatar sx={{ bgcolor: 'secondary.main' }}  src={`http://127.0.0.1:8000${profilestate.img}`} alt={user.email[0].toUpperCase()} />
              </IconButton>
              <Menu anchorEl={anchorEl} open={opener} onClose={handleClose}>
                <MenuItem><Typography sx={{ color: 'black' }}>
                  Hello, {user.email}
                </Typography> </MenuItem>
                <MenuItem component={Link}
                  to="/p">
                <Typography
                  
                  variant="outlined"
                  color="secondary"
                  sx={{ textTransform: 'none' ,color: 'black'   }}
                >
                  Profile
                </Typography>
                <PermIdentityRoundedIcon/>
                </MenuItem>
                <MenuItem component={Link}
                  to="/becomehost">
                <Typography
                  
                  variant="outlined"
                  color="secondary"
                  sx={{ textTransform: 'none' ,color: 'black'   }}
                >
                  Host your property
                </Typography>
                <AddHomeIcon/>
                </MenuItem>
                <MenuItem onClick={logoutUser}>
                
                <Typography
                  
                  variant="outlined"
                  color="secondary"
                  sx={{
                    textTransform: 'none',
                    borderColor: 'white',
                    color: 'black',
                  }}
                >
                  Logout 
                </Typography>
                <LogoutIcon/>
                </MenuItem>
                

                </Menu>
                
              </>
            ) : (
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                color="secondary"
                sx={{
                  textTransform: 'none',
                  borderColor: 'white',
                  color: 'white',
                }}
              >
                Login
              </Button>
            )}
          </Box>
            </Drawer>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {user ? (
              <>
              <IconButton onClick={handleClick}>
                <Avatar sx={{ bgcolor: 'secondary.main' }}  src={`http://127.0.0.1:8000${profilestate.img}`} alt={user.email[0].toUpperCase()} />
              </IconButton>
              <Menu anchorEl={anchorEl} open={opener} onClose={handleClose}>
                <MenuItem><Typography sx={{ color: 'black' }}>
                  Hello, {user.email}
                </Typography> </MenuItem>
                <MenuItem component={Link}
                  to="/p">
                <Typography
                  
                  variant="outlined"
                  color="secondary"
                  sx={{ textTransform: 'none' ,color: 'black'   }}
                >
                  Profile
                </Typography>
                <PermIdentityRoundedIcon/>
                </MenuItem>
                <MenuItem component={Link}
                  to="/becomehost">
                <Typography
                  
                  variant="outlined"
                  color="secondary"
                  sx={{ textTransform: 'none' ,color: 'black'   }}
                >
                  Host your property
                </Typography>
                <AddHomeIcon/>
                </MenuItem>
                <MenuItem onClick={logoutUser}>
                
                <Typography
                  
                  variant="outlined"
                  color="secondary"
                  sx={{
                    textTransform: 'none',
                    borderColor: 'white',
                    color: 'black',
                  }}
                >
                  Logout 
                </Typography>
                <LogoutIcon/>
                </MenuItem>
                

                </Menu>
                
              </>
            ) : (
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                color="secondary"
                sx={{
                  textTransform: 'none',
                  borderColor: 'white',
                  color: 'white',
                }}
              >
                Login
              </Button>
            )}
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;






































