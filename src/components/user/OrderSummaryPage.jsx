import React, { useState, useEffect } from 'react';  
import { Card, CardContent, CardActions, Typography, Grid, Button, Tooltip,useMediaQuery } from '@mui/material';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import API_URL from '../../config';
function OrderSummaryPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const userId = useSelector(state => state.user.userID);

  const isSmallScreen = useMediaQuery("(max-width:600px)");
  const isMediumScreen = useMediaQuery("(max-width:960px) and (min-width:601px)");
  const isLargeScreen = useMediaQuery("(min-width:961px)");
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/orders/user/${userId}`);
        setOrders(response.data.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [userId]);

  const handleCardClick = (order) => {
    navigate('/product-details', { state: { orderId: order.order_id } });
  };

  const getStatusColor = (orderStatus_Id, statusStep) => {
    return orderStatus_Id >= statusStep ? 'orange' : 'lightgray';
  };

  return (
    <Grid container spacing={2} sx={{ padding: 2 }}>
      {/* Map through the fetched orders */}
      {orders.map((order) => (
        <Grid item xs={6} sm={6} md={4} lg={2} key={order.order_id}>
          <Tooltip title="View Order Details">
          <Card  sx={{ backgroundColor:"rgba(220, 239, 255, 1)"}}>
            <Grid container>
              <Grid item xs={12}>
                <CardContent>
                  <Typography >Order id# <span style={{fontWeight:"29px",color:"#0045f5",fontSize:isSmallScreen?"16px":"18px"}}>{order.order_id}</span></Typography>
                  <Typography variant="body2">
                    Payment Status: <span style={{fontSize:"16px",fontWeight:"bold"}}>{
    order.payment === "offline"
      ? "Cash On Delivery" // Display "COD" for offline payments
      : order.payment === "online"
      ? "Verifying" // Display "Verify" for online payments
      : order.payment === "paid"
      ? "Paid"   // Display "Paid" if the payment status is already marked as "Paid"
      : "COD"    // Default to "COD" if no specific match is found
  }</span>
                  </Typography>  
                  <Typography sx={{fontSize:isSmallScreen?"14px":"18px"}}> Total Price: ₹{order.total_price}</Typography> 
                    
                   <Typography>Order Date: {new Date(order.order_date).toLocaleDateString()}</Typography> 
                <br />   <Button variant="contained" sx={{cursor:"pointer"}} color="warning" onClick={() => handleCardClick(order)}>
    Track Your Order
  </Button>
                </CardContent>
              </Grid>
              
            </Grid>
            
          </Card></Tooltip>
        </Grid>
      ))}
    </Grid>
  );
}

export default OrderSummaryPage;
