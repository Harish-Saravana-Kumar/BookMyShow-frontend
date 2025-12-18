import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/config';
import './Booking.css';

function Booking({ user }) {
  const { showId } = useParams();
  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(false);
  const navigate = useNavigate();

  const PRICE_PER_SEAT = 200;

  useEffect(() => {
    fetchShowDetails();
  }, [showId]);

  const fetchShowDetails = async () => {
    try {
      setError('');
      const response = await apiClient.get(`/shows/${showId}`);
      if (response.data.success) {
        setShow(response.data.data);
      }
    } catch (err) {
      setError(err.message || 'Unable to load show details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatSelect = useCallback((seatNumber, status) => {
    if (status === 'Booked') {
      setError('This seat is already booked');
      return;
    }

    setSelectedSeats(prevSeats => {
      if (prevSeats.includes(seatNumber)) {
        return prevSeats.filter(s => s !== seatNumber);
      } else {
        return [...prevSeats, seatNumber];
      }
    });
    setError(''); // Clear error when selecting new seat
  }, []);

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      setError('Please select at least one seat');
      return;
    }

    setBooking(true);
    setError('');
    try {
      const response = await apiClient.post('/bookings/create', {
        userId: user.userId,
        movieId: show.movieId,
        showId: showId,
        selectedSeats: selectedSeats,
        pricePerSeat: PRICE_PER_SEAT,
      });

      if (response.data.success) {
        alert('Booking confirmed! Your booking ID is: ' + response.data.data.bookingId);
        navigate('/my-bookings');
      } else {
        setError(response.data.message || 'Booking failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Booking failed. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div className="loading"><div className="spinner"></div>Loading seats...</div>;
  if (error && show === null) return (
    <div className="error-container">
      <div className="error">{error}</div>
      <button className="btn-retry" onClick={fetchShowDetails}>
        Try Again
      </button>
    </div>
  );

  return (
    <div className="booking-container">
      {show && (
        <>
          <h1>Select Your Seats</h1>
          <div className="booking-info">
            <p>Show Time: {show.showTime}</p>
            <p>Theatre: {show.theatreId}</p>
            <p>Price per seat: Rs. {PRICE_PER_SEAT}</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="seats-container">
            <div className="seat-grid">
              {show.seats.map((seat) => (
                <button
                  key={seat.seatNumber}
                  className={`seat ${seat.status === 'Booked' ? 'booked' : ''} ${
                    selectedSeats.includes(seat.seatNumber) ? 'selected' : ''
                  }`}
                  onClick={() => handleSeatSelect(seat.seatNumber, seat.status)}
                  disabled={seat.status === 'Booked'}
                >
                  {seat.seatNumber}
                </button>
              ))}
            </div>
          </div>

          <div className="booking-summary">
            <h3>Booking Summary</h3>
            <p>Selected Seats: {selectedSeats.join(', ') || 'None'}</p>
            <p>Total Amount: Rs. {selectedSeats.length * PRICE_PER_SEAT}</p>
            <button
              className="btn-primary btn-large"
              onClick={handleBooking}
              disabled={booking || selectedSeats.length === 0}
            >
              {booking ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Booking;
