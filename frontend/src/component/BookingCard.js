import { Box  , Typography , Paper , Grid} from '@mui/material'
import React from 'react'

import Slider from 'react-slick';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';

const BookingCard = ({bookingData}) => {



  return (
    <Box>
        <Paper
    elevation={3}
    sx={{
      backgroundColor: '#fff8e1',
      p: 2,
      my: 2,
      borderRadius: 2,
      border: '1px solid #fbc02d',
      
    }}
  >
    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#795548', mb: 1  }}>
      Booking ID: {bookingData.id}
    </Typography>
    
        <Typography>Home: {bookingData.home_name}</Typography>
        <Typography>Amount: ₹{bookingData.amount}</Typography>
        <Typography>Guests: {bookingData.number_of_guests}</Typography>
        <Typography>Check-in: {bookingData.start_date}</Typography>
        <Typography>check-out: {bookingData.end_date}</Typography>
      
    
        <Typography>Order ID: {bookingData.razorpay_order_id}</Typography>
        <Typography>Payment ID: {bookingData.razorpay_payment_id}</Typography>
        <Typography>Booked on: {new Date(bookingData.created_at).toLocaleString()}</Typography>
        <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>Paid: {bookingData.is_paid ? <CheckCircleTwoToneIcon/> : 'No'}</Typography>
        
      
  </Paper>
    </Box>
  )
}

export default BookingCard
