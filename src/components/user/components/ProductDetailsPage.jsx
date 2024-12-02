import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, Typography, Grid, Button,Snackbar ,Table,TableContainer,TableBody,TableCell,TableHead,TableRow} from '@mui/material';
import axios from 'axios';
import Swal from 'sweetalert2';
import API_URL from '../../../config';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import Paper from '@mui/material/Paper';
import { useSelector } from 'react-redux';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
import { CheckCircleOutline, LocalShipping, DirectionsCar, Home } from '@mui/icons-material';

function ProductDetailsPage() {
  const location = useLocation();
  const { orderId } = location.state; // Get orderId from the state
  const [orderData, setOrderData] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const userId = useSelector(state => state.user.userID);
  const navigate=useNavigate("");

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

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/order-details/${orderId}`);
        const { order, products } = response.data.data;
        setOrderData(order);
        setProducts(products);
      } catch (error) {
        console.error('Error fetching order details:', error);
      }
    };

    fetchOrderDetails();
  }, [orderId]);


  // Cancel Order Function
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // can be 'success', 'error', etc.

  const handleCancelOrder = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it'
    });

    if (result.isConfirmed) {
      try {
        await axios.put(`${API_URL}/api/orders/cancel/${orderId}`);
        Swal.fire(
          'Cancelled!',
          'Your order has been canceled.',
          'success'
        );
        navigate("/history")
        // Optionally, update the UI or redirect the user
      } catch (error) {
        console.error('Error canceling the order:', error);
        Swal.fire(
          'Error!',
          'Failed to cancel the order. Please try again.',
          'error'
        );
      }
    }
  };
  const handleSetCompleted = async (orderId) => {
    try {
        const response = await axios.put(`${API_URL}/api/orders/${orderId}/completed`);
       
        //navigate("/")
        navigate("/history")
        toast.success(response.data.message);
        // Optionally refresh the orders list or update UI
    } catch (error) {
        console.error('Error updating order to Completed', error);
    }
};
 
  if (!orderData) return <div>Loading...</div>;

  const getStatusColor = (orderStatus_Id, statusStep) => {
    return orderStatus_Id >= statusStep ? 'orange' : 'lightgray';
  };
  return (
    <Grid container spacing={3} sx={{ padding: 3 }}>

<Grid item xs={12}  md={4} lg={4}>
   <Card sx={{ backgroundColor:"rgba(220, 239, 255, 1)"}}>
     <CardContent>
     <Typography variant="h6">Order Status</Typography>
     <Timeline position="alternate"  >
                  {/* Order Processed */}
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot style={{ backgroundColor: getStatusColor(orderData.orderStatus_Id, 1) }}>
                        <CheckCircleOutline />
                      </TimelineDot>
                      <TimelineConnector style={{ backgroundColor: getStatusColor(orderData.orderStatus_Id, 1) }} />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="body2" color="textSecondary"> {orderData.orderStatus_Id === 1
        ? "Order Placed"
        : orderData.orderStatus_Id === 2
        ? "Ready to pick your order"
        : "Order Proceed"}</Typography>
                    </TimelineContent>
                  </TimelineItem>

                  {/* Order Shipped */}
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot style={{ backgroundColor: getStatusColor(orderData.orderStatus_Id, 3) }}>
                        <LocalShipping />
                      </TimelineDot>
                      <TimelineConnector style={{ backgroundColor: getStatusColor(orderData.orderStatus_Id, 3) }} />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="body2" color="textSecondary"> {orderData.orderStatus_Id === 3
        ? "Order Ready to Pick"
        : orderData.orderStatus_Id === 4
        ? "Ready to delivery your order"
        : "Order Picked"}</Typography>
                    </TimelineContent>
                  </TimelineItem>

                  {/* En Route */}
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot style={{ backgroundColor: getStatusColor(orderData.orderStatus_Id, 5) }}>
                        <DirectionsCar />
                      </TimelineDot>
                      <TimelineConnector style={{ backgroundColor: getStatusColor(orderData.orderStatus_Id, 5) }} />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="body2" color="textSecondary">En Route</Typography>
                    </TimelineContent>
                  </TimelineItem>

                  {/* Order Arrived */}
                  <TimelineItem>
                    <TimelineSeparator>
                      <TimelineDot style={{ backgroundColor: getStatusColor(orderData.orderStatus_Id, 6) }}>
                        <Home />
                      </TimelineDot>
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="body2" color="textSecondary">Order Delivered</Typography>
                    </TimelineContent>
                  </TimelineItem>
                </Timeline>
     </CardContent>
   </Card>
               
              </Grid>  
      {/* Product List Card */}
      <Grid item xs={12} md={4} lg={4}>
        <Card  sx={{ backgroundColor:"rgba(220, 239, 255, 1)"}}>
          <CardContent>
      
            <Typography variant="h6">Products  Details</Typography>
            <TableContainer component={Paper} sx={{ maxHeight: 300, overflowX: 'auto' }}>
        <Table stickyHeader aria-label="products-table">
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Rate</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Total Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product, index) => (
              <TableRow key={index}>
                <TableCell>{product.product_name}</TableCell>
                <TableCell>{product.category_name}</TableCell>
                <TableCell>₹{product.rate}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>₹{product.total_price}</TableCell>
              </TableRow>
            ))}
            
            <TableRow>
              <TableCell colSpan={4} align="right">
                <Typography variant="subtitle1" component="div"><strong>Total Price:</strong></Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1" component="div"><strong>₹{orderData.total_price}</strong></Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer> <br />
            {orderData && (orderData.orderStatus_Id === 1 || orderData.orderStatus_Id === 2) ? (
  <Button variant="contained" color="error" onClick={handleCancelOrder}>
    Cancel Order
  </Button>
) : orderData.orderStatus_Id === 5 ? (
  <Button
    variant="contained"
    style={{ backgroundColor: "green", color: "white" }}  // Set green color for button
    onClick={() => handleSetCompleted(orderData.order_id)}
  >
    Set Completed
  </Button>
) : null}

          </CardContent>
        </Card>
      </Grid>
      
    
      {/* Delivery Address Card */}
      <Grid item xs={12} md={4} lg={4}>
        <Card sx={{ backgroundColor:"rgba(220, 239, 255, 1)"}}>
          <CardContent>
            <Typography variant="h6">Delivery Address</Typography>
            <Typography variant="body2">{orderData.city_Id}, {orderData.Area}</Typography>
            <Typography variant="body2">{orderData.Street}, {orderData.Floor_Door_no}</Typography>
          </CardContent>
          <CardContent>
            <Typography variant="h6">Delivery Man Details</Typography>
            <Typography variant="body2">Name: {orderData.deliveryman_name}</Typography>
            <Typography variant="body2">Contact: {orderData.contact}</Typography>
          </CardContent>
        </Card>
      </Grid>

    
    </Grid>
  );
}

export default ProductDetailsPage;
