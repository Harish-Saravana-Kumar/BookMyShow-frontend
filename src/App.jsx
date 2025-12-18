import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Movies from './pages/Movies';
import Shows from './pages/Shows';
import Booking from './pages/Booking';
import MyBookings from './pages/MyBookings';

function App() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup onSignup={handleLogin} />} />
        <Route path="/movies" element={user ? <Movies /> : <Navigate to="/login" />} />
        <Route path="/shows/:movieId" element={user ? <Shows /> : <Navigate to="/login" />} />
        <Route path="/booking/:showId" element={user ? <Booking user={user} /> : <Navigate to="/login" />} />
        <Route path="/my-bookings" element={user ? <MyBookings user={user} /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/movies" />} />
      </Routes>
    </Router>
  );
}

export default App;
