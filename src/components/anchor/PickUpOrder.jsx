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
  Tooltip, Select, MenuItem
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { Cancel, Visibility, CheckCircle, Warning  } from '@mui/icons-material'; // Import icons
//import { Cancel } from '@mui/icons-material'; // Import the Cancel icon
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ContentCopyIcon from '@mui/icons-material/ContentCopy'; // For Copy button
import PhoneIcon from '@mui/icons-material/Phone'; // For Call button
import MapIcon from '@mui/icons-material/Map'; // For Google Maps button
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import API_URL from '../../config';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import QRCode from 'react-qr-code';
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const anchorOptions = [
  { title: 'Anchor 1' },
  { title: 'Anchor 2' },
  { title: 'Anchor 3' },
];



const TakeOrderAnchor= ({ triggerRefresh, refresh }) => {
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
  const [gpayLink, setGpayLink] = useState(''); // New state for gpayLink
  const CompanyId = useSelector(state => state.user.company_Id);
  const deliveryman_Id = useSelector(state => state.user.deliveryman_id);
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
          const response = await axios.get(`${API_URL}/API/myorders/${deliveryman_Id}/all`); // Replace with your API URL
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

  const handleOrderClick = async (orderId,totalAmt) => {
    setSelectedOrder(orderId);
    setOpen(true);
    const amount = totalAmt; // Amount to be paid
    const transactionNote = `orderId# ${orderId}`; // Transaction note
  //  const gpayLink = `upi://pay?pa=ajinkyapugal27@okicici&pn=Pugazh%20S&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
    const gpayLink = `upi://pay?pa=9159079191@okbizaxis&pn=kirush%20Laundry&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;
    setGpayLink(gpayLink)
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

  const handleSendTaskToAnchor = (orderId) => {
    const assignedAnchor = assignedAnchors[orderId] || [];
    alert(`Task sent for order #${orderId} to the following anchors: ${assignedAnchor.map(anchor => anchor.title).join(', ')}`);
  };

  // const filteredOrders = orders.filter(order => 
  //   (filteredStatus === 'All' || order.orderStatus_Id == filteredStatus) &&
  //   (order.user_Name.toLowerCase().includes(searchQuery.toLowerCase()) || 
  //   order.payment.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //    order.order_id.toString().includes(searchQuery)) &&
  //    (!startDate || !endDate || 
  //      (new Date(order.order_date) >= new Date(startDate) && new Date(order.order_date) <= new Date(endDate)))
  // );
  const filteredOrders = orders.filter(order => {
    // Convert "cash on delivery" to "offline" for the search query
    //const paymentSearchQuery = searchQuery.toLowerCase() === 'cash on delivery' ? 'offline' : searchQuery.toLowerCase();
  
    return (
      (filteredStatus === 'All' || order.orderStatus_Id == filteredStatus) &&
      (order.user_Name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
       (order.payment?.toLowerCase()?.includes(searchQuery.toLowerCase()) || 
        order.order_id.toString().includes(searchQuery))) &&
      (!startDate || !endDate || 
       (new Date(order.order_date) >= new Date(startDate) && new Date(order.order_date) <= new Date(endDate)))
      )      
  });
  
 console.log("filterstatus",filteredStatus);
 console.log("filterorder",filteredOrders);
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
  

const handleRejectOrder = async (orderId, statusName) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, Reject it!',
    cancelButtonText: 'No, keep it'
  });
  if(result.isConfirmed){
  try {
    const response = await axios.post(`${API_URL}/api/myorder/reject-order`, {
      orderId: orderId,
      status_Name: statusName,
    });
 
    Swal.fire(
      'Cancelled!',
      'Your order has been Rejected.',
      'success'
    );
    // if (response.status === 200) {
    //  triggerRefresh();
      toast.info('Order rejected and status updated successfully');
      // Optionally, refresh the order list or update the UI
   // }
    triggerRefresh();
  } catch (error) {
    console.error('Error rejecting order:', error);
    alert('Failed to reject order');
  } 
}   
};
const handleStartDateChange = (e) => setStartDate(e.target.value);
const handleEndDateChange = (e) => setEndDate(e.target.value);
const [editOpen, setEditOpen] = useState(false);
const [selectedPayment, setSelectedPayment] = useState('offline');
const [selectedOrderId, setSelectedOrderId] = useState(null);


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

// const handleSubmit = () => {
//   alert(`Order ID: ${selectedOrderId}\nSelected Payment: ${selectedPayment}`);
//   handleEditClose();
// };
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

const [showQRCode, setShowQRCode] = useState(false);
const [paymentMethod, setPaymentMethod] = useState('offline'); // Default to 'online'
// const amount = 10; // Amount to be paid
//   const transactionNote = `UserId#`; // Transaction note
//   const gpayLink = `upi://pay?pa=ajinkyapugal27@okicici&pn=Pugazh%20S&am=${amount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`;

const handlePaymentClick = () => {
  if (paymentMethod === 'online') {
      setShowQRCode(true); // Show QR code for online payment
  } else {
      alert("Please proceed with the offline payment.");
      setShowQRCode(false);
  }
};

// const handlePaymentMethodChange = (event) => {
//     setPaymentMethod(event.target.value);
//     setShowQRCode(false); // Reset QR code display when switching payment methods
// };
const handlePaymentMethodChange = (event) => {
setPaymentMethod(event.target.value);
};
//alert(paymentMethod)

const gpayNumber = "9786172510";
const [copied, setCopied] = useState(false);

const handleCopy = () => {
  navigator.clipboard.writeText(gpayNumber);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000); // Reset copy message after 2 seconds
};
  return (
    <Box p={3} sx={{backgroundColor:"rgb(245, 245, 245)"}}>
      <Typography variant="h5" gutterBottom>Picked Order List</Typography>
      
      {/* Filter tabs */}
      <Tabs value={filteredStatus} onChange={handleStatusChange}>
        <Tab label={`All(${orders.length})`} value="All" />
        {/* <Tab label={`Pick (${orders.filter(order => order.status_Name === 'Pending').length})`} value="Pending" /> */}
        {/* <Tab label={`Ready to Pick (${orders.filter(order => order.status_Name === 'Ready to Pick').length})`} value="Ready to Pick" /> */}
        <Tab label={`Pick (${orders.filter(order => order.orderStatus_Id == 3).length})`} value="3" /> 
         <Tab label={`Drop (${orders.filter(order => order.orderStatus_Id == 5).length})`} value="5" /> 
        {/* <Tab label={`Complete (${orders.filter(order => order.status_Name === 'Completed').length})`} value="Completed" /> */}
        {/* <Tab label={` Drop (${orders.filter(order => order.status_Name === 'Ready to Drop').length})`} value="Ready to Drop" /> */}
        {/* <Tab label={`Cancelled by User (${orders.filter(order => order.status_Name === 'User Cancelled').length})`} value="User Cancelled" /> */}
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
          label="Search Name or Order Id.."
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
           
              <TableCell>Order #Id</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
               <TableCell>PaymentStatus</TableCell>
              <TableCell>city</TableCell>
             
              <TableCell>Price</TableCell>
              <TableCell>your last Status</TableCell>
              <TableCell>Action</TableCell>
            
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order,index) => (
              <TableRow key={index}>
                {/* <TableCell>
                  <Checkbox />
                </TableCell> */}
                <TableCell>
                  <Button onClick={() => handleOrderClick(order.order_id,order.total_price)}>{`#${order.order_id}`}</Button>
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
                
                <TableCell>{order.city_Id}</TableCell>
                {/* <TableCell>{order.total_item}</TableCell> */}
                <TableCell>₹{order.total_price}</TableCell>
                <TableCell>
                  {
                    order.orderStatus_Id==3 ?(
                      <Typography style={{ color:"purple" ,fontSize:"larger",fontWeight:"bold"}}>Pick</Typography>
                    ):( <Typography style={{ color:"blue",fontSize:"larger",fontWeight:"bold"}}>Drop</Typography>)
                  }
                 
                </TableCell>
              
<TableCell>
  {order.status_Name === "Completed" ? (
    <Tooltip title="Order Completed">
      <IconButton color="success"  >
        <CheckCircle /> {/* Completed status icon */}
      </IconButton>
    </Tooltip>
  ) : order.status_Name === "Ready to Drop" ? (
    <Tooltip title="Ready to Drop">
      <IconButton color="warning"
       >
        <Warning /> {/* Ready to Drop status icon */}
      </IconButton>
    </Tooltip>
  ) : order.deliveryman_id == deliveryman_Id && order.orderStatus_Id==order.currentstatus  ? (
    <Tooltip title="Reject Order">
      <IconButton
        color="warning"
        onClick={() => handleRejectOrder(order.order_id,order.status_Name)} // Handle rejection
      >
        <Cancel sx={{ fontSize: 35 }} /> {/* Rejection icon */}
      </IconButton>
    </Tooltip>
  ) : (
    <Tooltip title="View Order">
      <IconButton
        color="primary"
        onClick={() => handleOrderClick(order.order_id)} // Handle viewing the order
      >
        <Visibility /> {/* View icon */}
      </IconButton>
    </Tooltip>
  )}
</TableCell>
{/* Inside the orderData.map function */}


              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
            }</Typography> <Box sx={{ display: 'flex', gap: 2 }}> {/* Flexbox for horizontal alignment */}
      

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
                    {/* <Typography variant="body1">deliverymanId: {orderData.
deliveryman_id
}</Typography> */}
                    {/* <Typography variant="body1">Order Status: {orderData.orderStatus_Id}</Typography> */}
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">Payment  </Typography>
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
                  
                  <QRCode value={gpayLink} size={160} />  <Typography variant="h6" style={{ marginTop: '10px' ,marginLeft:"15px" ,padding:"0px",}}>
                      OR
                  </Typography>
                                                    
                  <Typography variant="body1" style={{ marginTop: '10px' }}>
                      GPay Number: {gpayNumber}
                  </Typography></div>

            {/* <Typography variant="body2">Name: {orderData.deliveryman_name}</Typography>
            <Typography variant="body2">Contact: {orderData.contact}</Typography> */}
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
