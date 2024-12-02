import React, { useState } from 'react';
import '../App.css';
import Dashboard from '../components/Dashboard';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ThemeContextProvider from '../context/ThemeContextProvider';
import Order from '../components/admin/Order';
import Customers from '../components/admin/Customers'
import Anchor from '../components/admin/Anchor';
import Services from '../components/admin/Services';
import OrderList from '../components/admin/OrderList';
import OrderDetails from '../components/admin/OrderDetails';
import AdminProfilePage from '../components/admin/AdminProfilePage';
//import ProductDetailsPage from '../components/admin/Product';
import Product from '../components/admin/Product';
import  Category  from '../components/admin/Category';
//import { Anchor } from '@mui/icons-material';
function Admin() {
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [refresh, setRefresh] = useState(false); // Add refresh state
   
  const triggerRefresh = () => {
    setRefresh(!refresh); // Toggle the refresh state to trigger re-render
  };
  return (
    <ThemeContextProvider>
      <div className='flex'>
        <Sidebar  activeComponent={activeComponent} setActiveComponent={setActiveComponent} />
        <div className='grow ml-16 md:ml-64 h-full lg:h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white'>
          <Navbar />
          <div>
            {activeComponent === 'dashboard' && <Dashboard triggerRefresh={triggerRefresh} refresh={refresh} />}
            {activeComponent === 'orders' && <OrderList setActiveComponent={setActiveComponent} triggerRefresh={triggerRefresh} refresh={refresh} />}
            {activeComponent === 'customers' && <Customers triggerRefresh={triggerRefresh} refresh={refresh} />}
            {/* {activeComponent === 'anchor' && <Anchor />} */}
            {activeComponent === 'anchor' && (
              <Anchor setActiveComponent={setActiveComponent} triggerRefresh={triggerRefresh} refresh={refresh} />
            )}
            {activeComponent === 'services' && <Services setActiveComponent={setActiveComponent} triggerRefresh={triggerRefresh} refresh={refresh}   />}
            {activeComponent === 'orderlist' && <OrderList setActiveComponent={setActiveComponent} triggerRefresh={triggerRefresh} refresh={refresh} />}
            {activeComponent === 'orderdetails' && <OrderDetails triggerRefresh={triggerRefresh} refresh={refresh} />}
            {activeComponent === 'profilepage' && <AdminProfilePage triggerRefresh={triggerRefresh} refresh={refresh} />}
            {activeComponent === 'product' && <Product triggerRefresh={triggerRefresh} refresh={refresh}  />}
            {activeComponent === 'category' && <Category triggerRefresh={triggerRefresh} refresh={refresh}  />}


            {/* Add more components as needed */}
          </div>
        </div>
      </div>
    </ThemeContextProvider>
  );
}

export default Admin;
