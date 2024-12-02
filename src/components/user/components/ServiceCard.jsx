import React,{ useState, useEffect }  from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useCart } from '../../../context/CartContext';
import { useWishlist } from '../../../context/WishlistContext';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
import API_URL from '../../../config';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Snackbar from '@mui/material/Snackbar';
const useStyles = makeStyles((theme) => ({
  card: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%', // Ensure card height fills the grid cell
    width: '100%', // Ensure card width fills the grid cell
  },
  cardMedia: {
    height: '250px', // Set consistent image height
    objectFit:"fill"
  },
  cardActions: {
    justifyContent: 'space-between',
  },
  wishlistIcon: {
    position: 'absolute',
    bottom: '10px',
    right: '10px',
  },
  button: {
 
    fontSize: '1rem',
    padding: '10px 20px',
    
 
  }
}));

function ServiceCard({ service , triggerRefresh, refresh }) {
  const classes = useStyles();
  const { dispatch: cartDispatch } = useCart();
  const { wishlist, dispatch: wishlistDispatch } = useWishlist();
  const [favlist, setFavlist] = useState([]); 
  const [toastOpen, setToastOpen] = useState(false); // Snackbar state
  const [itemCounts, setItemCounts] = useState({}); // Track item counts
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Dynamic message
   const customerId = useSelector(state => state.user.userID);
  const isInWishlist = favlist.some((item) => item.servSubType_Id === service.servSubType_Id);

 console.log("fav",favlist);
  const navigate=useNavigate();
 
   console.log("iswishlist",isInWishlist);
   
  useEffect(() => {
    const fetchProductsAndWishlist = async () => {
      try {
      
        const wishlistResponse = await axios.get(`${API_URL}/api/wishlist/${customerId}`);
        const wishlistProductIds = wishlistResponse.data;
           console.log("wish",wishlistResponse);
           console.log("sid",wishlistProductIds);
           
        // Set wishlist items in a Set for efficient lookup
        setFavlist(wishlistProductIds);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchProductsAndWishlist();
  }, [refresh]);


 console.log(service);
 
//  const handleAddToCart = () => {
//   console.log("Adding to cart:", service); // Debugging line
//   cartDispatch({ type: 'ADD_TO_CART', payload: service });
//   setToastOpen(true); // Show toast

// };
const handleAddToCart = () => {
  const newCount = (itemCounts[service.servSubType_Id] || 0) + 1;

  // Update the item count
  setItemCounts((prevCounts) => ({
    ...prevCounts,
    [service.servSubType_Id]: newCount,
  }));

  // Dispatch to cart
  cartDispatch({ type: 'ADD_TO_CART', payload: service });

  // Set dynamic Snackbar message
  setSnackbarMessage(`${newCount} ${service.servSubType_Name} added to cart.`);
  setToastOpen(true);
};
console.log(service);
  const handleToggleWishlist = () => {
    const userID = localStorage.getItem('userID');
      
    if (userID) {
      if (isInWishlist) {
        axios.post(`${API_URL}/api/wishlist/remove`, { 
          userId: localStorage.getItem('userID'), 
          servSubType_Id: service.servSubType_Id 
        });
        triggerRefresh();
      //  wishlistDispatch({ type: 'REMOVE_FROM_WISHLIST', payload: service.servSubType_Id });
      } else {
        axios.post(`${API_URL}/api/wishlist/add`, { 
          userId: localStorage.getItem('userID'), 
          servSubType_Id: service.servSubType_Id 
        });
       // wishlistDispatch({ type: 'ADD_TO_WISHLIST', payload: service });
       triggerRefresh();
      }
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Please log in',
        text: 'You need to log in to add items to your Wishlistcart.',
        showCancelButton: true,
        confirmButtonText: 'Log In',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    }

  
  };
  
  return (
    <>
    <Card
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      width: '100%',
      maxWidth: { xs: 220, sm: 280, md: 380 }, // Adjust maxWidth for mobile responsiveness (below 380px)
      mx: 'auto', // Center align horizontally
      boxShadow: 3,
      padding: { xs: '10px', sm: '15px' }, 
    }}
  >
    {service.imagefile && (
      <CardMedia
        component="img"
        sx={{
          height: { xs: 120, sm: 180, md: 180,lg:180 }, // Adjust image height for smaller screens
          objectFit:"fill",
        }}
        image={`${API_URL}/uploads/product-images/${service.imagefile}`}
        alt={service.imagefile}
      />
    )}
    <CardContent
    
    >
      <Typography
        gutterBottom
        variant="h5"
        sx={{
          fontFamily: 'Outfit, serif',
          textTransform: 'capitalize',
          fontSize: { xs: '12px', sm: '16px', md: '18px' ,lg:'18px'}, // Responsive font size
        }}
      >
        {service.servSubType_Name}
      </Typography>
      <Typography
        gutterBottom
        variant="h6"
        sx={{
          fontFamily: 'Outfit, serif',
          textTransform: 'capitalize',
          fontSize: { xs: '10px', sm: '15px', md: '14px' ,lg:"14px"}, // Adjust font size for smaller screens
        }}
      >
        {service.serv_Name}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '10px', sm: '14px' } }}>
        Price: <b>₹{service.rate}</b>
      </Typography>
    </CardContent>
    <CardActions sx={{ justifyContent: 'space-between', px: 1,  }}>
      <Button
        size="small"
        variant="contained"
        color="primary"
        onClick={handleAddToCart}
        sx={{
          fontSize: { xs: '10px', sm: '12px' }, // Adjust font size for button
          padding: { xs: '5px 9px', sm: '6px 12px' }, // Button padding for small screens
        }}
      >
        Add to Cart
      </Button>
      <IconButton onClick={handleToggleWishlist} color="warning">
        {isInWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
    </CardActions>
  </Card>
   {/* Snackbar for toast message */}
   <Snackbar
        open={toastOpen}
        autoHideDuration={1000}
        onClose={() => setToastOpen(false)}
        message={snackbarMessage} // Display dynamic message
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
      </>
  );
}

export default ServiceCard;
