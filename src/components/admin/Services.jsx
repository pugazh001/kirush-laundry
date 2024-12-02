import React, { useState, useContext } from 'react';
//import { ServicesContext } from '../../context/ServicesContext';
import { Card, CardContent, Typography, IconButton, Grid, Box,TextField,  CardMedia,MenuItem, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
//import { useSelector } from 'react-redux';
import axios from 'axios'; // Import axios
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setCompanyId } from '../../features/userSlice';
//import { setCompanyId, addService } from '../../features/serviceSlice'; // Import actions from your Redux slice
import { useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import API_URL from '../../config';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
const ServicesPage = ({ setActiveComponent ,triggerRefresh, refresh }) => {
   // const { services, addService } = useContext(ServicesContext); 
    const dispatch = useDispatch(); // Initialize dispatch
    const userId = useSelector(state => state.user.userID);
    console.log(userId);
   //const companyId = useSelector((state) => state.service.company_Id);
   //console.log(companyId);
   

    const navigate = useNavigate();  // Consume services from context
    const [open, setOpen] = useState(false);
    const [serviceImage, setServiceImage] = useState(null);
    const [newService, setNewService] = useState({
        serviceName: '',
        serviceType: 'Two Way Service',
        organizationName: '',
        place: '',
        // serv_Code: 'WS001', // Example static serv_Code
        serv_Description: 'Fast and reliable water delivery service.', // Example static description
       // imagefile: 'water_image.png', // Example static image
        created_By: 1 // Example static creator
    });


    const serviceTypes = [
        { value: 'one-way', label: 'One Way Service' },
        { value: 'two-way', label: 'Two Way Service' }
    ];
   // const [service, setService] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [currentServiceId, setCurrentServiceId] = useState(null);

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setNewService({
            serviceName: '',
            serviceType: '',
            organizationName: '',
            place: '',
            
            serv_Description: 'Fast and reliable water delivery service.',
          
            created_By: 1,
        });
        setServiceImage(null)
        setEditMode(false)
    }
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewService((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = (event) => {
        setServiceImage(event.target.files[0]); // Get the file for upload
    };
    
   
    
  
   
    const handleSubmit = async () => {
        try {
            // Create a FormData object
            const formData = new FormData();
            
            // Append the form fields to FormData
            formData.append('userId', userId); // Example userId
            formData.append('servType_Name', newService.serviceType);
            formData.append('serv_Name', newService.serviceName);
            formData.append('serv_Description', newService.serv_Description);
            formData.append('created_By', newService.created_By);
    
            // Check if we are in edit mode, and append service ID if needed
            if (editMode && currentServiceId) {
                formData.append('serv_Id', currentServiceId); // Include service ID for update
            }
    
            // Append the image file only if it exists
            if (serviceImage) {
                formData.append('imagefile', serviceImage);
            }
    
            // Make the axios POST request with multipart/form-data for create or update
            const response = await axios({
                method: editMode ? 'put' : 'post', // Use PUT for edit, POST for create
                url: `${API_URL}/api/service/${editMode ? `update/${currentServiceId}` : 'create'}`,
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            console.log(response.data); // Check the response data
            if (response.data.company_Id) {
                localStorage.setItem('company_Id', response.data.company_Id); // Store company_Id in localStorage
                console.log('company_Id stored in localStorage:', response.data.company_Id);
            } else {
                console.error('company_Id is missing in the response');
            }
    
            // Reset the form after submission
            setNewService({
                serviceName: '',
                serviceType: '',
                serv_Description: 'Fast and reliable water delivery service.',
                created_By: 1,
            });
            setServiceImage(null); // Clear the image
            setEditMode(false); // Reset edit mode
            setOpen(false); // Close the form or modal
            triggerRefresh(); // Refresh the component or data
            toast.success(`Service ${editMode ? 'updated' : 'added'} successfully!`);
        } catch (error) {
            console.error(`Error ${editMode ? 'updating' : 'adding'} service:`, error);
            toast.error(`Failed to ${editMode ? 'update' : 'add'} service`);
        }
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
    }, [refresh]);
  
    const handleEdit = (service) => {
        setNewService({
            serviceName: service.serv_Name,
            serviceType: service.serv_Type,
            organizationName: service.organization_Name,
            place: service.place,
            serv_Description: service.serv_Description,
            created_By: service.created_By,
        });
        setCurrentServiceId(service.serv_Id); // Set the current service ID for updating
        setEditMode(true);
        setOpen(true);
    };
    console.log("ser id ",currentServiceId);
    
 console.log("img",serviceImage);
 
    // const handleDelete = async (id) => {
    //   //  alert(id)
    //     if (window.confirm("Are you sure you want to delete this service?")) {
    //         try {
    //             await axios.put(`${API_URL}/api/service/delete/${id}`);
    //             toast.success('Service deleted successfully!');
    //             triggerRefresh();
    //         } catch (error) {
    //             console.error('Error deleting service:', error);
    //             toast.error('Failed to delete service');
    //         }
    //     }
    // };
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });
    
        if (result.isConfirmed) {
            try {
                await axios.put(`${API_URL}/api/service/delete/${id}`);
                toast.success('Service deleted successfully!');
                triggerRefresh(); // Function to refresh data after deletion
            } catch (error) {
                console.error('Error deleting service:', error);
                toast.error('Failed to delete service');
            }
        }
    };
    console.log("ser",service);
    return (
        <div style={{ padding: 20 }}>
            <Typography variant="h4" gutterBottom>
                Services
            </Typography>

            <Grid container spacing={2}>
                {/* Add New Service Card */}
                <Grid item xs={12} sm={6} md={4}>
                    <Card style={{ textAlign: 'center', padding: '20px' }}>
                           {/* CardMedia for the image */}
                          
                        <CardContent>
                            <IconButton sx={{color:"green"}} onClick={handleClickOpen}>
                                <AddIcon fontSize="large" />
                            </IconButton>
                            <Typography variant="body1">Create New Service</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Render the services added */}
                {service.map((service, index) => (
    <Grid item xs={12} sm={6} md={4} key={index}>
        <Card>
        {service.imagefile && (
                            <CardMedia
                                component="img"
                               sx={{ width: '100%', height: '150px', objectFit: 'cover' }}
                                image={`${API_URL}/uploads/product-images/${service.imagefile}`} // Replace with the correct path to the image
                                alt={service.serv_Name}
                            />
                        )}
            <CardContent>
                {/* Flexbox container */}
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6">{service.serv_Name}</Typography>
                    <Box>
                        <IconButton color='info' onClick={() => handleEdit(service)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton  sx={{ color: "red" }}  onClick={() => handleDelete(service.serv_Id)}>
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                </Box>
                <Typography variant="body2">Description: {service.serv_Description}</Typography>
                <Typography variant="body2">Service Code: {service.serv_Code}</Typography>
                <Typography variant="body2">Created On: {new Date(service.created_On).toLocaleDateString()}</Typography>
            </CardContent>
        </Card>
    </Grid>
))}
            
            </Grid>

            {/* Dialog for creating a new service */}
            {/* <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create New Service</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="serviceName"
                        label="Service Name"
                        type="text"
                        fullWidth
                        value={newService.serviceName}
                        onChange={handleInputChange}
                    />
                    <TextField
                        margin="dense"
                        name="serviceType"
                        label="Service Type"
                        select
                        fullWidth
                        value={newService.serviceType}
                        onChange={handleInputChange}
                    >
                        {serviceTypes.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        margin="dense"
                        name="organizationName"
                        label="Organization Name"
                        type="text"
                        fullWidth
                        value={newService.organizationName}
                        onChange={handleInputChange}
                    />
                     
                    <TextField
                        margin="dense"
                        name="place"
                        label="Place"
                        type="text"
                        fullWidth
                        value={newService.place}
                        onChange={handleInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog> */}
             <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{editMode ? 'Edit Service' : 'Create New Service'}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="serviceName"
                        label="Service Name"
                        type="text"
                        fullWidth
                        value={newService.serviceName}
                        onChange={handleInputChange}
                    />
                    {/* <TextField
                        margin="dense"
                        name="serviceType"
                        label="Service Type"
                        select
                        fullWidth
                        value={newService.serviceType}
                        onChange={handleInputChange}
                    >
                        {serviceTypes.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField> */}
                    <TextField
                        margin="dense"
                        name="serv_Description"
                        label="Description"
                        type="text"
                        fullWidth
                        value={newService.serv_Description}
                        onChange={handleInputChange}
                    />
                    {/* <TextField
                        margin="dense"
                        name="place"
                        label="Place"
                        type="text"
                        fullWidth
                        value={newService.place}
                        onChange={handleInputChange}
                    /> */}
                      <Button
                        variant="contained"
                        component="label"
                        fullWidth
                        sx={{ marginTop: 2 }}
                    >
                        Upload Image
                        <input type="file" hidden onChange={handleImageUpload} />
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        {editMode ? 'Update' : 'Submit'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ServicesPage;
