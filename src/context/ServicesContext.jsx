// import React, { createContext, useState } from 'react';

// // Create a context to hold services
// export const ServicesContext = createContext();

// // Provide the context to all children components
// export const ServicesProvider = ({ children }) => {
//     const [services, setServices] = useState([]);

//     // Function to add a new service
//     const addService = (service) => {
//         setServices((prevServices) => [...prevServices, service]);
//     };

//     return (
//         <ServicesContext.Provider value={{ services, addService }}>
//             {children}
//         </ServicesContext.Provider>
//     );
// };
// src/context/ServiceContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../config';

// Create the context
const ServiceContext = createContext();

// Custom hook to use the ServiceContext
export const useService = () => {
    return useContext(ServiceContext);
};

// Service Provider to wrap around your application
export const ServiceProvider = ({ children }) => {
    const [service, setService] = useState([]);

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

    return (
        <ServiceContext.Provider value={{ service, setService }}>
            {children}
        </ServiceContext.Provider>
    );
};
