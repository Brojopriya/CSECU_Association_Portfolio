import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  Grid,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import './EventsPage.css';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true); // Added loading state
  const [openSnackbar, setOpenSnackbar] = useState(false); // For Snackbar

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      axios
        .get('http://localhost:8000/events/all', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setEvents(response.data.events);
          setLoading(false); // Set loading to false when data is loaded
        })
        .catch((err) => {
          console.error(err);
          setMessage('Error loading events.');
          setOpenSnackbar(true);
          setLoading(false); // Set loading to false even in case of error
        });
    } else {
      setMessage('Access denied. Please log in.');
      setOpenSnackbar(true);
      setLoading(false); // Set loading to false when no token is available
    }
  }, []);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="events-page">
      <Typography variant="h3" gutterBottom align="center">
        All Events
      </Typography>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>

      {loading ? (
        <div className="loading">
          <CircularProgress />
          <Typography variant="h6">Loading events...</Typography>
        </div>
      ) : (
        <Grid container spacing={3}>
          {events.length > 0 ? (
            events.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.event_id}>
                <Card>
                  <CardContent>
                    <Typography variant="h5" gutterBottom>
                      {event.event_name}
                    </Typography>
                    <Typography variant="body1" paragraph>
                      {event.event_description}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Date: {new Date(event.event_date).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Location: {event.location}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      Register
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography variant="h6" color="textSecondary" align="center">
              No events available.
            </Typography>
          )}
        </Grid>
      )}
    </div>
  );
};

export default EventsPage;
