import React, { useEffect, useState } from 'react';
import { Avatar, Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PaymentIcon from '@mui/icons-material/Payment';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useDispatch, useSelector } from 'react-redux';  // Import useDispatch and useSelector
import { logout } from '../../../features/userSlice';  // Import the logout action
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import API_URL from '../../../config';
import { Home as HomeIcon, HomeOutlined, LocationOn as LocationOnIcon, LocationOnOutlined } from '@mui/icons-material';
function UserProfile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();  // Initialize dispatch
  const userID = useSelector((state) => state.user.userID);  // Get userID from Redux store
  const { dispatch: cartDispatch } = useCart(); // Access the dispatch function from CartContext
  const { dispatch: wishlistDispatch } = useWishlist(); // Access the dispatch function from WishlistContext
  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (userID) {
          const response = await fetch(`${API_URL}/api/users/${userID}`);
          if (!response.ok) throw new Error('User not found');
          const data = await response.json();
          setUser(data);
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        navigate('/login');
      }
    };

    fetchUserProfile();
  }, [userID, navigate]);

  // Function to handle card clicks
  const handleCardClick = (path) => {
    navigate(path);
  };

  // Function to handle logout
  const handleLogout = () => {
    dispatch(logout());// Dispatch the logout action from Redux
    cartDispatch({ type: 'RESET_CART' });  
    wishlistDispatch({ type: 'RESET_WISHLIST' });
    localStorage.removeItem('totalPrice');
    localStorage.removeItem('totalQuantity');
    navigate('/');  // Redirect to the homepage or login page
  };

  if (!user) {
    return <Typography>Loading...</Typography>;  // Or a spinner/loading indicator
  }

  return (
    <Container>
      <Grid container spacing={3} alignItems="center" justifyContent="center" style={{ marginTop: 20 }}>
        <Grid item xs={12} sm={4}>
          <Avatar alt="" src="https://img.freepik.com/premium-vector/student-avatar-illustration-user-profile-icon-youth-avatar_118339-4406.jpg?w=360" style={{ width: 100, height: 100, margin: '0 auto' }} />
        </Grid>
        <Grid item xs={12} sm={8}>
          <Typography variant="h5" sx={{marginBottom:"5px"}}>{user.user_Name}</Typography>
          <Typography variant="body1">{user.alternativephoneNumber}</Typography>
          <Typography variant="body1">
        <PhoneIcon sx={{ mr: 1,color:"rgba(17, 125, 247, 0.8)" }} /> Phone Number: <span style={{fontWeight:"bold"}}>{user.mobile_Number}</span>
      </Typography>
      <Typography variant="body1">
        <EmailIcon sx={{ mr: 1 ,color:"rgba(17, 125, 247, 0.8)"}} /> Email:<span style={{fontWeight:"bold"}}>{user.email_ID}</span>
      </Typography>
        </Grid>
      </Grid>

      <Typography variant="h6" style={{ marginTop: 40 }}>
        My Activity
      </Typography>

      <Grid container spacing={3} style={{ marginTop: 20 }}>

      <Grid item xs={6} sm={6} md={3} lg={3}>
          <Card onClick={() => handleCardClick('/')} style={{ cursor: 'pointer' , backgroundColor:"rgba(220, 239, 255, 1)"}}>
            <CardContent style={{ textAlign: 'center' }}>
              <HomeOutlined style={{ fontSize: 50,color:"orange" }} />
              <Typography variant="h6">Home</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6}md={3} lg={3}>
          <Card onClick={() => handleCardClick('/useraddress')} style={{ cursor: 'pointer' , backgroundColor:"rgba(220, 239, 255, 1)"}}>
            <CardContent style={{ textAlign: 'center' }}>
              <LocationOnOutlined style={{ fontSize: 50,color:"orange" }} />
              <Typography variant="h6">Address</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6}md={3} lg={3}>
          <Card onClick={() => handleCardClick('/history')} style={{ cursor: 'pointer' , backgroundColor:"rgba(220, 239, 255, 1)"}}>
            <CardContent style={{ textAlign: 'center' }}>
              <PaymentIcon style={{ fontSize: 50,color:"orange" }} />
              <Typography variant="h6">Orders</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6}md={3} lg={3}>
          <Card onClick={() => handleCardClick('/wishlist')} style={{ cursor: 'pointer', backgroundColor:"rgba(220, 239, 255, 1)" }}>
            <CardContent style={{ textAlign: 'center' }}>
              <FavoriteIcon style={{ fontSize: 50,color:"orange" }} />
              <Typography variant="h6">Favorites</Typography>
            </CardContent>
          </Card>
        </Grid>
       
        <Grid item xs={6} sm={6}md={3} lg={3}>
          <Card onClick={() => handleCardClick('/cart-category')} style={{ cursor: 'pointer' , backgroundColor:"rgba(220, 239, 255, 1)"}}>
            <CardContent style={{ textAlign: 'center' }}>
              <ShoppingCartIcon style={{ fontSize: 50,color:"orange" }} />
              <Typography variant="h6">My Cart</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Logout Button */}
      <Grid container justifyContent="center" style={{ marginTop: 40 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogout}
          startIcon={<ExitToAppIcon />}
          style={{ marginBottom: 20 ,backgroundColor:"red"}}
        >
          Logout
        </Button>
      </Grid>
    </Container>
  );
}

export default UserProfile;
