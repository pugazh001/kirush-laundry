import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Button,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import logo from '../../../assets/img/Kirush4.png';
import { useCart } from '../../../context/CartContext';

function UserNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cartItems } = useCart();
  const userID = useSelector((state) => state.user.userID);
  const navigate = useNavigate();
  const theme = useTheme(); // Use the theme from ThemeProvider context
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileClick = () => {
    navigate('/account');  // Navigate to /account page when My Profile is clicked
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography
        variant="h6"
        sx={{
          padding: '4px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'orange',
          height: '55px',
          color: 'white',
        }}
      >
        OTS SERVICES
      </Typography>
      <List>
        {['Home', 'Login', 'History', 'Wishlist', 'Notifications', 'Account', 'Cart'].map((text) => (
          <ListItem key={text} component={Link} to={`/${text.toLowerCase()}`} button>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={createTheme()}> {/* Create and apply theme */}
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ backgroundColor: 'rgba(17, 125, 247, 0.8)' }}>
          <Toolbar>
            <Button color="inherit" component={Link} to="/" sx={{ marginRight: 2 }}>
              <img src={logo} alt="Logo" style={{ height: 60, marginRight: 20,borderRadius:"50%" }} />
             
                <Typography
                  sx={{
                    fontFamily: 'Outfit, serif',
                    fontOpticalSizing: 'auto',
                    fontWeight: 500,
                    fontStyle: 'normal',
                    fontSize:{xs:'14px',sm:'14px',md:'16px'}
                  }}
                >
                Kirush Laundry
                </Typography>
              
            </Button>

            <Box sx={{ flexGrow: 1 }} />
               
            <Link to="/cart-category" style={{ color: 'inherit', textDecoration: 'none' }}>
                  <IconButton color="inherit">
                    <Badge badgeContent={cartItems.length} color="warning">
                      <ShoppingCartIcon />
                    </Badge>
                    {!isMobile && (
                      <Typography variant="body1" component="span" sx={{ marginLeft: 1 }}>
                        Cart
                      </Typography>
                    )}
                  </IconButton>
                </Link>
            {userID ? (
              <>
              
                <IconButton color="inherit" onClick={handleProfileClick}>
                  <AccountCircle />
                  {!isMobile && (
                    <Typography variant="body1" component="span" sx={{ marginLeft: 1 }}>
                      My Profile
                    </Typography>
                  )}
                </IconButton>
              </>
            ) : (
              <Link to="/login" style={{ color: 'inherit', textDecoration: 'none' }}>
                <IconButton color="inherit">
                  <AccountCircle />
                  {!isMobile && (
                    <Typography variant="body1" component="span" sx={{ marginLeft: 1 }}>
                      Login
                    </Typography>
                  )}
                </IconButton>
              </Link>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </ThemeProvider>
  );
}

export default UserNavbar;
