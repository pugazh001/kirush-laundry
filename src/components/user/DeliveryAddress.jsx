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
import PaymentIcon from '@mui/icons-material/Payment';
import QRCode from 'react-qr-code';
import ClipboardJS from 'clipboard';
import { CopyAll as CopyIcon } from '@mui/icons-material'; // Copy Icon for the button
const DeliveryAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
 // const { cartItems, totalPrice,totalquantity } = location.state || { cartItems: [], totalPrice: 0 ,totalquantity};
  const userId = useSelector(state => state.user.userID);
 const { cartItems, dispatch } = useCart();
 // const userId="GUES240010"
 // const { dispatch } = useCart(); // Get dispatch from CartContext

 const totalPrice = localStorage.getItem('totalPrice');
    const totalquantity = localStorage.getItem('totalQuantity');
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
  //const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const handleCardClick = (path) => {
    const addressId = addresses[selectedAddress].AddressId;
    console.log(addressId);
    const selectedAddressData = addresses[selectedAddress]; // Get the selected address data
    navigate(path, { state: { address: selectedAddressData } }); // Pass address data in state
    // navigate('/addaddress')
  };
const handleDelete=async()=>{
  console.log("delete");
  const addressId = addresses[selectedAddress].AddressId;
 // alert(`delete ${addressId}`)
  //console.log(addressId);
  try {
    const response = await axios.delete(`${API_URL}/api/disable/address/${userId}/${addressId}`);
    //navigate('/');
    // navigate('/delivery')
   
     // Refresh the page after deletion
     window.location.reload();
     toast.info("Address deleted sucessfully...!");
    return response.data;
    
} catch (error) {
    console.error('Error deleting address:', error);
    throw error; // Re-throw the error for handling in the component
}
  
}
  const handleRadioChange = (value) => {
    setSelectedAddress(value);
  };
  //const addressId = addresses[selectedAddress].AddressId;

    //console.log(addressId);
    
    const handleSubmitOrder = async () => {
      if (selectedAddress === null) {
        toast.warn('Please select a delivery address.');
        return;
      }
  
      const addressId = addresses[selectedAddress].AddressId;
  
      try {
        const response = await axios.post(`${API_URL}/api/orders`, {
          cartItems,
          totalPrice,
          addressId,
          userId,
          totalquantity,
          payment:paymentMethod
        });
   // console.log();
    
        //alert(`Order placed successfully! Order ID: ${response.data.orderId}`);
  
        // Remove the items from the cart based on the service type
        cartItems.forEach(item => {
          dispatch({ type: 'REMOVE_FROM_CART', payload: { id: item.servSubType_Id } });
        });
        localStorage.removeItem('totalPrice');
        localStorage.removeItem('totalQuantity');
        navigate('/');
        toast.success(`Order processed successfully! Order ID: ${response.data.orderId}`);
      } catch (error) {
        alert('Error placing order: ' + (error.response?.data?.error || 'Unknown error'));
      }
    };
    // State to control showing all addresses

  // Toggle function to show/hide addresses
  const toggleShowAll = () => {
    setShowAllAddresses((prev) => !prev);
    setShowAllAddresses(!showAllAddresses);
  };

  // Decide which addresses to display (all or only first two)
  const displayedAddresses = showAllAddresses ? addresses : addresses.slice(0, 2);
  
  console.log(cartItems);
  

  //const gpayLink = "upi://pay?pa=ajinkyapugal27@okicici&pn=Pugazh S&am=1&cu=INR";
  const [showQRCode, setShowQRCode] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('offline'); // Default to 'online'
  const amount = totalPrice; // Amount to be paid
    const transactionNote = `UserId# ${userId}`; // Transaction note
    // const gpayLink = `upi://pay?pa=ajinkyapugal27@okicici&pn=Pugazh%20S&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
    const gpayLink = `upi://pay?pa=9159079191@okbizaxis&pn=kirush%20Laundry&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
  const handlePaymentClick = () => {
    if (paymentMethod === 'online') {
        setShowQRCode(true); // Show QR code for online payment
    } else {
        alert("Please proceed with the offline payment.");
        setShowQRCode(false);
    }
};


const handlePaymentMethodChange = (event) => {
  setPaymentMethod(event.target.value);
};
//alert(paymentMethod)

const gpayNumber = "9159079191";
const [copied, setCopied] = useState(false);
useEffect(() => {
  const clipboard = new ClipboardJS('.copy-button', {
    text: () => gpayNumber,
  });

  clipboard.on('success', () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset the copied message after 2 seconds
  });

  clipboard.on('error', () => {
    alert('Failed to copy text');
  });

  // Clean up the clipboard instance on component unmount
  return () => {
    clipboard.destroy();
  };
}, [gpayNumber]);
// const handleCopy = () => {
//     navigator.clipboard.writeText(gpayNumber);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000); // Reset copy message after 2 seconds
// };
const handleCopy = () => {
  const clipboard = new ClipboardJS('.copy-button', {
    text: () => gpayNumber
  });

  clipboard.on('success', () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset copy message after 2 seconds
  });

  clipboard.on('error', () => {
    alert('Failed to copy text');
  });

  clipboard.destroy();
};
  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', padding: 2 }}>
      <Typography variant="h5" component="div" gutterBottom>
        DELIVERY ADDRESS
      </Typography>

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
      {addresses.length > 2 && ( 
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
   
     
    <div >
            <FormControl component="fieldset">
                <FormLabel component="legend">Select Payment Method</FormLabel>
                <RadioGroup
                    row
                    aria-label="payment-method"
                    name="payment-method"
                    value={paymentMethod}
                    onChange={handlePaymentMethodChange}
                >
                    
                    <FormControlLabel value="offline" control={<Radio />} label="Offline Payment" />
                    <FormControlLabel value="online" control={<Radio />} label="Online Payment" />
                </RadioGroup>
            </FormControl>

           {paymentMethod === 'online' && (<>
              <Typography variant="body1" style={{ marginBottom: '5px' }}>
                      Scan this QR code to pay:
                  </Typography>
                <div style={{
                  marginTop: '10px',
                  marginBottom: '10px',
                  marginLeft:"10px",
                  textAlign: 'center',
                  display: 'flex',
                  justifyContent:"space-between",
                  alignItems: 'center',
              }}>
                  
                  <QRCode value={gpayLink} size={160} />

                  <Typography variant="h6" style={{ marginTop: '10px' , padding:"0px",}}>
                      OR
                  </Typography>
                                                    <div style={{flexDirection:"column",padding:"0px"}}>
                  <Typography variant="body1" style={{ marginTop: '10px' }}>
                      GPay Number: {gpayNumber}
                  </Typography>
                  <Typography variant="body1" style={{ marginTop: '10px' }}>
                      Total Amount : {totalPrice}
                  </Typography>
                  {/* <Button variant="outlined" onClick={handleCopy} style={{ marginTop: '5px' }}>
                      {copied ? "Copied!" : "Copy Number"}
                  </Button> */}
                    <div>
      <Button
        variant="contained"
        color="primary"
        className="copy-button" // Class is required for ClipboardJS
        startIcon={<CopyIcon />}
      >
        Copy Gpay Number
      </Button>

      {/* Snackbar to show a confirmation message */}
      {copied && (
        <Snackbar
          open={copied}
          message="Number copied to clipboard!"
          autoHideDuration={2000}
        />
      )}
    </div>
                  </div> 
              </div></>
          )}
        </div>
      <Button variant="contained" color="primary" sx={{ backgroundColor: 'rgba(17, 125, 247, 0.8)', marginTop: '5px' }} onClick={handleSubmitOrder}>
        DELIVER HERE
      </Button>
     
    </Box>
  );
};
// Function to detect if the user is on a mobile device



export default DeliveryAddress;
