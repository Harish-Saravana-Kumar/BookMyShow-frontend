import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/config';

const Movies = React.memo(() => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retrying, setRetrying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setError('');
      const response = await apiClient.get('/movies');
      console.log('Movies API Response:', response.data);
      if (response.data.success && response.data.data) {
        setMovies(response.data.data);
      } else {
        setMovies([]);
      }
    } catch (err) {
      console.error('Error fetching movies:', err);
      setError(err.message || 'Unable to load movies. Please check your connection.');
    } finally {
      setLoading(false);
      setRetrying(false);
    }
  };

  const handleRetry = async () => {
    setRetrying(true);
    setLoading(true);
    await fetchMovies();
  };

  if (loading) {
    return (
      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="mt-3">Loading Movies...</h4>
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
        <div className="row mb-4">
          <div className="col">
            <h1 className="display-5 fw-bold">
              <i className="bi bi-film me-3" style={{ color: '#667eea' }}></i>
              Now Showing
            </h1>
            <p className="lead text-muted">Choose your favorite movie and book your tickets</p>
          </div>
        </div>

        {movies.length === 0 ? (
          <div className="row">
            <div className="col-12">
              <div className="alert alert-info d-flex align-items-center" role="alert">
                <i className="bi bi-info-circle me-3" style={{ fontSize: '2rem' }}></i>
                <div>
                  <h4 className="alert-heading">No Movies Available</h4>
                  <p className="mb-0">There are no movies available at the moment. Please check back later!</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
            {movies.map((movie) => (
              <div key={movie.movieId} className="col">
                <div className="card h-100 shadow-sm border-0 hover-shadow" style={{ transition: 'transform 0.3s, box-shadow 0.3s', cursor: 'pointer' }}
                     onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                     onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div className="position-relative">
                    <div className="card-img-top bg-gradient p-5 text-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="bi bi-camera-reels text-white" style={{ fontSize: '4rem' }}></i>
                    </div>
                    <span className="position-absolute top-0 end-0 m-3 badge bg-dark">{movie.language}</span>
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold mb-2">{movie.movieName}</h5>
                    <div className="mb-3">
                      <span className="badge bg-light text-dark me-2">
                        <i className="bi bi-tag-fill me-1"></i>{movie.genre}
                      </span>
                      <span className="badge bg-light text-dark">
                        <i className="bi bi-clock me-1"></i>{movie.duration} mins
                      </span>
                    </div>
                    <button
                      className="btn btn-primary mt-auto w-100"
                      onClick={() => navigate(`/shows/${movie.movieId}`)}
                      style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}
                    >
                      <i className="bi bi-ticket-perforated me-2"></i>Book Tickets
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

Movies.displayName = 'Movies';
export default Movies;
