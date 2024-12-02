import React, { useContext,useState } from 'react';
//import { ServicesContext } from '../../context/ServicesContext';
import { Card, CardContent, Typography, Grid, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
//import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import axios from 'axios'; // Import axios
import API_URL from '../../config';
const Order = ({ setActiveComponent , triggerRefresh, refresh }) => {
   // const { services } = useContext(ServicesContext);  // Access services from context
    const navigate = useNavigate();  // Hook for navigation
    const dispatch = useDispatch();
   // const companyId = useSelector((state) => state.service.company_Id);
   // console.log(companyId);
    // Function to handle navigation
    const handleNavigate = (service) => {
        // Example: You could pass service details to another page via route params
        navigate(`/details/${service.serviceName}`, { state: { service } });
    };
    const [service, setService] = useState([]);

    // Example: Fetch services from the backend when the component loads
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/company/${localStorage.getItem('company_Id')}`);
                setService(response.data); // Assuming response contains the services array
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };

        fetchServices();
    }, []);


  const handleViewOrders = (serv_Code) => {
    // Navigate to the orders page with the serviceType parameter
   // navigate(`/orders/${serv_Code}`)
    navigate("/orderlist")
    console.log(serv_Code);
    
  };
    return (
        <div style={{ padding: 20 }}>
            <Typography variant="h4" gutterBottom>
                Order Page
            </Typography>

            <Grid container spacing={2}>
                {service.map((service, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{service.serv_Name}</Typography>
                                <Typography variant="body2">Type: {service.serv_Description}</Typography>
                                <Typography variant="body2">service code: {service.serv_Code}</Typography>
                                <Typography variant="body2">created_On: {service.created_On}</Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => setActiveComponent('orderlist')}
                                    // onClick={() => handleViewOrders(service.serv_Code)}
                                    style={{ marginTop: 10 }}
                                >
                                    View Orders
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default Order;
