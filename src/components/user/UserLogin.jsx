import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
//import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { login } from '../../features/userSlice'; 
import { Country, State, City } from 'country-state-city';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import LocationOnIcon from '@mui/icons-material/LocationOn'; // Location icon
import logo from '../../assets/img/logo-6.png';
import { Box, colors, Typography ,RadioGroup,FormControlLabel, Radio} from '@mui/material';
//import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
import InputAdornment from '@mui/material/InputAdornment';
import EmailIcon from '@mui/icons-material/Email';
import API_URL from '../../config';
import Swal from 'sweetalert2';
import {  Dialog, DialogContent, DialogTitle } from '@mui/material';
function UserLogin() {
    
  const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const [isSignup, setIsSignup] = useState(false);
    const [emailOrPhone, setEmailOrPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');
    // Form fields for signup
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [alternativePhoneNumber, setAlternativePhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [pinCode, setPinCode] = useState('');
    const [landmark, setLandmark] = useState('');
    //const [mapLocation, setMapLocation] = useState('');
    const [country, setCountry] = useState('India');
    const [state, setState] = useState('Tamil-Nadu');
    const [city, setCity] = useState('');
    const [area, setArea] = useState('');
    const [street, setStreet] = useState('');
    const [floorDoorNumber, setFloorDoorNumber] = useState('');
    const [showAddressDetails, setShowAddressDetails] = useState(false);
    const [location, setLocation] = useState({ latitude: '', longitude: '' });
    const[address,setAddress]=useState('')
    const dispatch = useDispatch();
 
    // Fetch country, state, city data
    const countries = Country.getAllCountries();
    const states = State.getStatesOfCountry(country);
    const cities = City.getCitiesOfState(country, state);
     
    console.log("name",name);
    
    console.log(location);
    
    // Handle OTP send and login/signup
    
    const handleRadioChange = (event) => {
        const value = event.target.value;
        setSelectedValue(value);
        console.log('Selected address type:', value); // Log the selected value
      };
      const handleOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
        // Open Google Maps link in new tab after closing the alert
        window.open(googleMapsLink, "_blank");
      };
const handleSendOtp = async () => {
    // Check if emailOrPhone is empty
    if (!validateEmail(emailOrPhone)) {
        Swal.fire({
            title: 'Invalid Email',
            text: 'Please provide a valid email address.',
            icon: 'error',
            confirmButtonText: 'OK',
        });
        return;
    }

    if (!emailOrPhone || emailOrPhone.trim() === "") {
        toast.error('Please enter your email ');
        return;
    }

    try {
        const response = await axios.post(`${API_URL}/api/request-otp`, {
            email: emailOrPhone
        });

        if (response.status === 200) {
            setIsOtpSent(true);
            toast.success('OTP has been sent to your email ');
        } else {
            toast.error('Failed to send OTP');
        }
    } catch (error) {
        toast.error('User Not Found...!');
    }
};



const handleLogin = async () => {
    // Check if OTP is provided
    if (!otp || otp.trim() === "") {
        toast.error('Please enter the OTP.');
        return;
    }

    try {
        const response = await axios.post(`${API_URL}/api/verify-otp`, {
            email: emailOrPhone,
            otp
        });

        if (response.status === 200|| response.status === 201) {
            const { user_type, userID, company_Id, deliveryman_id } = response.data;

            // Store the user data including user_type in Redux or context
            dispatch(login({ userID, user_type, company_Id, deliveryman_id }));

            // Show success message
         

            // Navigate to the home page, component will render based on user_type
            toast.success('User signed in successfully!');
                navigate("/");
        } else {
            toast.error('OTP verification failed.');
        }
    } catch (error) {
        toast.error('An error occurred during OTP verification.');
    }
};
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/; // Assuming 10-digit Indian phone numbers starting with 6-9
    return phoneRegex.test(phone);
};
    
  
    const handleSignup = async () => {
        console.log("signup the process");
    
        const user = {
            name,
            phoneNumber,
            alternativePhoneNumber,
            address,
            email,
            pinCode,
            landmark,
            country,
            state,
            city,
            area,
            street,
            floorDoorNumber,
            location // Assuming location contains latitude and longitude
        };
        
        console.log("Validating email:", email);
        if (!validateEmail(email)) {
            Swal.fire({
                title: 'Invalid Email',
                text: 'Please provide a valid email address.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            return;
        }
    
        if (!validatePhoneNumber(phoneNumber)) {
            Swal.fire({
                title: 'Invalid Phone Number',
                text: 'Please provide a valid 10-digit phone number starting with 6-9.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            return;
        }
    
        if (!validatePhoneNumber(alternativePhoneNumber)) {
            Swal.fire({
                title: 'Invalid Alternative Phone Number',
                text: 'Please provide a valid 10-digit alternative phone number starting with 6-9.',
                icon: 'error',
                confirmButtonText: 'OK',
            });
            return;
        }
        if(city || address || pinCode || landmark ||area || street || floorDoorNumber || location.latitude ){
           
            let missingFields = [];

            // if (!userId) missingFields.push("User ID");
            if (!country) missingFields.push("Country");
            if (!state) missingFields.push("State");
            if (!city) missingFields.push("City");
            if (!area) missingFields.push("Area");
            if (!street) missingFields.push("Street");
            if (!pinCode) missingFields.push("Pin Code");
            if (!floorDoorNumber) missingFields.push("Floor & Door Number");
            if (!landmark) missingFields.push("Landmark");
            if (!phoneNumber) missingFields.push("Phone Number");
            if (!alternativePhoneNumber) missingFields.push("alternative Phone Number");
            if (!name) missingFields.push("name");
            if (!email) missingFields.push("email");
          
            if (missingFields.length > 0) {
              Swal.fire({
                title: 'Missing Information',
                text: `Please fill in the following fields: ${missingFields.join(", ")}`,
                icon: 'warning',
                confirmButtonText: 'OK',
              });
              return; // Prevent form submission if any fields are missing
            }
          
          
             else if(((!location.latitude && !address)||(location.latitude && address))){
              Swal.fire({
                title: 'Missing Information',
                text: 'Please choose one location.',
                icon: 'warning',
                confirmButtonText: 'OK',
              });
              setLocation({ latitude: '', longitude: '' });
              setAddress('');
              return
             }
        }else{
            let missingFields = [];

          
            if (!phoneNumber) missingFields.push("Phone Number");
            if (!alternativePhoneNumber) missingFields.push("alternative Phone Number");
            if (!name) missingFields.push("name");
            if (!email) missingFields.push("email");
          
            if (missingFields.length > 0) {
              Swal.fire({
                title: 'Missing Information',
                text: `Please fill in the following fields: ${missingFields.join(", ")}`,
                icon: 'warning',
                confirmButtonText: 'OK',
              });
              return; // Prevent form submission if any fields are missing
            }
          
        }
     
        try {
            const response = await axios.post(`${API_URL}/api/users`, user);
            
            if (response.status === 200 || response.status === 201) {
                const { user_type, userID, company_Id, deliveryman_id } = response.data;
                dispatch(login({ userID, user_type, company_Id, deliveryman_id }));
    
               
    
                toast.success("User signed up successfully.!")
                navigate("/");
            } else {
                Swal.fire({
                    title: 'Signup Failed',
                    text: 'There was an issue with the signup process.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            }
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Email already exist',
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };
    // const validateEmail = (email) => {
    //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    //     return emailRegex.test(email);
    // };

    // const validatePhoneNumber = (phone) => {
    //     const phoneRegex = /^[6-9]\d{9}$/; // Assuming 10-digit Indian phone numbers starting with 6-9
    //     return phoneRegex.test(phone);
    // };
    // const handleSignup = async () => {
    //     console.log("signup");
    
    //     const user = {
    //         name,
    //         phoneNumber,
    //         alternativePhoneNumber,
    //         address,
    //         email,
    //         pinCode,
    //         landmark,
    //         country,
    //         state,
    //         city,
    //         area,
    //         street,
    //         floorDoorNumber,
    //         location, // Assuming location contains latitude and longitude
    //     };
    
      
    
    //     let missingFields = [];
    
    //     // Check for missing fields
    //     if (!name) missingFields.push("Name");
    //     if (!phoneNumber) missingFields.push("Phone Number");
    //     if (!alternativePhoneNumber) missingFields.push("Alternative Phone Number");
    //     if (!email) missingFields.push("Email");
    //     if (!country) missingFields.push("Country");
    //     if (!state) missingFields.push("State");
    //     if (!city) missingFields.push("City");
    //     if (!area) missingFields.push("Area");
    //     if (!street) missingFields.push("Street");
    //     if (!pinCode) missingFields.push("Pin Code");
    //     if (!floorDoorNumber) missingFields.push("Floor & Door Number");
    //     if (!landmark) missingFields.push("Landmark");
    
    //     if (missingFields.length > 0) {
    //         Swal.fire({
    //             title: 'Missing Information',
    //             text: `Please fill in the following fields: ${missingFields.join(", ")}`,
    //             icon: 'warning',
    //             confirmButtonText: 'OK',
    //         });
    //         return;
    //     }
    //     console.log("Validating email:", email);
    //     // Validate email format
    //     if (!validateEmail(email)) {
    //         Swal.fire({
    //             title: 'Invalid Email',
    //             text: 'Please provide a valid email address.',
    //             icon: 'error',
    //             confirmButtonText: 'OK',
    //         });
    //         return;
    //     }
    
    //     // Validate phone number formats
    //     if (!validatePhoneNumber(phoneNumber)) {
    //         Swal.fire({
    //             title: 'Invalid Phone Number',
    //             text: 'Please provide a valid 10-digit phone number starting with 6-9.',
    //             icon: 'error',
    //             confirmButtonText: 'OK',
    //         });
    //         return;
    //     }
    
    //     if (!validatePhoneNumber(alternativePhoneNumber)) {
    //         Swal.fire({
    //             title: 'Invalid Alternative Phone Number',
    //             text: 'Please provide a valid 10-digit alternative phone number starting with 6-9.',
    //             icon: 'error',
    //             confirmButtonText: 'OK',
    //         });
    //         return;
    //     }
    
    //     // Check for conflicting location/address inputs
    //     if ((location.latitude && address) || (!location.latitude && !address)) {
    //         Swal.fire({
    //             title: 'Location Conflict',
    //             text: 'Please provide either a location or an address, not both.',
    //             icon: 'warning',
    //             confirmButtonText: 'OK',
    //         });
    //         setLocation({ latitude: '', longitude: '' });
    //         setAddress('');
    //         return;
    //     }
    
    //     try {
    //         const response = await axios.post(`${API_URL}/api/users`, user);
    
    //         if (response.status === 200 || response.status === 201) {
    //             const { user_type, userID, company_Id, deliveryman_id } = response.data;
    //             dispatch(login({ userID, user_type, company_Id, deliveryman_id }));
    //             toast.success("User signed up successfully.!");
    //             navigate("/");
    //         } else {
    //             Swal.fire({
    //                 title: 'Signup Failed',
    //                 text: 'There was an issue with the signup process.',
    //                 icon: 'error',
    //                 confirmButtonText: 'OK',
    //             });
    //         }
    //     } catch (error) {
    //         Swal.fire({
    //             title: 'Error',
    //             text: 'An error occurred during signup.',
    //             icon: 'error',
    //             confirmButtonText: 'OK',
    //         });
    //     }
    // };
    
    const handleMapLocationClick = () => { 
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
              setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              });
            }, error => {
              console.error('Error fetching location: ', error);
            });
            toast.info("location picked successfully..!")
          } else {
            toast.error('Geolocation is not supported by this browser.');
          }
    
    };

    return (
        <Grid container sx={{ height: '100vh'}}>
           <Grid
    item
    xs={12}
    md={6}
    sx={{
      backgroundImage: `url(http://136.185.14.8:8099/uploads/kirush.png)`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover', 
      display: { xs: 'none', md: 'block' },    
      minHeight: '100vh',
      padding: 0, // Removes padding
      margin: 0, // Removes margin
    }}
  />


            {/* Right Side - Login Form */}
            {/* <Grid
                item
                xs={12}
                md={6}
                container
                alignItems="center"
                justifyContent="center"
              
            >  */}
              <Grid
    item
    xs={12}
    md={6}
    container
    alignItems="center"
    justifyContent="center"
    sx={{
      padding: 3,
      minHeight: '100vh',
    }}
  >
           
                <Container maxWidth="sm" sx={{ py: 4,position:"relative" ,backgroundColor:"rgba(39, 131, 245, 0.14)" ,borderRadius:"8px"}}>
               
                  <Typography
                variant="h4"
                sx={{
                    position: 'relative',
                    top: 20,
                    fontWeight: 'bold',
                    color: 'rgba(0, 114, 255, 1)',
                    textAlign: 'center',

                }}
            >
              kirush Laundry
            </Typography> <br /><br />
            
       
                    <Typography variant="h3" gutterBottom sx={{color:"black",fontSize:'2rem'}}>
                        {isSignup ? 'Sign Up' : isOtpSent ? 'Enter OTP' : 'Login'}
                    </Typography>
                    <Typography sx={{color:"rgba(38, 38, 38, 0.57)"}}><i><b>Welcome to Kirush Laundry</b></i></Typography>
                    {/* Signup or Login Form */}
                    {isSignup ? (
                        <>
                            <TextField label="Name" variant="outlined" fullWidth margin="normal" value={name} onChange={(e) => setName(e.target.value)} />
                            <TextField label="Phone Number" variant="outlined" fullWidth margin="normal" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                            <TextField label="Alternative Phone Number" variant="outlined" fullWidth margin="normal" value={alternativePhoneNumber} onChange={(e) => setAlternativePhoneNumber(e.target.value)} />
                            <TextField label="Email" variant="outlined" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} /> 
                            
                   

<Grid container alignItems="center" spacing={2}>
    {/* Address Details Icon Button */}
    <Grid item>
        <IconButton
            color="primary"
            onClick={() => setShowAddressDetails(!showAddressDetails)}
            sx={{ mt: 2 }}
        >
            {showAddressDetails ? <RemoveIcon /> : <AddIcon />}
        </IconButton>
    </Grid>
    <Grid item>
        <Typography variant="body2" sx={{ mt: 2 ,color:"black"} }>
            {showAddressDetails ? 'Hide Address Details' : 'Add Address Details(optional)'}
        </Typography>
    </Grid>
    
    

</Grid>



                            {showAddressDetails && (
                                <Grid container spacing={2} sx={{ mt: 2 }}>
                                    {/* <Grid item xs={12} sm={6}>
                                        <TextField
                                            select
                                            label="Country"
                                            variant="outlined"
                                            fullWidth
                                            margin="normal"
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                            SelectProps={{ native: true }}
                                        >
                                            {countries.map((c) => (
                                                <option key={c.isoCode} value={c.isoCode}>
                                                    {c.name}
                                                </option>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            select
                                            label="State"
                                            variant="outlined"
                                            fullWidth
                                            margin="normal"
                                            value={state}
                                            onChange={(e) => setState(e.target.value)}
                                            SelectProps={{ native: true }}
                                        >
                                            {states.map((s) => (
                                                <option key={s.isoCode} value={s.isoCode}>
                                                    {s.name}
                                                </option>
                                            ))}
                                        </TextField>
                                    </Grid> */}
                                     <Grid item xs={12} sm={6}>
                <TextField
                    label="Country"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value="India"
                    InputProps={{ readOnly: true }} // Make the field read-only
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    label="State"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value="Tamil-Nadu"
                    onChange={(e) => setState(e.target.value)}
                    InputProps={{ readOnly: true }} // Make the field read-only
                />
            </Grid>
                                    {/* <Grid item xs={12} sm={6}>
                                        <TextField
                                            select
                                            label="City"
                                            variant="outlined"
                                            fullWidth
                                            margin="normal"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                          
                                        >
                                           
                                        </TextField>
                                    </Grid> */}<Grid item xs={12} sm={6}>
                                        <TextField label="City" variant="outlined" fullWidth margin="normal"  placeholder="(i,e)Trichy" value={city} onChange={(e) => setCity(e.target.value)} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField label="Area" variant="outlined" fullWidth margin="normal"placeholder="(i,e)Thillai-Nagar" value={area} onChange={(e) => setArea(e.target.value)} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField label="Street" variant="outlined" fullWidth margin="normal" placeholder="(i,e)10th cross west" value={street} onChange={(e) => setStreet(e.target.value)} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField label="Floor & Door Number" variant="outlined" fullWidth margin="normal"  placeholder="(i,e)D-25"  value={floorDoorNumber} onChange={(e) => setFloorDoorNumber(e.target.value)} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField label="Landmark" variant="outlined" fullWidth margin="normal"  placeholder="(i,e)Apolo city center hospital" value={landmark} onChange={(e) => setLandmark(e.target.value)} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField label="PinCode" variant="outlined" fullWidth margin="normal" placeholder="(i,e)621-307"  value={pinCode} onChange={(e) => setPinCode(e.target.value)} />
                                    </Grid>
                                     
                                    <Grid item xs={12} sm={6} >
                            <Box sx={{color:"black"}}>
      <Typography variant="h6" gutterBottom>Share Order Place Location</Typography>

      {/* Radio Button Group */}
      <Typography>Please choose one Location</Typography>
      <RadioGroup value={selectedValue} onChange={handleRadioChange}>
        <FormControlLabel value="currentLocation" control={<Radio />} label="Your Current Location" />
        <FormControlLabel value="orderPlaceAddress" control={<Radio />} label="Your Order Place Address" />
      </RadioGroup>

      {/* Conditional Rendering based on selected Radio Button */}
      {selectedValue === 'currentLocation' && (
        <Button
          variant="contained"
          color="white"
          startIcon={<LocationOnIcon />}
          onClick={handleMapLocationClick}
          sx={{ mt: 2, backgroundColor: 'rgba(10, 106, 0, 0.8)', color: 'white' }}
        >
          Get Location
        </Button>
      )}

      {selectedValue === 'orderPlaceAddress' && (
        <div>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Share Location
          </Button>

          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Video</DialogTitle>
            <DialogContent>
              <h4>Steps</h4>
              <ul>
                <li>1. OK to continue and select your order's exact location</li>
                <li>2. Click to copy link button</li>
                <li>3. Paste,Your location URL</li>
              </ul>
              <video width="100%" height="auto" controls>
                <source src="http://136.185.14.8:8099/uploads/location.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <p>OK to continue and select your order's exact location</p>

              <Button onClick={handleClose} variant="contained" color="primary" fullWidth>
                OK
              </Button>
            </DialogContent>
          </Dialog>

          <TextField
            fullWidth
            margin="normal"
            variant="outlined"
            label="Your Location URL"
            placeholder="copy here ,Your location URL"
            onChange={(e) => setAddress(e.target.value)}
          />

          {/* <Button onClick={handleSubmit} variant="contained" color="primary" fullWidth>
            Submit
          </Button> */}
        </div>
      )}

      {/* Address Form */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {/* Form Fields... */}
      </Grid>

      {/* <Box sx={{ marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Save Address
        </Button>
        <Button variant="text" color="primary" onClick={() => navigate('/cart-category')}>
          Cancel
        </Button>
      </Box> */}
    </Box>
    </Grid>

                                </Grid>
                            )}
                        </>
                    ) : isOtpSent ? (
                        <TextField label="OTP" variant="outlined" fullWidth margin="normal" value={otp} onChange={(e) => setOtp(e.target.value)} />
                    ) : (
                        <TextField label="Email" variant="outlined" fullWidth margin="normal" value={emailOrPhone} onChange={(e) => setEmailOrPhone(e.target.value)} />
                    )}

                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        {isSignup ? (
                            <Grid item xs={12} >
                                <Button variant="contained"   sx={{ mt: 2, backgroundColor: 'rgba(255, 112, 3, 0.69)', color: 'white' }}  fullWidth onClick={handleSignup}>
                                    Sign Up
                                </Button>
                            </Grid>
                        ) : (
                            <Grid item xs={12} >
                                {isOtpSent ? (
                                    <Button variant="contained" color="primary" fullWidth onClick={handleLogin} sx={{ mt: 2, backgroundColor: 'rgba(255, 112, 3, 0.69)', color: 'white' }} >
                                        Login
                                    </Button>
                                ) : (
                                    <Button variant="contained" color="primary" fullWidth onClick={handleSendOtp} sx={{ mt: 2, backgroundColor: 'rgba(255, 112, 3, 0.69)', color: 'white' }} >
                                        Send OTP
                                    </Button>
                                )}
                            </Grid>
                        )}

<Grid container justifyContent="center" sx={{ mt: 2 }}>
    {isSignup ? (
        <Typography variant="body2" align="center" sx={{color:"black"}}>
            Already have an account?{' '}
            <Button
                variant="text"
                color="primary"
                onClick={() => setIsSignup(false)} // Switch to login form
                sx={{
                    textTransform: 'none',
                    padding: 0, // No extra padding
                    minWidth: 'auto',
                    textDecoration:"underline",
                }}
            >
                Login here
            </Button>
        </Typography>
    ) : (
        <Typography variant="body2" align="center" sx={{color:"black"}}>
            Don't have an account?{' '}
            <Button
                variant="text"
                color="primary"
                onClick={() => setIsSignup(true)} // Switch to sign up form
                sx={{
                    textDecoration:"underline",
                    textTransform: 'none',
                    padding: 0,
                    minWidth: 'auto',
                 
                }}
            >
                Sign up here
            </Button>
        </Typography>
    )}
</Grid>

                    </Grid>
                </Container>
            </Grid>
        </Grid>
    );
}

export default UserLogin;
