import React ,{ useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import { useWishlist } from '../../../context/WishlistContext';
import ServiceCard from './ServiceCard'; // Assuming ServiceCard is in the same folder
import { Container } from '@mui/material';
//import { Container } from 'postcss';
import { useSelector } from 'react-redux';
import axios from 'axios';
import API_URL from '../../../config';

function Wishlist() {
  const { wishlist } = useWishlist();
 
  const customerId = useSelector(state => state.user.userID); 
  const [refresh, setRefresh] = useState(false); // Add refresh state
  const [favlist, setFavlist] = useState([]); 
  const triggerRefresh = () => {
    setRefresh(!refresh); // Toggle the refresh state to trigger re-render
  };
  useEffect(() => {
    const fetchProductsAndWishlist = async () => {
      try {
        // Fetch all products
        //const productsResponse = await axios.get('/api/products');
      // setProducts(productsResponse.data);

        // Fetch the wishlist for the logged-in user
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

  console.log("fav",favlist);
  
  return (
    <Container>
    <div style={{ padding: '20px', boxSizing: 'border-box', minHeight: '100vh' }}>
      <h2>Your Wishlist</h2>
      {favlist.length === 0  ? (
        <>
          <p>Your wishlist is empty.</p>
        </>
      ) : (
        
        <Grid container spacing={3}>
        {favlist.map((service) => (
        

      
          <Grid 
            item 
            xs={6}  // 2 cards per row on extra-small screens (360px and up)
            sm={6}  // 2 cards per row on small screens (600px and up)
            md={3}  // 4 cards per row on medium screens (960px and up)
            lg={3}
            key={service.servSubType_Id}
          >
            <ServiceCard triggerRefresh={triggerRefresh} refresh={refresh} service={service} />
          </Grid>   
        ))}
        
      </Grid> 
      )}
    </div></Container>
  );
}

export default Wishlist;
