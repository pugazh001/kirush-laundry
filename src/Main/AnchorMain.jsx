import React, { useState } from 'react';
import '../App.css';
import Dashboard from '../components/anchor/AnchorDashboard';
import Navbar from '../components/anchor/AnchorNavbar';
import Sidebar from '../components/anchor/AnchorSidebar';
import ThemeContextProvider from '../context/ThemeContextProvider';
import TakeOrderAnchor from '../components/anchor/TakeorderAnchor';
import PendingOrder from '../components/anchor/PendingOrder';
import PickUpOrder from '../components/anchor/PickUpOrder';
import DeleveryOrder from '../components/anchor/DeliveryOrder';
import UserSalaryCase from '../components/anchor/UserCase';
import AnchorProfilePage from '../components/anchor/AnchorProfilePage';
// import Order from '../components/admin/Order';
// import Customers from '../components/admin/Customers'
// import Anchor from '../components/admin/Anchor';
// import Services from '../components/admin/Services';
// import OrderList from '../components/admin/OrderList';
// import OrderDetails from '../components/admin/OrderDetails';
// //import { Anchor } from '@mui/icons-material';
function AnchorMain() {
  const [activeComponent, setActiveComponent] = useState('dashboard');

  const [refresh, setRefresh] = useState(false); // Add refresh state

  const triggerRefresh = () => {
    setRefresh(!refresh); // Toggle the refresh state to trigger re-render
  };

  return (
    <ThemeContextProvider>
      <div className='flex'>
        <Sidebar activeComponent={activeComponent} setActiveComponent={setActiveComponent} />
        <div className='grow ml-16 md:ml-64 h-full lg:h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white'>
          <Navbar />
          <div>
            {activeComponent === 'dashboard' && <Dashboard triggerRefresh={triggerRefresh} refresh={refresh} />}
            {/* {activeComponent === 'orders' && <Order setActiveComponent={setActiveComponent} />} */}
            {/* {activeComponent === 'customers' && <Customers />}
            {activeComponent === 'anchor' && <Anchor />}
            {activeComponent === 'services' && <Services />}
            {/* {activeComponent === 'orderlist' && <OrderList setActiveComponent={setActiveComponent} />} */}
            {/* {activeComponent === 'orderdetails' && <OrderDetails />} */} 
            {/* Add more components as needed */}
            {activeComponent === 'anchorTakeorder' && <TakeOrderAnchor triggerRefresh={triggerRefresh} refresh={refresh}  />}
           
            {activeComponent === 'pendingorder' && <PendingOrder triggerRefresh={triggerRefresh} refresh={refresh} />}
            {activeComponent === 'pickuporder' && <PickUpOrder triggerRefresh={triggerRefresh} refresh={refresh} />}
            {activeComponent === 'deliveryorder' && <DeleveryOrder triggerRefresh={triggerRefresh} refresh={refresh} />}
            {activeComponent === 'cash' && <OrderDetails triggerRefresh={triggerRefresh} refresh={refresh} />}
            {activeComponent === 'usersalary' && <UserSalaryCase triggerRefresh={triggerRefresh} refresh={refresh} />}
            {activeComponent === 'profilepage' && <AnchorProfilePage triggerRefresh={triggerRefresh} refresh={refresh} />}
          </div>
        </div>
      </div>
    </ThemeContextProvider>
  );
}

export default AnchorMain;
