import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  TextField
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import RazorpayButton from './RazorpayButton';

const style = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
  
};

export default function DateSelectorModal({ open, onClose, onSelect, bookings,bookingD }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guests , setGuests] = useState(null);

  const isDateBooked = (date) => {
    return bookings.some(b => {
      const start = dayjs(b.start_date);
      const end = dayjs(b.end_date);
      return date >= start && date <= end;
    });
  };

  const shouldDisableDate = (date) => isDateBooked(date);

  const handleConfirm = () => {
    if (startDate && endDate && !startDate.isAfter(endDate)) {
      onSelect({
        start_date: startDate.format('YYYY-MM-DD'),
        end_date: endDate.format('YYYY-MM-DD')
      });
      onClose();
    } else {
      alert('Please select a valid date range.');
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        
        <Typography variant="h6" sx = {{m:2 , display:'flex' , justifyContent:'center'}} >Select Booking Dates</Typography>
        <Box sx = {{display:'flex', flexDirection:'row' , m : 3}}>
        <LocalizationProvider dateAdapter={AdapterDayjs} >
          <DatePicker
            sx = {{borderRadius:20 , mx:3}}
            label="Check-in "
            value={startDate}
            onChange={setStartDate}
            shouldDisableDate={shouldDisableDate}
            renderInput={(params) => <TextField fullWidth sx={{ mb: 2 }} {...params} />}
          />
          <DatePicker
            sx = {{borderRadius:20 , mx :3}}
            label="check-out"
            value={endDate}
            onChange={setEndDate}
            shouldDisableDate={shouldDisableDate}
            renderInput={(params) => <TextField fullWidth {...params} />}
          />
        </LocalizationProvider>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <TextField
            sx={{ m: 3 }}
            label="Guests"
            type="number"
            value={guests ?? ''}
            onChange={(e) => setGuests(Number(e.target.value))}
            size="medium"
            inputProps={{ min: 1 }}
          />
        </Box>
        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" onClick={onClose}>Cancel</Button>
          {startDate && endDate && (guests && guests>0) &&(
            <RazorpayButton
              bookingData={{
                homeId: bookingD.homeId,
                start_date: startDate.format('YYYY-MM-DD'),
                end_date: endDate.format('YYYY-MM-DD'),
                number_of_guests: guests, // customize this
                amount:bookingD.amount,
              }}
              // or from context
            />
          )}
          <Button variant="contained" onClick={handleConfirm}>Confirm</Button>
        </Box>
      </Box>
    </Modal>
  );
}
