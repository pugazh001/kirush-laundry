import React, { useState ,useEffect} from 'react';
import {
    Box, Button, Card, CardContent, Typography, Grid, Dialog, DialogActions, 
    DialogContent, DialogTitle, TextField, IconButton, Select, MenuItem, 
    FormControl, InputLabel
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useService } from '../../context/ServicesContext';
import axios from 'axios';
import { useSelector } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import API_URL from '../../config';
const ProductPage = ({ triggerRefresh, refresh }) => {
    //const { service } = useService(); // Get services from context
   
    const CompanyId = useSelector(state => state.user.company_Id);
    const ProductCompany_Id = useSelector(state => state.user.company_Id);
    console.log(CompanyId);
    const [currentProductId, setCurrentProductId] = useState(null);
    const [products, setProducts] = useState([]); // Initialize with default products
    const [filteredService, setFilteredService] = useState("All"); // Service filter
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [serviceName, setServiceName] = useState(''); // Service name
    const [productImage, setProductImage] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editIndex, setEditIndex] = useState(null); // Track the index of the product being edited
    const [service,setService]=useState([]);
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
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/serviceSubTypes/${localStorage.getItem('company_Id')}`);
                setProducts(response.data); // Assuming response contains the services array
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };

        fetchServices();
    }, [refresh]);
    console.log("product",products);
    
    const handleImageUpload = (event) => {
        setProductImage(event.target.files[0]); // Get the file for upload
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        resetForm();
        setEditMode(false)
    };

    const resetForm = () => {
        setProductName('');
        setProductPrice('');
        setServiceName('');
        setProductImage(null);
        setEditIndex(null); // Reset the edit index
    };

    const handleAddProduct = async () => {
        const productData = new FormData();
        productData.append('servSubType_Name', productName);
        productData.append('rate', productPrice);
        productData.append('serv_Name', serviceName);
        productData.append('imagefile', productImage);
        productData.append('company_Id', CompanyId);
       // productData.append('product_company_Id', ProductCompany_Id);

        try {
            if (editMode && currentProductId) {
                // Update product API call
                console.log("hj",productData);
                

                await axios.put(`${API_URL}/api/serviceSubTypes/${currentProductId}`, productData); // PUT request to update product
            } else {
                // Add new product API call
                const response = await axios.post(`${API_URL}/api/serviceSubTypes`, productData); // POST request to add product
                const newProduct = response.data;
                console.log("hj",productData);
                setProducts([...products, { name: productName, price: productPrice, service: serviceName, image: productImage }]);
            }
            setEditMode(false);
            handleCloseDialog();
            triggerRefresh();
            toast.success('product added successfully! ');
        } catch (error) {
            console.error('Error adding/updating product:', error);
        }
    };

    const handleEditProduct = (product) => {
      //  const product = products[index];
      setOpenDialog(true);
      console.log("product",product);
      
        setProductName(product.servSubType_Name);
        setProductPrice(product.rate);
       setServiceName(product.service);
        setProductImage(product.image);
        setEditMode(true);
       setCurrentProductId(product.servSubType_Id)
         // setEditIndex(index); // Set the index of the product being edited
    };
console.log("pro",currentProductId);

    const handleDeleteProduct = async (product) => {
        try {
            await axios.put(`${API_URL}/api/serviceSubTypes/disable/${product.servSubType_Id}`); // API call to delete the product
            // const filteredProducts = products.filter((_, i) => i !== index);
            // setProducts(filteredProducts);
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    // Filter products by service name, case-insensitive
    const filteredProducts = filteredService === "All"
    ? products:products.filter((product) => 
        product.serv_Name?.toLowerCase() === filteredService
      )
     ;
   console.log(filteredService);
   console.log("ji",products);
   
   console.log("serv",service);
   
    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                Product List
            </Typography>
            <Box>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddCircleIcon />}
                    onClick={handleOpenDialog}
                    sx={{ marginTop: 3 }}
                >
                    Add Product
                </Button>
            </Box>

            {/* Filter by Service Name */}
            <FormControl fullWidth sx={{ marginBottom: 3, marginTop: 3 }}>
                <Select
                    value={filteredService}
                    onChange={(e) => setFilteredService(e.target.value)}
                    displayEmpty
                >
                    <MenuItem value="All">
                        <em>All Services</em>
                    </MenuItem>
                    {service.map((s, index) => (
                        <MenuItem key={index} value={s.serv_Name.toLowerCase()}>{s.serv_Name}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Display filtered products */}
            <Grid container spacing={2}>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card>
                                <CardContent>
                                    {product.imagefile && (
                                        <img
                                            src={`${API_URL}/uploads/product-images/${product.imagefile}`}
                                           
                                            alt={product.imagefile}
                                            style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                                        />
                                    )}
                                    <Typography variant="h6">{product.servSubType_Name}</Typography>
                                    <Typography>Price: ₹{product.rate}</Typography>
                                    <Typography>Service: {product.serv_Name}</Typography>
                                    <Typography>Created on:{new Date(product.created_On).toLocaleDateString()}</Typography>


                                    {/* Edit and Delete Buttons */}
                                    <Box display="flex" justifyContent="space-between" mt={2}>
                                        <IconButton onClick={() => handleEditProduct(product)}>
                                            <EditIcon color="primary" />
                                        </IconButton>
                                        <IconButton onClick={() => handleDeleteProduct(product)}>
                                            <DeleteIcon color="error" />
                                        </IconButton>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography>No products found for the selected service.</Typography>
                )}
            </Grid>

            {/* Alert Dialog for Adding/Editing Product */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{editIndex !== null ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Product Name"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Product Price"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        fullWidth
                        margin="normal"
                    />

                    {/* Select for Service Name */}
                  {!editMode?<> <FormControl fullWidth margin="normal">
                        <InputLabel>Service Name</InputLabel>
                        <Select
                            value={serviceName}
                            onChange={(e) => setServiceName(e.target.value)}
                            fullWidth
                        >
                            <MenuItem value="">
                                <em>Select Service</em>
                            </MenuItem>
                            {service.map((s, index) => (
                                <MenuItem key={index} value={s.serv_Name.toLowerCase()}>{s.serv_Name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl></>:<></>} 

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
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleAddProduct} color="primary">
                        {editMode ? 'Update Product' : 'Add Product'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ProductPage;
