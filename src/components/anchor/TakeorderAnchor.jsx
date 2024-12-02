import React, { useState,useEffect } from 'react';
import { 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Checkbox, 
  Button, 
  Typography, 
  Tabs, 
  Tab, 
  TextField, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Autocomplete 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ContentCopyIcon from '@mui/icons-material/ContentCopy'; // For Copy button
import PhoneIcon from '@mui/icons-material/Phone'; // For Call button
import MapIcon from '@mui/icons-material/Map'; // For Google Maps button
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import API_URL from '../../config';
import Paper from '@mui/material/Paper';

//import { useSelector } from 'react-redux';
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const anchorOptions = [
  { title: 'Anchor 1' },
  { title: 'Anchor 2' },
  { title: 'Anchor 3' },
];



const TakeOrderAnchor= ({ triggerRefresh, refresh }) => {
  const [orders, setOrders] = useState([]);
  const [pendingOrder, setpendingOrders] = useState([]);
  const [filteredStatus, setFilteredStatus] = useState('Assign By Admin');
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(1);
  const [assignedAnchors, setAssignedAnchors] = useState({}); // Store assigned anchors per order
  const { serviceType } = useParams(); 
  const [products, setProducts] = useState([]);
  const [orderData, setOrderData] = useState(null);
  const [deliveryman,setDeliveryman]=useState([]);
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate=useNavigate();

  const CompanyId = useSelector(state => state.user.company_Id);
  const deliveryman_Id = useSelector(state => state.user.deliveryman_id);
  console.log("deliveryman id",deliveryman_Id);
  

  // Function to handle tab change
  const handleStatusChange = (event, newValue) => {
    setFilteredStatus(newValue);
    
    // Fetch pending orders if the "Pending" tab is clicked
    if (newValue === 'Pending'  || newValue === 'Ready to Drop') {
      fetchPendingOrders(); // Call the function to get pending orders
    }
   
  };

  // Function to fetch pending orders
  const fetchPendingOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/all-order-details`); // Fetch orders with "Pending" status from your API
     // const data = await response.json();
      setpendingOrders(response.data.data);// Update pendingOrder state
    } catch (error) {
      console.error('Error fetching pending orders:', error);
    }
  };
  // useEffect to fetch orders when the component mounts
  useEffect(() => {
    fetchPendingOrders(); // Fetch orders when the component mounts
  }, [refresh]); 

  useEffect(() => {
    const fetchServices = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/deliveryman/${CompanyId}`);
            setDeliveryman(response.data); // Assuming response contains the services array
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    fetchServices();
}, [refresh]);

    // Fetch orders from backend
    useEffect(() => {
      const fetchOrders = async () => {
        try {
          const response = await axios.get(`${API_URL}/api/assignedOrders/${deliveryman_Id}`); // Replace with your API URL
          setOrders(response.data);
          console.log("or",response.data.data);
          
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      };
  
      fetchOrders();
    }, [refresh]);
    console.log(orders);
    

    const handleGetReadyDrop = async (orderId) => {
      try {
          const response = await axios.put(`${API_URL}/api/orders/${orderId}/ready-to-drop`);
          alert(response.data.message);
          navigate("/")
          // Optionally refresh the orders list or update UI
      } catch (error) {
          console.error('Error updating order to Ready to Drop', error);
      }
  };
  
  const handleSetCompleted = async (orderId) => {
      try {
          const response = await axios.put(`${API_URL}/api/orders/${orderId}/completed`);
          alert(response.data.message);
          navigate("/")
          // Optionally refresh the orders list or update UI
      } catch (error) {
          console.error('Error updating order to Completed', error);
      }
  };
   

    console.log("s",selectedOrder);
    console.log("order",orderData,products);
    
    
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleOrderClick = async (orderId) => {
    setSelectedOrder(orderId);
    setOpen(true);

    try {
      const response = await axios.get(`${API_URL}/api/order-details/${orderId}`);
      const { order, products } = response.data.data;
      setOrderData(order);
      setProducts(products);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };
  const handleClose = () => {
    setOpen(false);
    setOrderData(null);
    setProducts([])
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

 
  const handleSendTaskToAnchor = async (orderId) => {
    try {
      const response = await axios.post(`${API_URL}/api/deliveryman/accept-order`, {
        orderId, 
        deliverymanId:deliveryman_Id
      });
  
      if (response.status === 200 || response.status===201) {
        toast.info('Order accepted successfully!');
        triggerRefresh();
        // Optionally update the UI after the success
      }
     
    } catch (error) {
      console.error('Error accepting order:', error);
      alert('Failed to accept the order.');
    }
  };
  console.log("orderdata",orderData);
  
  const openGoogleMaps = (longitude, latitude,address) => {
    if (longitude==0 || latitude==0) {
      const googleMapsUrl = `${address}`;
      window.open(googleMapsUrl, '_blank');
      return;
    }
    
    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(googleMapsUrl, '_blank');
  };
  const dialPhoneNumber = (phoneNumber) => {
    if (phoneNumber) {
      window.open(`tel:${phoneNumber}`);
    } else {
      alert('Phone number not available!');
    }
  };
  
  const filteredOrders = (filteredStatus === 'Pending' || filteredStatus === 'Ready to Drop' ? pendingOrder : orders).filter(order =>
    (filteredStatus === 'Assign By Admin' || order.status_Name === filteredStatus) &&
    (order.user_Name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    
    order.order_id.toString().includes(searchQuery) ||
     order.email_Id.toLowerCase().includes(searchQuery.toLowerCase()))  &&
     (!startDate || !endDate || (new Date(order.order_date) >= new Date(startDate) && new Date(order.order_date) <= new Date(endDate)))
 
  );

  const copyPhoneNumber = (phoneNumber) => {
    navigator.clipboard.writeText(phoneNumber)
      .then(() => {
        alert('Phone number copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy phone number: ', err);
      });}
  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'rgba(245, 113, 0, 1)';
      case 'Ready to Pick':
        return 'rgba(1, 135, 117, 1)';
      case 'Pick':
        return 'rgba(255, 0, 189, 1)';
      case 'Drop':
        return 'rgba(0, 157, 255, 1)';
      case 'Completed':
        return 'rgba(33, 176, 47, 1)';
        case 'Ready to Drop':
            return 'rgba(0, 13, 255, 1)';
      default:
        return 'red';
    }
  };
  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);
  return (
    <Box p={3} sx={{backgroundColor:"rgb(245, 245, 245)"}}>
      <Typography variant="h5" gutterBottom>Assign By Admin</Typography>
      
      {/* Filter tabs */}
      <Tabs value={filteredStatus} onChange={handleStatusChange}>
        <Tab label={`Assign By Admin (${orders.length})`} value="Assign By Admin" />
        <Tab label={`Pending (${pendingOrder.filter(order => order.status_Name === 'Pending').length})`} value="Pending" />
        
        <Tab label={`Ready to Drop (${pendingOrder.filter(order => order.status_Name === 'Ready to Drop').length})`} value="Ready to Drop" />
     
      </Tabs>

      {/* Search and Date Filters */}
      <Box my={2} display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" gap={2}>
        <TextField 
          label="Start date" 
          type="date" 
          InputLabelProps={{ shrink: true }}
          value={startDate}
          onChange={handleStartDateChange}
        />
        <TextField 
          label="End date" 
          type="date" 
          InputLabelProps={{ shrink: true }}
          value={endDate}
          onChange={handleEndDateChange}
        />
        </Box>
        
        <TextField
          label="Search Name Or Order Id..."
          value={searchQuery}
          onChange={handleSearch}
          InputProps={{
            endAdornment: (
              <IconButton>
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
      </Box>

      {/* Orders Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {/* <TableCell>
                <Checkbox />
              </TableCell> */}
              <TableCell>Order #Id</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>city</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
              {/* <TableCell>Send Task To Anchor</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.order_id}>
                {/* <TableCell>
                  <Checkbox />
                </TableCell> */}
                <TableCell>
                  <Button onClick={() => handleOrderClick(order.order_id)}>{`#${order.order_id}`}</Button>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Typography>{order.user_Name}</Typography>
                  </Box>
                  <Typography variant="caption" color="textSecondary">{order.email_Id}</Typography>
                </TableCell>
                <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
                <TableCell>{order.city_Id}</TableCell>
                <TableCell>{order.total_item}</TableCell>
                <TableCell>₹{order.total_price}</TableCell>
                <TableCell>
                  <Typography style={{ color: getStatusColor(order.status_Name) ,fontSize:"larger",fontWeight:"bold"}}>{order.status_Name}</Typography>
                </TableCell>
                
<TableCell>
 
      <Button
  variant="contained" 
  color="primary" 
  onClick={() => handleSendTaskToAnchor(order.order_id)}  // Pass order_id and deliverymanId
>
  Accept Order
</Button>

</TableCell>


              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog Box for Order Details */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {orderData && products ? (
            <Grid container spacing={2}>
              {/* Product List Card */}
              {/* <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6">Products</Typography>
                    {products.map((product, index) => (
                      <Typography key={index} variant="body1">
                        {product.product_name}({product.category_name}) - ₹{product.rate} (x{product.quantity})
                        
                        ---₹{product.total_price} 
                      </Typography>
                      
                    ))}
                    <Typography>------------------------------------------------</Typography>
                     <Typography variant="body1">Total Price: -----------------₹{orderData.total_price}</Typography> 
                  </CardContent>
                </Card>
              </Grid> */}
              <Grid item xs={12} >
  <Card variant="outlined">
    <CardContent>
      <Typography variant="h6" gutterBottom>Products</Typography>
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
            {/* Optional Total Price Row */}
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
      </TableContainer>
    </CardContent>
  </Card>
</Grid>

              <Grid item xs={12}  sm={6}>
        <Card>
          <CardContent>
            <Typography variant="h6"> Address Details</Typography>
            
            <Typography variant="body2">{orderData.city_Id},{orderData.Area}</Typography>
            <Typography variant="body2">{orderData.Street},{orderData.Floor_Door_no}</Typography>
          
            <Typography>Customer Phone Number: {orderData.mobile_number
            }</Typography>
    <Box sx={{ display: 'flex', gap: 2 }}> {/* Flexbox for horizontal alignment */}
    

      <Button 
        variant="contained" 
        color="secondary" 
        sx={{fontSize:"8"}}
        startIcon={<PhoneIcon />} // Add Phone Icon
        onClick={() => dialPhoneNumber(orderData.mobile_number)}
      >
        Call Phone Number
      </Button>

      <Button  
        variant="contained" 
        sx={{ backgroundColor: 'rgba(255, 112, 3, 0.69)', color: "white" ,fontSize:"8"}}
        startIcon={<MapIcon />} // Add Map Icon
        onClick={() => openGoogleMaps(orderData.longitude, orderData.lattitude,orderData.address[0])}
      >
        Open Map
      </Button>
    </Box>
          </CardContent>
        </Card>
      </Grid>
              {/* Order Details Card */}
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6">Order Details</Typography>
                    <Typography variant="body1">Order ID: {orderData.order_id}</Typography>
                    {/* <Typography variant="body1">User Code: {orderData.user_Code}</Typography> */}
                    <Typography variant="body1">Total Price: ₹{orderData.total_price}</Typography>
                    <Typography variant="body1">Order Date: {new Date(orderData.order_date).toLocaleDateString()}</Typography>
                    
                    {/* <Typography variant="body1">Order Status: {orderData.orderStatus_Id}</Typography> */}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">Delivery Man Details</Typography>
            <Typography variant="body2">Name: {orderData.deliveryman_name}</Typography>
            <Typography variant="body2">Contact: {orderData.contact}</Typography>
          </CardContent>
        </Card>
      </Grid>
            </Grid>
          ) : (
            <Typography>Loading...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TakeOrderAnchor;
