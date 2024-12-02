import React from 'react';
import { FaTachometerAlt, FaShoppingCart, FaUsers, FaUser, FaBox, FaCog } from 'react-icons/fa';
import logo from '../assets/img/Kirush5.png';

const Sidebar = ({ setActiveComponent, activeComponent }) => {
  // Function to check if the sidebar item is active
  const isActive = (component) => activeComponent === component;
  console.log('Active Component:', activeComponent);

  return (
    <div className="bg-gray-100 text-gray-900 h-screen px-4 fixed w-16 md:w-64 border-r border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white">
      {/* <img  
        src={logo}
        alt="Logo"
        className="w-18h-18 md:w-32 md:h-32 object-cover rounded-full"
      /> */}
      <div className="w-12 h-12 md:w-24 md:h-24 rounded-full overflow-hidden flex items-center justify-center mt-6 md:ml-8">
        <img src={logo} alt="Image Description" className="object-cover w-full h-full" />
    
      </div>

      <ul className='flex flex-col mt-5 text-xl'>
        <li 
          className={`flex items-center py-3 px-2 hover:rounded hover:cursor-pointer   ${isActive('dashboard') ? 'bg-blue-500 text-white rounded-[5px]' : ''}`}
          onClick={() => setActiveComponent('dashboard')}
        >
          <FaTachometerAlt className="inline-block" />
          <span className='hidden ml-4 md:inline'>Dashboard</span>
        </li>
        <li 
          className={`flex items-center py-3 px-2 hover:rounded hover:cursor-pointer  ${isActive('orders') || isActive('orderlist') ? 'bg-blue-500 text-white rounded-[5px]' : ''}`}
          onClick={() => setActiveComponent('orders')}
        >
          <FaShoppingCart className="inline-block" />
          <span className="hidden md:inline ml-4">Orders</span>
        </li>
        <li 
          className={`flex items-center py-3 px-2 hover:rounded hover:cursor-pointer ${isActive('customers') ? 'bg-blue-500 text-white rounded-[5px]' : ''}`}
          onClick={() => setActiveComponent('customers')}
        >
          <FaUsers className="inline-block" />
          <span className="hidden md:inline ml-4">Customers</span>
        </li>
        <li 
          className={`flex items-center py-3 px-2 hover:rounded hover:cursor-pointer  ${isActive('anchor') ? 'bg-blue-500 text-white rounded-[5px]' : ''}`}
          onClick={() => setActiveComponent('anchor')}
        >
          <FaUser className="inline-block" />
          <span className="hidden md:inline ml-4">Anchor</span>
        </li>
        <li 
          className={`flex items-center py-3 px-2 hover:rounded hover:cursor-pointer  ${isActive('services') ? 'bg-blue-500 text-white rounded-[5px]' : ''}`}
          onClick={() => setActiveComponent('services')}
        >
          <FaBox className="inline-block" />
          <span className="hidden md:inline ml-4">Services</span>
        </li>
        {/* <li 
          className={`flex items-center py-3 px-2 hover:rounded hover:cursor-pointer  ${isActive('category') ? 'bg-orange-600 text-white rounded-[5px]' : ''}`}
          onClick={() => setActiveComponent('category')}
        >
          <FaCog className="inline-block" />
          <span className="hidden md:inline ml-4">Add Category</span>
        </li> */}
        <li 
          className={`flex items-center py-3 px-2 hover:rounded hover:cursor-pointer  ${isActive('product') ? 'bg-blue-500 text-white rounded-[5px]' : ''}`}
          onClick={() => setActiveComponent('product')}
        >
          <FaShoppingCart className="inline-block" />
          <span className="hidden md:inline ml-4">Add Product</span>
        </li>
        <li 
          className={`flex items-center py-3 px-2 hover:rounded hover:cursor-pointer  ${isActive('profilepage') ? 'bg-blue-500 text-white rounded-[5px]' : ''}`}
          onClick={() => setActiveComponent('profilepage')}
        >
          <FaUsers className="inline-block" />
          <span className="hidden md:inline ml-4">Profile</span>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
