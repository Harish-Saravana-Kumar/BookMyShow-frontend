import React, { useState, useEffect } from 'react';
import apiClient from '../api/config';
import './MyBookings.css';

const MyBookings = React.memo(({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [user.userId]);

  const fetchBookings = async () => {
    try {
      setError('');
      const response = await apiClient.get(`/bookings/user/${user.userId}`);
      if (response.data.success) {
        setBookings(response.data.data);
      }
    } catch (err) {
      setError(err.message || 'Unable to load bookings. Please try again.');
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  const handleRetry = async () => {
    setRetrying(true);
    await fetchBookings();
  };

  if (loading) return <div className="loading"><div className="spinner"></div>Loading bookings...</div>;

  return (
    <div className="bookings-container">
      <h1>My Bookings</h1>
      {error && (
        <div className="error-container">
          <div className="error">{error}</div>
          <button className="btn-retry" onClick={handleRetry} disabled={retrying}>
            {retrying ? 'Retrying...' : 'Try Again'}
          </button>
        </div>
      )}
      
      {bookings.length === 0 ? (
        <p className="no-bookings">No bookings yet. Start booking now!</p>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <div className="booking-details">
                <h3>Booking ID: {booking.bookingId}</h3>
                <p><strong>Movie ID:</strong> {booking.movieId}</p>
                <p><strong>Show ID:</strong> {booking.showId}</p>
                <p><strong>Seats:</strong> {booking.selectedSeats.join(', ')}</p>
                <p><strong>Total Amount:</strong> Rs. {booking.totalAmount}</p>
                <p><strong>Status:</strong> <span className="status">{booking.bookingStatus}</span></p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

MyBookings.displayName = 'MyBookings';
export default MyBookings;
