import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert,Container,Typography
} from '@mui/material';
//import { Container } from 'postcss';
import API_URL from '../../config';
const CustomerTable = () => {
  // State to store users data, loading, and error status
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/customer`); // Your backend API route
        setUsers(response.data.data);  // Assuming response has a data object with a data array
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Conditional rendering based on loading and error states
  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="info">No Customer Found</Alert>;
  }

  return (
    <div style={{padding:"30px"}}>
           <Typography variant="h6" style={{ marginTop: 20 }}>
        Customer Details
      </Typography> <br />
    <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
      <Table sx={{ minWidth: 650 }} aria-label="user table">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: '10%', textAlign: 'left', fontWeight: 'bold' }}>User ID</TableCell>
            <TableCell sx={{ textAlign: 'left', fontWeight: 'bold' }}>Username</TableCell>
            <TableCell sx={{ textAlign: 'left', fontWeight: 'bold' }}>Email</TableCell>
            <TableCell sx={{ textAlign: 'left', fontWeight: 'bold' }}>Phone</TableCell>
            <TableCell sx={{ textAlign: 'left', fontWeight: 'bold' }}>Alternative Mobile Number</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, index) => (
            <TableRow
              key={index}
              sx={{
                backgroundColor: index % 2 === 0 ? '#f5f5f5' : '#ffffff',  // Alternate row colors
                '&:hover': {
                  backgroundColor: '#e0f7fa', // Hover effect for rows
                },
              }}
            >
              <TableCell sx={{ width: '10%', textAlign: 'left' }}>{index + 1}</TableCell>
              <TableCell sx={{ textAlign: 'left' }}>{user.user_Name}</TableCell>
              <TableCell sx={{ textAlign: 'left' }}>{user.email_ID}</TableCell>
              <TableCell sx={{ textAlign: 'left' }}>{user.mobile_Number}</TableCell>
              <TableCell sx={{ textAlign: 'left' }}>{user.alter_Mobile_number}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer></div>
  );
};

export default CustomerTable;
