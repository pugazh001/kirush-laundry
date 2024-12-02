
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation ,Navigate} from 'react-router-dom';
import { useSelector } from 'react-redux';

// Import components
import UserNavbar from '../components/user/components/UserNavbar';
import UserHome from '../components/user/UserHome';
import UserLogin from '../components/user/UserLogin';
import UserCart from '../components/user/UserCart';
import Admin from './Admin';
import DeliveryAddress from '../components/user/DeliveryAddress';
import AddNewAddress from '../components/user/AddNewAddress';
import OrderSummaryPage from '../components/user/OrderSummaryPage';
import Wishlist from '../components/user/components/Wishlist';
import NotificationPage from '../components/user/components/NotifcationPage';
import UserProfile from '../components/user/components/Userprofilepage';
import ProductDetailsPage from '../components/user/components/ProductDetailsPage';
import AnchorMain from './AnchorMain';
import CartCategoryPage from '../components/user/components/CartCategoryPage';
import SuperAdminPage from './SuperAdmin';
import OrderList from '../components/admin/OrderList';
import LocationButton from '../components/superadmin/UserSuperAdmin';
//import UpdateAddress from '../components/user/components/UpdateAddress';
import EditAddress from '../components/user/EditAddress';
import UserAddress from '../components/user/UserAddress';

// Map user types to components
const userTypeComponents = {
  0: UserHome,
  1: SuperAdminPage,
  2: Admin,
  4: AnchorMain,
  5: UserHome,
};

function User() {
  const location = useLocation();
  const userType = useSelector(state => state.user.user_type);

  // Define paths where the navbar should not be displayed
  const hideNavbarRoutes = ['/login','/'];

  // Determine if UserNavbar should be hidden
  const isNavbarHidden = hideNavbarRoutes.includes(location.pathname) || [1, 2, 4].includes(userType);
  console.log(hideNavbarRoutes);
  
   console.log(isNavbarHidden);
   console.log(!isNavbarHidden);
   console.log(userType);
   
  
  // Determine the component to render based on userType
  const ComponentToRender = userTypeComponents[userType] || UserHome;
  console.log(ComponentToRender);
  
  return (
    <div>
      {/* Conditionally render UserNavbar */}
      {!isNavbarHidden && <UserNavbar />}
      <Routes>
        <Route path="/" element={<ComponentToRender  />} />
        <Route path="/login" element={<UserLogin />} />
        {/* <Route path='/login' element={<Login />} /> */}
        <Route path="/cart" element={<UserCart />} />
        <Route path="/delivery" element={<DeliveryAddress />} /> 
        {/* <Route path="/orders/TW-2024003" element={<DeliveryAddress />} />  */}
        <Route path="/addaddress" element={<AddNewAddress />} />
        <Route path="/editaddress" element={<EditAddress />} />
        <Route path="/history" element={<OrderSummaryPage />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/superadmin" element={<SuperAdminPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/account" element={<UserProfile />} />
        <Route path="/product-details" element={<ProductDetailsPage />} />
        <Route path="/cart-category" element={<UserCart />} />
        <Route path="/orderlist" element={<OrderList />} />

        <Route path="/useraddress" element={<UserAddress />} />
        < Route path="/locations" element={<LocationButton />} />
        {/* Catch-all route to redirect any invalid paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <User />
    </Router>
  );
}
