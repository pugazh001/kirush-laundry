// src/components/NotificationPage.js

import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

function NotificationPage() {
  // Dummy notifications
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Item added to cart' },
    { id: 2, message: 'Order shipped' },
    { id: 3, message: 'Payment successful' },
    { id: 4, message: 'New offer available' },
  ]);

  // Function to handle notification deletion
  const handleDeleteNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications available.</p>
      ) : (
        <Grid container spacing={3}>
          {notifications.map(notification => (
            <Grid item xs={12} sm={6} md={4} key={notification.id}>
              <Card>
                <CardContent>
                  <Typography variant="body1">{notification.message}</Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    variant="contained" 
                    color="secondary" 
                    onClick={() => handleDeleteNotification(notification.id)}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
}

export default NotificationPage;
