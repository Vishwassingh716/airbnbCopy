import React, { useContext, useEffect, useState } from 'react';
import { 
  Grid, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Modal, 
  Button, 
  TextField ,
  Avatar,
  Paper
} from '@mui/material';
import AddCommentIcon from '@mui/icons-material/AddComment';
import StarIcon from '@mui/icons-material/Star';
import { Rating } from "@mui/material";
import AuthContext from '../context/AuthContext';

import KeyboardArrowDownOutlinedIcon from '@mui/icons-material/KeyboardArrowDownOutlined';

import KeyboardArrowUpOutlinedIcon from '@mui/icons-material/KeyboardArrowUpOutlined';

const Rev = ({ id }) => {
  const [review, setReview] = useState([]);
  const { user , authToken } = useContext(AuthContext);
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [haverev, setHaverev] = useState(false);

  const [version, setVersion] = useState(0);

  const [showAll, setShowAll] = useState(false);

  const [formData, setFormData] = useState({
    home: id,
    review: "",
    rating: "",
    guest: user.user_id
  });

  // Fetch Reviews
  const getReviewData = async () => {
    try {
      let response = await fetch(`http://localhost:8000/api/review/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + String(authToken.access)
        }
      });
      if (response.ok) {
        let data = await response.json();
        setReview(data);
      } else {
        console.log("Failed to fetch reviews");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  // Handle Form Input Change
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


const handleDelete = async (revid) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this review?");
  if (!confirmDelete) return;

  try {
    const response = await fetch(`http://localhost:8000/api/review/delorupd/${revid}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken.access}`,
      },
    });

    if (response.ok) {
      alert("Review deleted successfully!");
      getReviewData(); // Refresh reviews
      setFormData({
    home: id,
    review: "",
    rating: "",
    guest: user.user_id
  });

    } else {
      alert("Failed to delete review.");
    }
  } catch (error) {
    console.error("Error deleting review:", error);
  }
};


  // Handle Review Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/api/review/post/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken.access}`,
        },
        body: JSON.stringify({
          home: formData.home,
          review: formData.review,
          rating: formData.rating,
          guest: formData.guest,
        }),
      });
      
      if (response.ok) {
        alert("Review submitted successfully!");
        setOpen(false); // Close the modal
        setFormData({ home: id, review: "", rating: "" }); // Reset form
        getReviewData(); // Refresh reviews
      } else {
        alert("Failed to submit review.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  // Open/Close Modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Fetch reviews on component mount
  useEffect(() => {
    getReviewData();
  }, []);

  useEffect(() => {
    const rev = review.some(item => item.guest === user.user_id);

    if(rev){
      setHaverev(true);
    }
    else{
      setHaverev(false)
    }
 
  }, [review])

  // Modal Style
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };
  const averageRating = review.length
  ? review.reduce((acc, r) => acc + r.rating, 0) / review.length
  : 0;

  return (
   <Box
  sx={{
    mt: 15,
    px: 0,
    py: 5,
    backgroundColor: 'rgba(250, 250, 250, 0.9)',
    height: '100%',
    boxShadow: 2,
  }}
>
   <Box
  sx={{
    mx: 0,
    backgroundColor:'rgba(250, 250, 250, 0.9)',
    borderRadius: 3,
    display:'flex',
    flexDirection:'column'
  }}
>
  {/* Header with overall rating */}
  <Typography variant="h5" fontWeight="bold" mb={4} align={'center'}>
    ★ {averageRating.toFixed(1)} · {review.length} reviews
  </Typography>

  {/* Reviews List */}
 {review.length > 0 ? (
  <>
    <Grid container spacing={4} sx ={{}}>
      {(showAll ? review : review.slice(0, 3)).map((item, index) => (
        <Grid item xs={12} sm={6} md={4} key={item.id || index} sx = {{ background:'rgba(250, 250, 250, 0.9)' ,p:2}}>
          <Paper
            elevation={1}
            sx={{
              p: 0,
              px: 0,
          
              borderRadius: 3,
              height: '100%',
              width: '100%',
              display: 'flex',
              m: 0,
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: '0.3s',
              '&:hover': {
                boxShadow: 4,
              },
            }}
          >
            {/* Reviewer Info */}
            <Box display="flex" alignItems="center" m={2}>
              <Avatar
                src={`http://127.0.0.1:8000${item.imgg}`}
                alt={item.user_email}
                sx={{ width: 48, height: 48, mr: 2 }}
              />
              <Box>
                <Typography fontWeight="bold">
                  {item.user_email.split('@')[0]}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(item.timenow).toLocaleDateString(undefined, {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Typography>
              </Box>
            </Box>

            {/* Review Text */}
            <Typography
              variant="body2"
              sx={{
                color: 'text.primary',
                fontSize: '0.95rem',
                lineHeight: 1.6,
                mx:2,
              }}
            >
              {item.review.length > 180
                ? item.review.slice(0, 180) + '...'
                : item.review}
            </Typography>

            {/* Rating */}
            <Box m={2} display="flex" alignItems="center">
              {Array.from({ length: item.rating }, (_, i) => (
                <StarIcon key={i} sx={{ color: '#FF5A5F', fontSize: 20 }} />
              ))}
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', ml: 1 }}
              >
                {item.rating} / 5
              </Typography>
            </Box>

            {/* Delete Option */}
            {(item.guest === user.user_id) && (
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'end' , my:2 }}>
                <Typography
                  variant='caption'
                  sx={{
                    ml: 2,
                    color: 'red',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      ))}
    </Grid>

    {/* View More / View Less Button */}
    {review.length > 3 && (
      <Box mt={10} sx = {{display : 'flex', flexDirection: 'row', justifyContent:"center",}} >
        
          {showAll ? 
          <Box sx = {{ display:'flex',flexDirection:'row', cursor:'pointer'}} onClick={() => setShowAll(!showAll)}><Typography>View Less</Typography> <KeyboardArrowUpOutlinedIcon/></Box>  : <Box onClick={() => setShowAll(!showAll)} sx = {{ display:'flex',flexDirection:'row' , cursor:'pointer'}}><Typography>View All</Typography> <KeyboardArrowDownOutlinedIcon/></Box>}
        
      </Box>
    )}
  </>
) : (
  <Typography variant="body1" align="center" color="text.secondary">
    No reviews available.
  </Typography>
)}

  {/* Add Review Button */}
  <Box sx={{ mt: 6, textAlign: 'center' }}>
    {(!haverev)?
    (
      <>
    <Typography variant="subtitle1" sx={{ mb: 1 }}>
      Want to leave a review?
    </Typography>
    <Button
      variant="contained"
      startIcon={<AddCommentIcon />}
      onClick={handleOpen}
      sx={{
        borderRadius: 2,
        fontWeight: 'bold',
        backgroundColor: '#FF5A5F',
        '&:hover': {
          backgroundColor: '#e14c50',
        },
      }}
    >
      Add Your Review
    </Button>
    </>) : null
}
  </Box>

  {/* Modal for Adding Review */}
  <Modal
    open={open}
    onClose={handleClose}
    aria-labelledby="modal-title"
    aria-describedby="modal-description"
  >
    <Box
      sx={{
        width: 400,
        bgcolor: 'background.paper',
        p: 4,
        borderRadius: 3,
        mx: 'auto',
        mt: '10%',
        boxShadow: 24,
      }}
    >
      <Typography id="modal-title" variant="h6" gutterBottom>
        Submit Your Review
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Write your review"
          name="review"
          value={formData.review}
          onChange={handleInputChange}
          fullWidth
          required
          multiline
          rows={3}
          sx={{ mb: 3 }}
        />

        <Typography component="legend">Rate Us</Typography>
        <Rating
          name="rating"
          value={formData.rating}
          onChange={(event, newValue) =>
            setFormData({ ...formData, rating: newValue })
          }
        />
        <Typography sx={{ mt: 1 }}>Your Rating: {formData.rating}</Typography>

        <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
          Submit Review
        </Button>
        <Button variant="text" fullWidth onClick={handleClose} sx={{ mt: 1 }}>
          Cancel
        </Button>
      </form>
    </Box>
  </Modal>
</Box>
</Box>

  );
}

export default Rev;





















































