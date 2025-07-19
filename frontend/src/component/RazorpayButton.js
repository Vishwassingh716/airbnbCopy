
import React, { useContext, useEffect, useState, useMemo } from 'react';
import AuthContext from '../context/AuthContext';


const RazorpayButton = ({ bookingData }) => {
  const loadRazorpayScript = () => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";

        script.onload = () => {
          resolve(true);
        };

        script.onerror = () => {
          resolve(false);
        };

        document.body.appendChild(script);
      });
    };

  let {authToken , user} = useContext(AuthContext)
  const handlePayment = async () => {

    const razorpayLoaded = await loadRazorpayScript();

    if (!razorpayLoaded) {
      alert("Failed to load Razorpay SDK. Please try again.");
      return;
    }
    try {
      // Step 1: Create booking and get Razorpay order ID
      const res = await fetch(`http://localhost:8000/api/homebookings/${bookingData.homeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken.access}`
        },
        body: JSON.stringify({
          home:bookingData.homeId,
          guest:user.user_id,
          start_date: bookingData.start_date,
          end_date: bookingData.end_date,
          number_of_guests: bookingData.number_of_guests,
          amount: bookingData.amount,
         
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Booking creation failed');
      }

      const booking = await res.json();

      // Step 2: Load Razorpay checkout with the order
      const options = {
        
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: booking.amount * 100, // amount in paise
        currency: "INR",
        name: "Your Booking App",
        description: "Confirm your stay",
        order_id: booking.razorpay_order_id,

        handler: async function (response) {
          // Step 3: Verify payment
          const verifyRes = await fetch('http://localhost:8000/api/payment-verify/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken.access}`
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            })
          });

          if (verifyRes.ok) {
            alert("✅ Payment verified successfully!");

          } else {
            alert("❌ Payment verification failed.");
          }
          // window.location.reload();
        },

        prefill: {
        //   name: booking.guest_name || '',
          email: user.email || '',
        },
        theme: {
          color: '#3399cc'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Razorpay Error:", error);
      alert("Something went wrong during booking/payment.");
    }
  };

  return (
    <button onClick={handlePayment}>
      Pay Online
    </button>
  );
};

export default RazorpayButton;