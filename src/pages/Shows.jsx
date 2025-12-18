import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/config';

const Shows = React.memo(() => {
  const { movieId } = useParams();
  const [shows, setShows] = useState([]);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retrying, setRetrying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchShowsAndMovie();
  }, [movieId]);

  const fetchShowsAndMovie = async () => {
    try {
      setError('');
      const [movieResponse, showsResponse] = await Promise.all([
        apiClient.get(`/movies/${movieId}`),
        apiClient.get(`/shows/movie/${movieId}`)
      ]);

      console.log('Movie Response:', movieResponse.data);
      console.log('Shows Response:', showsResponse.data);

      if (movieResponse.data.success && movieResponse.data.data) {
        setMovie(movieResponse.data.data);
      }

      if (showsResponse.data.success && showsResponse.data.data) {
        setShows(showsResponse.data.data);
      } else {
        setShows([]);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Unable to load shows. Please try again.');
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  const handleRetry = async () => {
    setRetrying(true);
    setLoading(true);
    await fetchShowsAndMovie();
  };

  if (loading) {
    return (
      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="mt-3">Loading Shows...</h4>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <i className="bi bi-exclamation-triangle text-danger" style={{ fontSize: '4rem' }}></i>
          <h3 className="mt-3">{error}</h3>
          <button className="btn btn-primary mt-3" onClick={handleRetry} disabled={retrying}>
            {retrying ? 'Retrying...' : 'Try Again'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <div className="container">
        {movie && (
          <div className="row mb-4">
            <div className="col">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  <h1 className="text-white fw-bold mb-3">
                    <i className="bi bi-camera-reels me-3"></i>
                    {movie.movieName}
                  </h1>
                  <div className="d-flex flex-wrap gap-3">
                    <span className="badge bg-white text-dark px-3 py-2">
                      <i className="bi bi-tag-fill me-2"></i>{movie.genre}
                    </span>
                    <span className="badge bg-white text-dark px-3 py-2">
                      <i className="bi bi-clock me-2"></i>{movie.duration} mins
                    </span>
                    <span className="badge bg-white text-dark px-3 py-2">
                      <i className="bi bi-translate me-2"></i>{movie.language}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="row mb-3">
          <div className="col">
            <h2 className="fw-bold">
              <i className="bi bi-calendar-event me-2" style={{ color: '#667eea' }}></i>
              Select a Show
            </h2>
          </div>
        </div>

        {shows.length === 0 ? (
          <div className="row">
            <div className="col-12">
              <div className="alert alert-warning d-flex align-items-center" role="alert">
                <i className="bi bi-exclamation-triangle me-3" style={{ fontSize: '2rem' }}></i>
                <div>
                  <h4 className="alert-heading">No Shows Available</h4>
                  <p className="mb-0">There are currently no shows available for this movie. Please check back later!</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {shows.map((show) => (
              <div key={show.showId} className="col">
                <div className="card h-100 shadow-sm border-0 hover-shadow" style={{ transition: 'all 0.3s' }}>
                  <div className="card-body p-4">
                    <div className="d-flex align-items-start mb-3">
                      <div className="flex-grow-1">
                        <h4 className="card-title fw-bold mb-2">
                          <i className="bi bi-clock-fill me-2" style={{ color: '#667eea' }}></i>
                          {new Date(show.showTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </h4>
                        <p className="text-muted mb-2">
                          <i className="bi bi-calendar3 me-2"></i>
                          {new Date(show.showTime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="mb-2">
                        <i className="bi bi-geo-alt-fill me-2" style={{ color: '#667eea' }}></i>
                        <strong>{show.theatreId}</strong>
                      </p>
                      <div className="d-flex align-items-center">
                        <i className="bi bi-people-fill me-2" style={{ color: '#667eea' }}></i>
                        <span className="badge bg-success">
                          {show.seats?.filter(s => s.status === 'Available').length || 0} seats available
                        </span>
                      </div>
                    </div>
                    
                    <button
                      className="btn btn-primary w-100 mt-3"
                      onClick={() => navigate(`/booking/${show.showId}`)}
                      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                    >
                      <i className="bi bi-arrow-right-circle me-2"></i>
                      Select Seats
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

Shows.displayName = 'Shows';
export default Shows;
