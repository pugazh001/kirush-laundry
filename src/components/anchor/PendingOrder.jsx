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
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const anchorOptions = [
  { title: 'Anchor 1' },
  { title: 'Anchor 2' },
  { title: 'Anchor 3' },
];



const TakeOrderAnchor= () => {
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
          const response = await axios.get('http://localhost:3001/api/admin/all-order-details'); // Replace with your API URL
          setOrders(response.data.data);
          console.log("or",response.data.data);
          
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      };
  
      fetchOrders();
    }, []);
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
    // useEffect(() => {
    //   const fetchOrderDetails = async () => {
    //     try {
    //       console.log("jut",selectedOrder);
          
    //       const response = await axios.get(`${API_URL}/api/order-details/${selectedOrder}`);
    //       const { order, products } = response.data.data;
    //       setOrderData(order);
          
    //       setProducts(products);
    //     } catch (error) {
    //       console.error('Error fetching order details:', error);
    //     }
    //   };
  
    //   fetchOrderDetails();
    // }, [selectedOrder]);

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

  const handleSendTaskToAnchor = (orderId) => {
    const assignedAnchor = assignedAnchors[orderId] || [];
    alert(`Task sent for order #${orderId} to the following anchors: ${assignedAnchor.map(anchor => anchor.title).join(', ')}`);
  };

  const filteredOrders = orders.filter(order => 
    (filteredStatus === 'All' || order.status_Name === filteredStatus) &&
    (order.user_Name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     order.email_Id.toLowerCase().includes(searchQuery.toLowerCase()))
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

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>Order List</Typography>
      
      {/* Filter tabs */}
      <Tabs value={filteredStatus} onChange={handleStatusChange}>
        <Tab label={`Recommended by Admin (${orders.length+1})`} value="All" />
        <Tab label={`Pending (${orders.filter(order => order.status_Name === 'Pending').length})`} value="Pending" />
        {/* <Tab label={`Ready to Pick (${orders.filter(order => order.status_Name === 'Ready to Pick').length})`} value="Ready to Pick" /> */}
        {/* <Tab label={`Pick (${orders.filter(order => order.status_Name === 'Pick').length})`} value="Pick" /> */}
        {/* <Tab label={`Drop (${orders.filter(order => order.status_Name === 'Drop').length})`} value="Drop" /> */}
        {/* <Tab label={`Complete (${orders.filter(order => order.status_Name === 'Completed').length})`} value="Completed" /> */}
        <Tab label={`Ready to Drop (${orders.filter(order => order.status_Name === 'Ready to Drop').length})`} value="Ready to Drop" />
        {/* <Tab label={`Cancelled by User (${orders.filter(order => order.status_Name === 'User Cancelled').length})`} value="User Cancelled" /> */}
      </Tabs>

      {/* Search and Date Filters */}
      <Box my={2} display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" gap={2}>
          <TextField label="Start date" type="date" InputLabelProps={{ shrink: true }} />
          <TextField label="End date" type="date" InputLabelProps={{ shrink: true }} />
        </Box>
        
        <TextField
          label="Search customer or order number..."
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
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>Order #</TableCell>
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
                <TableCell>
                  <Checkbox />
                </TableCell>
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
                <TableCell>${order.total_price}</TableCell>
                <TableCell>
                  <Typography style={{ color: getStatusColor(order.status_Name) ,fontSize:"larger",fontWeight:"bold"}}>{order.status_Name}</Typography>
                </TableCell>
                {/* <TableCell>
  {order.status_Name === 'Pick' || order.status_Name === 'Drop' ? (
    <Typography variant="body1">
      Order handle by: {order.deliveryman_name ? order.deliveryman_name : 'Not Assigned'}
    </Typography>
  ) : (
    <Autocomplete
      multiple
      id={`assign-anchor-${order.order_id}`}
      options={deliveryman}
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
          [order.order_id]: newValue,
        }))
      }
      value={assignedAnchors[order.order_id] || []}
      style={{ width: 250 }}
      renderInput={(params) => (
        <TextField {...params} label="Assign Anchor" placeholder="Choose anchor" />
      )}
    />
  )}
</TableCell> */}
                {/* <TableCell>
                <Button 
    variant="contained" 
    color="primary" 
    onClick={() => handleSendTaskToAnchor(order.order_id)}
    disabled={
      order.status_Name === 'Completed' || 
      order.status_Name === 'User Cancelled' || 
      (assignedAnchors[order.order_id] || []).length === 0 // Check if Assign to Anchor is empty
    }
    style={{
      cursor: (order.status_Name === 'Completed' || 
              order.status_Name === 'User Cancelled' || 
              (assignedAnchors[order.order_id] || []).length === 0) ? 'not-allowed' : 'pointer' // Disable cursor style
    }}
  >
    Send Task
  </Button>
                </TableCell> */}
                {/* <TableCell>
  {order.status_Name === 'Pick' ? (
    <Button
      variant="contained"
      color="primary"
      onClick={() => handleSendTaskToAnchor(order.order_id)}
      disabled={assignedAnchors[order.order_id]?.length === 0} // Disable if no anchors are assigned
      style={{
        cursor: assignedAnchors[order.order_id]?.length === 0 ? 'not-allowed' : 'pointer'
      }}
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
      onClick={() => handleSendTaskToAnchor(order.order_id)}
      disabled={
        order.status_Name === 'Completed' || 
        order.status_Name === 'User Cancelled' || 
        (assignedAnchors[order.order_id] || []).length === 0 // Check if Assign to Anchor is empty
      }
      style={{
        cursor: (order.status_Name === 'Completed' || 
                 order.status_Name === 'User Cancelled' || 
                 (assignedAnchors[order.order_id] || []).length === 0) 
                 ? 'not-allowed' 
                 : 'pointer' // Disable cursor style
      }}
    >
      Send Task
    </Button>
  )}
</TableCell> */}
<TableCell>
  {/* {order.status_Name === 'Pick' ? (
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
      onClick={() => handleSendTaskToAnchor(order.order_id)}
      disabled={
        order.status_Name === 'Completed' || 
        order.status_Name === 'User Cancelled' || 
        (assignedAnchors[order.order_id] || []).length === 0
      }
    >
      Send Task
    </Button>
  )} */} <Button
  variant="contained" 
      color="primary" 
      onClick={() => handleSendTaskToAnchor(order.order_id)}
      >Accept Order</Button>
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
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6">Products</Typography>
                    {products.map((product, index) => (
                      <Typography key={index} variant="body1">
                        {product.product_name} - ₹{product.rate} (x{product.quantity})
                        
                        ------ ₹{product.total_price} 
                      </Typography>
                      
                    ))}
                    <Typography>------------------------------------------------</Typography>
                     <Typography variant="body1">Total Price: -----------------₹{orderData.total_price}</Typography> 
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
          </CardContent>
        </Card>
      </Grid>
              {/* Order Details Card */}
              <Grid item xs={12} sm={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6">Order Details</Typography>
                    <Typography variant="body1">Order ID: {orderData.order_id}</Typography>
                    <Typography variant="body1">User Code: {orderData.user_Code}</Typography>
                    <Typography variant="body1">Total Price: ₹{orderData.total_price}</Typography>
                    <Typography variant="body1">Order Date: {new Date(orderData.order_date).toLocaleDateString()}</Typography>
                    
                    <Typography variant="body1">Order Status: {orderData.orderStatus_Id}</Typography>
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
