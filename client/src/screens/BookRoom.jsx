import React, { useState, useEffect } from 'react';
import {
  Typography,
  Button,
  Paper,
  TextField,
  Divider,
  Grid,
  Box,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import moment from 'moment';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

const PremiumPaymentGateway = () => {
  const { id } = useParams();
  const [selectedRoom, setSelectedRoom] = useState({});
  const [fromDate, setFromDate] = useState(localStorage.getItem('fromDate') || null);
  const [toDate, setToDate] = useState(localStorage.getItem('toDate') || null);
  const [days, setDays] = useState(0);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/rooms/${id}`);
        setSelectedRoom(response.data);
        const diffInDays = moment.duration(moment(toDate).diff(moment(fromDate))).asDays() + 1;
        setDays(diffInDays);
        setTotal(diffInDays * response.data.rentPerDay);
      } catch (error) {
        console.error('Error fetching room data:', error);
      }
    };

    fetchRoomData();
  }, [id, fromDate, toDate]);

  const handlePayment = async () => {
    const paymentDetails = {
      room: selectedRoom.name,
      room_id: selectedRoom._id,
      user_id: JSON.parse(localStorage.getItem('currentUser')).id,
      from_date: moment(fromDate).format('YYYY-MM-DD'),
      to_date: moment(toDate).format('YYYY-MM-DD'),
      total_days: days,
      total_amount: total,
    };

    try {
      console.log(paymentDetails);

      const response = await axios.post('http://localhost:8000/api/book/', paymentDetails);
      Swal.fire('Payment Successful', 'Thank you for your payment!', 'success').then(() => {
        navigate('/');
        window.location.reload();
      });
    } catch (error) {
      Swal.fire('Payment Failed', 'There was an error processing your payment.', 'error');
      console.error('Payment error:', error);
    }
  };

  if (!selectedRoom.name) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Paper
        elevation={3}
        style={{
          maxWidth: '50vw',
          margin: 'auto',
          backgroundColor: '#f9f9f9',
          boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.15)',
        }}
      >
        <Box
          style={{
            backgroundImage: `url(${selectedRoom?.imageUrls?.[0] || 'default-image-url'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '30vh',
            marginBottom: '1vh',
          }}
        ></Box>
        <div style={{ padding: '0 2vw 3vh 2vw' }}>
          <Typography
            variant="h4"
            style={{
              fontFamily: 'Playfair Display, serif',
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            Secure Payment Gateway
          </Typography>
          <Divider style={{ margin: '1vh' }} />
          <Grid container spacing={2} style={{ padding: '0 0px' }}>
            <Grid item xs={6}>
              <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                Room Name:
              </Typography>
              <Typography variant="body1">{selectedRoom.name}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                Total Amount:
              </Typography>
              <Typography variant="body1">${total}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                Check-in:
              </Typography>
              <Typography variant="body1">{moment(fromDate).format('YYYY-MM-DD')}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
                Check-out:
              </Typography>
              <Typography variant="body1">{moment(toDate).format('YYYY-MM-DD')}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Divider style={{ margin: '1vh 0' }} />
            </Grid>
          </Grid>
          <Typography
            variant="h6"
            style={{ marginBottom: '1vh', fontFamily: 'Roboto, sans-serif' }}
          >
            Enter Payment Details:
          </Typography>
          <TextField
            fullWidth
            label="Card Number"
            variant="outlined"
            style={{ marginBottom: '1vh', backgroundColor: '#fff', borderRadius: '10px' }}
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Expiry Date (MM/YY)"
                variant="outlined"
                style={{ marginBottom: '1vh', backgroundColor: '#fff', borderRadius: '10px' }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="CVV"
                variant="outlined"
                style={{ marginBottom: '1vh', backgroundColor: '#fff', borderRadius: '10px' }}
              />
            </Grid>
          </Grid>
          <Button
            variant="contained"
            fullWidth
            style={{
              backgroundColor: '#4CAF50',
              color: '#fff',
              padding: '15px',
              fontSize: '16px',
              fontWeight: 'bold',
              borderRadius: '10px',
              boxShadow: '0px 6px 10px rgba(0, 0, 0, 0.1)',
            }}
            onClick={handlePayment}
          >
            Pay Now
          </Button>
        </div>
      </Paper>
      <Footer />
    </div>
  );
};

export default PremiumPaymentGateway;
