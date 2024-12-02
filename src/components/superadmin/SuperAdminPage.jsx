import React, { useState } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Snackbar, Alert
} from '@mui/material';
import axios from 'axios'; // Import axios
import API_URL from '../../config';
const SuperAdminPage = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    usercode: '',
   
    companyName: '',
    mobileId: '',
    email: ''
  });
  const [success, setSuccess] = useState(false);

  // Handle form open/close
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Handle form input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log('Admin data submitted:', formData);

    // Add your API call here to submit the form data
    // e.g., axios.post('/api/admin', formData)
    const response = await axios.post(`${API_URL}/api/create-admin`,formData);
    console.log(response.data); // Ensure response has company_Id
    setSuccess(true);
    setOpen(false);
    setFormData({
      username: '',
      usercode: '',
   
      companyName: '',
      mobileId: '',
      email: ''
    });
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Create Admin
      </Button>

      {/* Alert Dialog Form */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create Admin</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              name="username"
              label="Username"
              fullWidth
              margin="normal"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <TextField
              name="usercode"
              label="User Code"
              fullWidth
              margin="normal"
              value={formData.usercode}
              onChange={handleChange}
              required
            />
            
            <TextField
              name="companyName"
              label="Company Name"
              fullWidth
              margin="normal"
              value={formData.companyName}
              onChange={handleChange}
              required
            />
            <TextField
              name="mobileId"
              label="Mobile Number"
              fullWidth
              margin="normal"
              value={formData.mobileId}
              onChange={handleChange}
              required
            />
            <TextField
              name="email"
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <DialogActions>
              <Button onClick={handleClose} color="secondary">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>

      {/* Snackbar for success message */}
      <Snackbar
        open={success}
        autoHideDuration={4000}
        onClose={() => setSuccess(false)}
      >
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
          Admin added successfully!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SuperAdminPage;
