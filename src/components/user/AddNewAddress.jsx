import React, { useState } from 'react';
import { Box, Button, TextField, Typography, RadioGroup, FormControlLabel, Radio, Grid } from '@mui/material';
import { Country, State, City } from 'country-state-city';
import axios from 'axios';
import { useSelector } from 'react-redux';
import LocationOnIcon from '@mui/icons-material/LocationOn'; 
import { useLocation, useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import API_URL from '../../config';
import Swal from 'sweetalert2';
import {  Dialog, DialogContent, DialogTitle } from '@mui/material';
useSelector
const AddNewAddress = () => {
  const locationupdate = useLocation();
  const addressupdate = locationupdate.state?.address;
  const [open, setOpen] = useState(false);
  const [locationUrl, setLocationUrl] = useState("");

  const googleMapsLink = "https://www.google.com/maps/@10.8145558,78.8901637,10.5z?entry=ttu&g_ep=EgoyMDI0MTAxNi4wIKXMDSoASAFQAw%3D%3D";

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // Open Google Maps link in new tab after closing the alert
    window.open(googleMapsLink, "_blank");
  };
  //navigate(path, { state: { address: selectedAddressData } });

  const [country, setCountry] = useState('India');
  const [state, setState] = useState('Tamil-Nadu');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [street, setStreet] = useState('');
  const [floorDoorNumber, setFloorDoorNumber] = useState('');
  const[address,setAddress]=useState('')
  const [location, setLocation] = useState({ latitude: '', longitude: '' });
  //const [showAddressDetails, setShowAddressDetails] = useState(false);
  const countries = Country.getAllCountries();
  const states = State.getStatesOfCountry(country);
  const cities = City.getCitiesOfState(country, state);
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate=useNavigate();
  const [pinCode, setPinCode] = useState('');
    const [landmark, setLandmark] = useState('');
    const [selectedValue, setSelectedValue] = useState('');
    const userId = useSelector(state => state.user.userID);
    const handleRadioChange = (event) => {
      const value = event.target.value;
      setSelectedValue(value);
      console.log('Selected address type:', value); // Log the selected value
    };
    // const handleSubmit=()=>{
    //   console.log(country,state,city,area,street,floorDoorNumber,landmark,pinCode,selectedValue);
      
    // }
   
 console.log(location);
 

const handleSubmit = async () => {
  const addressData = {
    userId, // Replace this with the actual user ID
    country,
    state,
    city,
    area,
    street,
    floorDoorNumber,
    landmark,
    pinCode,
    addressType: selectedValue,
    location, // Should contain latitude and longitude
    phoneNumber,address
  };

  // Basic validation for required fields
  let missingFields = [];

  if (!userId) missingFields.push("User ID");
  if (!country) missingFields.push("Country");
  if (!state) missingFields.push("State");
  if (!city) missingFields.push("City");
  if (!area) missingFields.push("Area");
  if (!street) missingFields.push("Street");
  if (!pinCode) missingFields.push("Pin Code");
  if (!floorDoorNumber) missingFields.push("Floor & Door Number");
  if (!landmark) missingFields.push("Landmark");
  if (!phoneNumber) missingFields.push("Phone Number");

  if (missingFields.length > 0) {
    Swal.fire({
      title: 'Missing Information',
      text: `Please fill in the following fields: ${missingFields.join(", ")}`,
      icon: 'warning',
      confirmButtonText: 'OK',
    });
    return; // Prevent form submission if any fields are missing
  }
 else if(((!location.latitude && !address)||(location.latitude && address))){
  Swal.fire({
    title: 'Missing Information',
    text: 'Please choose one location.',
    icon: 'warning',
    confirmButtonText: 'OK',
  });
  setLocation({ latitude: '', longitude: '' });
  setAddress('');
  return
 }
  try {
    // Send POST request to the backend
    const response = await axios.post(`${API_URL}/api/addAddress`, addressData);
    
    // Navigate to cart-category page on success
    navigate('/delivery');
    
    // Show success toast message
    toast.success('Address added successfully');

    console.log('Address added successfully:', response.data);
  } catch (error) {
    // Use SweetAlert2 for displaying errors
    Swal.fire({
      title: 'Error!',
      text: error.response?.data?.message || 'An error occurred while adding the address.',
      icon: 'error',
      confirmButtonText: 'OK',
    });

    console.error('Error adding address:', error);
  }
};

    const handleCancel=()=>{
      setCountry('')
      setState('')
      setCity('')
      setArea('')
      setStreet('')
      setFloorDoorNumber('')
      setLandmark('')
      setPinCode('')
      setPhoneNumber('')
      setLocation({ latitude: '', longitude: '' })
    }

    const handleMapLocationClick = () => { 
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(position => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            });
          }, error => {
            console.error('Error fetching location: ', error);
          });
        } else {
          alert('Geolocation is not supported by this browser.');
        }
  
  };
  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
      <Typography variant="h6" gutterBottom >
        ADD A NEW ADDRESS
      </Typography>
      {/* <Typography variant="body1">City: {addressupdate.city_Id}</Typography> */}
      <>
                            <Grid container spacing={2} sx={{ mt: 2 }}>
                                <Grid item xs={12} sm={6}>
                                <TextField
                    label="Country"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value="India"
                    InputProps={{ readOnly: true }} // Make the field read-only
                />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                <TextField
                    label="State"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value="Tamil-Nadu"
                    onChange={(e) => setState(e.target.value)}
                    InputProps={{ readOnly: true }} // Make the field read-only
                />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                <TextField label="City" variant="outlined" fullWidth margin="normal"  placeholder="(i,e)Trichy" value={city} onChange={(e) => setCity(e.target.value)} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Area" variant="outlined" fullWidth margin="normal" placeholder="(i,e)Thillai-Nagar" value={area} onChange={(e) => setArea(e.target.value)} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Street" variant="outlined" fullWidth margin="normal" placeholder="(i,e)10th cross west" value={street} onChange={(e) => setStreet(e.target.value)} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Floor & Door Number" variant="outlined" placeholder="(i,e)D-25" fullWidth margin="normal" value={floorDoorNumber} onChange={(e) => setFloorDoorNumber(e.target.value)} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="Landmark" variant="outlined" fullWidth margin="normal" placeholder="(i,e)Apolo city center hospital" value={landmark} onChange={(e) => setLandmark(e.target.value)} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField label="PinCode" variant="outlined" fullWidth margin="normal" placeholder="(i,e)621-307" value={pinCode} onChange={(e) => setPinCode(e.target.value)} />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                <TextField label="Phone Number" variant="outlined" fullWidth margin="normal" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                                </Grid>
                                
                           
                            <Grid item xs={12} sm={6} sx={{ mt: 1 }}>
                            <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
      <Typography variant="h6" gutterBottom>Share Your Order Place Location</Typography>

      {/* Radio Button Group */}
      <p>Please choose one </p>
      <RadioGroup value={selectedValue} onChange={handleRadioChange}>
        <FormControlLabel value="currentLocation" control={<Radio />} label="Your Current Location" />
        <FormControlLabel value="orderPlaceAddress" control={<Radio />} label="Your Order Place Address" />
      </RadioGroup>

      {/* Conditional Rendering based on selected Radio Button */}
      {selectedValue === 'currentLocation' && (
        <Button
          variant="contained"
          color="white"
          startIcon={<LocationOnIcon />}
          onClick={handleMapLocationClick}
          sx={{ mt: 2, backgroundColor: 'rgba(10, 106, 0, 0.8)', color: 'white' }}
        >
          Get Location
        </Button>
      )}

      {selectedValue === 'orderPlaceAddress' && (
        <div>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Share Location
          </Button>

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Video</DialogTitle>
            <DialogContent>
              <h4>Steps</h4>
              <ul>
                <li>1. OK to continue and select your order's exact location</li>
                <li>2. Click to  copy link button </li>
                <li>3. Paste,Your location URL</li>
              </ul>
              <video width="100%" height="auto" controls>
                <source src="http://136.185.14.8:8099/uploads/location.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <p>OK to continue and select your order's exact location</p>

              <Button onClick={handleClose} variant="contained" color="primary" fullWidth>
                OK
              </Button>
            </DialogContent>
          </Dialog>

          <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            label="Your Location URL"
            placeholder="copy here ,Your location URL"
            onChange={(e) => setAddress(e.target.value)}
          />

          {/* <Button onClick={handleSubmit} variant="contained" color="primary" fullWidth>
            Submit
          </Button> */}
        </div>
      )}

      {/* Address Form */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {/* Form Fields... */}
      </Grid>

      {/* <Box sx={{ marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Save Address
        </Button>
        <Button variant="text" color="primary" onClick={() => navigate('/cart-category')}>
          Cancel
        </Button>
      </Box> */}
    </Box>
    </Grid>
    </Grid >             <Box sx={{ marginTop: 2 }}>
        
    
      </Box>

                        </>
     

      <Box sx={{ marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="contained" color="primary" sx={{ backgroundColor: 'rgba(17, 125, 247, 0.8)' }} onClick={handleSubmit}>
          Save Address
        </Button>
        <Button variant="text" color="primary" onClick={handleCancel}>
          CANCEL
        </Button>
      </Box>
    </Box>
  );
};

export default AddNewAddress;
