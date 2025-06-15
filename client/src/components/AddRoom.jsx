import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {
  TextField,
  Button,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Card,
  CardContent,
  Snackbar,
  Alert,
} from '@mui/material';
import WifiIcon from '@mui/icons-material/Wifi';
import FreeBreakfastIcon from '@mui/icons-material/FreeBreakfast';
import BathtubIcon from '@mui/icons-material/Bathtub';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import SafetyCheckIcon from '@mui/icons-material/SafetyCheck';

const facilityIcons = {
  "Free Wi-Fi": <WifiIcon style={{ color: '#1E3A8A' }} />,
  "Minibar": <FreeBreakfastIcon style={{ color: '#1E3A8A' }} />,
  "Shower WC": <BathtubIcon style={{ color: '#1E3A8A' }} />,
  "Bathrobe": <LocalLaundryServiceIcon style={{ color: '#1E3A8A' }} />,
  "In-room Digital Safe": <SafetyCheckIcon style={{ color: '#1E3A8A' }} />,
  "Iron and Iron Board": <LocalLaundryServiceIcon style={{ color: '#1E3A8A' }} />,
};

const AddRoom = () => {
  const { id } = useParams();
  const [room, setRoom] = useState({
    name: '',
    maxCount: '',
    rentPerDay: '',
    imageUrls: [],
    phoneNumber: '',
    type: '',
    description: '',
    facilities: [],
  });
  const [allFacilities, setAllFacilities] = useState([ 'Free Wi-Fi', 'Minibar', 'Shower WC', 'Bathrobe', 'In-room Digital Safe', 'Iron and Iron Board' ]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const navigate = useNavigate();

  // Fetch room data if editing an existing room
  useEffect(() => {
    const fetchRoom = async () => {
      if (id) {
        try {
          const response = await axios.get(`http://localhost:8000/api/rooms/${id}`);
          setRoom(response.data);
        } catch (error) {
          console.error("Error fetching room:", error);
        }
      }
    };
    fetchRoom();
  }, [id]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setRoom((prev) => ({
        ...prev,
        facilities: checked
          ? [...prev.facilities, value]
          : prev.facilities.filter((facility) => facility !== value),
      }));
    } else if (name === 'imageUrls') {
      // Process multiple image URLs
      setRoom((prev) => ({
        ...prev,
        imageUrls: value.split(',').map((url) => url.trim()),
      }));
    } else {
      setRoom((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Submit form for adding or updating a room
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`http://localhost:8000/api/rooms/${id}`, room);
        setSnackbarMessage('Room updated successfully!');
      } else {
        await axios.post('http://localhost:8000/api/rooms', room);
        setSnackbarMessage('Room added successfully!');
      }
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      navigate('/admin');
    } catch (error) {
      console.error("Error processing room:", error.response?.data?.message || error.message);
      setSnackbarMessage(error.response?.data?.message || 'Error processing room');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <Card
      style={{
        padding: '0 2vw'
      }}
    >
      <CardContent>
        <Typography
          variant="h4"
          component="div"
          style={{
            textAlign: 'center',
            marginBottom: '20px',
            fontWeight: 'bold',
            color: '#031d42',
            fontFamily: 'Playfair Display'
          }}
        >
          {id ? 'Edit Room' : 'Add New Room'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Room Name"
                name="name"
                fullWidth
                value={room.name}
                onChange={handleChange}
                required
                style={{ backgroundColor: '#f9f9f9', borderRadius: '6px' }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth style={{ backgroundColor: '#f9f9f9', borderRadius: '6px' }}>
                <InputLabel>Room Type</InputLabel>
                <Select
                  name="type"
                  value={room.type}
                  onChange={handleChange}
                >
                  <MenuItem value="Deluxe">Deluxe</MenuItem>
                  <MenuItem value="Standard">Standard</MenuItem>
                  <MenuItem value="Suite">Suite</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                name="description"
                fullWidth
                multiline
                rows={4}
                value={room.description}
                onChange={handleChange}
                required
                style={{ backgroundColor: '#f9f9f9', borderRadius: '6px' }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Phone Number"
                name="phoneNumber"
                type="tel"
                fullWidth
                value={room.phoneNumber}
                onChange={handleChange}
                required
                style={{ backgroundColor: '#f9f9f9', borderRadius: '6px' }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Max Count"
                name="maxCount"
                type="number"
                fullWidth
                value={room.maxCount}
                onChange={handleChange}
                required
                style={{ backgroundColor: '#f9f9f9', borderRadius: '6px' }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Rent Per Day"
                name="rentPerDay"
                type="number"
                fullWidth
                value={room.rentPerDay}
                onChange={handleChange}
                required
                style={{ backgroundColor: '#f9f9f9', borderRadius: '6px' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Image URLs (comma-separated)"
                name="imageUrls"
                fullWidth
                value={room.imageUrls.join(', ')}
                onChange={handleChange}
                helperText="Separate multiple URLs with commas"
                required
                style={{ backgroundColor: '#f9f9f9', borderRadius: '6px' }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                Facilities
              </Typography>
              {allFacilities.map((facility) => (
                <FormControlLabel
                  key={facility}
                  control={
                    <Checkbox
                      checked={room.facilities.includes(facility)}
                      onChange={handleChange}
                      name="facilities"
                      value={facility}
                    />
                  }
                  label={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {facilityIcons[facility]}
                      <span style={{ marginLeft: '10px' }}>{facility}</span>
                    </div>
                  }
                />
              ))}
            </Grid>
          </Grid>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{
              marginTop: '20px',
              backgroundColor: '#1E3A8A',
              color: 'white',
              fontWeight: 'bold',
            }}
            fullWidth
          >
            {id ? 'Save Changes' : 'Add Room'}
          </Button>
        </form>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default AddRoom;
