import React,{useEffect,useState} from 'react'
import Card from './Card'
import { FaAnchor, FaBox, FaCog, FaShoppingCart, FaTicketAlt, FaUsers } from 'react-icons/fa'
//import { dataLine} from '../assets/chartData'
import {Line, Bar} from 'react-chartjs-2'
import axios from 'axios';
import { FaDeploydog, FaPerson, FaTicket } from 'react-icons/fa6'
//import { Card, CardContent, Typography } from '@mui/material';
import { PieChart, Pie, Tooltip, Cell, Legend } from 'recharts';
import {Chart as ChartJS, LineElement, BarElement, CategoryScale, LinearScale, PointElement} from 'chart.js'
import CountUp from 'react-countup'
import { Avatar, isMuiElement } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import API_URL from '../config'
//import Typography from '@mui/material'


ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement)

  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
 

  // Function to get the last seven days in 'YYYY-MM-DD' format
const getLastSevenDays = () => {
  const dates = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(date.toISOString().split('T')[0]); // Format as 'YYYY-MM-DD'
  }
  return dates;
};

// Function to fetch order data and count orders for each of the last seven days
const fetchOrderData = async () => {
  try {
      const response = await axios.get(`${API_URL}/api/admin/all-order-details`);
      const orders = response.data.data;

      // Get the last seven days
      const lastSevenDays = getLastSevenDays();

      // Count orders by date
      const orderCounts = lastSevenDays.map(date => {
          // Filter orders by matching the order_date with each date in the last seven days
          const count = orders.filter(order => order.order_date.startsWith(date)).length;
          return count;
      });

      return orderCounts; // Return counts for the last seven days
  } catch (error) {
      console.error('Error fetching order data:', error);
      return Array(7).fill(0); // Return an array of zeros if there's an error
  }
};

const Dashboard = ({ triggerRefresh, refresh }) => {

  const userID = useSelector((state) => state.user.userID);
  const CompanyId = useSelector(state => state.user.company_Id);
   console.log(userID);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [customer,setcustomer]=useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const[orders,setOrders]=useState([])

  const [rows, setRows] = useState([]);
  const [orderData, setOrderData] = useState(Array(7).fill(0));

  useEffect(() => {
    const getData = async () => {
        const counts = await fetchOrderData();
        setOrderData(counts);
    };
    getData();
}, []);
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users/${userID}`);
        console.log('User Data:', response.data); // Log user data
        setUser(response.data); // Set user information in state
      } catch (err) {
        console.error('Error fetching user info:', err); // Log the error
      }
    };
  
    if (userID) {
      fetchUserInfo();
    }
  }, [userID]);
  // Dependency array - fetch user info when userID changes

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/customer`); // Your backend API route
        setcustomer(response.data.data);  // Assuming response has a data object with a data array
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/deliveryman/${CompanyId}`);
            setRows(response.data); // Assuming response contains the services array
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    fetchServices();
},  []);

useEffect(() => {
  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/all-order-details`); // Replace with your API URL
      setOrders(response.data.data);
      console.log("or",response.data.data);
      
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  fetchOrders();
},  [refresh]);
  console.log("cid",CompanyId);
  console.log("order",orders);
  
  console.log("admin",user);
  console.log("cus",customer);
  console.log("anchor",rows);
  
  if (!user) {
    return <p>Loading...</p>;  // Or a spinner/loading indicator
  }
  // Filter orders with statusName == 2
const ordersWithStatus2 = orders.filter(order => order.status_Name === 'Pending');
const countStatus2 = ordersWithStatus2.length;

// Filter orders with statusName == 5
const ordersWithStatus5 = orders.filter(order => order.status_Name === 'Completed');
const countStatus5 = ordersWithStatus5.length;

// Filter orders with statusName == 5
const validStatuses = ['Ready to Pick', 'Pick', 'Drop', 'Ready to Drop'];
const ordersWithStatus3 = orders.filter(order =>
    validStatuses.includes(order.status_Name)
);

const countStatus3 = ordersWithStatus3.length;
const data = [
  { name: 'Pending', value:countStatus2 },
  { name: 'Progress', value: countStatus3 },
 
  
];
const dataLine = {
  labels: getLastSevenDays().map(date => {
      const [year, month, day] = date.split('-');
      return `${day} ${new Date(year, month - 1).toLocaleString('en', { month: 'short' })}`;
  }), // Format dates as 'DD MMM'
  datasets: [
      {
          label: 'Literature Survey',
          data: orderData, // Use fetched order data
          fill: false,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          tension: 0.1,
      },
  ],
};

const options = {
  scales: {
      y: {
          beginAtZero: true,
          title: {
              display: true,
              text: 'Order Count',
          },
          ticks: {
              stepSize: 5,
          },
      },
      x: {
          title: {
              display: true,
              text: 'Date',
          },
      },
  },
};


  return (
    <div className='grow p-8'>
       <div style={{ display: 'flex', marginBottom: '15px' }}>
      {/* <Avatar
        alt=""
        src="https://img.freepik.com/free-photo/view-3d-businessman_23-2150709828.jpg?w=740&t=st=1729161369~exp=1729161969~hmac=47188f3a919bafde6b37e2292c1a1d206ac7da4f836f439c994844022c519be5"
        style={{ width: 100, height: 100, marginRight: '20px' }} // marginRight adds space between avatar and heading
      /> */}
      <h2 className='text-2xl mb-4' style={{marginTop:"25px"}} > {user.user_Name} Dashboard <span style={{color:"blue"}}>(Admin)</span></h2>
    </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6'>
        <Card 
  icon={<FaUsers />} 
  title="Customer" 
  value={<CountUp end={customer.length} duration={2} />} 
  style={{ backgroundColor: 'rgba(255, 247, 240, 0.8)' }} 
/>

<Card 
  icon={<FaPerson />} 
  title="DeliveryMan" 
  value={<CountUp end={rows.length} duration={2} />} 
  style={{ backgroundColor: 'rgba(255, 247, 240, 0.8)' }} 
/>
<Card 
  icon={<FaTicketAlt />} 
  title="Pending Order" 
  value={<CountUp end={countStatus2} duration={2} />} 
  style={{ backgroundColor: 'rgba(255, 247, 240, 0.8)' }} 
/>
<Card 
  icon={<FaTicketAlt />} 
  title="In Progress" 
  value={<CountUp end={countStatus3} duration={2} />} 
  style={{ backgroundColor: 'rgba(255, 247, 240, 0.8)' }} 
/>
<Card 
  icon={<FaShoppingCart />} 
  title="Delivered Order" 
  value={<CountUp end={countStatus5} duration={2} />} 
  style={{ backgroundColor: 'rgba(255, 247, 240, 0.8)' }} 
/>



        </div>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
            <div className='bg-white p-4 dark:bg-gray-800 rounded-lg shadow-md'>
                <h3 className='text-lg font-semibold mb-4'>Orders Data</h3>
                <Line data={dataLine}  options={options} />
            </div>
            <div className="bg-white p-4 dark:bg-gray-800 rounded-lg shadow-md">
  <h3 className="text-lg font-semibold mb-4">Working Status</h3>
  <div className="flex justify-center items-center">
    <PieChart width={400} height={400}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  </div>
</div>

        </div>
    </div>
  )
}

export default Dashboard