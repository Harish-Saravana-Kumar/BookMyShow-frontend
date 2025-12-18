import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark shadow-sm" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="container-fluid px-4">
        <Link to="/" className="navbar-brand fw-bold fs-4">
          <i className="bi bi-film me-2"></i>
          BookMyShow
        </Link>
        
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            {user ? (
              <>
                <li className="nav-item">
                  <Link to="/movies" className="nav-link px-3">
                    <i className="bi bi-collection-play me-1"></i>
                    Browse Movies
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/my-bookings" className="nav-link px-3">
                    <i className="bi bi-ticket-perforated me-1"></i>
                    My Bookings
                  </Link>
                </li>
                <li className="nav-item px-3">
                  <span className="navbar-text text-white">
                    <i className="bi bi-person-circle me-2"></i>
                    {user.name}
                  </span>
                </li>
                <li className="nav-item">
                  <button onClick={handleLogout} className="btn btn-outline-light btn-sm ms-2">
                    <i className="bi bi-box-arrow-right me-1"></i>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link px-3">
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/signup" className="btn btn-light btn-sm ms-2">
                    <i className="bi bi-person-plus me-1"></i>
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
