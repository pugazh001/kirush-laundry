import React from 'react';
import { FaTachometerAlt, FaShoppingCart, FaUsers, FaUser, FaBox, FaCog } from 'react-icons/fa';
import logo from '../../assets/img/Kirush5.png';
const AnchorSidebar = ({ setActiveComponent, activeComponent }) => {

  const isActive = (component) => activeComponent === component;
  console.log('Active Component:', activeComponent);
  return (
    <div className="bg-gray-100 text-gray-900 h-screen px-4 fixed w-16 md:w-64 border-r border-gray-300 dark:border-gray-600 dark:bg-gray-900 dark:text-white">
      {/* <h1 className="text-2xl font-bold hidden md:block mt-4 text-center italic">OTS Services</h1> */}
      
      <div className="w-12 h-12 md:w-24 md:h-24 rounded-full overflow-hidden flex items-center justify-center mt-6 md:ml-8">
        <img src={logo} alt="Image Description" className="object-cover w-full h-full" />
    
      </div>


      <ul className='flex flex-col mt-5 text-xl'>
        <li 
          className={`flex items-center py-3 px-2 hover:rounded hover:cursor-pointer  ${isActive('dashboard') ? 'bg-blue-500 text-white rounded-[5px]' : ''}`}
          onClick={() => setActiveComponent('dashboard')}
        >
          <FaTachometerAlt className="inline-block " />
          <span className='hidden ml-4 md:inline'>Dashboard</span>
        </li>
        <li 
          className={`flex items-center py-3 px-2 hover:rounded hover:cursor-pointer  ${isActive('anchorTakeorder') ? 'bg-blue-500 text-white rounded-[5px]' : ''}`}
          onClick={() => setActiveComponent('anchorTakeorder')}
        >
          <FaShoppingCart className="inline-block " />
          <span className="hidden md:inline ml-4">Take Orders</span>
        </li>
        {/* <li className="flex items-center py-3 px-2 hover:rounded hover:cursor-pointer hover:bg-orange-600 hover:text-white" onClick={() => setActiveComponent('customer')}>
          <FaUsers className="inline-block " />
          <span className="hidden md:inline ml-4">Admin Recommend Orders</span>
        </li> */}
        {/* <li className="flex items-center py-3 px-2 hover:rounded hover:cursor-pointer hover:bg-orange-600 hover:text-white" onClick={() => setActiveComponent('pendingorder')}>
          <FaUser className="inline-block " />
          <span className="hidden md:inline ml-4">Pending Order</span>
        </li> */}
        <li className={`flex items-center py-3 px-2 hover:rounded hover:cursor-pointer  ${isActive('pickuporder') ? 'bg-blue-500 text-white rounded-[5px]' : ''}` } onClick={() => setActiveComponent('pickuporder')}>
          <FaBox className="inline-block " />
          <span className="hidden md:inline ml-4">My Orders</span>
        </li>
        {/* <li className="flex items-center py-3 px-2 hover:rounded hover:cursor-pointer hover:bg-orange-600 hover:text-white" onClick={() => setActiveComponent('deliveryorder')}>
          <FaCog className="inline-block " />
          <span className="hidden md:inline ml-4">Drop Off Order</span>
        </li> */}
        {/* <li className="flex items-center py-3 px-2 hover:rounded hover:cursor-pointer " onClick={() => setActiveComponent('usersalary')}>
          <FaCog className="inline-block " />
          <span className="hidden md:inline ml-4">Payment Details</span>
        </li> */}
        <li className={`flex items-center py-3 px-2 hover:rounded hover:cursor-pointer  ${isActive('profilepage') ? 'bg-blue-500 text-white rounded-[5px]' : ''}`} onClick={() => setActiveComponent('profilepage')}>
          <FaUser className="inline-block " />
          <span className="hidden md:inline ml-4">Profile</span>
        </li>
      </ul>
    </div>
  );
}

export default AnchorSidebar;
