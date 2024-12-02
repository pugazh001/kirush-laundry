import React from 'react';
import { useCart } from '../../context/CartContext';
import { useLocation, useNavigate } from 'react-router-dom';
import {  Container, Typography, Button, Grid, IconButton,useMediaQuery, Box} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { red, green } from '@mui/material/colors';
import API_URL from '../../config';
import Swal from 'sweetalert2';
function UserCart() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, dispatch } = useCart();

  // Parse the category from the URL
  const queryParams = new URLSearchParams(location.search);
  const category = Number(queryParams.get('category')); // Convert category to a number
  const filteredCartItems = cartItems;
  
 console.log("filter",filteredCartItems);
 console.log("cartitem",cartItems);
 console.log("category",category);
 
 const isSmallScreen = useMediaQuery("(max-width:600px)");
 const isMediumScreen = useMediaQuery("(max-width:960px) and (min-width:601px)");
 const isLargeScreen = useMediaQuery("(min-width:961px)");

  const handleIncreaseQuantity = (id) => {
    dispatch({ type: 'INCREASE_QUANTITY', payload: { id } });
  };

  const handleDecreaseQuantity = (id) => {
    dispatch({ type: 'DECREASE_QUANTITY', payload: { id } });
  };

  const handleRemoveFromCart = (id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { id } });
  };

  const calculateTotalPrice = () => {
    return filteredCartItems.reduce((total, item) => {
  
    const price = parseFloat(item.rate).toFixed(2);

      return total + (price || 0) * item.quantity;
    }, 0);
  };


  const handlePlaceOrder = () => {
    const userID = localStorage.getItem('userID');
  
    if (userID) {
      const totalPrice = calculateTotalPrice().toFixed(2);
    
      const totalquantity=calculateTotalQuantity().toFixed(2)
      
     localStorage.setItem('totalPrice', totalPrice);
     localStorage.setItem('totalQuantity', totalquantity);
   
      navigate('/delivery');
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Please log in',
        text: 'You need to log in to add items to your cart.',
        showCancelButton: true,
        confirmButtonText: 'Log In',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    }
    
   
    console.log('Order placed');
  };
  
  const calculateTotalQuantity = () => {
    return filteredCartItems.reduce((total, item) => total + item.quantity, 0);
  };
  
  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Outfit, serif', marginTop: '10px', marginBottom: '30px' }}>
        Your Cart
      </Typography>

      {filteredCartItems.length === 0 ? (
        <Typography variant="h5" sx={{ fontFamily: 'Outfit, serif', marginTop: '10px', marginBottom: '10px' }}>
          Your cart is empty
        </Typography>
      ) : (
        <>
          <Grid container spacing={2}>
            {filteredCartItems.map((item, index) => (
              <Grid
                key={index}
                item
                xs={12}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'nowrap',
                }}
              >
                <img
                  src={`${API_URL}/uploads/product-images/${item.imagefile}`}
                  alt={item.imagefile}
                  style={{ width: 75, height: 75, borderRadius: '5px' }}
                />
                <Box sx={{ flex: 1, ml: 2 }}>
                  <Typography variant="h6" sx={{ fontFamily: 'Outfit, serif', textTransform: 'capitalize',fontSize:isSmallScreen?"14px":"20px" }}>
                    {item.servSubType_Name}
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'Outfit, serif', textTransform: 'capitalize' ,fontSize:isSmallScreen?"12px":"14px" }}>
                    {item.serv_Name}
                  </Typography>
                  <Typography variant="body2" sx={{ fontFamily: 'Outfit, serif', textTransform: 'capitalize',whiteSpace: 'nowrap',fontSize:isSmallScreen?"10px":"16px" }}>
                    Price: ₹ {parseFloat(item.rate).toFixed(2)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton onClick={() => handleIncreaseQuantity(item.servSubType_Id)} sx={{ color: green[500] }}>
                    <AddIcon />
                  </IconButton>
                  <Typography variant="body1" style={{ margin: '0 8px' }}>{item.quantity}</Typography>
                  <IconButton onClick={() => handleDecreaseQuantity(item.servSubType_Id)}>
                    <RemoveIcon />
                  </IconButton>
                  <IconButton onClick={() => handleRemoveFromCart(item.servSubType_Id)} sx={{ color: red[500] }}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
          <br />
          <hr />
          <Grid container justifyContent="space-between" alignItems="center"  sx={{ mt: 2,marginBottom:"10px" }}>
            <Typography variant="body2" gutterBottom>
              Total Price: ₹<b>{calculateTotalPrice().toFixed(2)}</b>
            </Typography>
            <Button variant="contained" color="primary" sx={{ backgroundColor: 'rgba(17, 125, 247, 0.8)' }} onClick={handlePlaceOrder}>
              Place Order
            </Button>
          </Grid>
        </>
      )}
    </Container>
  );
}

export default UserCart;
