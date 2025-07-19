import React, { useState, useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { Icon } from "leaflet";
import AuthContext from "../context/AuthContext";
import HomeContext from "../context/HomeContext";
import { useNavigate } from "react-router-dom";

import {TextField, Button, Container, Typography, Grid, Paper , MenuItem, Select, InputLabel, FormControl , Checkbox, FormControlLabel ,Modal, Box} from "@mui/material";

const CreateHostPage = () => {
  const { authToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const { homeData, setHomeData } = useContext(HomeContext);

  const [open, setOpen] = useState(false);

  const [airconditioner, setAirconditioner] = useState(false);
  const [heating, setHeating] = useState(false);
  const [wifi, setWifi] = useState(false);
  const [fireext, setFireext] = useState(false);
  const [roomser, setRoomser] = useState(false);
  const [freeparking, setFreeparking] = useState(false);
  const [smokealarm, setSmokealarm] = useState(false);
  const [exteriorcam, setexteriorcam] = useState(false);
  const [fridge, setFridge] = useState(false);
  const [microwave, setMicrowave] = useState(false);


  const [newLocation, setNewLocation] = useState(null);
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    types_of_property: "",
    total_number_of_guest: "",
    base_price: "",
    name: "",
    address: "",
    country: "",
    city: "",
    description: "",
  });

  // Custom icon for markers
  const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
    iconSize: [38, 38],
  });

  const customIcon2 = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/3203/3203071.png",
    iconSize: [38, 38],
  });

  // Add marker on map click
  const AddClick = () => {
    useMapEvents({
      click(e) {
        setNewLocation([e.latlng.lat, e.latlng.lng]); // Capture click coordinates
      },
    });
    return null;
  };


  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  // Handle image selection
  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Save the selected file
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Post data to API
  const postData = async () => {
    if (!newLocation) {
      alert("Please select a location on the map.");
      return;
    }

    // Create FormData object for uploading data and file
    const uploadData = new FormData();
    uploadData.append("types_of_property", formData.types_of_property);
    uploadData.append("total_number_of_guest", formData.total_number_of_guest);
    uploadData.append("base_price", formData.base_price);
    uploadData.append("name", formData.name);
    uploadData.append("address", formData.address);
    uploadData.append("country", formData.country);
    uploadData.append("city", formData.city);
    uploadData.append("description", formData.description);
    uploadData.append("images", image);
    uploadData.append("airconditioner", airconditioner);
    uploadData.append("heating", heating);
    uploadData.append("wifi", wifi);
    uploadData.append("fireext", fireext);
    uploadData.append("roomservices", roomser);
    uploadData.append("freeparking", freeparking);
    uploadData.append("smokealarm", smokealarm);
    uploadData.append("exteriorcam", exteriorcam);
    uploadData.append("fridge", fridge);
    uploadData.append("microwave", microwave);
    uploadData.append(
      "location",
      `SRID=4326;POINT (${newLocation[1]} ${newLocation[0]})`
    );

    try {
      const response = await fetch("http://localhost:8000/api/homes/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken.access}`, // Include the token
        },
        body: uploadData, // Send FormData object
      });

      if (response.status === 201) {
        const savedFeature = await response.json();
        setHomeData((prevData) => [...prevData, savedFeature]); // Update context
        setNewLocation(null); // Clear temporary marker
        setFormData({}); // Reset form
        navigate("/");
        alert("Location added successfully!");
      } else {
        const errorData = await response.json();
        alert(`Error: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      alert("An error occurred while posting data.");
    }
  };

  return (
    <Box sx={{top:60 , position : 'relative'}}>
      <Container maxWidth="lg" style={{ marginTop: "20px" }}>
        <Grid container spacing={4}>
          {/* Form Section */}
          <Grid item xs={12} md={6}>
            <Paper style={{ padding: "20px", backgroundColor: "#f9f9f9" }}>
              <Typography variant="h4" gutterBottom>
                Add New Location
              </Typography>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  postData();
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="City/State"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      fullWidth
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Property Type</InputLabel>
                        <Select
                          name="types_of_property"
                          value={formData.types_of_property}
                          onChange={handleInputChange}
                        >
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
                          ].map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Number of Guests"
                      name="total_number_of_guest"
                      value={formData.total_number_of_guest}
                      onChange={handleInputChange}
                      fullWidth
                      type="number"
                      required
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Base Price"
                      name="base_price"
                      value={formData.base_price}
                      onChange={handleInputChange}
                      fullWidth
                      type="number"
                      required
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <input
                      type="file"
                      name="images"
                      onChange={handleImageChange}
                      accept="image/png, image/jpeg"
                      required
                    />
                  </Grid>

                  
                  <Grid item xs={12}>
                  <Button variant="contained" onClick={handleOpen}>
                    Select Amenities
                  </Button>
                  </Grid>
                  <Modal open={open} onClose={handleClose}>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 500,
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                      }}
                    >
                    <Grid item xs={12}>
                    <FormControlLabel
                        control={
                          <Checkbox
                            checked={airconditioner}
                            onChange={(e) => setAirconditioner(e.target.checked)}
                          />
                        }
                        label="Air Conditioner"
                    />  
                    <FormControlLabel
                        control={
                          <Checkbox
                            checked={heating}
                            onChange={(e) => setHeating(e.target.checked)}
                          />
                        }
                        label="Heating"
                    />  
                    <FormControlLabel
                        control={
                          <Checkbox
                            checked={wifi}
                            onChange={(e) => setWifi(e.target.checked)}
                          />
                        }
                        label="Wifi"
                    />  
                    <FormControlLabel
                        control={
                          <Checkbox
                            checked={fireext}
                            onChange={(e) => setFireext(e.target.checked)}
                          />
                        }
                        label="Fire extinguisher"
                    />  
                    <FormControlLabel
                        control={
                          <Checkbox
                            checked={roomser}
                            onChange={(e) => setRoomser(e.target.checked)}
                          />
                        }
                        label="Room services"
                    />  
                    <FormControlLabel
                        control={
                          <Checkbox
                            checked={freeparking}
                            onChange={(e) => setFreeparking(e.target.checked)}
                          />
                        }
                        label="Free Parking"
                    />  
                    <FormControlLabel
                        control={
                          <Checkbox
                            checked={smokealarm}
                            onChange={(e) => setSmokealarm(e.target.checked)}
                          />
                        }
                        label="Smoke alarm"
                    />  
                    <FormControlLabel
                        control={
                          <Checkbox
                            checked={exteriorcam}
                            onChange={(e) => setexteriorcam(e.target.checked)}
                          />
                        }
                        label="Exterior Cameras"
                    />  
                    <FormControlLabel
                        control={
                          <Checkbox
                            checked={fridge}
                            onChange={(e) => setFridge(e.target.checked)}
                          />
                        }
                        label="Fridge"
                    />  
                    <FormControlLabel
                        control={
                          <Checkbox
                            checked={microwave}
                            onChange={(e) => setMicrowave(e.target.checked)}
                          />
                        }
                        label="Microwave"
                    />  
                  
                  </Grid>
                  <Button variant="contained" onClick={handleClose}>
                    Select 
                  </Button>
                    </Box>
                  </Modal>
                  
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                      Add Location
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>

          {/* Map Section */}
          <Grid item xs={12} md={6}>
            <MapContainer center={[28.6, 77.2]} zoom={12} style={{ height: "80vh", width: "100%" }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />

              {homeData.map((feature, index) => {
                const pointData = feature.geometry.match(/POINT \(([^)]+)\)/);
                if (pointData) {
                  const [longitude, latitude] = pointData[1].split(" ").map(Number);
                  return (
                    <Marker key={index} position={[latitude, longitude]} icon={customIcon2}>
                      <Popup>
                        <b>{feature.properties.name}</b>
                        <br />
                        {feature.properties.address}, {feature.properties.city}
                      </Popup>
                    </Marker>
                  );
                }
                return null;
              })}

              {newLocation && (
                <Marker position={newLocation} icon={customIcon}>
                  <Popup>New Location</Popup>
                </Marker>
              )}

              <AddClick />
            </MapContainer>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CreateHostPage;























































































