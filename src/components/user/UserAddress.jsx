import React, { useState, useEffect } from 'react';
import {
  Card, CardActionArea, CardContent, Typography, Radio, FormControlLabel,
  Button, Box, FormControl, FormLabel, RadioGroup, IconButton, Grid, Snackbar
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useCart } from '../../context/CartContext';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import API_URL from '../../config';
//import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import QRCode from 'react-qr-code';
import ClipboardJS from 'clipboard';
import { CopyAll as CopyIcon } from '@mui/icons-material'; // Copy Icon for the button
const UserAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const navigate = useNavigate();
  
  const userId = useSelector(state => state.user.userID);




  const [showAllAddresses, setShowAllAddresses] = useState(false);
  useEffect(() => {
 
    
    const fetchAddresses = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/getAddress/${userId}`);
        setAddresses(response.data);
      } catch (error) {
        console.error('Error fetching addresses:', error);
      //  alert('Error fetching addresses');
      }
    };

    if (userId) {
      fetchAddresses();
    }
  }, [userId]);

  const handleCardClick = (path) => {
    const addressId = addresses[selectedAddress].AddressId;
    console.log(addressId);
    const selectedAddressData = addresses[selectedAddress]; // Get the selected address data
    navigate(path, { state: { address: selectedAddressData } }); // Pass address data in state
 
  };
const handleDelete=async()=>{
  console.log("delete");
  const addressId = addresses[selectedAddress].AddressId;

  try {
    const response = await axios.delete(`${API_URL}/api/disable/address/${userId}/${addressId}`);
   
     window.location.reload();
     toast.info("Address deleted sucessfully...!");
    return response.data;
    
} catch (error) {
    console.error('Error deleting address:', error);
    throw error;
}
  
}

  
   
    // State to control showing all addresses

  // Toggle function to show/hide addresses
  const toggleShowAll = () => {
    setShowAllAddresses((prev) => !prev);
    setShowAllAddresses(!showAllAddresses);
  };

  // Decide which addresses to display (all or only first two)
  const displayedAddresses = showAllAddresses ? addresses : addresses.slice(0, 6);
  
  
  


  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
      {/* <Typography variant="h5" component="div" gutterBottom>
        DELIVERY ADDRESS
      </Typography> */}

      <Button variant="contained" sx={{backgroundColor:"rgba(0, 163, 39, 0.8)"}} fullWidth onClick={() => navigate('/addaddress')}>
        Add a new address
      </Button>
     <br /> <br />

     
        <>
        {addresses.length === 0 ? (
        <Typography variant="body1">No saved addresses found.</Typography>
      ) : (
        displayedAddresses.map((address, index) => (
          <Card sx={{ marginBottom: 2, position: 'relative' }} key={index}>
            <CardActionArea
              onClick={() => setSelectedAddress(index)}
              sx={{
                backgroundColor: selectedAddress === index ? 'rgba(220, 239, 255, 1)' : 'transparent',
                borderRadius: '4px',
                transition: 'background-color 0.3s ease',
              }}
            >
              <CardContent>
                <Grid container alignItems="center">
                  <Grid item xs={10}>
                    <FormControlLabel
                      value={index}
                      control={<Radio checked={selectedAddress === index} onChange={() => setSelectedAddress(index)} />}
                      label={
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                            {address.city_Id}, {address.Area}, {address.Street}
                          </Typography>
                          <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                            {address.state_Id}, {address.pin_Code}
                          </Typography>
                        </Box>
                      }
                    />
                  </Grid>
                  {selectedAddress === index && (
                    <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <IconButton sx={{ color: 'rgba(0, 163, 39, 0.8)', padding: 0.5 }} onClick={() => handleCardClick('/editaddress')}>
                        <EditIcon />
                      </IconButton>
                      <IconButton sx={{ color: 'red', padding: 0.5, marginLeft: 1 }} onClick={handleDelete}>
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </CardActionArea>
          </Card>
        ))
      )}

      {/* Show "More" button if there are more than 2 addresses */}
      {addresses.length > 6 && ( 
        <>
        <Button
          variant="outlined"
          onClick={toggleShowAll}
          sx={{
            borderColor: 'transparent', // Remove border color
            '&:hover': {
              borderColor: 'transparent', // Keep it transparent on hover
            }
          }}
          endIcon={showAllAddresses ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        >
          {showAllAddresses ? 'Show Less Address' : 'Show More Address'}
        </Button>
        <br /> <br />
      </>
        
      )}
    </>
   
     
  
     
    </Box>
  );
};
// Function to detect if the user is on a mobile device



export default UserAddress;
