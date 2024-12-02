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
  Autocomplete ,
  List,ListItem, ListItemText,
  Select, MenuItem
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, Grid , Badge, Popover} from '@mui/material';
import { useSelector } from 'react-redux';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ContentCopyIcon from '@mui/icons-material/ContentCopy'; // For Copy button
import PhoneIcon from '@mui/icons-material/Phone'; // For Call button
import MapIcon from '@mui/icons-material/Map'; // For Google Maps button
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import API_URL from '../../config';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import NotificationsIcon from '@mui/icons-material/Notifications';
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;


const OrderList = ({ triggerRefresh, refresh }) => {
  const [orders, setOrders] = useState([]);
  const [filteredStatus, setFilteredStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(1);
  const [assignedAnchors, setAssignedAnchors] = useState({}); // Store assigned anchors per order
  const { serviceType } = useParams(); 
  const [products, setProducts] = useState([]);
  const [orderData, setOrderData] = useState(null);
  const [deliveryman,setDeliveryman]=useState([]);
  const [open, setOpen] = useState(false);
  const navigate=useNavigate();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dialogContent, setDialogContent] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState('offline');
  const [anchorEl, setAnchorEl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [rejectorder,setRejectorders]=useState([]);

  useEffect(() => {
    const fetchServices = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/rejectlist`);
          //   console.log("rerespon",response.data);
             
            setRejectorders(response.data); // Assuming response contains the services array
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    fetchServices();
}, []);
  console.log("reject",rejectorder);
  

    const handleIconClick = (event) => {
      setAnchorEl(event.currentTarget); // Open popover
    };
  
    const handlePopoverClose = () => {
      setAnchorEl(null); // Close popover
    };
  
    const handleNotificationClick = (notification) => {
      setSelectedNotification(notification); // Set selected notification details
      setDialogOpen(true); // Open dialog
      handlePopoverClose(); // Close popover
    };
  
  
  const CompanyId = useSelector(state => state.user.company_Id);
  const handleStatusChange = (event, newValue) => {
    setFilteredStatus(newValue);
  };
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
}, []);

    // Fetch orders from backend
    useEffect(() => {
      const fetchOrders = async () => {
        try {
          const response = await axios.get(`${API_URL}/api/admin/all-order-details`); // Replace with your API URL
          setOrders(response.data.data);
          console.log("or",response.data.data);
          
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      };
  
      fetchOrders();
    },  [refresh]);
    // const [visibleOrders, setVisibleOrders] = useState([]); // Orders currently visible
    // const [itemsPerLoad] = useState(10); // Number of items to load per scroll
    // const [hasMore, setHasMore] = useState(true); // To check if more items are available
  
    // // Fetch all orders from the API
    // useEffect(() => {
    //   const fetchOrders = async () => {
    //     try {
    //       const response = await axios.get(`${API_URL}/api/admin/all-order-details`);
    //       setOrders(response.data.data); // Store full data
    //       setVisibleOrders(response.data.data.slice(0, itemsPerLoad)); // Load initial items
    //     } catch (error) {
    //       console.error("Error fetching orders:", error);
    //     }
    //   };
  
    //   fetchOrders();
    // }, [triggerRefresh]);
  
    // // Handle scroll event
    // const handleScroll = () => {
    //   if (
    //     window.innerHeight + document.documentElement.scrollTop >=
    //     document.documentElement.offsetHeight
    //   ) {
    //     loadMoreOrders();
    //   }
    // };
  
    // // Load more items on scroll
    // const loadMoreOrders = () => {
    //   if (visibleOrders.length >= orders.length) {
    //     setHasMore(false); // No more items to load
    //     return;
    //   }
  
    //   const newOrders = orders.slice(
    //     visibleOrders.length,
    //     visibleOrders.length + itemsPerLoad
    //   );
    //   setVisibleOrders((prev) => [...prev, ...newOrders]);
    // };
  
    // // Attach scroll event listener
    // useEffect(() => {
    //   window.addEventListener("scroll", handleScroll);
    //   return () => window.removeEventListener("scroll", handleScroll); // Cleanup
    // }, [visibleOrders, orders]);
    // console.log(orders);

    const handleGetReadyDrop = async (orderId) => {
      try {
          const response = await axios.put(`${API_URL}/api/orders/${orderId}/ready-to-drop`);
          toast.info(response.data.message);
         // navigate("/")
          triggerRefresh();
          // Optionally refresh the orders list or update UI
      } catch (error) {
          console.error('Error updating order to Ready to Drop', error);
      }
  };
  
  const handleSetCompleted = async (orderId) => {
      try {
          const response = await axios.put(`${API_URL}/api/orders/${orderId}/completed`);
          toast.info(response.data.message);
          //navigate("/")
          triggerRefresh();
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
    setDialogOpen(false); // Close dialog
  };

  const handleSendTaskToAnchor = async (orderId,status_Name) => {
    const selectedAnchors = assignedAnchors[orderId]; // Get the assigned deliverymen for this order
    if (selectedAnchors && selectedAnchors.length > 0) {
      const deliverymanIds = selectedAnchors.map(anchor => anchor.deliveryman_id); // Extract deliveryman IDs
  
      try {
        const response = await axios.post(`${API_URL}/api/assign-deliveryman`, {

          orderId,
          status_Name,
          deliverymanIds
        });
  
       // triggerRefresh(); // Trigger the re-render of the Anchor component
        toast.info('Task assigned successfully:', response.data);
        setAssignedAnchors({})
        triggerRefresh();
        // Optionally handle success response, show a message, update UI, etc.
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: error.response?.data?.message || 'An error occurred while assigning the task to the deliveryman.',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      
        console.error('Error assigning task to deliveryman:', error);
        // Optionally handle the error further, e.g., logging or user notification
      }
    } else {
      console.log('No deliverymen selected for order:', orderId);
    }
  };


  const filteredOrders = orders.filter(order => 
    (filteredStatus === 'All' || order.status_Name === filteredStatus) &&
    (order.user_Name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     order.email_Id.toLowerCase().includes(searchQuery.toLowerCase()) || 
          (order.payment?.toLowerCase()?.includes(searchQuery.toLowerCase()))) &&
     (!startDate || !endDate || (new Date(order.order_date) >= new Date(startDate) && new Date(order.order_date) <= new Date(endDate)))
 
  );
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

  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);


const handleEditClick = (orderId, payment) => {
  setSelectedOrderId(orderId);
  setSelectedPayment(payment);
  setEditOpen(true);
};

const handleEditClose = () => {
  setEditOpen(false);
  setSelectedOrderId(null);
  setSelectedPayment('');
};

const handlePaymentChange = (event) => {
  setSelectedPayment(event.target.value);
};


const handleSubmit = async () => {
  try {
    const response = await axios.put(`${API_URL}/api/orders/updatePayment`, {
      orderId: selectedOrderId,
      paymentStatus: selectedPayment,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Since axios automatically checks response status, you can directly check if the request was successful
    if (response.status === 200||response.status===201) {
     // alert(`Order ID: ${selectedOrderId} payment status updated to: ${selectedPayment}`);
    } else {
      alert(`Failed to update payment status: ${response.data.error}`);
    }

    handleEditClose();
    triggerRefresh();
  } catch (error) {
    console.error('Error updating payment status:', error);
    alert('An error occurred while updating payment status.');
  }
};
useEffect(() => {
  if (editOpen) {
      setSelectedPayment("offline");
  }
}, [editOpen]);
  return (
    <Box p={3} sx={{backgroundColor:"rgb(245, 245, 245)"}}>
      {/* <Typography variant="h5" gutterBottom>Order List</Typography> */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
      <Typography variant="h5" gutterBottom sx={{marginTop:"6px"}}>
        Order List
      </Typography>

      {/* Notification Icon with Badge */}
      <IconButton color="primary" onClick={handleIconClick} style={{ marginLeft: '8px' }}>
        <Badge badgeContent={rejectorder.length} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      {/* Popover for Notifications */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <List style={{ width: '250px' }}>
          {rejectorder.map((notification) => (
            // onClick={() => handleNotificationClick(notification)}
            <ListItem button key={notification.id} >  
              <ListItemText primary={`Order Id ${notification.order_id} Rejected by ${notification.deliveryman_name}`} />
            </ListItem>
          ))}
        </List>
      </Popover>

      {/* Dialog for Notification Details */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>Notification Details</DialogTitle>
        <DialogContent dividers>
          <Typography>{selectedNotification?.deliveryman_name}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>

      {/* Filter tabs */}
      <Tabs value={filteredStatus} onChange={handleStatusChange}>
        <Tab label={`All (${orders.length})`} value="All" />
        <Tab label={`Pending (${orders.filter(order => order.status_Name === 'Pending').length})`} value="Pending" />
        <Tab label={`Ready to Pick (${orders.filter(order => order.status_Name === 'Ready to Pick').length})`} value="Ready to Pick" />
        <Tab label={`Pick (${orders.filter(order => order.status_Name === 'Pick').length})`} value="Pick" />
        <Tab label={`Drop (${orders.filter(order => order.status_Name === 'Drop').length})`} value="Drop" />
        <Tab label={`Complete (${orders.filter(order => order.status_Name === 'Completed').length})`} value="Completed" />
        <Tab label={`Ready to Drop (${orders.filter(order => order.status_Name === 'Ready to Drop').length})`} value="Ready to Drop" />
        <Tab label={`Cancelled by User (${orders.filter(order => order.status_Name === 'User Cancelled').length})`} value="User Cancelled" />
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
          label="Search Name or Email..."
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
      <TableContainer >
        <Table>
          <TableHead>
            <TableRow>
              {/* <TableCell>
                <Checkbox />
              </TableCell> */}
              <TableCell>Order #Id</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>PaymentStatus</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assign to Anchor</TableCell>
              <TableCell>Send Task To Anchor</TableCell>
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
                  <Typography variant="caption" >UserID# <b>{order.user_Code}</b></Typography>
                </TableCell>
                <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
                <TableCell>
                {/* {order.payment}{" "} */}
  {
    order.payment === "offline"
      ? "COD" // Display "COD" for offline payments
      : order.payment === "online"
      ? "Verify" // Display "Verify" for online payments
      : order.payment === "paid"
      ? "Paid"   // Display "Paid" if the payment status is already marked as "Paid"
      : "COD"    // Default to "COD" if no specific match is found
  }
  <IconButton onClick={() => handleEditClick(order.order_id, order.payment)}>
    <EditIcon color='primary' />
  </IconButton>
</TableCell>
                <TableCell>{order.total_item}</TableCell>
                <TableCell>₹{order.total_price}</TableCell>
                <TableCell>
                  <Typography style={{ color: getStatusColor(order.status_Name) ,fontSize:"larger",fontWeight:"bold"}}>{order.status_Name}</Typography>
                </TableCell>
                <TableCell>
  {order.status_Name === 'Pick' || order.status_Name === 'Drop' ? (
    <Typography variant="body1">
      Order handle by: {order.deliveryman_name ? order.deliveryman_name : 'Not Assigned'}
    </Typography>
  ) : (
    <Autocomplete
  multiple
  id={`assign-anchor-${order.order_id}`}
  options={deliveryman} // This is the list of deliverymen from the API
  disableCloseOnSelect
  getOptionLabel={(option) => option.deliveryman_name}
  renderOption={(props, option, { selected }) => {
    const { key, ...optionProps } = props;
    return (
      <li key={key} {...optionProps}>
        <Checkbox
          icon={icon}
          checkedIcon={checkedIcon}
          style={{ marginRight: 8 }}
          checked={selected}
        />
        {option.deliveryman_name}
      </li>
    );
  }}
  onChange={(event, newValue) =>
    setAssignedAnchors((prev) => ({
      ...prev,
      [order.order_id]: newValue, // Store assigned deliverymen for each order
    }))
  }
  value={assignedAnchors[order.order_id] || []} // Assigned deliverymen for this order
  style={{ width: 250 }}
  renderInput={(params) => (
    <TextField {...params} label="Assign Anchor" placeholder="Choose anchor" />
  )}
/>
  )}
</TableCell>
                
<TableCell>
  {order.status_Name === 'Pick' ? (
    <Button
      variant="contained"
      color="primary"
      onClick={() => handleGetReadyDrop(order.order_id)}
    >
      Get Ready Drop
    </Button>
  ) : order.status_Name === 'Drop' ? (
    <Button
      variant="contained"
      color="secondary"
      onClick={() => handleSetCompleted(order.order_id)}
    >
      Set Completed
    </Button>
  ) : (
    <Button 
    variant="contained" 
    color="primary" 
    onClick={() => handleSendTaskToAnchor(order.order_id,order.status_Name)}
    disabled={
      order.status_Name === 'Completed' || 
      order.status_Name === 'User Cancelled' || 
      (assignedAnchors[order.order_id] || []).length === 0
    }
  >
    Send Task
  </Button>
  )}
</TableCell>


              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
     {/* Dialog for editing payment status */}
     <Dialog open={editOpen} onClose={handleEditClose}>
            <DialogTitle>Order ID: {selectedOrderId}</DialogTitle>
            <DialogContent>
                <Typography variant="body1">Select Payment Status:</Typography>
                <Select
                placeholder='gf'
                    value={selectedPayment} // Bound to selectedPayment state
                    onChange={handlePaymentChange}
                    fullWidth
                >
                    <MenuItem value="offline">COD</MenuItem>
                    <MenuItem value="online">Verify</MenuItem>
                    <MenuItem value="paid">PAID</MenuItem>
                </Select>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleEditClose} color="primary">Cancel</Button>
                <Button onClick={handleSubmit} color="primary">Submit</Button>
            </DialogActions>
        </Dialog>
      {/* Dialog Box for Order Details */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {orderData && products ? (
            <Grid container spacing={2}>
              {/* Product List Card */}
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
            {/* <Typography variant="body2">{orderData.user_Name}</Typography>
            <Typography variant="body2">{orderData.contact}</Typography> */}
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
    </Box> </CardContent>
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

export default OrderList;
