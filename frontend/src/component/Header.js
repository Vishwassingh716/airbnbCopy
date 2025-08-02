import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

import { Visibility, VisibilityOff } from '@mui/icons-material';



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
  Menu, Modal,
  InputAdornment,
  TextField
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

import LogoutIcon from '@mui/icons-material/Logout';
import AddHomeIcon from '@mui/icons-material/AddHome';
import ProfileContext from '../context/ProfileContext';

import PermIdentityRoundedIcon from '@mui/icons-material/PermIdentityRounded';

import LockResetTwoToneIcon from '@mui/icons-material/LockResetTwoTone';

const Header = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [drawerOpen, setDrawerOpen] = useState(false);


  const [oldpassword, setoldPassword] = useState('');
  const [showoldPassword, setShowoldPassword] = useState(false);
  const [newpassword, setnewPassword] = useState('');
  const [shownewPassword, setShownewPassword] = useState(false);

  const handleToggleold = () => setShowoldPassword((prev) => !prev);
  const handleTogglenew = () => setShownewPassword((prev) => !prev);

  const {profilestate} = useContext(ProfileContext)
  const {authToken} = useContext(AuthContext)

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const opener = Boolean(anchorEl);
  
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleClosemodal = () => {
    setOpen(false);
    setnewPassword('');
    setoldPassword('');
    setShownewPassword(false);
    setShowoldPassword(false);
  }
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit =async (e) => {
  e.preventDefault();
  // console.log('Password:', password);

   try {
      const response = await fetch('http://localhost:8000/api/change-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + String(authToken.access)
        },
        body: JSON.stringify({
          'old_password': oldpassword,
          'new_password': newpassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password changed successfully.');
        setoldPassword('');
        setnewPassword('');
        setOpen(false);
      } else {
        setError(data.error || 'Failed to change password.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }


  handleClose();
  };
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
                  to="/p"><PermIdentityRoundedIcon/>
                <Typography
                  
                  variant="outlined"
                  color="secondary"
                  sx={{ textTransform: 'none' ,color: 'black'   }}
                >
                  Profile
                </Typography>
                
                </MenuItem>
                <MenuItem component={Link}
                  to="/becomehost"><AddHomeIcon/>
                <Typography
                  
                  variant="outlined"
                  color="secondary"
                  sx={{ textTransform: 'none' ,color: 'black'   }}
                >
                  Host your property
                </Typography>
                
                
                </MenuItem>
                <MenuItem  onClick={() => {setOpen(true); setAnchorEl(false);}} >
                <LockResetTwoToneIcon/>
                <Typography
                  
                  variant="outlined"
                  color="secondary"
                  sx={{ textTransform: 'none' ,color: 'black'   }}
                >
                  change password
                </Typography>
                
                </MenuItem>
                <MenuItem onClick={logoutUser}>
                <LogoutIcon/>
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
 <Modal open={open} onClose={handleClosemodal}>
                  <Box sx = {{ mt : 5,
              
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    maxHeight: '70vh',         // limits height to 90% of viewport
                    overflowY: 'auto',         // enables scroll when content overflows
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 4,}}
                    component="form" onSubmit={handleSubmit}>
                    <Typography variant="h6" gutterBottom>
                      Enter Your Password
                    </Typography>

                    <TextField
                      fullWidth
                      label="Old Password"
                      type={showoldPassword ? 'text' : 'password'}
                      value={oldpassword}
                      onChange={(e) => setoldPassword(e.target.value)}
                      margin="normal"
                      variant="outlined"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleToggleold} edge="end">
                              {showoldPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      fullWidth
                      label="New Password"
                      type={shownewPassword ? 'text' : 'password'}
                      value={newpassword}
                      onChange={(e) => setnewPassword(e.target.value)}
                      margin="normal"
                      variant="outlined"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleTogglenew} edge="end">
                              {shownewPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <Box mt={2} display="flex" justifyContent="flex-end">
                      <Button onClick={handleClosemodal} sx={{ mr: 1 }}>
                        Cancel
                      </Button>
                      <Button type="submit" variant="contained">
                        Submit
                      </Button>
                    </Box>
                  </Box>
                </Modal>
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
                <PermIdentityRoundedIcon/>
                <Typography
                  
                  variant="outlined"
                  color="secondary"
                  sx={{ textTransform: 'none' ,color: 'black'   }}
                >
                  Profile
                </Typography>
                
                </MenuItem>
                <MenuItem component={Link}
                  to="/becomehost">

                <AddHomeIcon/>
                <Typography
                  
                  variant="outlined"
                  color="secondary"
                  sx={{ textTransform: 'none' ,color: 'black'   }}
                >
                  Host your property
                </Typography>
                
                </MenuItem>

                <MenuItem onClick={() => {setOpen(true); setAnchorEl(false);}}>
                <LockResetTwoToneIcon/>
                <Typography
                  
                  variant="outlined"
                  color="secondary"
                  sx={{ textTransform: 'none' ,color: 'black'   }}
                >
                  change password
                </Typography>
                
                </MenuItem>
                
                <MenuItem onClick={logoutUser}>
                <LogoutIcon/>
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
            <Modal open={open} onClose={handleClosemodal}>
                  <Box sx = {{ mt : 5,
              
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
                    p: 4,}}
                    component="form" onSubmit={handleSubmit}>
                    <Typography variant="h6" gutterBottom>
                      Enter Your Password
                    </Typography>

                    <TextField
                      fullWidth
                      label="Old Password"
                      type={showoldPassword ? 'text' : 'password'}
                      value={oldpassword}
                      onChange={(e) => setoldPassword(e.target.value)}
                      margin="normal"
                      variant="outlined"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleToggleold} edge="end">
                              {showoldPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      fullWidth
                      label="New Password"
                      type={shownewPassword ? 'text' : 'password'}
                      value={newpassword}
                      onChange={(e) => setnewPassword(e.target.value)}
                      margin="normal"
                      variant="outlined"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleTogglenew} edge="end">
                              {shownewPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <Box mt={2} display="flex" justifyContent="flex-end">
                      <Button onClick={handleClosemodal} sx={{ mr: 1 }}>
                        Cancel
                      </Button>
                      <Button type="submit" variant="contained">
                        Submit
                      </Button>
                    </Box>
                  </Box>
                </Modal>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;






































